"""Admin router stub"""
from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_officer
from app.models.schemas import OfficerOut

router = APIRouter()

@router.get("/stats")
async def admin_stats(officer: OfficerOut = Depends(get_current_officer)):
    return {"total_officers": 1247, "active_sessions": 89, "queries_today": 1204}
