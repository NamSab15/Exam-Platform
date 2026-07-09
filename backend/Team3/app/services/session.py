from datetime import datetime, timezone
import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.certificate import Certificate
from app.models.exam_session import ExamSession, ExamSessionStatus
from app.models.result import Result
from app.models.submission import Submission
from app.schemas.autosave import AutosavePayload
from app.services.scoring import ScoringService
from app.services.lock_service import LockService


class SessionService:
    """
    Service responsible for managing exam session lifecycles (timers, autosave, finalization).
    Enforces multi-tenancy at the query level.
    """

    def __init__(self, db: AsyncSession, tenant_id: str):
        self.db = db
        self.tenant_id = tenant_id
        self._lock = LockService(db, tenant_id)

    async def start_exam_timer(self, session_id: uuid.UUID) -> ExamSession:
        """
        Starts the exam timer for a session by updating start_time and marking it in_progress.
        Enforces tenant isolation and locks the exam configuration.
        """
        result = await self.db.execute(
            select(ExamSession).where(
                ExamSession.id == session_id,
                ExamSession.tenant_id == self.tenant_id,
            )
        )
        session = result.scalar_one_or_none()
        if not session:
            raise ValueError(
                f"Exam session {session_id} not found under tenant {self.tenant_id}"
            )

        session.status = ExamSessionStatus.IN_PROGRESS
        session.start_time = datetime.now(timezone.utc)

        # Lock the exam configuration because a candidate has started the exam (FR-045)
        await self._lock.lock_exam(session.exam_assignment_id)

        await self.db.commit()
        await self.db.refresh(session)
        return session

    async def process_autosave(
        self, session_id: uuid.UUID, payload: AutosavePayload
    ) -> None:
        """
        Processes candidate autosave payload by creating/updating Submissions for each question.
        Enforces tenant isolation.
        """
        # 1. Verify session exists and is active under current tenant
        result = await self.db.execute(
            select(ExamSession).where(
                ExamSession.id == session_id,
                ExamSession.tenant_id == self.tenant_id,
            )
        )
        session = result.scalar_one_or_none()
        if not session:
            raise ValueError(
                f"Exam session {session_id} not found under tenant {self.tenant_id}"
            )
        if session.status != ExamSessionStatus.IN_PROGRESS:
            raise ValueError(
                f"Cannot auto-save. Exam session is not in progress (current status: {session.status.value})"
            )

        # 2. Update each question submission
        for question_str, answer_data in payload.answers.items():
            try:
                question_uuid = uuid.UUID(question_str)
            except ValueError:
                # Skip invalid question ID format keys
                continue

            # Query existing submission record, enforcing tenant check
            sub_result = await self.db.execute(
                select(Submission).where(
                    Submission.session_id == session_id,
                    Submission.question_id == question_uuid,
                    Submission.tenant_id == self.tenant_id,
                )
            )
            submission = sub_result.scalar_one_or_none()

            code_snippet = answer_data.get("code_snippet")
            language_id = answer_data.get("language_id", 0)
            autosave_data = answer_data.get("autosave_data")

            if submission:
                # Update existing submission
                submission.code_snippet = code_snippet
                submission.language_id = language_id
                submission.autosave_data = autosave_data
            else:
                # Create a new submission record
                submission = Submission(
                    tenant_id=self.tenant_id,
                    session_id=session_id,
                    question_id=question_uuid,
                    code_snippet=code_snippet,
                    language_id=language_id,
                    autosave_data=autosave_data,
                )
                self.db.add(submission)

        await self.db.commit()

    async def finalize_exam(self, session_id: uuid.UUID) -> ExamSession:
        """
        Finalizes the exam session, calculates scores, and generates certificates if passed.
        Enforces tenant isolation.
        """
        # 1. Fetch the exam session under current tenant
        result = await self.db.execute(
            select(ExamSession).where(
                ExamSession.id == session_id,
                ExamSession.tenant_id == self.tenant_id,
            )
        )
        session = result.scalar_one_or_none()
        if not session:
            raise ValueError(
                f"Exam session {session_id} not found under tenant {self.tenant_id}"
            )
        if session.status != ExamSessionStatus.IN_PROGRESS:
            raise ValueError(
                f"Cannot finalize exam. Session is not in progress (current status: {session.status.value})"
            )

        # 2. Update session state
        session.status = ExamSessionStatus.SUBMITTED
        session.end_time = datetime.now(timezone.utc)

        # 3. Calculate grade using ScoringService (passing the tenant_id)
        scoring_svc = ScoringService(self.db, self.tenant_id)
        score = await scoring_svc.calculate_score(session_id)
        passed = score >= 50.0  # Pass mark threshold is 50.0%

        # 4. Save result record
        result_record = Result(
            tenant_id=self.tenant_id,
            session_id=session_id,
            total_score=score,
            passed=passed,
        )
        self.db.add(result_record)

        # 5. Create Certificate if candidate passed
        if passed:
            cert_num = f"CERT-{self.tenant_id[:4].upper()}-{uuid.uuid4().hex[:8].upper()}"
            certificate_record = Certificate(
                tenant_id=self.tenant_id,
                session_id=session_id,
                certificate_number=cert_num,
                verification_url=f"https://exam.platform/verify/{cert_num}",
            )
            self.db.add(certificate_record)

        await self.db.commit()
        await self.db.refresh(session)
        return session
