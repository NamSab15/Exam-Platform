"""
ExamResultRelease model — FR-046, FR-047, FR-048
Result release mode, score display granularity, and certificate issuance toggle.
"""
import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.exams_configuration import ExamConfiguration


class ResultReleaseMode(str, enum.Enum):
    IMMEDIATE = "immediate"
    SCHEDULED = "scheduled"
    NEVER = "never"


class ScoreDisplayMode(str, enum.Enum):
    TOTAL_ONLY = "total_only"
    SECTION_BREAKDOWN = "section_breakdown"
    PER_QUESTION = "per_question"


class ExamResultRelease(Base):
    __tablename__ = "exams_result_release"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    exam_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False, index=True)

    configuration_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("exams_configuration.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    # FR-046: Release mode
    release_mode: Mapped[ResultReleaseMode] = mapped_column(
        Enum(ResultReleaseMode, name="result_release_mode",
             values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default=ResultReleaseMode.IMMEDIATE,
    )
    release_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # FR-047: Score display granularity
    score_display: Mapped[ScoreDisplayMode] = mapped_column(
        Enum(ScoreDisplayMode, name="score_display_mode",
             values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default=ScoreDisplayMode.TOTAL_ONLY,
    )

    # FR-048: Certificate issuance
    certificate_enabled: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Relationship
    configuration: Mapped["ExamConfiguration"] = relationship(
        "ExamConfiguration", back_populates="result_release", lazy="select"
    )
