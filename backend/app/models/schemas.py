from datetime import datetime

from pydantic import BaseModel, EmailStr


class EmailCreate(BaseModel):
    to: EmailStr
    cc: str | None = None
    bcc: str | None = None
    subject: str
    body: str
    scheduled_at: datetime | None = None

class EmailUpdate(BaseModel):
    to: EmailStr | None = None
    cc: str | None = None
    bcc: str | None = None
    subject: str | None = None
    body: str | None = None
    scheduled_at: datetime | None = None
    status: str | None = None