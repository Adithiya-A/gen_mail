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