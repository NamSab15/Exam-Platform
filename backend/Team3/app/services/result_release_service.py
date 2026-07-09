"""
ResultReleaseService — FR-046, FR-047, FR-048
Manages result release rules (immediate, scheduled, or never),
score display granularity, and certificate issuance toggles.
"""
import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ExamNotFoundError
from app.models.exams_configuration import ExamConfiguration
from app.models.exams_result_release import ExamResultRelease
from app.schemas.result_release import ResultReleaseCreate, ResultReleaseUpdate


class ResultReleaseService:
    def __init__(self, db: AsyncSession, tenant_id: str):
        self.db = db
        self.tenant_id = tenant_id

    async def configure_release(
        self, exam_id: uuid.UUID, payload: ResultReleaseCreate
    ) -> ExamResultRelease:
        """FR-046, FR-047, FR-048: Set or update result release config."""
        config = await self._get_exam_config_or_404(exam_id)

        result = await self.db.execute(
            select(ExamResultRelease).where(
                ExamResultRelease.exam_id == exam_id,
                ExamResultRelease.tenant_id == self.tenant_id,
            )
        )
        release = result.scalar_one_or_none()

        if release:
            release.release_mode = payload.release_mode
            release.release_at = payload.release_at
            release.score_display = payload.score_display
            release.certificate_enabled = payload.certificate_enabled
        else:
            release = ExamResultRelease(
                tenant_id=self.tenant_id,
                exam_id=exam_id,
                configuration_id=config.id,
                release_mode=payload.release_mode,
                release_at=payload.release_at,
                score_display=payload.score_display,
                certificate_enabled=payload.certificate_enabled,
            )
            self.db.add(release)

        await self.db.commit()
        await self.db.refresh(release)
        return release

    async def update_release(
        self, exam_id: uuid.UUID, payload: ResultReleaseUpdate
    ) -> ExamResultRelease:
        """Partial update of result release configuration."""
        release = await self._get_release_or_404(exam_id)
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(release, field, value)

        await self.db.commit()
        await self.db.refresh(release)
        return release

    async def get_release_config(self, exam_id: uuid.UUID) -> ExamResultRelease:
        return await self._get_release_or_404(exam_id)

    # ── Helpers ────────────────────────────────────────────────────────────────

    async def _get_exam_config_or_404(self, exam_id: uuid.UUID) -> ExamConfiguration:
        result = await self.db.execute(
            select(ExamConfiguration).where(
                ExamConfiguration.exam_id == exam_id,
                ExamConfiguration.tenant_id == self.tenant_id,
            )
        )
        config = result.scalar_one_or_none()
        if not config:
            raise ExamNotFoundError(f"Exam configuration for exam {exam_id} not found.")
        return config

    async def _get_release_or_404(self, exam_id: uuid.UUID) -> ExamResultRelease:
        result = await self.db.execute(
            select(ExamResultRelease).where(
                ExamResultRelease.exam_id == exam_id,
                ExamResultRelease.tenant_id == self.tenant_id,
            )
        )
        release = result.scalar_one_or_none()
        if not release:
            raise ExamNotFoundError(
                f"Result release configuration for exam {exam_id} not found. Configure it first."
            )
        return release
