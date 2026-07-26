"""Pydantic schemas for POLICEGPT"""

from pydantic import BaseModel


class OfficerOut(BaseModel):
    id: str | None
    name: str | None
    role: str | None
    badge_number: str | None

    class Config:
        from_attributes = True
