"""
SQLModel ORM models for the Exam Configuration & Session service.
All tables are prefixed with their domain as per the shared schema convention.
"""
from __future__ import annotations

import enum
import uuid
from datetime import UTC, datetime
from decimal import Decimal
from typing import Any

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, SQLModel


# ---------------------------------------------------------------------------
# Enum types
# ---------------------------------------------------------------------------

class QuestionSelectionMode(str, enum.Enum):
    MANUAL = "manual"
    RANDOM = "random"


class CandidateAccessMode(str, enum.Enum):
    EMAIL_LIST = "email_list"
    CSV_UPLOAD = "csv_upload"
    INVITE_LINK = "invite_link"


class CandidateStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    COMPLETED = "completed"


class ProctoringLevel(str, enum.Enum):
    NONE = "none"
    AI_ONLY = "ai_only"
    AI_HUMAN = "ai_human"
    HUMAN_ONLY = "human_only"


class RecordingMode(str, enum.Enum):
    NONE = "none"
    WEBCAM_ONLY = "webcam_only"
    SCREEN_ONLY = "screen_only"
    BOTH = "both"


class ResultReleaseMode(str, enum.Enum):
    IMMEDIATE = "immediate"
    SCHEDULED = "scheduled"
    NEVER = "never"


class ScoreDisplayMode(str, enum.Enum):
    TOTAL_ONLY = "total_only"
    SECTION_BREAKDOWN = "section_breakdown"
    PER_QUESTION = "per_question"


class ExamSessionStatus(str, enum.Enum):
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    AUTO_SUBMITTED = "auto_submitted"


# ---------------------------------------------------------------------------
# Exam Configuration (FR-031–FR-048)
# ---------------------------------------------------------------------------

class ExamConfiguration(SQLModel, table=True):
    __tablename__ = "exams_configuration"  # type: ignore[assignment]

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    tenant_id: str = Field(max_length=255, index=True)
    exam_id: uuid.UUID = Field(index=True)

    title: str = Field(max_length=500)
    description: str | None = Field(default=None)
    instructions: str | None = Field(default=None)
    total_duration_minutes: int
    total_marks: Decimal = Field(max_digits=10, decimal_places=2)
    passing_marks: Decimal = Field(max_digits=10, decimal_places=2)
    window_start: datetime | None = Field(default=None)
    window_end: datetime | None = Field(default=None)

    shuffle_questions: bool = Field(default=False)
    shuffle_options: bool = Field(default=False)
    max_attempts: int = Field(default=1)
    cooldown_minutes: int = Field(default=0)
    navigation_locked: bool = Field(default=False)
    negative_marking_pct: Decimal | None = Field(default=None, max_digits=5, decimal_places=2)
    is_locked: bool = Field(default=False)

    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class ExamSection(SQLModel, table=True):
    __tablename__ = "exams_sections"  # type: ignore[assignment]

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    tenant_id: str = Field(max_length=255, index=True)
    exam_id: uuid.UUID = Field(index=True)
    configuration_id: uuid.UUID = Field(foreign_key="exams_configuration.id")

    title: str = Field(max_length=500)
    instructions: str | None = Field(default=None)
    time_limit_minutes: int | None = Field(default=None)
    negative_marking_pct: Decimal | None = Field(default=None, max_digits=5, decimal_places=2)
    order_index: int = Field(default=0)

    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class ExamSectionQuestion(SQLModel, table=True):
    __tablename__ = "exams_section_questions"  # type: ignore[assignment]

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    tenant_id: str = Field(max_length=255, index=True)
    section_id: uuid.UUID = Field(foreign_key="exams_sections.id")

    selection_mode: QuestionSelectionMode
    question_id: uuid.UUID | None = Field(default=None)
    random_pool_tag: str | None = Field(default=None, max_length=255)
    random_pool_difficulty: str | None = Field(default=None, max_length=100)
    random_count: int | None = Field(default=None)
    order_index: int = Field(default=0)


