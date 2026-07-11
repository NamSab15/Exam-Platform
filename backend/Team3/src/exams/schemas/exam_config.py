"""Pydantic schemas for Exam Configuration (FR-031 – FR-048)."""
from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel

from exams.models import (
    CandidateAccessMode,
    CandidateStatus,
    ProctoringLevel,
    QuestionSelectionMode,
    RecordingMode,
    ResultReleaseMode,
    ScoreDisplayMode,
)


# ---------------------------------------------------------------------------
# Exam Configuration
# ---------------------------------------------------------------------------

class ExamConfigCreate(BaseModel):
    title: str
    description: str | None = None
    instructions: str | None = None
    total_duration_minutes: int
    total_marks: Decimal
    passing_marks: Decimal
    window_start: datetime | None = None
    window_end: datetime | None = None
    shuffle_questions: bool = False
    shuffle_options: bool = False
    max_attempts: int = 1
    cooldown_minutes: int = 0
    navigation_locked: bool = False
    negative_marking_pct: Decimal | None = None


class ExamConfigResponse(BaseModel):
    id: uuid.UUID
    tenant_id: str
    exam_id: uuid.UUID
    title: str
    description: str | None
    instructions: str | None
    total_duration_minutes: int
    total_marks: Decimal
    passing_marks: Decimal
    window_start: datetime | None
    window_end: datetime | None
    shuffle_questions: bool
    shuffle_options: bool
    max_attempts: int
    cooldown_minutes: int
    navigation_locked: bool
    negative_marking_pct: Decimal | None
    is_locked: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Sections
# ---------------------------------------------------------------------------

class SectionCreate(BaseModel):
    title: str
    instructions: str | None = None
    time_limit_minutes: int | None = None
    negative_marking_pct: Decimal | None = None
    order_index: int = 0


class SectionResponse(BaseModel):
    id: uuid.UUID
    title: str
    instructions: str | None
    time_limit_minutes: int | None
    negative_marking_pct: Decimal | None
    order_index: int

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Section Questions
# ---------------------------------------------------------------------------

class SectionQuestionCreate(BaseModel):
    selection_mode: QuestionSelectionMode
    question_id: uuid.UUID | None = None
    random_pool_tag: str | None = None
    random_pool_difficulty: str | None = None
    random_count: int | None = None
    order_index: int = 0


class SectionQuestionResponse(BaseModel):
    id: uuid.UUID
    selection_mode: QuestionSelectionMode
    question_id: uuid.UUID | None
    random_pool_tag: str | None
    random_pool_difficulty: str | None
    random_count: int | None
    order_index: int

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Candidate Access
# ---------------------------------------------------------------------------

class CandidateAccessCreate(BaseModel):
    access_mode: CandidateAccessMode
    timezone_label: str | None = None


class CandidateAccessResponse(BaseModel):
    id: uuid.UUID
    exam_id: uuid.UUID
    access_mode: CandidateAccessMode
    timezone_label: str | None
    invite_link_token: str | None

    model_config = {"from_attributes": True}


class CandidateEmailAdd(BaseModel):
    emails: list[str]


class InvitedCandidateResponse(BaseModel):
    id: uuid.UUID
    email: str
    status: CandidateStatus
    invited_at: datetime

    model_config = {"from_attributes": True}


class CandidateBulkAddResponse(BaseModel):
    added: int
    skipped_duplicates: int
    emails_added: list[str]


class InviteLinkResponse(BaseModel):
    exam_id: uuid.UUID
    invite_link_token: str
    invite_link_url: str


class PassphraseSet(BaseModel):
    passphrase: str


class PassphraseVerify(BaseModel):
    passphrase: str


class PassphraseVerifyResponse(BaseModel):
    valid: bool


# ---------------------------------------------------------------------------
# Proctoring Config
# ---------------------------------------------------------------------------

class ProctoringConfigCreate(BaseModel):
    level: ProctoringLevel = ProctoringLevel.NONE
    recording_mode: RecordingMode = RecordingMode.NONE


class ProctoringFlagCreate(BaseModel):
    flag_type: str
    enabled: bool = True
    warning_threshold: int = 3
    notification_threshold: int = 5
    termination_threshold: int = 10


class ProctoringFlagResponse(BaseModel):
    id: uuid.UUID
    flag_type: str
    enabled: bool
    warning_threshold: int
    notification_threshold: int
    termination_threshold: int

    model_config = {"from_attributes": True}


class ProctoringConfigResponse(BaseModel):
    id: uuid.UUID
    exam_id: uuid.UUID
    level: ProctoringLevel
    recording_mode: RecordingMode
    flags: list[ProctoringFlagResponse] = []

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Result Release
# ---------------------------------------------------------------------------

class ResultReleaseCreate(BaseModel):
    release_mode: ResultReleaseMode = ResultReleaseMode.IMMEDIATE
    release_at: datetime | None = None
    score_display: ScoreDisplayMode = ScoreDisplayMode.TOTAL_ONLY
    certificate_enabled: bool = False


class ResultReleaseResponse(BaseModel):
    id: uuid.UUID
    exam_id: uuid.UUID
    release_mode: ResultReleaseMode
    release_at: datetime | None
    score_display: ScoreDisplayMode
    certificate_enabled: bool

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Lock status
# ---------------------------------------------------------------------------

class LockStatusResponse(BaseModel):
    exam_id: uuid.UUID
    is_locked: bool
