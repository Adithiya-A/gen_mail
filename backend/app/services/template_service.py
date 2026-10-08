from datetime import datetime, timezone
from uuid import uuid4

from firebase_admin import firestore


db = firestore.client()


def create_template(user_id: str, template_data: dict):
    """
    Create a new template document for a user.
    """

    template_id = str(uuid4())

    template_ref = (
        db.collection("users")
        .document(user_id)
        .collection("templates")
        .document(template_id)
    )

    now = datetime.now(timezone.utc)

    template = {
        "name": template_data.get("name"),
        "subject": template_data.get("subject"),
        "description": template_data.get("description"),
        "category": template_data.get("category"),
        "body": template_data.get("body"),
        "isDefault": template_data.get("isDefault", False),
        "iconBg": template_data.get("iconBg"),
        "created_at": now,
        "updated_at": now,
    }

    template_ref.set(template)

    return {
        "id": template_id,
        **template,
    }


def get_templates(user_id: str):
    """
    Get all templates belonging to a user.
    """

    templates_ref = (
        db.collection("users")
        .document(user_id)
        .collection("templates")
    )

    docs = templates_ref.order_by(
        "created_at",
        direction=firestore.Query.DESCENDING,
    ).stream()

    templates = []

    for doc in docs:
        template = doc.to_dict()

        templates.append({
            "id": doc.id,
            **template,
        })

    return templates


def update_template(
    user_id: str,
    template_id: str,
    template_data: dict,
):
    """
    Update an existing template belonging to a user.
    """

    template_ref = (
        db.collection("users")
        .document(user_id)
        .collection("templates")
        .document(template_id)
    )

    existing_template = template_ref.get()

    if not existing_template.exists:
        return None

    update_data = {
        key: value
        for key, value in template_data.items()
        if value is not None
    }

    update_data["updated_at"] = datetime.now(timezone.utc)

    template_ref.update(update_data)

    updated_template = template_ref.get()

    return {
        "id": template_id,
        **updated_template.to_dict(),
    }


def delete_template(
    user_id: str,
    template_id: str,
):
    """
    Delete a template belonging to a user.
    """

    template_ref = (
        db.collection("users")
        .document(user_id)
        .collection("templates")
        .document(template_id)
    )

    existing_template = template_ref.get()

    if not existing_template.exists:
        return False

    template_ref.delete()

    return True