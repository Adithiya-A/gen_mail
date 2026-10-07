from fastapi import APIRouter, Depends, HTTPException

from app.auth.dependencies import get_current_user

from app.models.schemas import (
    GenerateEmailRequest,
    GenerateEmailResponse,
    ExtractIntentRequest,
    ExtractIntentResponse,
    GenerateEmailFromIntentRequest,
)

from app.services.ai_service import (
    generate_email,
    extract_intent,
    generate_email_from_intent,
)


router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.post(
    "/generate-email",
    response_model=GenerateEmailResponse,
)
def generate_email_endpoint(request: GenerateEmailRequest, current_user: dict = Depends(get_current_user), ):

    result = generate_email(
        recipient=request.recipient,
        instruction=request.instruction,
        tone=request.tone,
    )

    lines = result.splitlines()

    subject = ""
    body_lines = []

    reading_body = False

    for line in lines:

        if line.startswith("SUBJECT:"):
            subject = line.replace("SUBJECT:", "", 1).strip()
            continue

        if line.strip() == "BODY:":
            reading_body = True
            continue

        if reading_body:
            body_lines.append(line)

    body = "\n".join(body_lines).strip()

    return GenerateEmailResponse(
        subject=subject,
        body=body,
    )

@router.post(
    "/extract-intent",
    response_model=ExtractIntentResponse,
)
def extract_intent_endpoint(
    request: ExtractIntentRequest,
    current_user: dict = Depends(get_current_user),
):

    result = extract_intent(
        prompt=request.prompt,
        tone=request.tone,
        length=request.length,
        purpose=request.purpose,
    )

    lines = result.splitlines()

    extracted = {
        "recipient": "Not specified",
        "purpose": "Not specified",
        "reason": "Not specified",
        "timing": "Not specified",
        "tone": "Not specified",
        "length": "Not specified",
    }

    field_mapping = {
        "RECIPIENT:": "recipient",
        "PURPOSE:": "purpose",
        "REASON:": "reason",
        "TIMING:": "timing",
        "TONE:": "tone",
        "LENGTH:": "length",
    }

    for line in lines:
        line = line.strip()

        for prefix, field in field_mapping.items():
            if line.startswith(prefix):
                value = line.replace(prefix, "", 1).strip()

                if value:
                    extracted[field] = value

                break

    return ExtractIntentResponse(**extracted)

@router.post("/generate-email-from-intent")
def generate_email_from_intent_route(
    request: GenerateEmailFromIntentRequest,
    current_user: dict = Depends(get_current_user),
):
    try:
        result = generate_email_from_intent(
            recipient=request.recipient,
            purpose=request.purpose,
            reason=request.reason,
            timing=request.timing,
            tone=request.tone,
            length=request.length,
        )

        subject = ""
        body = ""

        lines = result.splitlines()

        body_started = False
        body_lines = []

        for line in lines:
            if line.startswith("SUBJECT:"):
                subject = line.replace("SUBJECT:", "", 1).strip()

            elif line.startswith("BODY:"):
                body_started = True

            elif body_started:
                body_lines.append(line)

        body = "\n".join(body_lines).strip()

        return {
            "subject": subject,
            "body": body,
        }

    except Exception as e:
        error_message = str(e)

        print(
            "Generate email from intent error:",
            repr(e)
        )

        if (
            "429" in error_message
            or "RESOURCE_EXHAUSTED" in error_message
        ):
            raise HTTPException(
                status_code=429,
                detail=(
                    "Gemini API quota exceeded. "
                    "Please wait for the quota to reset "
                    "before generating another email."
                ),
            )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate email from intent.",
        )