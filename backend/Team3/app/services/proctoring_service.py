"""
ProctoringService — FR-041, FR-042, FR-043, FR-044, FR-045
Manages proctoring level, recording mode, and per-flag sensitivity thresholds.
All mutating operations check the configuration lock (FR-045).
"""
import uuid
from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ExamNotFoundError
from app.models.exams_configuration import ExamConfiguration
from app.models.exams_proctoring_config import ExamProctoringConfig
from app.models.exams_proctoring_flag import ExamProctoringFlag
from app.schemas.proctoring import ProctoringConfigCreate, ProctoringConfigUpdate, ProctoringFlagUpdate
from app.services.lock_service import LockService

# Canonical set of AI flag types supported by the proctoring engine
DEFAULT_FLAG_TYPES: List[str] = [
    "face_not_visible",
    "multiple_faces",
    "tab_switch",
    "screen_share_stopped",
    "audio_detected",
    "mobile_phone_detected",
    "looking_away",
]


class ProctoringService:
    def __init__(self, db: AsyncSession, tenant_id: str):
        self.db = db
        self.tenant_id = tenant_id
        self._lock = LockService(db, tenant_id)

    # ── Proctoring config ──────────────────────────────────────────────────────

    async def configure_proctoring(
        self, exam_id: uuid.UUID, payload: ProctoringConfigCreate
    ) -> ExamProctoringConfig:
        """FR-041, FR-043: Set/update proctoring level and recording mode."""
        await self._lock.assert_not_locked(exam_id)
        config = await self._get_exam_config_or_404(exam_id)

        result = await self.db.execute(
            select(ExamProctoringConfig).where(
                ExamProctoringConfig.exam_id == exam_id,
                ExamProctoringConfig.tenant_id == self.tenant_id,
            )
        )
        proctoring = result.scalar_one_or_none()

        if proctoring:
            proctoring.level = payload.level
            proctoring.recording_mode = payload.recording_mode
        else:
            proctoring = ExamProctoringConfig(
                tenant_id=self.tenant_id,
                exam_id=exam_id,
                configuration_id=config.id,
                level=payload.level,
                recording_mode=payload.recording_mode,
            )
            self.db.add(proctoring)
            await self.db.flush()  # get the id before adding flags

            # FR-042: Seed default flags for all known flag types (all enabled by default)
            for flag_type in DEFAULT_FLAG_TYPES:
                self.db.add(ExamProctoringFlag(
                    tenant_id=self.tenant_id,
                    proctoring_config_id=proctoring.id,
                    flag_type=flag_type,
                    enabled=True,
                ))

        await self.db.commit()
        await self.db.refresh(proctoring)
        return proctoring

    async def update_proctoring(
        self, exam_id: uuid.UUID, payload: ProctoringConfigUpdate
    ) -> ExamProctoringConfig:
        """Partial update of proctoring level/recording."""
        await self._lock.assert_not_locked(exam_id)
        proctoring = await self._get_proctoring_or_404(exam_id)
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(proctoring, field, value)
        await self.db.commit()
        await self.db.refresh(proctoring)
        return proctoring

    async def get_proctoring_config(self, exam_id: uuid.UUID) -> ExamProctoringConfig:
        return await self._get_proctoring_or_404(exam_id)

    # ── Per-flag management ────────────────────────────────────────────────────

    async def update_flag(
        self, exam_id: uuid.UUID, flag_type: str, payload: ProctoringFlagUpdate
    ) -> ExamProctoringFlag:
        """FR-042, FR-044: Enable/disable a flag or update its sensitivity thresholds."""
        await self._lock.assert_not_locked(exam_id)
        proctoring = await self._get_proctoring_or_404(exam_id)

        result = await self.db.execute(
            select(ExamProctoringFlag).where(
                ExamProctoringFlag.proctoring_config_id == proctoring.id,
                ExamProctoringFlag.flag_type == flag_type,
                ExamProctoringFlag.tenant_id == self.tenant_id,
            )
        )
        flag = result.scalar_one_or_none()
        if not flag:
            # Create the flag if it doesn't exist (allows custom flag types)
            flag = ExamProctoringFlag(
                tenant_id=self.tenant_id,
                proctoring_config_id=proctoring.id,
                flag_type=flag_type,
            )
            self.db.add(flag)

        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(flag, field, value)

        await self.db.commit()
        await self.db.refresh(flag)
        return flag

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
            raise ExamNotFoundError(f"Exam configuration for {exam_id} not found.")
        return config

    async def _get_proctoring_or_404(self, exam_id: uuid.UUID) -> ExamProctoringConfig:
        result = await self.db.execute(
            select(ExamProctoringConfig).where(
                ExamProctoringConfig.exam_id == exam_id,
                ExamProctoringConfig.tenant_id == self.tenant_id,
            )
        )
        proctoring = result.scalar_one_or_none()
        if not proctoring:
            raise ExamNotFoundError(
                f"Proctoring config for exam {exam_id} not found. Configure proctoring first."
            )
        return proctoring
