from datetime import datetime, timezone


def _contacts_collection(db, user_id: str):
    return (
        db.collection("users")
        .document(user_id)
        .collection("contacts")
    )


def create_contact(db, user_id: str, contact_data: dict):
    contacts_ref = _contacts_collection(db, user_id)

    contact_ref = contacts_ref.document()

    contact = {
        "id": contact_ref.id,
        "name": contact_data["name"],
        "email": contact_data["email"],
        "role": contact_data.get("role", "Contact"),
        "tag": contact_data.get("tag", "Professional"),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }

    contact_ref.set(contact)

    return contact


def get_contacts(db, user_id: str):
    contacts_ref = _contacts_collection(db, user_id)

    contacts = []

    for doc in contacts_ref.stream():
        contact = doc.to_dict()
        contact["id"] = doc.id
        contacts.append(contact)

    contacts.sort(
        key=lambda contact: contact.get("created_at", ""),
        reverse=True,
    )

    return contacts


def update_contact(
    db,
    user_id: str,
    contact_id: str,
    contact_data: dict,
):
    contact_ref = (
        _contacts_collection(db, user_id)
        .document(contact_id)
    )

    if not contact_ref.get().exists:
        return None

    update_data = {
        key: value
        for key, value in contact_data.items()
        if value is not None
    }

    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    contact_ref.update(update_data)

    updated_contact = contact_ref.get().to_dict()
    updated_contact["id"] = contact_id

    return updated_contact


def delete_contact(db, user_id: str, contact_id: str):
    contact_ref = (
        _contacts_collection(db, user_id)
        .document(contact_id)
    )

    if not contact_ref.get().exists:
        return False

    contact_ref.delete()

    return True