class ExamCandidateAccess(SQLModel, table=True):
    __tablename__ = "exams_candidate_access"  # type: ignore[assignment]

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    tenant_id: str = Field(max_length=255, index=True)
    exam_id: uuid.UUID = Field(index=True)
    configuration_id: uuid.UUID = Field(foreign_key="exams_configuration.id", unique=True)

    access_mode: CandidateAccessMode
    invite_link_token: str | None = Field(default=None, max_length=128)
    invite_passphrase_hash: str | None = Field(default=None, max_length=255)
    timezone_label: str | None = Field(default=None, max_length=100)

    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class ExamInvitedCandidate(SQLModel, table=True):
    __tablename__ = "exams_invited_candidates"  # type: ignore[assignment]

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    tenant_id: str = Field(max_length=255, index=True)
    access_config_id: uuid.UUID = Field(foreign_key="exams_candidate_access.id")

    email: str = Field(max_length=320)
    status: CandidateStatus = Field(default=CandidateStatus.PENDING)
    invited_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class ExamProctoringConfig(SQLModel, table=True):
    __tablename__ = "exams_proctoring_config"  # type: ignore[assignment]

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    tenant_id: str = Field(max_length=255, index=True)
    exam_id: uuid.UUID = Field(index=True)
    configuration_id: uuid.UUID = Field(foreign_key="exams_configuration.id", unique=True)

    level: ProctoringLevel = Field(default=ProctoringLevel.NONE)
    recording_mode: RecordingMode = Field(default=RecordingMode.NONE)

    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class ExamProctoringFlag(SQLModel, table=True):
    __tablename__ = "exams_proctoring_flags"  # type: ignore[assignment]

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    tenant_id: str = Field(max_length=255, index=True)
    proctoring_config_id: uuid.UUID = Field(foreign_key="exams_proctoring_config.id")

    flag_type: str = Field(max_length=100)
    enabled: bool = Field(default=True)
    warning_threshold: int = Field(default=3, ge=1)
    notification_threshold: int = Field(default=5, ge=1)
    termination_threshold: int = Field(default=10, ge=1)


class ExamResultRelease(SQLModel, table=True):
    __tablename__ = "exams_result_release"  # type: ignore[assignment]

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    tenant_id: str = Field(max_length=255, index=True)
    exam_id: uuid.UUID = Field(index=True)
    configuration_id: uuid.UUID = Field(foreign_key="exams_configuration.id", unique=True)

    release_mode: ResultReleaseMode = Field(default=ResultReleaseMode.IMMEDIATE)
    release_at: datetime | None = Field(default=None)
    score_display: ScoreDisplayMode = Field(default=ScoreDisplayMode.TOTAL_ONLY)
    certificate_enabled: bool = Field(default=False)

    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


# ---------------------------------------------------------------------------
# Exam Sessions / Exam-Taking (Team 3 runtime tables)
# ---------------------------------------------------------------------------

class ExamSession(SQLModel, table=True):
    __tablename__ = "exam_sessions"  # type: ignore[assignment]

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    tenant_id: str = Field(max_length=255, index=True)
    user_id: str = Field(max_length=255, index=True)
    exam_assignment_id: uuid.UUID = Field(index=True)

    start_time: datetime = Field(default_factory=lambda: datetime.now(UTC))
    end_time: datetime | None = Field(default=None)
    status: ExamSessionStatus = Field(default=ExamSessionStatus.IN_PROGRESS)


class Submission(SQLModel, table=True):
    __tablename__ = "submissions"  # type: ignore[assignment]

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    tenant_id: str = Field(max_length=255, index=True)
    session_id: uuid.UUID = Field(foreign_key="exam_sessions.id", index=True)
    question_id: uuid.UUID = Field(index=True)

    code_snippet: str | None = Field(default=None)
    language_id: int = Field(default=0)
    autosave_data: dict[str, Any] | None = Field(
        default=None, sa_column=Column(JSONB, nullable=True)
    )


class Result(SQLModel, table=True):
    __tablename__ = "results"  # type: ignore[assignment]

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    tenant_id: str = Field(max_length=255, index=True)
    session_id: uuid.UUID = Field(foreign_key="exam_sessions.id", unique=True)

    total_score: float
    passed: bool = Field(default=False)


class Certificate(SQLModel, table=True):
    __tablename__ = "certificates"  # type: ignore[assignment]

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    tenant_id: str = Field(max_length=255, index=True)
    session_id: uuid.UUID = Field(foreign_key="exam_sessions.id", unique=True)

    certificate_number: str = Field(max_length=100, unique=True)
    verification_url: str = Field(max_length=512)
