"""
ExamCandidateAccess model — FR-038, FR-039, FR-040
Stores access mode, invite link token, passphrase hash, and timezone display label.
"""
import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import DateTime, Enum, ForeignKey, String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.exams_configuration import ExamConfiguration
    from app.models.exams_invited_candidate import ExamInvitedCandidate


class CandidateAccessMode(str, enum.Enum):
    EMAIL_LIST = "email_list"
    CSV_UPLOAD = "csv_upload"
    INVITE_LINK = "invite_link"


class ExamCandidateAccess(Base):
    __tablename__ = "exams_candidate_access"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    exam_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False, index=True)

    configuration_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("exams_configuration.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    # FR-038: Access mode
    access_mode: Mapped[CandidateAccessMode] = mapped_column(
        Enum(CandidateAccessMode, name="candidate_access_mode",
             values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
    )

    # FR-039: Invite link token and optional passphrase (bcrypt hashed)
    invite_link_token: Mapped[Optional[str]] = mapped_column(
        String(128), unique=True, nullable=True
    )
    invite_passphrase_hash: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True
    )

    # FR-040: Timezone label for display (storage is always UTC)
    timezone_label: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Relationships
    configuration: Mapped["ExamConfiguration"] = relationship(
        "ExamConfiguration", back_populates="candidate_access", lazy="select"
    )
    candidates: Mapped[List["ExamInvitedCandidate"]] = relationship(
        "ExamInvitedCandidate",
        back_populates="access_config",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
