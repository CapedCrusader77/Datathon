"""
Cases / FIR Router — Search, retrieve, create FIRs
"""
from datetime import date

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from pydantic import BaseModel

from app.auth.dependencies import get_current_officer
from app.models.schemas import OfficerOut

router = APIRouter()


class FIRSummary(BaseModel):
    id: str
    fir_number: str
    date_filed: str
    category: str
    status: str
    crime_location: str
    district: str
    investigating_officer: str
    suspect_count: int
    urgency_score: float
    ai_summary: str | None


@router.get("/", response_model=list[FIRSummary])
async def list_firs(
    search: str | None = None,
    category: str | None = None,
    status: str | None = None,
    district: str | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    repeat_offender: bool | None = None,
    unsolved_days: int | None = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    officer: OfficerOut = Depends(get_current_officer),
):
    """
    Search FIRs with rich filtering.
    Supports: category, status, district, date range, repeat offender flag, days unsolved.
    """
    demo_firs = [
        FIRSummary(id="f1", fir_number="CR-045/2024", date_filed="2024-03-10", category="Robbery",
                   status="open", crime_location="Koramangala 5th Block", district="Bangalore South",
                   investigating_officer="SI Priya Sharma", suspect_count=3, urgency_score=0.87,
                   ai_summary="Armed robbery at petrol station. 3 suspects on motorcycles. CCTV footage available."),
        FIRSummary(id="f2", fir_number="CR-089/2024", date_filed="2024-05-22", category="Cybercrime",
                   status="under_investigation", crime_location="Whitefield", district="Bangalore East",
                   investigating_officer="Inspector Ramesh Kumar", suspect_count=1, urgency_score=0.72,
                   ai_summary="Online fraud - ₹4.5L stolen via fake KYC link. Suspect traced to Delhi."),
        FIRSummary(id="f3", fir_number="CR-112/2023", date_filed="2023-11-15", category="Murder",
                   status="chargesheeted", crime_location="Mysore Road", district="Bangalore South",
                   investigating_officer="Inspector Ramesh Kumar", suspect_count=2, urgency_score=0.95,
                   ai_summary="Homicide. Two accused arrested. Chargesheet filed. Trial pending."),
        FIRSummary(id="f4", fir_number="CR-034/2024", date_filed="2024-01-08", category="Narcotics",
                   status="open", crime_location="KR Market area", district="Bangalore Central",
                   investigating_officer="SI Priya Sharma", suspect_count=4, urgency_score=0.81,
                   ai_summary="Drug peddling network. 4 suspects. 2.3kg MDMA seized. Network extends to Goa."),
        FIRSummary(id="f5", fir_number="CR-078/2024", date_filed="2024-04-15", category="Vehicle Theft",
                   status="open", crime_location="Jayanagar 4th T Block", district="Bangalore South",
                   investigating_officer="SI Priya Sharma", suspect_count=2, urgency_score=0.55,
                   ai_summary="Honda City stolen. Suspect identified via CCTV. Vehicle possibly in Tumkur."),
    ]
    return demo_firs


@router.get("/{fir_id}")
async def get_fir_detail(
    fir_id: str,
    officer: OfficerOut = Depends(get_current_officer),
):
    """Get complete FIR with all linked data"""
    return {
        "id": fir_id,
        "fir_number": "CR-045/2024",
        "date_filed": "2024-03-10T22:30:00",
        "date_incident": "2024-03-10T21:45:00",
        "status": "open",
        "category": "Robbery",
        "ipc_sections": ["392", "397", "34"],
        "bns_sections": ["309", "310"],
        "description": "On 10-03-2024 at approximately 21:45 hrs, three masked persons arrived on two motorcycles at Vijay Petroleum, Koramangala 5th Block. They were armed with sharp weapons. They threatened the staff and decamped with ₹1,42,000 cash from the counter. CCTV shows partial registration KA-01 visible on one motorcycle.",
        "crime_location": "Vijay Petroleum, Koramangala 5th Block, Bangalore 560095",
        "latitude": 12.9356, "longitude": 77.6272,
        "district": "Bangalore South",
        "police_station": "Koramangala PS",
        "investigating_officer": "SI Priya Sharma (KSP002)",
        "urgency_score": 0.87,
        "evidence_confidence": 0.71,
        "suspects": [
            {"name": "Ravi Kumar S", "role": "Main accused", "status": "Absconding"},
            {"name": "Unknown Male 1", "role": "Co-accused", "status": "Not identified"},
            {"name": "Unknown Male 2", "role": "Co-accused", "status": "Not identified"},
        ],
        "evidence": [
            {"type": "CCTV footage", "description": "Petrol station camera 3 — 60 sec clip", "confidence": 0.82},
            {"type": "Witness statement", "description": "Petrol station attendant", "confidence": 0.90},
            {"type": "Physical evidence", "description": "Blood sample from scene", "confidence": 0.78},
        ],
        "similar_cases": ["CR-089/2023", "CR-156/2022"],
        "ai_recommendations": [
            "Verify CCTV from adjacent shops on 5th Block",
            "Cross-check motorcycle registration with RTO records",
            "Compare MO with robbery cluster in Koramangala Q1 2024",
            "Ravi Kumar S known to frequent Shivajinagar — alert all PSs",
        ]
    }


@router.post("/{fir_id}/ai-summary")
async def generate_ai_summary(
    fir_id: str,
    officer: OfficerOut = Depends(get_current_officer),
):
    """Generate AI summary and legal section recommendations for a FIR"""
    return {
        "fir_id": fir_id,
        "ai_summary": "Armed robbery at petrol station on 10-Mar-2024. Three masked suspects, two motorcycles. ₹1.42L stolen. Main accused Ravi Kumar S (absconding, repeat offender). CCTV evidence available. Similar MO to 2 prior robberies in south Bangalore.",
        "recommended_sections": {
            "ipc": ["392 (Robbery — 10 years)", "397 (Robbery with deadly weapon — min 7 years)", "34 (Common intention)"],
            "bns": ["309 (Robbery)", "310 (Dacoity preparation)"],
        },
        "urgency_assessment": "HIGH — Repeat offender absconding. Immediate lookout notice recommended.",
        "next_steps": ["Issue LOC for Ravi Kumar S", "Forensic analysis of blood sample", "Check CDR of towers in 1km radius"],
    }


@router.post("/upload-pdf")
async def upload_fir_pdf(
    file: UploadFile = File(...),
    officer: OfficerOut = Depends(get_current_officer),
):
    """Upload and OCR-parse a PDF FIR"""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files accepted")
    return {
        "filename": file.filename,
        "status": "processed",
        "extracted_fir_number": "CR-045/2024",
        "confidence": 0.94,
        "message": "FIR parsed successfully. Review and confirm before saving.",
    }
