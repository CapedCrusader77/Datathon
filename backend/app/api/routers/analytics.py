"""
Analytics API Router — Crime heatmaps, trends, hotspots, statistics
"""
from fastapi import APIRouter, Depends, Query
from typing import Optional, List
from datetime import datetime, date
from pydantic import BaseModel

from app.auth.dependencies import get_current_officer
from app.models.schemas import OfficerOut

router = APIRouter()


class CrimeHotspot(BaseModel):
    latitude: float
    longitude: float
    weight: float
    count: int
    category: str
    location_name: str


class TrendData(BaseModel):
    period: str
    count: int
    category: str
    change_percent: float


@router.get("/heatmap")
async def get_crime_heatmap(
    district: Optional[str] = None,
    category: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    officer: OfficerOut = Depends(get_current_officer),
):
    """
    Returns geo-coordinates for crime heatmap visualization.
    Powers the interactive map in the dashboard.
    """
    # Demo data for Karnataka districts
    hotspots = [
        {"lat": 12.9716, "lng": 77.5946, "weight": 0.9, "count": 342, "area": "Bangalore Central"},
        {"lat": 12.9352, "lng": 77.6245, "weight": 0.75, "count": 287, "area": "Bangalore East"},
        {"lat": 12.8931, "lng": 77.5969, "weight": 0.8, "count": 311, "area": "Bangalore South"},
        {"lat": 13.0358, "lng": 77.5970, "weight": 0.6, "count": 198, "area": "Bangalore North"},
        {"lat": 12.2958, "lng": 76.6394, "weight": 0.65, "count": 167, "area": "Mysore"},
        {"lat": 15.3647, "lng": 75.1240, "weight": 0.55, "count": 143, "area": "Hubli"},
        {"lat": 15.8497, "lng": 74.4977, "weight": 0.45, "count": 98, "area": "Belgaum"},
        {"lat": 13.1986, "lng": 77.7066, "weight": 0.5, "count": 112, "area": "Kolar"},
        {"lat": 14.4663, "lng": 75.9238, "weight": 0.4, "count": 89, "area": "Shimoga"},
        {"lat": 13.3409, "lng": 77.1000, "weight": 0.35, "count": 76, "area": "Tumkur"},
        {"lat": 12.8605, "lng": 74.8433, "weight": 0.55, "count": 134, "area": "Mangalore"},
        {"lat": 17.3297, "lng": 76.8200, "weight": 0.4, "count": 87, "area": "Gulbarga"},
    ]
    return {"hotspots": hotspots, "total_incidents": sum(h["count"] for h in hotspots)}


@router.get("/trends")
async def get_crime_trends(
    period: str = Query(default="monthly", pattern="^(daily|weekly|monthly|yearly)$"),
    district: Optional[str] = None,
    year: int = Query(default=2024),
    officer: OfficerOut = Depends(get_current_officer),
):
    """Crime trend analysis over time"""
    monthly_data = [
        {"month": "Jan", "robbery": 45, "cybercrime": 89, "assault": 67, "burglary": 34, "narcotics": 23},
        {"month": "Feb", "robbery": 38, "cybercrime": 102, "assault": 71, "burglary": 29, "narcotics": 31},
        {"month": "Mar", "robbery": 52, "cybercrime": 115, "assault": 63, "burglary": 41, "narcotics": 28},
        {"month": "Apr", "robbery": 49, "cybercrime": 98, "assault": 59, "burglary": 37, "narcotics": 35},
        {"month": "May", "robbery": 61, "cybercrime": 134, "assault": 82, "burglary": 48, "narcotics": 42},
        {"month": "Jun", "robbery": 58, "cybercrime": 121, "assault": 74, "burglary": 43, "narcotics": 38},
        {"month": "Jul", "robbery": 67, "cybercrime": 143, "assault": 88, "burglary": 52, "narcotics": 47},
        {"month": "Aug", "robbery": 72, "cybercrime": 156, "assault": 91, "burglary": 58, "narcotics": 51},
        {"month": "Sep", "robbery": 64, "cybercrime": 148, "assault": 79, "burglary": 49, "narcotics": 44},
        {"month": "Oct", "robbery": 69, "cybercrime": 162, "assault": 85, "burglary": 55, "narcotics": 49},
        {"month": "Nov", "robbery": 55, "cybercrime": 139, "assault": 71, "burglary": 42, "narcotics": 40},
        {"month": "Dec", "robbery": 48, "cybercrime": 128, "assault": 66, "burglary": 38, "narcotics": 36},
    ]
    return {"period": "monthly", "year": year, "data": monthly_data}


@router.get("/kpis")
async def get_dashboard_kpis(
    officer: OfficerOut = Depends(get_current_officer),
):
    """Key performance indicators for the dashboard"""
    return {
        "total_firs_2024": 48_234,
        "open_cases": 12_891,
        "solved_cases": 35_343,
        "clearance_rate": 73.3,
        "repeat_offenders": 2_341,
        "missing_persons_active": 234,
        "cybercrime_reports_ytd": 8_921,
        "narcotics_seized_kg": 1245.6,
        "arrests_ytd": 19_876,
        "chargesheets_filed": 28_441,
        "avg_investigation_days": 47.2,
        "ai_queries_today": 1_204,
        "trends": {
            "firs": +5.2,
            "solved": +12.4,
            "cybercrime": +34.1,
            "narcotics": -8.7,
        },
    }


@router.get("/category-breakdown")
async def get_category_breakdown(
    officer: OfficerOut = Depends(get_current_officer),
):
    """Crime category distribution"""
    return {
        "data": [
            {"category": "Cybercrime", "count": 8921, "color": "#6366f1"},
            {"category": "Robbery", "count": 5432, "color": "#f59e0b"},
            {"category": "Assault", "count": 7234, "color": "#ef4444"},
            {"category": "Burglary", "count": 4123, "color": "#8b5cf6"},
            {"category": "Narcotics", "count": 3456, "color": "#10b981"},
            {"category": "Vehicle Theft", "count": 6789, "color": "#3b82f6"},
            {"category": "Economic Offence", "count": 2341, "color": "#f97316"},
            {"category": "Missing Persons", "count": 1234, "color": "#14b8a6"},
            {"category": "Murder", "count": 892, "color": "#dc2626"},
            {"category": "Others", "count": 7812, "color": "#6b7280"},
        ]
    }


@router.get("/predictions")
async def get_crime_predictions(
    district: Optional[str] = None,
    days_ahead: int = Query(default=30, ge=7, le=90),
    officer: OfficerOut = Depends(get_current_officer),
):
    """AI-powered crime prediction for next N days"""
    return {
        "prediction_period_days": days_ahead,
        "model": "POLICEGPT-PredictV1",
        "confidence": 0.76,
        "hotspot_predictions": [
            {"area": "Bangalore Central", "predicted_increase": +12.3, "risk": "high"},
            {"area": "Mysore City", "predicted_increase": +5.7, "risk": "medium"},
            {"area": "Hubli", "predicted_increase": -3.2, "risk": "low"},
        ],
        "category_predictions": [
            {"category": "Cybercrime", "predicted_change": +18.5, "driver": "Festival season online fraud"},
            {"category": "Vehicle Theft", "predicted_change": +8.2, "driver": "High demand period"},
            {"category": "Robbery", "predicted_change": -4.1, "driver": "Increased patrolling"},
        ],
        "disclaimer": "Predictions are probabilistic estimates for resource planning only.",
    }
