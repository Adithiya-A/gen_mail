from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.dependencies import get_current_user
from app.models.schemas import EmailCreate, EmailUpdate
from app.services.email_service import (
    create_email,
    get_emails,
    update_email,
    delete_email,
    send_email
)


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

@router.get("/")
def get_user_emails(
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["uid"]

    emails = get_emails(user_id)

    return {
        "message": "Emails retrieved successfully",
        "emails": emails,
    }

@router.put("/{email_id}")
def update_existing_email(
    email_id: str,
    email: EmailUpdate,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["uid"]

    updated_email = update_email(
        user_id=user_id,
        email_id=email_id,
        email_data=email.model_dump(exclude_unset=True),
    )

    if updated_email is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email not found",
        )

    return {
        "message": "Email updated successfully",
        "email": updated_email,
    }


@router.delete("/{email_id}")
def delete_existing_email(
    email_id: str,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["uid"]

    deleted = delete_email(
        user_id=user_id,
        email_id=email_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email not found",
        )

    return {
        "message": "Email deleted successfully",
    }

@router.post("/{email_id}/send")
def send_existing_email(
    email_id: str,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["uid"]

    sent_message, error = send_email(
        user_id=user_id,
        email_id=email_id,
    )

    if error:
        if error == "Email not found":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=error,
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error,
        )

    return {
        "message": "Email sent successfully",
        "gmail_message_id": sent_message.get("id"),
    }