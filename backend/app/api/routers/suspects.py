"""
Suspects Router — Criminal profiling, history, repeat offender detection
"""

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel

from app.auth.dependencies import get_current_officer
from app.models.schemas import OfficerOut

router = APIRouter()


class SuspectProfile(BaseModel):
    id: str
    criminal_id: str
    name: str
    aliases: list[str]
    age: int
    gender: str
    photo_url: str | None
    risk_level: str
    fir_count: int
    is_repeat_offender: bool
    gang_affiliation: str | None
    is_arrested: bool
    is_absconding: bool
    last_known_location: str | None
    crime_categories: list[str]
    created_at: str


@router.get("/", response_model=list[SuspectProfile])
async def list_suspects(
    search: str | None = None,
    risk_level: str | None = None,
    is_absconding: bool | None = None,
    repeat_offender: bool | None = None,
    district: str | None = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    officer: OfficerOut = Depends(get_current_officer),
):
    """Search and list suspects with filtering"""
    # Demo data
    demo_suspects = [
        SuspectProfile(
            id="s1", criminal_id="KSP-CR-2024-0001",
            name="Ravi Kumar S", aliases=["Ravi Bhai", "King"],
            age=34, gender="Male", photo_url=None,
            risk_level="extreme", fir_count=12,
            is_repeat_offender=True, gang_affiliation="Bengaluru South Gang",
            is_arrested=False, is_absconding=True,
            last_known_location="Shivajinagar area, Bangalore",
            crime_categories=["robbery", "assault", "extortion"],
            created_at="2020-03-15T10:00:00"
        ),
        SuspectProfile(
            id="s2", criminal_id="KSP-CR-2023-0045",
            name="Mohammed Irfan", aliases=["Irfan Bhai"],
            age=28, gender="Male", photo_url=None,
            risk_level="high", fir_count=7,
            is_repeat_offender=True, gang_affiliation=None,
            is_arrested=True, is_absconding=False,
            last_known_location="Central Prison, Parappana Agrahara",
            crime_categories=["cybercrime", "fraud"],
            created_at="2021-06-20T14:30:00"
        ),
        SuspectProfile(
            id="s3", criminal_id="KSP-CR-2024-0078",
            name="Venkatesh P", aliases=["Venki"],
            age=41, gender="Male", photo_url=None,
            risk_level="high", fir_count=5,
            is_repeat_offender=True, gang_affiliation="Mysore Network",
            is_arrested=False, is_absconding=False,
            last_known_location="Mysore City",
            crime_categories=["narcotics", "robbery"],
            created_at="2019-11-08T09:00:00"
        ),
    ]
    return demo_suspects


@router.get("/{suspect_id}", response_model=SuspectProfile)
async def get_suspect_profile(
    suspect_id: str,
    officer: OfficerOut = Depends(get_current_officer),
):
    """Get complete suspect profile with full criminal history"""
    return SuspectProfile(
        id=suspect_id, criminal_id="KSP-CR-2024-0001",
        name="Ravi Kumar S", aliases=["Ravi Bhai", "King", "Boss"],
        age=34, gender="Male", photo_url=None,
        risk_level="extreme", fir_count=12,
        is_repeat_offender=True, gang_affiliation="Bengaluru South Gang",
        is_arrested=False, is_absconding=True,
        last_known_location="Shivajinagar area, Bangalore",
        crime_categories=["robbery", "assault", "extortion", "vehicle_theft"],
        created_at="2020-03-15T10:00:00"
    )


@router.get("/{suspect_id}/timeline")
async def get_suspect_timeline(
    suspect_id: str,
    officer: OfficerOut = Depends(get_current_officer),
):
    """Chronological crime timeline for a suspect"""
    return {
        "suspect_id": suspect_id,
        "timeline": [
            {"date": "2020-03-15", "event": "First arrest", "fir": "CR-012/2020", "category": "robbery"},
            {"date": "2020-09-20", "event": "Bail granted", "court": "JMFC Bangalore", "fir": "CR-012/2020"},
            {"date": "2021-04-08", "event": "New FIR filed", "fir": "CR-087/2021", "category": "assault"},
            {"date": "2022-01-15", "event": "Arrested again", "fir": "CR-034/2022", "category": "robbery"},
            {"date": "2022-07-30", "event": "Absconding declared", "court_order": "KCOCA applied"},
            {"date": "2023-11-22", "event": "Spotted — evaded capture", "location": "Shivajinagar"},
            {"date": "2024-03-10", "event": "New FIR", "fir": "CR-045/2024", "category": "extortion"},
        ]
    }


@router.get("/{suspect_id}/similar-mo")
async def find_similar_mo_cases(
    suspect_id: str,
    officer: OfficerOut = Depends(get_current_officer),
):
    """Find cases with similar modus operandi — AI-powered MO matching"""
    return {
        "suspect_id": suspect_id,
        "modus_operandi": "Targets late-night petrol stations. Works in team of 3. Uses motorcycles for escape. Always armed with blades.",
        "similar_cases": [
            {"fir": "CR-045/2024", "similarity": 0.94, "location": "Koramangala", "date": "2024-03-10"},
            {"fir": "CR-089/2023", "similarity": 0.87, "location": "Whitefield", "date": "2023-08-22"},
            {"fir": "CR-156/2022", "similarity": 0.81, "location": "Electronic City", "date": "2022-11-15"},
        ],
        "ai_analysis": "High probability (87%) same offender responsible for all 3 cases based on MO pattern match."
    }
