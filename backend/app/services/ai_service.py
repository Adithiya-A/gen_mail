import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PRIMARY_MODEL = "gemini-2.5-flash"
FALLBACK_MODEL = "gemini-2.5-flash-lite"

def generate_with_fallback(prompt: str):
    try:
        return client.models.generate_content(
            model=PRIMARY_MODEL,
            contents=prompt,
        )

    except Exception as primary_error:
        print(
            f"Primary Gemini model failed: {primary_error}"
        )

        try:
            return client.models.generate_content(
                model=FALLBACK_MODEL,
                contents=prompt,
            )

        except Exception as fallback_error:
            print(
                f"Fallback Gemini model failed: {fallback_error}"
            )

            raise fallback_error

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not configured")

client = genai.Client(api_key=GEMINI_API_KEY)


def generate_email(
    recipient: str,
    instruction: str,
    tone: str = "Professional",
):
    prompt = f"""
You are an AI email writing assistant.

Generate a professional email based on the information provided below.

Recipient:
{recipient}

User's instruction:
{instruction}

Tone:
{tone}

Requirements:
1. Generate a clear and relevant email subject.
2. Generate the complete email body.
3. Do not invent unnecessary facts.
4. Keep the email natural and human-like.
5. Match the requested tone.
6. Do not include explanations outside the email.
7. Return the result exactly in this format:

SUBJECT: <email subject>

BODY:
<email body>
"""

    response = generate_with_fallback(prompt)

    return response.text

def extract_intent(
    prompt: str,
    tone: str = "Professional",
    length: str = "Medium",
    purpose: str = "Request",
):
    intent_prompt = f"""
You are an intent extraction engine for an AI email automation application.

Analyze the user's email request and extract the important information.

User request:
{prompt}

User selected tone:
{tone}

User selected length:
{length}

User selected purpose:
{purpose}

Extract the following fields:

1. recipient
2. purpose
3. reason
4. timing
5. tone
6. length

Rules:
- Do not invent information.
- If a value is not explicitly available, use "Not specified".
- Keep each field concise.
- Return ONLY the following format:

RECIPIENT: <recipient>
PURPOSE: <purpose>
REASON: <reason>
TIMING: <timing>
TONE: <tone>
LENGTH: <length>
"""

    response = generate_with_fallback(intent_prompt)

    return response.text

def generate_email_from_intent(
    recipient: str,
    purpose: str,
    reason: str,
    timing: str,
    tone: str,
    length: str,
):
    intent_prompt = f"""
You are GenMail, an intelligent AI email assistant.

Generate a complete email using the confirmed intent below.

Recipient:
{recipient}

Purpose:
{purpose}

Reason:
{reason}

Timing:
{timing}

Tone:
{tone}

Length:
{length}

Instructions:

1. Generate an appropriate email subject.
2. Generate a complete, natural email body.
3. Follow the confirmed intent exactly.
4. Do not invent personal information.
5. Do not add fake names, student IDs, phone numbers, company names,
   addresses, dates, or other details that were not provided.
6. Do not use placeholders such as:
   [Your Name]
   [Professor's Name]
   [Student ID]
   [Date]
7. If the recipient's exact name is unknown, use an appropriate generic
   greeting such as "Dear Professor,".
8. If the sender's name is unknown, end the email naturally without
   inventing a name.
9. Match the requested tone.
10. Match the requested length.
11. Return ONLY this format:

SUBJECT: <subject>

BODY:
<body>
"""

    response = generate_with_fallback(intent_prompt)

    return response.text