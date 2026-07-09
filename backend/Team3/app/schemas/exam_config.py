"""
Pydantic schemas for ExamConfiguration — FR-031, FR-034–FR-037, FR-045.
"""
import uuid
from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field, model_validator


class ExamConfigCreate(BaseModel):
    """Create or fully replace exam setup configuration."""

    # FR-031
    title: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = Field(None, max_length=5000)
    instructions: Optional[str] = Field(None)  # rich-text HTML
    total_duration_minutes: int = Field(..., gt=0)
    total_marks: Decimal = Field(..., gt=0)
    passing_marks: Decimal = Field(..., ge=0)
    window_start: Optional[datetime] = None  # UTC
    window_end: Optional[datetime] = None    # UTC

    # FR-034
    shuffle_questions: bool = False
    shuffle_options: bool = False

    # FR-035
    max_attempts: int = Field(1, ge=1)
    cooldown_minutes: int = Field(0, ge=0)

    # FR-036
    navigation_locked: bool = False

    # FR-037
    negative_marking_pct: Optional[Decimal] = Field(None, ge=0, le=100)

    @model_validator(mode="after")
    def validate_marks_and_window(self) -> "ExamConfigCreate":
        if self.passing_marks > self.total_marks:
            raise ValueError("passing_marks cannot exceed total_marks")
        if self.window_start and self.window_end and self.window_end <= self.window_start:
            raise ValueError("window_end must be after window_start")
        return self


class ExamConfigUpdate(BaseModel):
    """Partial update — all fields optional."""

    title: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = None
    instructions: Optional[str] = None
    total_duration_minutes: Optional[int] = Field(None, gt=0)
    total_marks: Optional[Decimal] = Field(None, gt=0)
    passing_marks: Optional[Decimal] = Field(None, ge=0)
    window_start: Optional[datetime] = None
    window_end: Optional[datetime] = None
    shuffle_questions: Optional[bool] = None
    shuffle_options: Optional[bool] = None
    max_attempts: Optional[int] = Field(None, ge=1)
    cooldown_minutes: Optional[int] = Field(None, ge=0)
    navigation_locked: Optional[bool] = None
    negative_marking_pct: Optional[Decimal] = Field(None, ge=0, le=100)


class ExamConfigResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    tenant_id: str
    exam_id: uuid.UUID
    title: str
    description: Optional[str]
    instructions: Optional[str]
    total_duration_minutes: int
    total_marks: Decimal
    passing_marks: Decimal
    window_start: Optional[datetime]
    window_end: Optional[datetime]
    shuffle_questions: bool
    shuffle_options: bool
    max_attempts: int
    cooldown_minutes: int
    navigation_locked: bool
    negative_marking_pct: Optional[Decimal]
    is_locked: bool
    created_at: datetime
    updated_at: datetime


class LockStatusResponse(BaseModel):
    exam_id: uuid.UUID
    is_locked: bool
