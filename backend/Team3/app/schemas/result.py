import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict


class ExamResultResponse(BaseModel):
    """
    Schema for reporting exam results including certificate verification link if passed.
    """

    session_id: uuid.UUID
    total_score: float
    passed: bool
    certificate_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
