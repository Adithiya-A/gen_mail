import os

from supabase import create_client, Client


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")
SUPABASE_STORAGE_BUCKET = os.getenv(
    "SUPABASE_STORAGE_BUCKET",
    "email-attachments",
)


if not SUPABASE_URL or not SUPABASE_SECRET_KEY:
    raise RuntimeError(
        "SUPABASE_URL and SUPABASE_SECRET_KEY must be configured"
    )


supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY,
)


def upload_attachment(
    file_bytes: bytes,
    storage_path: str,
    content_type: str,
):
    return supabase.storage.from_(
        SUPABASE_STORAGE_BUCKET
    ).upload(
        storage_path,
        file_bytes,
        {
            "content-type": content_type,
            "upsert": "false",
        },
    )


def download_attachment(storage_path: str) -> bytes:
    return supabase.storage.from_(
        SUPABASE_STORAGE_BUCKET
    ).download(storage_path)


def delete_attachment(storage_path: str):
    return supabase.storage.from_(
        SUPABASE_STORAGE_BUCKET
    ).remove([storage_path])