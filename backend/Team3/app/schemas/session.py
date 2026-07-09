from datetime import datetime
import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.models.exam_session import ExamSessionStatus


class SessionCreate(BaseModel):
    tenant_id: str
    user_id: str
    exam_assignment_id: uuid.UUID


class SessionResponse(BaseModel):
    id: uuid.UUID
    tenant_id: str
    user_id: str
    exam_assignment_id: uuid.UUID
    start_time: datetime
    end_time: Optional[datetime] = None
    status: ExamSessionStatus

    model_config = ConfigDict(from_attributes=True)
