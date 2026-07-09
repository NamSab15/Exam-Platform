"""
ExamProctoringConfig model — FR-041, FR-043, FR-045
Proctoring level selection and recording options.
Configuration is locked once first candidate starts the exam (FR-045).
"""
import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import DateTime, Enum, ForeignKey, String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.exams_configuration import ExamConfiguration
    from app.models.exams_proctoring_flag import ExamProctoringFlag


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


class ExamProctoringConfig(Base):
    __tablename__ = "exams_proctoring_config"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    exam_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False, index=True)

    configuration_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("exams_configuration.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    # FR-041: Proctoring level
    level: Mapped[ProctoringLevel] = mapped_column(
        Enum(ProctoringLevel, name="proctoring_level",
             values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default=ProctoringLevel.NONE,
    )

    # FR-043: Recording options
    recording_mode: Mapped[RecordingMode] = mapped_column(
        Enum(RecordingMode, name="recording_mode",
             values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default=RecordingMode.NONE,
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

    # Relationships
    configuration: Mapped["ExamConfiguration"] = relationship(
        "ExamConfiguration", back_populates="proctoring_config", lazy="select"
    )
    flags: Mapped[List["ExamProctoringFlag"]] = relationship(
        "ExamProctoringFlag",
        back_populates="proctoring_config",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
