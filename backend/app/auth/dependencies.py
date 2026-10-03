from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.firebase import verify_firebase_token


security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    id_token = credentials.credentials

    try:
        decoded_token = verify_firebase_token(id_token)
        return decoded_token

    except Exception as e:
        print("Firebase token verification error:", repr(e))

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase token",
        )