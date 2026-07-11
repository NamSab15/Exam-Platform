"""Pydantic/SQLModel schemas for exam sessions and submission endpoints."""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel

from exams.models import ExamSessionStatus


# ---------------------------------------------------------------------------
# Session Schemas
# ---------------------------------------------------------------------------

class SessionCreate(BaseModel):
    exam_assignment_id: uuid.UUID


class SessionResponse(BaseModel):
    id: uuid.UUID
    tenant_id: str
    user_id: str
    exam_assignment_id: uuid.UUID
    start_time: datetime
    end_time: datetime | None
    status: ExamSessionStatus

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Autosave Schemas
# ---------------------------------------------------------------------------

class AnswerPayload(BaseModel):
    code_snippet: str | None = None
    language_id: int = 0
    autosave_data: dict[str, Any] | None = None


class AutosavePayload(BaseModel):
    """Map of question_id (str) → answer payload."""
    answers: dict[str, AnswerPayload]


# ---------------------------------------------------------------------------
# Result Schemas
# ---------------------------------------------------------------------------

class ExamResultResponse(BaseModel):
    session_id: uuid.UUID
    total_score: float
    passed: bool
    certificate_url: str | None = None
