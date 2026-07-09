"""
ExamInvitedCandidate model — FR-038
Individual candidate assignments, supporting all three access modes
(email list, CSV upload, and invite link).
"""
import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, ForeignKey, String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.exams_candidate_access import ExamCandidateAccess


class CandidateStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    COMPLETED = "completed"


class ExamInvitedCandidate(Base):
    __tablename__ = "exams_invited_candidates"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)

    access_config_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("exams_candidate_access.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    email: Mapped[str] = mapped_column(String(320), nullable=False, index=True)
    status: Mapped[CandidateStatus] = mapped_column(
        Enum(CandidateStatus, name="candidate_status",
             values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default=CandidateStatus.PENDING,
    )

    invited_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    # Relationship
    access_config: Mapped["ExamCandidateAccess"] = relationship(
        "ExamCandidateAccess", back_populates="candidates", lazy="select"
    )
