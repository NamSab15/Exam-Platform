import logging
import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.submission import Submission

logger = logging.getLogger(__name__)


class ScoringService:
    """
    Service responsible for grading student exam submissions.
    """

    def __init__(self, db: AsyncSession, tenant_id: str):
        self.db = db
        self.tenant_id = tenant_id

    async def calculate_score(self, session_id: uuid.UUID) -> float:
        """
        Reads all submissions for the specified session_id and computes a final grade.
        Enforces multi-tenancy by filtering by tenant_id.
        """
        # Read the submissions from the database, enforcing tenant isolation
        result = await self.db.execute(
            select(Submission).where(
                Submission.session_id == session_id,
                Submission.tenant_id == self.tenant_id,
            )
        )
        submissions = result.scalars().all()
        logger.info(
            f"Calculating score for session {session_id} under tenant {self.tenant_id}. Found {len(submissions)} submissions."
        )

        if not submissions:
            return 0.0

        # Stub scoring logic: return a static grade for demonstration
        return 85.0
