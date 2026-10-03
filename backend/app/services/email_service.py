from datetime import datetime, timezone
from uuid import uuid4

from firebase_admin import firestore

import base64
from email.message import EmailMessage
from app.core.gmail import get_gmail_service


db = firestore.client()


def create_email(user_id: str, email_data: dict):
    """
    Create a new email document for a user.
    """

    email_id = str(uuid4())

    email_ref = (
        db.collection("users")
        .document(user_id)
        .collection("emails")
        .document(email_id)
    )

    now = datetime.now(timezone.utc)

    email = {
        "to": email_data.get("to"),
        "cc": email_data.get("cc"),
        "bcc": email_data.get("bcc"),
        "subject": email_data.get("subject"),
        "body": email_data.get("body"),
        "status": "DRAFT",
        "scheduled_at": email_data.get("scheduled_at"),
        "sent_at": None,
        "created_at": now,
        "updated_at": now,
    }

    email_ref.set(email)

    return {
        "id": email_id,
        **email,
    }

def get_emails(user_id: str):
    """
    Get all emails belonging to a user.
    """

    emails_ref = (
        db.collection("users")
        .document(user_id)
        .collection("emails")
    )

    docs = emails_ref.order_by(
        "created_at",
        direction=firestore.Query.DESCENDING
    ).stream()

    emails = []

    for doc in docs:
        email = doc.to_dict()

        emails.append({
            "id": doc.id,
            **email,
        })

    return emails

def update_email(
    user_id: str,
    email_id: str,
    email_data: dict,
):
    """
    Update an existing email belonging to a user.
    """

    email_ref = (
        db.collection("users")
        .document(user_id)
        .collection("emails")
        .document(email_id)
    )

    existing_email = email_ref.get()

    if not existing_email.exists:
        return None

    update_data = {
        key: value
        for key, value in email_data.items()
        if value is not None
    }

    update_data["updated_at"] = datetime.now(timezone.utc)

    email_ref.update(update_data)

    updated_email = email_ref.get()

    return {
        "id": email_id,
        **updated_email.to_dict(),
    }


def delete_email(
    user_id: str,
    email_id: str,
):
    """
    Delete an email belonging to a user.
    """

    email_ref = (
        db.collection("users")
        .document(user_id)
        .collection("emails")
        .document(email_id)
    )

    existing_email = email_ref.get()

    if not existing_email.exists:
        return False

    email_ref.delete()

    return True

def send_email(user_id: str, email_id: str):
    # Get the email from Firestore
    email_ref = (
        db.collection("users")
        .document(user_id)
        .collection("emails")
        .document(email_id)
    )

    email_doc = email_ref.get()

    if not email_doc.exists:
        return None, "Email not found"

    email_data = email_doc.to_dict()

    # Prevent sending an already-sent email
    if email_data.get("status") in ("SENDING", "SENT"):
        return None, "Email is already being sent or has already been sent"

    # Get Gmail OAuth credentials
    gmail_ref = (
        db.collection("users")
        .document(user_id)
        .collection("gmail")
        .document("connection")
    )

    gmail_doc = gmail_ref.get()

    if not gmail_doc.exists:
        return None, "Gmail is not connected"

    gmail_data = gmail_doc.to_dict()

    if not gmail_data.get("connected"):
        return None, "Gmail is not connected"

    # Mark email as SENDING
    email_ref.update({
        "status": "SENDING",
        "updated_at": datetime.now(timezone.utc),
    })

    try:
        # Create Gmail API service
        gmail_service = get_gmail_service(gmail_data)

        # Create email message
        message = EmailMessage()

        message["To"] = email_data["to"]
        message["Subject"] = email_data["subject"]

        if email_data.get("cc"):
            message["Cc"] = email_data["cc"]

        if email_data.get("bcc"):
            message["Bcc"] = email_data["bcc"]

        message.set_content(email_data["body"])

        # Encode email for Gmail API
        encoded_message = base64.urlsafe_b64encode(
            message.as_bytes()
        ).decode()

        gmail_message = {
            "raw": encoded_message
        }

        # Send through Gmail API
        sent_message = (
            gmail_service.users()
            .messages()
            .send(
                userId="me",
                body=gmail_message,
            )
            .execute()
        )

        # Mark email as SENT
        now = datetime.now(timezone.utc)

        email_ref.update({
            "status": "SENT",
            "sent_at": now,
            "updated_at": now,
        })

        return sent_message, None

    except Exception as e:
        print("Gmail send error:", repr(e))

        # Mark email as FAILED
        email_ref.update({
            "status": "FAILED",
            "updated_at": datetime.now(timezone.utc),
        })

        return None, "Failed to send email"