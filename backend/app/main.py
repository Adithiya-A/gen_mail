from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.dependencies import get_current_user
from app.services.user_service import create_or_update_user
from app.routes.emails import router as email_router


app = FastAPI(
    title="GenMail API",
    description="Backend API for GenMail AI Email Automation",
    version="1.0.0",
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

app.include_router(email_router)

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