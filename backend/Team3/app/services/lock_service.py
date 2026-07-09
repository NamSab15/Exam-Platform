"""
LockService — FR-045
Checks whether an exam's configuration is locked by querying exam_sessions.
Called by all mutating service methods on proctoring and setup.
"""
import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.exam_session import ExamSession, ExamSessionStatus
from app.models.exams_configuration import ExamConfiguration
from app.core.exceptions import ConfigLockedError, ExamNotFoundError


class LockService:
    """
    Determines lock status for exam configuration.
    An exam is considered locked when at least one candidate has started a session
    (i.e. any ExamSession exists for that exam_id with status != a future/planned state).
    """

    def __init__(self, db: AsyncSession, tenant_id: str):
        self.db = db
        self.tenant_id = tenant_id

    async def is_locked(self, exam_id: uuid.UUID) -> bool:
        """
        Returns True if any exam session exists for this exam_id under the tenant.
        Uses the exam_assignment_id column as the join key.
        """
        result = await self.db.execute(
            select(ExamSession).where(
                ExamSession.exam_assignment_id == exam_id,
                ExamSession.tenant_id == self.tenant_id,
            ).limit(1)
        )
        return result.scalar_one_or_none() is not None

    async def assert_not_locked(self, exam_id: uuid.UUID) -> None:
        """Raises ConfigLockedError if the exam has active sessions."""
        if await self.is_locked(exam_id):
            raise ConfigLockedError(
                f"Exam {exam_id} configuration is locked — "
                "candidates have already started the exam."
            )

    async def lock_exam(self, exam_id: uuid.UUID) -> None:
        """
        Explicitly sets is_locked=True on the ExamConfiguration row.
        Called by the session-start endpoint when the first candidate begins.
        """
        result = await self.db.execute(
            select(ExamConfiguration).where(
                ExamConfiguration.exam_id == exam_id,
                ExamConfiguration.tenant_id == self.tenant_id,
            )
        )
        config = result.scalar_one_or_none()
        if config and not config.is_locked:
            config.is_locked = True
            await self.db.commit()
