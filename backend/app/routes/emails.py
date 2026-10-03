from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.models.schemas import EmailCreate
from app.services.email_service import create_email


router = APIRouter(
    prefix="/emails",
    tags=["Emails"],
)


@router.post("/")
def create_new_email(
    email: EmailCreate,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["uid"]

    created_email = create_email(
        user_id=user_id,
        email_data=email.model_dump(),
    )

    return {
        "message": "Email created successfully",
        "email": created_email,
    }