from fastapi import Header, HTTPException, status

from app.core.firebase import verify_firebase_token


def get_current_user(
    authorization: str | None = Header(default=None)
):
    """
    Extract and verify the Firebase ID token
    from the Authorization header.
    """

    # Check whether Authorization header exists
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is missing",
        )

    # Check the expected format
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization format",
        )

    # Extract the Firebase ID token
    id_token = authorization.split("Bearer ", 1)[1]

    try:
        # Verify token using Firebase Admin SDK
        decoded_token = verify_firebase_token(id_token)

        return decoded_token

    except Exception as e:
        print("Firebase token verification error:", repr(e))

        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired Firebase token",)