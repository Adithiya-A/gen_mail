from datetime import datetime, timezone
from uuid import uuid4
import base64

from firebase_admin import firestore
from app.services.storage_service import (
    upload_attachment,
    download_attachment,
)

import base64
import re
from html import unescape
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
        "attachments": email_data.get("attachments", []),
        "status": "DRAFT",
        "scheduled_at": email_data.get("scheduled_at"),
        "sent_at": None,
        "created_at": now,
        "updated_at": now,
    }

    attachments = email_data.get("attachments", [])

    safe_attachments = []

    for attachment in attachments:
        attachment_name = str(
            attachment.get("name", "attachment")
        )

        attachment_type = str(
            attachment.get("type")
            or "application/octet-stream"
        )

        attachment_data = str(
            attachment.get("data", "")
        )

        if "," in attachment_data:
            _, encoded_data = attachment_data.split(",", 1)
        else:
            encoded_data = attachment_data

        file_bytes = base64.b64decode(encoded_data)

        storage_path = (
            f"users/{user_id}/emails/{email_id}/attachments/"
            f"{attachment_name}"
        )

        upload_attachment(
            file_bytes=file_bytes,
            storage_path=storage_path,
            content_type=attachment_type,
        )

        safe_attachments.append({
            "name": attachment_name,
            "size": int(
                attachment.get(
                    "size",
                    len(file_bytes),
                )
            ),
            "type": attachment_type,
            "storage_path": storage_path,
        })

    email["attachments"] = safe_attachments

    print(
        "DEBUG Firestore attachments:",
        [
            {
                "name": a.get("name"),
                "size": a.get("size"),
                "type": a.get("type"),
                "data_type": type(a.get("data")).__name__,
                "data_length": len(a.get("data", "")),
            }
            for a in email["attachments"]
        ],
    )

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

        html_body = email_data.get("body") or ""

        plain_text = re.sub(r"<br\s*/?>", "\n", html_body, flags=re.IGNORECASE,)

        plain_text = re.sub(r"</p\s*>", "\n\n", plain_text, flags=re.IGNORECASE,)

        plain_text = re.sub(r"<[^>]+>", "", plain_text,)

        plain_text = unescape(plain_text).strip()

        message.set_content(plain_text)
        message.add_alternative(
            html_body,
            subtype="html",
        )

        attachments = email_data.get("attachments", [])

        for attachment in attachments:
            filename = attachment.get("name") or "attachment"

            content_type = (
                attachment.get("type")
                or "application/octet-stream"
            )

            storage_path = attachment.get("storage_path")

            if not storage_path:
                print(
                    f"Attachment {filename} has no storage path"
                )
                continue

            file_bytes = download_attachment(storage_path)

            if "/" in content_type:
                maintype, subtype = content_type.split(
                    "/",
                    1,
                )
            else:
                maintype = "application"
                subtype = "octet-stream"

            message.add_attachment(
                file_bytes,
                maintype=maintype,
                subtype=subtype,
                filename=filename,
            )

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