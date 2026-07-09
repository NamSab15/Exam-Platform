"""
Pydantic schemas for ExamSection and ExamSectionQuestion — FR-032, FR-033.
"""
import uuid
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.exams_section_question import QuestionSelectionMode


# ── Section schemas ────────────────────────────────────────────────────────────

class SectionCreate(BaseModel):
    """FR-032: Add a labelled section with optional time limit."""

    title: str = Field(..., min_length=1, max_length=500)
    instructions: Optional[str] = None
    time_limit_minutes: Optional[int] = Field(None, gt=0)
    negative_marking_pct: Optional[Decimal] = Field(None, ge=0, le=100)
    order_index: int = Field(0, ge=0)


class SectionUpdate(BaseModel):
    """Partial section update."""

    title: Optional[str] = Field(None, min_length=1, max_length=500)
    instructions: Optional[str] = None
    time_limit_minutes: Optional[int] = Field(None, gt=0)
    negative_marking_pct: Optional[Decimal] = Field(None, ge=0, le=100)
    order_index: Optional[int] = Field(None, ge=0)


class QuestionInSectionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    selection_mode: QuestionSelectionMode
    question_id: Optional[uuid.UUID]
    random_pool_tag: Optional[str]
    random_pool_difficulty: Optional[str]
    random_count: Optional[int]
    order_index: int


class SectionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    tenant_id: str
    exam_id: uuid.UUID
    title: str
    instructions: Optional[str]
    time_limit_minutes: Optional[int]
    negative_marking_pct: Optional[Decimal]
    order_index: int
    questions: List[QuestionInSectionResponse] = []


# ── Question selection schemas ─────────────────────────────────────────────────

class QuestionSelectionCreate(BaseModel):
    """FR-033: Add a question to a section (manual or random draw)."""

    selection_mode: QuestionSelectionMode

    # Manual mode
    question_id: Optional[uuid.UUID] = None

    # Random draw mode
    random_pool_tag: Optional[str] = Field(None, max_length=255)
    random_pool_difficulty: Optional[str] = Field(None, max_length=100)
    random_count: Optional[int] = Field(None, gt=0)

    order_index: int = Field(0, ge=0)

    def model_post_init(self, __context) -> None:  # noqa: ANN001
        if self.selection_mode == QuestionSelectionMode.MANUAL and not self.question_id:
            raise ValueError("question_id is required for manual selection mode")
        if self.selection_mode == QuestionSelectionMode.RANDOM and not self.random_count:
            raise ValueError("random_count is required for random selection mode")
