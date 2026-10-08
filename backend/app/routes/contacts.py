from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import firestore

from app.models.schemas import ContactCreate, ContactUpdate
from app.services.contacts_service import (
    create_contact,
    get_contacts,
    update_contact,
    delete_contact,
)
from app.auth.dependencies import get_current_user


router = APIRouter(prefix="/contacts", tags=["Contacts"])


@router.get("")
def list_contacts(
    current_user=Depends(get_current_user),
):
    db = firestore.client()

    return get_contacts(
        db,
        current_user["uid"],
    )


@router.post("")
def add_contact(
    contact_data: ContactCreate,
    current_user=Depends(get_current_user),
):
    db = firestore.client()

    return create_contact(
        db,
        current_user["uid"],
        contact_data.model_dump(),
    )


@router.put("/{contact_id}")
def edit_contact(
    contact_id: str,
    contact_data: ContactUpdate,
    current_user=Depends(get_current_user),
):
    db = firestore.client()

    contact = update_contact(
        db,
        current_user["uid"],
        contact_id,
        contact_data.model_dump(exclude_unset=True),
    )

    if contact is None:
        raise HTTPException(
            status_code=404,
            detail="Contact not found",
        )

    return contact


@router.delete("/{contact_id}")
def remove_contact(
    contact_id: str,
    current_user=Depends(get_current_user),
):
    db = firestore.client()

    deleted = delete_contact(
        db,
        current_user["uid"],
        contact_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Contact not found",
        )

    return {
        "message": "Contact deleted successfully",
    }