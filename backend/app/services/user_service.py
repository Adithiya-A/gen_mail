from datetime import datetime, timezone

from firebase_admin import firestore


db = firestore.client()


def create_or_update_user(user: dict):
    """
    Create a Firestore user document if it doesn't exist.
    Otherwise update the user's latest information.
    """

    uid = user.get("uid")

    if not uid:
        raise ValueError("User UID is missing")

    user_ref = db.collection("users").document(uid)

    user_data = {
        "name": user.get("name"),
        "email": user.get("email"),
        "photo_url": user.get("picture"),
        "updated_at": datetime.now(timezone.utc),
    }

    existing_user = user_ref.get()

    if not existing_user.exists:
        user_data["role"] = "user"
        user_data["created_at"] = datetime.now(timezone.utc)

    user_ref.set(
        user_data,
        merge=True
    )

    return user_ref.get().to_dict()