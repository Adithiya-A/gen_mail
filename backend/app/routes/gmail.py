import secrets

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from firebase_admin import firestore
from datetime import datetime, timezone

from app.auth.dependencies import get_current_user
from app.core.gmail import (
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    GMAIL_SCOPES,
)

router = APIRouter(
    prefix="/gmail",
    tags=["Gmail"],
)

# Temporary OAuth state storage.
# This is suitable for our local development stage.
oauth_states = {}


def create_google_flow():
    client_config = {
        "web": {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [GOOGLE_REDIRECT_URI],
        }
    }

    return Flow.from_client_config(
        client_config,
        scopes=GMAIL_SCOPES,
        redirect_uri=GOOGLE_REDIRECT_URI,
    )


@router.get("/test")
def gmail_test():
    return {
        "message": "Gmail router is working"
    }


@router.get("/connect")
def gmail_connect(
    current_user: dict = Depends(get_current_user),
):
    firebase_uid = current_user.get("uid")

    if not firebase_uid:
        raise HTTPException(
            status_code=401,
            detail="Firebase user ID is missing",
        )

    flow = create_google_flow()

    authorization_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
    )

    oauth_states[state] = {
        "firebase_uid": firebase_uid,
        "code_verifier": flow.code_verifier,
    }

    return { "authorization_url": authorization_url }

@router.get("/status")
def gmail_status(
    current_user: dict = Depends(get_current_user),
):
    firebase_uid = current_user.get("uid")

    if not firebase_uid:
        raise HTTPException(
            status_code=401,
            detail="Firebase user ID is missing",
        )

    db = firestore.client()

    gmail_ref = (
        db.collection("users")
        .document(firebase_uid)
        .collection("gmail")
        .document("connection")
    )

    gmail_doc = gmail_ref.get()

    if not gmail_doc.exists:
        return {
            "connected": False,
            "message": "Gmail is not connected",
        }

    gmail_data = gmail_doc.to_dict()

    return {
        "connected": gmail_data.get("connected", False),
        "email": gmail_data.get("email", ""),
        "connected_at": gmail_data.get("connected_at"),
        "message": (
            "Gmail is connected"
            if gmail_data.get("connected", False)
            else "Gmail is not connected"
        ),
    }

@router.post("/disconnect")
def gmail_disconnect(
    current_user: dict = Depends(get_current_user),
):
    firebase_uid = current_user.get("uid")

    if not firebase_uid:
        raise HTTPException(
            status_code=401,
            detail="Firebase user ID is missing",
        )

    db = firestore.client()

    gmail_ref = (
        db.collection("users")
        .document(firebase_uid)
        .collection("gmail")
        .document("connection")
    )

    gmail_doc = gmail_ref.get()

    if not gmail_doc.exists:
        return {
            "connected": False,
            "message": "Gmail is already disconnected",
        }

    gmail_ref.delete()

    return {
        "connected": False,
        "message": "Gmail disconnected successfully",
    }


@router.get("/oauth/callback")
def gmail_oauth_callback(code: str, state: str):
    oauth_data = oauth_states.get(state)

    if not oauth_data:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired OAuth state",
        )

    del oauth_states[state]

    firebase_uid = oauth_data["firebase_uid"]
    code_verifier = oauth_data["code_verifier"]

    flow = create_google_flow()

    # Restore the PKCE verifier generated during /connect
    flow.code_verifier = code_verifier
    flow.oauth2session.scope = None

    try:
        flow.fetch_token(code=code, include_client_id=True,)

    except Exception as e:
        print("====================================")
        print("GMAIL OAUTH TOKEN EXCHANGE FAILED")
        print("ERROR TYPE:", type(e).__name__)
        print("ERROR:", repr(e))
        print("====================================")

        raise HTTPException(
            status_code=400,
            detail=f"Google OAuth error: {str(e)}",
        )

    credentials = flow.credentials

    gmail_service = build(
        "gmail",
        "v1",
        credentials=credentials,
    )

    profile = gmail_service.users().getProfile(
        userId="me"
    ).execute()

    gmail_email = profile.get("emailAddress", "")

    db = firestore.client()

    gmail_ref = (
        db.collection("users")
        .document(firebase_uid)
        .collection("gmail")
        .document("connection")
    )

    gmail_data = {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "scopes": credentials.scopes,
        "connected": True,
        "email": gmail_email,
        "connected_at": datetime.now(timezone.utc).isoformat(),
    }

    gmail_ref.set(gmail_data, merge=True)

    return RedirectResponse(
        url="http://localhost:5173/settings/gmail"
    )