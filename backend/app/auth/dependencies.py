"""Stub modules for app.auth, app.models.schemas, app.db"""
# app/auth/dependencies.py
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_officer(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return type("Officer", (), {
            "id": payload.get("sub"),
            "name": payload.get("name"),
            "role": payload.get("role"),
            "badge_number": payload.get("badge"),
        })()
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
