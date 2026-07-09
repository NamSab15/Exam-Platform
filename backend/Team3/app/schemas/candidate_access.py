"""
Pydantic schemas for Candidate Access — FR-038, FR-039, FR-040.
"""
import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.exams_candidate_access import CandidateAccessMode
from app.models.exams_invited_candidate import CandidateStatus


# ── Access config ──────────────────────────────────────────────────────────────

class CandidateAccessCreate(BaseModel):
    """FR-038: Configure the access mode for an exam."""

    access_mode: CandidateAccessMode
    timezone_label: Optional[str] = Field(None, max_length=100)  # FR-040


class CandidateAccessResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    tenant_id: str
    exam_id: uuid.UUID
    access_mode: CandidateAccessMode
    invite_link_token: Optional[str]
    timezone_label: Optional[str]
    created_at: datetime
    updated_at: datetime


# ── Invite link ────────────────────────────────────────────────────────────────

class InviteLinkResponse(BaseModel):
    """FR-039: Returns the generated invite link token."""

    exam_id: uuid.UUID
    invite_link_token: str
    invite_link_url: str  # constructed URL for convenience


class PassphraseSet(BaseModel):
    """FR-039: Set a passphrase for the invite link."""

    passphrase: str = Field(..., min_length=4, max_length=128)


class PassphraseVerify(BaseModel):
    """FR-039: Verify a passphrase submitted by a candidate."""

    passphrase: str


class PassphraseVerifyResponse(BaseModel):
    valid: bool


# ── Candidates ─────────────────────────────────────────────────────────────────

class CandidateEmailAdd(BaseModel):
    """FR-038: Add candidates by individual email addresses."""

    emails: List[EmailStr] = Field(..., min_length=1, max_length=500)


class InvitedCandidateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    status: CandidateStatus
    invited_at: datetime


class CandidateBulkAddResponse(BaseModel):
    added: int
    skipped_duplicates: int
    emails_added: List[str]
