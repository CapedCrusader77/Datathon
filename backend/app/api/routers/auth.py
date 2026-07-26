"""
Authentication Router — JWT + RBAC for POLICEGPT
Zero Trust: every request is authenticated and authorized
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional
import jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.db.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    officer_name: str
    officer_role: str
    badge_number: str


class LoginRequest(BaseModel):
    badge_number: str
    password: str


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire, "iat": datetime.utcnow(), "type": "access"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


@router.post("/login", response_model=Token)
async def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    """
    Police officer login with badge number + password.
    Returns JWT access + refresh tokens.
    """
    # Validate credentials against database
    # officer = await get_officer_by_badge(db, form_data.username)
    # For demo: use hardcoded test credentials
    demo_officers = {
        "KSP001": {"name": "Inspector Ramesh Kumar", "role": "inspector", "password": "police123"},
        "KSP002": {"name": "SI Priya Sharma", "role": "officer", "password": "police123"},
        "KSP003": {"name": "DySP Vikram Nair", "role": "dsp", "password": "police123"},
        "KSP004": {"name": "Cyber Expert Ananya", "role": "cybercrime", "password": "police123"},
        "KSP999": {"name": "Commissioner DGP", "role": "commissioner", "password": "admin123"},
    }

    officer_data = demo_officers.get(form_data.username)
    if not officer_data or officer_data["password"] != form_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid badge number or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_data = {
        "sub": form_data.username,
        "name": officer_data["name"],
        "role": officer_data["role"],
        "badge": form_data.username,
    }

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        officer_name=officer_data["name"],
        officer_role=officer_data["role"],
        badge_number=form_data.username,
    )


@router.post("/refresh")
async def refresh_token(refresh_token: str):
    """Refresh access token using refresh token"""
    try:
        payload = jwt.decode(
            refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")

        new_access_token = create_access_token(
            {"sub": payload["sub"], "name": payload["name"], "role": payload["role"]}
        )
        return {"access_token": new_access_token, "token_type": "bearer"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/logout")
async def logout():
    """Logout — client should discard tokens"""
    return {"message": "Logged out successfully"}


@router.get("/me")
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current officer profile"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return {
            "badge_number": payload.get("badge"),
            "name": payload.get("name"),
            "role": payload.get("role"),
        }
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
