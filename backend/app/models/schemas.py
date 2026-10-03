from datetime import datetime

from pydantic import BaseModel, EmailStr


class EmailCreate(BaseModel):
    to: EmailStr
    cc: str | None = None
    bcc: str | None = None
    subject: str
    body: str
    scheduled_at: datetime | None = None