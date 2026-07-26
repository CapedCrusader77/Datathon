"""
Database models (SQLAlchemy) for POLICEGPT
Complete schema for all crime investigation entities
"""
import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    ARRAY,
    JSON,
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy import Enum as SAEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


def gen_uuid():
    return str(uuid.uuid4())


# ── Enums ──────────────────────────────────────────────────────────────────

class CaseStatus(str, enum.Enum):
    OPEN = "open"
    UNDER_INVESTIGATION = "under_investigation"
    CHARGESHEETED = "chargesheeted"
    CLOSED = "closed"
    SUSPENDED = "suspended"

class CrimeCategory(str, enum.Enum):
    ROBBERY = "robbery"
    MURDER = "murder"
    ASSAULT = "assault"
    BURGLARY = "burglary"
    CYBERCRIME = "cybercrime"
    NARCOTICS = "narcotics"
    ECONOMIC_OFFENCE = "economic_offence"
    KIDNAPPING = "kidnapping"
    SEXUAL_OFFENCE = "sexual_offence"
    MISSING_PERSON = "missing_person"
    VEHICLE_THEFT = "vehicle_theft"
    TERRORISM = "terrorism"
    GANG_ACTIVITY = "gang_activity"
    OTHER = "other"

class OfficerRank(str, enum.Enum):
    CONSTABLE = "constable"
    HEAD_CONSTABLE = "head_constable"
    ASI = "asi"
    SI = "si"
    PSI = "psi"
    PI = "pi"
    DySP = "dysp"
    SP = "sp"
    DIG = "dig"
    IGP = "igp"
    ADGP = "adgp"
    DGP = "dgp"

class UserRole(str, enum.Enum):
    OFFICER = "officer"
    INSPECTOR = "inspector"
    DSP = "dsp"
    CYBERCRIME = "cybercrime"
    FORENSICS = "forensics"
    ANALYST = "analyst"
    ADMIN = "admin"
    COMMISSIONER = "commissioner"


# ── Core Models ────────────────────────────────────────────────────────────

class District(Base):
    __tablename__ = "districts"
    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(100), nullable=False, unique=True)
    code = Column(String(20), unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    police_stations = relationship("PoliceStation", back_populates="district")


class PoliceStation(Base):
    __tablename__ = "police_stations"
    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(200), nullable=False)
    code = Column(String(20), unique=True)
    district_id = Column(String, ForeignKey("districts.id"))
    address = Column(Text)
    phone = Column(String(20))
    latitude = Column(Float)
    longitude = Column(Float)
    district = relationship("District", back_populates="police_stations")
    firs = relationship("FIR", back_populates="police_station")


class Officer(Base):
    __tablename__ = "officers"
    id = Column(String, primary_key=True, default=gen_uuid)
    badge_number = Column(String(50), unique=True, nullable=False)
    name = Column(String(200), nullable=False)
    rank = Column(SAEnum(OfficerRank))
    role = Column(SAEnum(UserRole), default=UserRole.OFFICER)
    email = Column(String(200), unique=True)
    phone = Column(String(20))
    police_station_id = Column(String, ForeignKey("police_stations.id"))
    district_id = Column(String, ForeignKey("districts.id"))
    hashed_password = Column(String(255))
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    assigned_cases = relationship("FIR", back_populates="investigating_officer")


