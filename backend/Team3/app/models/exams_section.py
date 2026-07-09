"""
ExamSection model — FR-032
Labelled sections with optional time limits and per-section negative marking (FR-037).
"""
import uuid
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, Text, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.exams_configuration import ExamConfiguration
    from app.models.exams_section_question import ExamSectionQuestion


class ExamSection(Base):
    __tablename__ = "exams_sections"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    exam_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False, index=True)

    # Back-reference to the configuration row (not a FK — same exam_id)
    configuration_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("exams_configuration.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # FR-032: Section fields
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    time_limit_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # FR-037: Per-section negative marking override (None = use global)
    negative_marking_pct: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(5, 2), nullable=True
    )

    order_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

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
        "ExamConfiguration", back_populates="sections", lazy="select"
    )
    questions: Mapped[List["ExamSectionQuestion"]] = relationship(
        "ExamSectionQuestion",
        back_populates="section",
        lazy="selectin",
        cascade="all, delete-orphan",
        order_by="ExamSectionQuestion.order_index",
    )
