"""
Pydantic schemas for Proctoring Configuration — FR-041, FR-042, FR-043, FR-044, FR-045.
"""
import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.exams_proctoring_config import ProctoringLevel, RecordingMode


# ── Proctoring config ──────────────────────────────────────────────────────────

class ProctoringConfigCreate(BaseModel):
    """FR-041: Set proctoring level. FR-043: Set recording mode."""

    level: ProctoringLevel
    recording_mode: RecordingMode = RecordingMode.NONE


class ProctoringConfigUpdate(BaseModel):
    level: Optional[ProctoringLevel] = None
    recording_mode: Optional[RecordingMode] = None


class ProctoringFlagResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    flag_type: str
    enabled: bool
    warning_threshold: int
    notification_threshold: int
    termination_threshold: int


class ProctoringConfigResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    tenant_id: str
    exam_id: uuid.UUID
    level: ProctoringLevel
    recording_mode: RecordingMode
    flags: List[ProctoringFlagResponse] = []
    created_at: datetime
    updated_at: datetime


# ── Individual flag update ─────────────────────────────────────────────────────

class ProctoringFlagUpdate(BaseModel):
    """FR-042: Enable/disable a flag. FR-044: Adjust sensitivity thresholds."""

    enabled: Optional[bool] = None
    warning_threshold: Optional[int] = Field(None, ge=1)
    notification_threshold: Optional[int] = Field(None, ge=1)
    termination_threshold: Optional[int] = Field(None, ge=1)

    def model_post_init(self, __context) -> None:  # noqa: ANN001
        w = self.warning_threshold
        n = self.notification_threshold
        t = self.termination_threshold
        if w and n and w > n:
            raise ValueError("warning_threshold must be <= notification_threshold")
        if n and t and n > t:
            raise ValueError("notification_threshold must be <= termination_threshold")
