"""
ExamConfiguration model — FR-031, FR-034, FR-035, FR-036, FR-037, FR-045
Core exam setup fields including scheduling window, randomisation, attempts,
navigation lock, negative marking, and the is_locked flag.
"""
import uuid
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.exams_section import ExamSection
    from app.models.exams_candidate_access import ExamCandidateAccess
    from app.models.exams_proctoring_config import ExamProctoringConfig
    from app.models.exams_result_release import ExamResultRelease


class ExamConfiguration(Base):
    __tablename__ = "exams_configuration"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    exam_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False, index=True)

    # FR-031: Core fields
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    total_duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    total_marks: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    passing_marks: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    window_start: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    window_end: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # FR-034: Randomisation options
    shuffle_questions: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    shuffle_options: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    # FR-035: Attempts & cooldown
    max_attempts: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    cooldown_minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    # FR-036: Navigation lock
    navigation_locked: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    # FR-037: Negative marking (global; per-section override lives on ExamSection)
    negative_marking_pct: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(5, 2), nullable=True
    )

    # FR-045: Configuration lock — set True when first candidate starts
    is_locked: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Relationships
    sections: Mapped[List["ExamSection"]] = relationship(
        "ExamSection",
        back_populates="configuration",
        lazy="selectin",
        cascade="all, delete-orphan",
        order_by="ExamSection.order_index",
    )
    candidate_access: Mapped[Optional["ExamCandidateAccess"]] = relationship(
        "ExamCandidateAccess",
        back_populates="configuration",
        lazy="selectin",
        uselist=False,
        cascade="all, delete-orphan",
    )
    proctoring_config: Mapped[Optional["ExamProctoringConfig"]] = relationship(
        "ExamProctoringConfig",
        back_populates="configuration",
        lazy="selectin",
        uselist=False,
        cascade="all, delete-orphan",
    )
    result_release: Mapped[Optional["ExamResultRelease"]] = relationship(
        "ExamResultRelease",
        back_populates="configuration",
        lazy="selectin",
        uselist=False,
        cascade="all, delete-orphan",
    )
