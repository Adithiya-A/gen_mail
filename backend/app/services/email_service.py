from datetime import datetime, timezone
from uuid import uuid4

from firebase_admin import firestore


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