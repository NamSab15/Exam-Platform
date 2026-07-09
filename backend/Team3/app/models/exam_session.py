from datetime import datetime
import enum
import uuid
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import String, DateTime, Enum, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.submission import Submission
    from app.models.result import Result
    from app.models.certificate import Certificate


class ExamSessionStatus(str, enum.Enum):
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    AUTO_SUBMITTED = "auto_submitted"


class ExamSession(Base):
    __tablename__ = "exam_sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4
    )
    tenant_id: Mapped[str] = mapped_column(
        String(255), nullable=False, index=True
    )
    user_id: Mapped[str] = mapped_column(
        String(255), nullable=False, index=True
    )
    exam_assignment_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, nullable=False, index=True
    )
    start_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=func.now()
    )
    end_time: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    status: Mapped[ExamSessionStatus] = mapped_column(
        Enum(ExamSessionStatus, name="exam_session_status"),
        nullable=False,
        default=ExamSessionStatus.IN_PROGRESS,
    )

    # Relationships configured with lazy="selectin" for async compatibility
    submissions: Mapped[List["Submission"]] = relationship(
        "Submission",
        back_populates="session",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    result: Mapped[Optional["Result"]] = relationship(
        "Result",
        back_populates="session",
        lazy="selectin",
        uselist=False,
        cascade="all, delete-orphan",
    )
    certificate: Mapped[Optional["Certificate"]] = relationship(
        "Certificate",
        back_populates="session",
        lazy="selectin",
        uselist=False,
        cascade="all, delete-orphan",
    )
