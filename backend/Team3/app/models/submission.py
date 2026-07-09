import uuid
from typing import TYPE_CHECKING, Any, Dict, Optional
from sqlalchemy import String, Text, Integer, ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.exam_session import ExamSession


class Submission(Base):
    __tablename__ = "submissions"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4
    )
    tenant_id: Mapped[str] = mapped_column(
        String(255), nullable=False, index=True
    )
    session_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("exam_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    question_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, nullable=False, index=True
    )
    code_snippet: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    language_id: Mapped[int] = mapped_column(Integer, nullable=False)
    autosave_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSONB, nullable=True
    )

    # Relationship configured with lazy="selectin" for async compatibility
    session: Mapped["ExamSession"] = relationship(
        "ExamSession", back_populates="submissions", lazy="selectin"
    )
