from dotenv import load_dotenv
load_dotenv()

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.dependencies import get_current_user
from app.services.user_service import create_or_update_user
from app.routes.emails import router as email_router
from app.routes.gmail import router as gmail_router
from app.routes.ai import router as ai_router
from app.routes.templates import router as templates_router
from app.routes.contacts import router as contacts_router

from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler
from app.services.scheduler_service import process_scheduled_emails
from app.services.storage_service import upload_attachment


scheduler = BackgroundScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):

    print("[SCHEDULER] Starting scheduled email worker...")

    scheduler.add_job(
        process_scheduled_emails,
        "interval",
        seconds=30,
        id="scheduled_email_worker",
        replace_existing=True,
    )

    scheduler.start()

    yield

    print("[SCHEDULER] Stopping scheduled email worker...")

    scheduler.shutdown()

app = FastAPI(
    title="GenMail API",
    description="Backend API for GenMail AI Email Automation",
    version="1.0.0",
    lifespan=lifespan,
)


# Allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "GenMail API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/firebase-test")
def firebase_test():
    return {
        "message": "Firebase Admin SDK initialized successfully"
    }


@app.get("/auth/me")
def get_me(current_user: dict = Depends(get_current_user)):
    firestore_user = create_or_update_user(current_user)

    return {
        "uid": current_user.get("uid"),
        "email": current_user.get("email"),
        "name": current_user.get("name"),
        "picture": current_user.get("picture"),
        "firestore_user": firestore_user,
    }
@app.get("/test-supabase-storage")
def test_supabase_storage():
    test_data = b"GenMail Supabase storage test"

    result = upload_attachment(
        file_bytes=test_data,
        storage_path="tests/genmail-test.txt",
        content_type="text/plain",
    )

    return {
        "message": "Supabase upload successful",
        "result": result,
    }

app.include_router(email_router)
app.include_router(gmail_router)
app.include_router(ai_router)
app.include_router(templates_router)
app.include_router(contacts_router)