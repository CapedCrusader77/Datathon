"""Pydantic schemas for POLICEGPT"""
from pydantic import BaseModel
from typing import Optional


class OfficerOut(BaseModel):
    id: Optional[str]
    name: Optional[str]
    role: Optional[str]
    badge_number: Optional[str]

    class Config:
        from_attributes = True