class FIR(Base):
    """First Information Report - Core crime record"""
    __tablename__ = "firs"
    id = Column(String, primary_key=True, default=gen_uuid)
    fir_number = Column(String(50), unique=True, nullable=False)  # e.g. "CR-01/2024"
    date_filed = Column(DateTime, nullable=False)
    date_incident = Column(DateTime)
    status = Column(SAEnum(CaseStatus), default=CaseStatus.OPEN)
    category = Column(SAEnum(CrimeCategory))
    sub_category = Column(String(100))

    # IPC / BNS Sections
    ipc_sections = Column(ARRAY(String))
    bns_sections = Column(ARRAY(String))

    # Narrative
    description = Column(Text)
    summary_ai = Column(Text)  # AI-generated summary
    modus_operandi = Column(Text)
    mo_embedding = Column(JSON)  # Vector embedding for MO similarity

    # Location
    crime_location = Column(Text)
    latitude = Column(Float)
    longitude = Column(Float)
    police_station_id = Column(String, ForeignKey("police_stations.id"))
    district_id = Column(String, ForeignKey("districts.id"))

    # People
    investigating_officer_id = Column(String, ForeignKey("officers.id"))

    # AI scores
    urgency_score = Column(Float, default=0.0)
    evidence_confidence = Column(Float, default=0.0)
    duplicate_probability = Column(Float, default=0.0)
    fake_complaint_score = Column(Float, default=0.0)

    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    police_station = relationship("PoliceStation", back_populates="firs")
    investigating_officer = relationship("Officer", back_populates="assigned_cases")
    suspects = relationship("FIRSuspect", back_populates="fir")
    victims = relationship("Victim", back_populates="fir")
    evidence = relationship("Evidence", back_populates="fir")
    chargesheet = relationship("Chargesheet", back_populates="fir", uselist=False)


class Person(Base):
    """Universal person record (suspect or victim base)"""
    __tablename__ = "persons"
    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(200))
    aliases = Column(ARRAY(String))
    dob = Column(DateTime)
    age = Column(Integer)
    gender = Column(String(20))
    nationality = Column(String(50), default="Indian")
    religion = Column(String(50))
    caste = Column(String(50))
    aadhaar = Column(String(12))  # Masked in display
    phone_numbers = Column(ARRAY(String))
    address_current = Column(Text)
    address_permanent = Column(Text)
    latitude = Column(Float)
    longitude = Column(Float)
    photo_url = Column(String(500))
    face_embedding = Column(JSON)  # For face similarity search
    fingerprint_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)


class Suspect(Base):
    __tablename__ = "suspects"
    id = Column(String, primary_key=True, default=gen_uuid)
    person_id = Column(String, ForeignKey("persons.id"))
    criminal_id = Column(String(50), unique=True)  # Police criminal ID
    is_repeat_offender = Column(Boolean, default=False)
    fir_count = Column(Integer, default=0)
    gang_affiliation = Column(String(200))
    gang_id = Column(String, ForeignKey("gangs.id"), nullable=True)
    risk_level = Column(String(20))  # low / medium / high / extreme
    last_known_location = Column(Text)
    is_absconding = Column(Boolean, default=False)
    is_arrested = Column(Boolean, default=False)
    arrest_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    person = relationship("Person")
    fir_links = relationship("FIRSuspect", back_populates="suspect")


class FIRSuspect(Base):
    """Many-to-many: FIR ↔ Suspect"""
    __tablename__ = "fir_suspects"
    id = Column(String, primary_key=True, default=gen_uuid)
    fir_id = Column(String, ForeignKey("firs.id"))
    suspect_id = Column(String, ForeignKey("suspects.id"))
    role = Column(String(100))  # main accused / co-accused / witness
    fir = relationship("FIR", back_populates="suspects")
    suspect = relationship("Suspect", back_populates="fir_links")


class Victim(Base):
    __tablename__ = "victims"
    id = Column(String, primary_key=True, default=gen_uuid)
    fir_id = Column(String, ForeignKey("firs.id"))
    person_id = Column(String, ForeignKey("persons.id"))
    injury_description = Column(Text)
    medical_report_url = Column(String(500))
    statement = Column(Text)
    fir = relationship("FIR", back_populates="victims")
    person = relationship("Person")


class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(String, primary_key=True, default=gen_uuid)
    registration_number = Column(String(20), index=True)
    make = Column(String(100))
    model = Column(String(100))
    color = Column(String(50))
    year = Column(Integer)
    owner_person_id = Column(String, ForeignKey("persons.id"))
    is_stolen = Column(Boolean, default=False)
    stolen_date = Column(DateTime)
    chassis_number = Column(String(100))
    engine_number = Column(String(100))
    fir_links = Column(ARRAY(String))  # FIR IDs this vehicle appears in
    created_at = Column(DateTime, default=datetime.utcnow)
    owner = relationship("Person")


