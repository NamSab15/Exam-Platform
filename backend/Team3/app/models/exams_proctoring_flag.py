"""
ExamProctoringFlag model — FR-042, FR-044
Per-flag enable/disable toggle and sensitivity threshold configuration.
Each flag type maps to an AI detection category (e.g. face_not_visible, tab_switch).
"""
import uuid

from sqlalchemy import Boolean, ForeignKey, Integer, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.exams_proctoring_config import ExamProctoringConfig


class ExamProctoringFlag(Base):
    __tablename__ = "exams_proctoring_flags"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)

    proctoring_config_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("exams_proctoring_config.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # FR-042: Flag type identifier (standardised string key)
    flag_type: Mapped[str] = mapped_column(String(100), nullable=False)

    # FR-042: Per-flag enable/disable
    enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    # FR-044: Sensitivity thresholds (event counts)
    warning_threshold: Mapped[int] = mapped_column(Integer, nullable=False, default=3)
    notification_threshold: Mapped[int] = mapped_column(Integer, nullable=False, default=5)
    termination_threshold: Mapped[int] = mapped_column(Integer, nullable=False, default=10)

    # Relationship
    proctoring_config: Mapped["ExamProctoringConfig"] = relationship(
        "ExamProctoringConfig", back_populates="flags", lazy="select"
    )
