"""Session service — exam lifecycle management (start, autosave, finalize)."""
from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from exams.models import (
    Certificate,
    ExamSession,
    ExamSessionStatus,
    Result,
    Submission,
)
from exams.schemas.session import AutosavePayload


class SessionService:
    """Manages exam session lifecycles. Enforces multi-tenancy at query level."""

    def __init__(self, db: AsyncSession, tenant_id: str) -> None:
        self.db = db
        self.tenant_id = tenant_id

    async def _get_session(self, session_id: uuid.UUID) -> ExamSession:
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
        return session

    async def start_exam_timer(self, session_id: uuid.UUID) -> ExamSession:
        """Start exam timer. Locks config once first candidate begins (FR-045)."""
        session = await self._get_session(session_id)
        session.status = ExamSessionStatus.IN_PROGRESS
        session.start_time = datetime.now(UTC)

        # Lock the exam configuration (FR-045)
        await self._lock_exam_config(session.exam_assignment_id)

        self.db.add(session)
        await self.db.commit()
        await self.db.refresh(session)
        return session

    async def _lock_exam_config(self, exam_id: uuid.UUID) -> None:
        """Set is_locked=True on the exam configuration so it becomes read-only."""
        from exams.models import ExamConfiguration

        result = await self.db.execute(
            select(ExamConfiguration).where(
                ExamConfiguration.exam_id == exam_id,
                ExamConfiguration.tenant_id == self.tenant_id,
            )
        )
        config = result.scalar_one_or_none()
        if config and not config.is_locked:
            config.is_locked = True
            self.db.add(config)

    async def process_autosave(
        self, session_id: uuid.UUID, payload: AutosavePayload
    ) -> None:
        """Create or update submission records for each answered question."""
        session = await self._get_session(session_id)
        if session.status != ExamSessionStatus.IN_PROGRESS:
            raise ValueError(
                f"Cannot autosave. Session status: {session.status.value}"
            )

        for question_str, answer_data in payload.answers.items():
            try:
                question_uuid = uuid.UUID(question_str)
            except ValueError:
                continue

            result = await self.db.execute(
                select(Submission).where(
                    Submission.session_id == session_id,
                    Submission.question_id == question_uuid,
                    Submission.tenant_id == self.tenant_id,
                )
            )
            submission = result.scalar_one_or_none()

            if submission:
                submission.code_snippet = answer_data.code_snippet
                submission.language_id = answer_data.language_id
                submission.autosave_data = answer_data.autosave_data
            else:
                submission = Submission(
                    tenant_id=self.tenant_id,
                    session_id=session_id,
                    question_id=question_uuid,
                    code_snippet=answer_data.code_snippet,
                    language_id=answer_data.language_id,
                    autosave_data=answer_data.autosave_data,
                )
            self.db.add(submission)

        await self.db.commit()

    async def finalize_exam(self, session_id: uuid.UUID) -> tuple[ExamSession, Result, Certificate | None]:
        """Finalize exam, score it, and issue a certificate if passed."""
        session = await self._get_session(session_id)
        if session.status != ExamSessionStatus.IN_PROGRESS:
            raise ValueError(
                f"Cannot finalize. Session status: {session.status.value}"
            )

        session.status = ExamSessionStatus.SUBMITTED
        session.end_time = datetime.now(UTC)

        # Simple scoring: percentage of answered questions (placeholder until
        # Team 2's question service provides marks-per-question data)
        score = await self._calculate_score(session_id)
        passed = score >= 50.0

        result_record = Result(
            tenant_id=self.tenant_id,
            session_id=session_id,
            total_score=score,
            passed=passed,
        )
        self.db.add(session)
        self.db.add(result_record)

        cert_record: Certificate | None = None
        if passed:
            cert_num = f"CERT-{self.tenant_id[:4].upper()}-{uuid.uuid4().hex[:8].upper()}"
            cert_record = Certificate(
                tenant_id=self.tenant_id,
                session_id=session_id,
                certificate_number=cert_num,
                verification_url=f"https://exam.platform/verify/{cert_num}",
            )
            self.db.add(cert_record)

        await self.db.commit()
        await self.db.refresh(session)
        await self.db.refresh(result_record)
        return session, result_record, cert_record

    async def _calculate_score(self, session_id: uuid.UUID) -> float:
        """Placeholder scoring — returns 75.0 until Team 2 marks integration."""
        # TODO: integrate with Team 2 question service to get per-question marks
        # and calculate actual score based on submitted answers.
        return 75.0
