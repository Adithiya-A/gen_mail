from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.dependencies import get_current_user
from app.models.schemas import TemplateCreate, TemplateUpdate
from app.services.template_service import (
    create_template,
    get_templates,
    update_template,
    delete_template,
)


router = APIRouter(
    prefix="/templates",
    tags=["Templates"],
)


@router.post("/")
def create_new_template(
    template: TemplateCreate,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["uid"]

    created_template = create_template(
        user_id=user_id,
        template_data=template.model_dump(),
    )

    return {
        "message": "Template created successfully",
        "template": created_template,
    }


@router.get("/")
def get_user_templates(
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["uid"]

    templates = get_templates(user_id)

    return {
        "message": "Templates retrieved successfully",
        "templates": templates,
    }


@router.put("/{template_id}")
def update_existing_template(
    template_id: str,
    template: TemplateUpdate,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["uid"]

    updated_template = update_template(
        user_id=user_id,
        template_id=template_id,
        template_data=template.model_dump(exclude_unset=True),
    )

    if updated_template is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )

    return {
        "message": "Template updated successfully",
        "template": updated_template,
    }


@router.delete("/{template_id}")
def delete_existing_template(
    template_id: str,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["uid"]

    deleted = delete_template(
        user_id=user_id,
        template_id=template_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )

    return {
        "message": "Template deleted successfully",
    }