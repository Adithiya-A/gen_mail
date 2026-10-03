import os
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

from dotenv import load_dotenv

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv(
    "GOOGLE_CLIENT_ID"
)

GOOGLE_CLIENT_SECRET = os.getenv(
    "GOOGLE_CLIENT_SECRET"
)

GOOGLE_REDIRECT_URI = os.getenv(
    "GOOGLE_REDIRECT_URI"
)

GMAIL_SCOPES = [
    "https://www.googleapis.com/auth/gmail.send"
]

def get_gmail_service(gmail_data: dict):
    credentials = Credentials(
        token=gmail_data.get("token"),
        refresh_token=gmail_data.get("refresh_token"),
        token_uri=gmail_data.get("token_uri"),
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        scopes=GMAIL_SCOPES,
    )

    return build(
        "gmail",
        "v1",
        credentials=credentials,
    )