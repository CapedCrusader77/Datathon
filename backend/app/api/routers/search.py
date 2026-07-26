"""
Search Router — Unified search across all entities
"""
from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.auth.dependencies import get_current_officer
from app.models.schemas import OfficerOut

router = APIRouter()


@router.get("/")
async def unified_search(
    q: str = Query(..., min_length=2),
    entity_type: Optional[str] = Query(default=None, description="fir|suspect|vehicle|phone|weapon"),
    officer: OfficerOut = Depends(get_current_officer),
):
    """Unified search across FIRs, suspects, vehicles, phones, weapons"""
    return {
        "query": q,
        "results": {
            "firs": [{"fir_number": "CR-045/2024", "relevance": 0.92, "category": "Robbery"}],
            "suspects": [{"name": "Ravi Kumar", "criminal_id": "KSP-CR-2024-0001", "relevance": 0.88}],
            "vehicles": [{"registration": "KA-01-AB-1234", "model": "Hyundai i20", "relevance": 0.71}],
        },
        "total_results": 3,
    }


@router.get("/vehicle/{registration_number}")
async def lookup_vehicle(
    registration_number: str,
    officer: OfficerOut = Depends(get_current_officer),
):
    """Vehicle lookup by registration number"""
    return {
        "registration_number": registration_number.upper(),
        "make": "Hyundai", "model": "i20", "color": "White", "year": 2019,
        "owner": "Ravi Kumar S", "owner_criminal_id": "KSP-CR-2024-0001",
        "is_stolen": False,
        "fir_appearances": ["CR-045/2024", "CR-089/2023"],
        "last_seen": {"date": "2024-03-10", "location": "Koramangala 5th Block"},
    }


@router.get("/phone/{phone_number}")
async def lookup_phone(
    phone_number: str,
    officer: OfficerOut = Depends(get_current_officer),
):
    """Phone number intelligence lookup"""
    return {
        "phone_number": phone_number,
        "subscriber": "Ravi Kumar S",
        "operator": "Jio",
        "imei": "35XXXXXXXXXXXXXXX",
        "fir_links": ["CR-045/2024", "CR-089/2023"],
        "call_record_summary": "450 calls in last 90 days. Frequent contact with 3 known associates.",
        "tower_locations": ["Koramangala", "Shivajinagar", "Mysore Road"],
    }
