"""
ExamSectionQuestion model — FR-033
Supports both manual question selection and random draw by tag/difficulty pool.
"""
import enum
import uuid
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Enum, ForeignKey, Integer, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.exams_section import ExamSection


class QuestionSelectionMode(str, enum.Enum):
    MANUAL = "manual"
    RANDOM = "random"


class ExamSectionQuestion(Base):
    __tablename__ = "exams_section_questions"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)

    section_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("exams_sections.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # FR-033: Selection mode
    selection_mode: Mapped[QuestionSelectionMode] = mapped_column(
        Enum(QuestionSelectionMode, name="question_selection_mode",
             values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
    )

    # Manual mode: soft reference to Team 2's question bank
    question_id: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid, nullable=True)

    # Random draw mode: pool criteria
    random_pool_tag: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    random_pool_difficulty: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    random_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    order_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    # Relationship
    section: Mapped["ExamSection"] = relationship(
        "ExamSection", back_populates="questions", lazy="select"
    )
