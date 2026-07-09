import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.exam_session import ExamSession


class Certificate(Base):
    __tablename__ = "certificates"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4
    )
    tenant_id: Mapped[str] = mapped_column(
        String(255), nullable=False, index=True
    )
    session_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("exam_sessions.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    certificate_number: Mapped[str] = mapped_column(
        String(100), nullable=False, unique=True
    )
    verification_url: Mapped[str] = mapped_column(String(512), nullable=False)

    # Relationship configured with lazy="selectin" for async compatibility
    session: Mapped["ExamSession"] = relationship(
        "ExamSession", back_populates="certificate", lazy="selectin"
    )
