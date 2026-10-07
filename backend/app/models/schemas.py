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

class GenerateEmailRequest(BaseModel):
    recipient: str
    instruction: str
    tone: str = "Professional"


class GenerateEmailResponse(BaseModel):
    subject: str
    body: str

class ExtractIntentRequest(BaseModel):
    prompt: str
    tone: str = "Professional"
    length: str = "Medium"
    purpose: str = "Request"


class ExtractIntentResponse(BaseModel):
    recipient: str
    purpose: str
    reason: str
    timing: str
    tone: str
    length: str

class GenerateEmailFromIntentRequest(BaseModel):
    recipient: str
    purpose: str
    reason: str
    timing: str
    tone: str
    length: str