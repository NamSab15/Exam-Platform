"""
Pydantic schemas for Result Release — FR-046, FR-047, FR-048.
"""
import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.exams_result_release import ResultReleaseMode, ScoreDisplayMode


class ResultReleaseCreate(BaseModel):
    """FR-046: Release mode. FR-047: Score display. FR-048: Certificate toggle."""

    release_mode: ResultReleaseMode
    release_at: Optional[datetime] = None   # required when release_mode == 'scheduled'
    score_display: ScoreDisplayMode = ScoreDisplayMode.TOTAL_ONLY
    certificate_enabled: bool = False

    @model_validator(mode="after")
    def validate_scheduled_date(self) -> "ResultReleaseCreate":
        if self.release_mode == ResultReleaseMode.SCHEDULED and not self.release_at:
            raise ValueError("release_at is required when release_mode is 'scheduled'")
        return self


class ResultReleaseUpdate(BaseModel):
    release_mode: Optional[ResultReleaseMode] = None
    release_at: Optional[datetime] = None
    score_display: Optional[ScoreDisplayMode] = None
    certificate_enabled: Optional[bool] = None


class ResultReleaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    tenant_id: str
    exam_id: uuid.UUID
    release_mode: ResultReleaseMode
    release_at: Optional[datetime]
    score_display: ScoreDisplayMode
    certificate_enabled: bool
    created_at: datetime
    updated_at: datetime
