import firebase_admin
from firebase_admin import credentials, auth, storage
from pathlib import Path


# Find the backend folder
BASE_DIR = Path(__file__).resolve().parents[2]

# Location of Firebase service account
SERVICE_ACCOUNT_PATH = (
    BASE_DIR / "credentials" / "firebase-service-account.json"
)


# Initialize Firebase only once
if not firebase_admin._apps:
    cred = credentials.Certificate(str(SERVICE_ACCOUNT_PATH))
    firebase_admin.initialize_app(
        cred,
        {
            "storageBucket": "genmail-ai.firebasestorage.app"
        }
    )


def verify_firebase_token(id_token: str):
    """
    Verify a Firebase ID token and return the decoded user information.
    """
    return auth.verify_id_token(id_token)