class Weapon(Base):
    __tablename__ = "weapons"
    id = Column(String, primary_key=True, default=gen_uuid)
    type = Column(String(100))
    description = Column(Text)
    serial_number = Column(String(100))
    registered_owner_id = Column(String, ForeignKey("persons.id"))
    is_licensed = Column(Boolean)
    recovered_in_fir = Column(String, ForeignKey("firs.id"))
    created_at = Column(DateTime, default=datetime.utcnow)


class Evidence(Base):
    __tablename__ = "evidence"
    id = Column(String, primary_key=True, default=gen_uuid)
    fir_id = Column(String, ForeignKey("firs.id"))
    type = Column(String(100))  # physical / digital / documentary / forensic
    description = Column(Text)
    file_url = Column(String(500))
    file_type = Column(String(50))  # pdf / image / video / audio
    extracted_text = Column(Text)  # OCR output
    ai_analysis = Column(Text)
    confidence_score = Column(Float)
    chain_of_custody = Column(JSON)  # List of handlers with timestamps
    collected_by = Column(String, ForeignKey("officers.id"))
    collected_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    fir = relationship("FIR", back_populates="evidence")


class Gang(Base):
    __tablename__ = "gangs"
    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(200))
    aliases = Column(ARRAY(String))
    active_since = Column(DateTime)
    last_active = Column(DateTime)
    territory = Column(Text)
    crime_specialization = Column(ARRAY(String))
    leader_person_id = Column(String, ForeignKey("persons.id"))
    strength = Column(Integer)
    status = Column(String(50))  # active / dormant / disbanded
    created_at = Column(DateTime, default=datetime.utcnow)
    members = relationship("Suspect", foreign_keys=[Suspect.gang_id])


class PhoneRecord(Base):
    __tablename__ = "phone_records"
    id = Column(String, primary_key=True, default=gen_uuid)
    phone_number = Column(String(20), index=True)
    subscriber_name = Column(String(200))
    person_id = Column(String, ForeignKey("persons.id"))
    operator = Column(String(100))
    imei = Column(String(20))
    fir_links = Column(ARRAY(String))
    created_at = Column(DateTime, default=datetime.utcnow)


class CrimeScene(Base):
    __tablename__ = "crime_scenes"
    id = Column(String, primary_key=True, default=gen_uuid)
    fir_id = Column(String, ForeignKey("firs.id"))
    address = Column(Text)
    latitude = Column(Float)
    longitude = Column(Float)
    scene_type = Column(String(100))
    description = Column(Text)
    cctv_available = Column(Boolean, default=False)
    cctv_coverage_hours = Column(Integer)
    forensic_report = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class Chargesheet(Base):
    __tablename__ = "chargesheets"
    id = Column(String, primary_key=True, default=gen_uuid)
    fir_id = Column(String, ForeignKey("firs.id"), unique=True)
    filing_date = Column(DateTime)
    court_name = Column(String(200))
    sections_charged = Column(ARRAY(String))
    summary = Column(Text)
    ai_summary = Column(Text)
    file_url = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    fir = relationship("FIR", back_populates="chargesheet")


class MissingPerson(Base):
    __tablename__ = "missing_persons"
    id = Column(String, primary_key=True, default=gen_uuid)
    person_id = Column(String, ForeignKey("persons.id"))
    reported_missing_date = Column(DateTime)
    last_seen_location = Column(Text)
    last_seen_latitude = Column(Float)
    last_seen_longitude = Column(Float)
    case_status = Column(String(50))  # missing / found / deceased
    linked_fir_id = Column(String, ForeignKey("firs.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    person = relationship("Person")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String, primary_key=True, default=gen_uuid)
    officer_id = Column(String, ForeignKey("officers.id"))
    action = Column(String(200))
    resource_type = Column(String(100))
    resource_id = Column(String)
    ip_address = Column(String(50))
    query_text = Column(Text)
    response_summary = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)


class ConversationHistory(Base):
    __tablename__ = "conversation_history"
    id = Column(String, primary_key=True, default=gen_uuid)
    session_id = Column(String, index=True)
    officer_id = Column(String, ForeignKey("officers.id"))
    role = Column(String(20))  # user / assistant / system
    content = Column(Text)
    citations = Column(JSON)
    tool_calls = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)
