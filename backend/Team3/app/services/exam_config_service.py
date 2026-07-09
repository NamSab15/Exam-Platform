"""
ExamConfigService — FR-031, FR-032, FR-033, FR-034, FR-035, FR-036, FR-037
Manages the lifecycle of exam configuration, sections, and question selection.
All writes check the lock status via LockService.
"""
import uuid
from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ExamNotFoundError
from app.models.exams_configuration import ExamConfiguration
from app.models.exams_section import ExamSection
from app.models.exams_section_question import ExamSectionQuestion
from app.schemas.exam_config import ExamConfigCreate, ExamConfigUpdate
from app.schemas.exam_section import SectionCreate, SectionUpdate, QuestionSelectionCreate
from app.services.lock_service import LockService


class ExamConfigService:
    def __init__(self, db: AsyncSession, tenant_id: str):
        self.db = db
        self.tenant_id = tenant_id
        self._lock = LockService(db, tenant_id)

    # ── Configuration CRUD ─────────────────────────────────────────────────────

    async def create_or_update_config(
        self, exam_id: uuid.UUID, payload: ExamConfigCreate
    ) -> ExamConfiguration:
        """Upsert exam configuration. Respects lock for updates."""
        result = await self.db.execute(
            select(ExamConfiguration).where(
                ExamConfiguration.exam_id == exam_id,
                ExamConfiguration.tenant_id == self.tenant_id,
            )
        )
        config = result.scalar_one_or_none()

        if config:
            # Update — must not be locked
            await self._lock.assert_not_locked(exam_id)
            for field, value in payload.model_dump(exclude_unset=False).items():
                setattr(config, field, value)
        else:
            # Create
            config = ExamConfiguration(
                tenant_id=self.tenant_id,
                exam_id=exam_id,
                **payload.model_dump(),
            )
            self.db.add(config)

        await self.db.commit()
        await self.db.refresh(config)
        return config

    async def patch_config(
        self, exam_id: uuid.UUID, payload: ExamConfigUpdate
    ) -> ExamConfiguration:
        """Partial update. Checks lock."""
        config = await self._get_config_or_404(exam_id)
        await self._lock.assert_not_locked(exam_id)

        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(config, field, value)

        await self.db.commit()
        await self.db.refresh(config)
        return config

    async def get_config(self, exam_id: uuid.UUID) -> ExamConfiguration:
        return await self._get_config_or_404(exam_id)

    async def get_lock_status(self, exam_id: uuid.UUID) -> bool:
        """Returns is_locked flag. FR-045."""
        locked_by_sessions = await self._lock.is_locked(exam_id)
        result = await self.db.execute(
            select(ExamConfiguration.is_locked).where(
                ExamConfiguration.exam_id == exam_id,
                ExamConfiguration.tenant_id == self.tenant_id,
            )
        )
        db_flag = result.scalar_one_or_none()
        return bool(db_flag) or locked_by_sessions

    # ── Sections ───────────────────────────────────────────────────────────────

    async def add_section(
        self, exam_id: uuid.UUID, payload: SectionCreate
    ) -> ExamSection:
        """FR-032: Add a labelled section."""
        config = await self._get_config_or_404(exam_id)
        await self._lock.assert_not_locked(exam_id)

        section = ExamSection(
            tenant_id=self.tenant_id,
            exam_id=exam_id,
            configuration_id=config.id,
            **payload.model_dump(),
        )
        self.db.add(section)
        await self.db.commit()
        await self.db.refresh(section)
        return section

    async def update_section(
        self, exam_id: uuid.UUID, section_id: uuid.UUID, payload: SectionUpdate
    ) -> ExamSection:
        await self._lock.assert_not_locked(exam_id)
        section = await self._get_section_or_404(section_id, exam_id)
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(section, field, value)
        await self.db.commit()
        await self.db.refresh(section)
        return section

    async def delete_section(self, exam_id: uuid.UUID, section_id: uuid.UUID) -> None:
        await self._lock.assert_not_locked(exam_id)
        section = await self._get_section_or_404(section_id, exam_id)
        await self.db.delete(section)
        await self.db.commit()

    async def list_sections(self, exam_id: uuid.UUID) -> List[ExamSection]:
        result = await self.db.execute(
            select(ExamSection)
            .where(
                ExamSection.exam_id == exam_id,
                ExamSection.tenant_id == self.tenant_id,
            )
            .order_by(ExamSection.order_index)
        )
        return list(result.scalars().all())

    # ── Question selection ─────────────────────────────────────────────────────

    async def add_question(
        self, exam_id: uuid.UUID, section_id: uuid.UUID, payload: QuestionSelectionCreate
    ) -> ExamSectionQuestion:
        """FR-033: Add a question entry (manual or random draw)."""
        await self._lock.assert_not_locked(exam_id)
        await self._get_section_or_404(section_id, exam_id)

        question = ExamSectionQuestion(
            tenant_id=self.tenant_id,
            section_id=section_id,
            **payload.model_dump(),
        )
        self.db.add(question)
        await self.db.commit()
        await self.db.refresh(question)
        return question

    async def remove_question(
        self, exam_id: uuid.UUID, section_id: uuid.UUID, question_entry_id: uuid.UUID
    ) -> None:
        await self._lock.assert_not_locked(exam_id)
        result = await self.db.execute(
            select(ExamSectionQuestion).where(
                ExamSectionQuestion.id == question_entry_id,
                ExamSectionQuestion.section_id == section_id,
                ExamSectionQuestion.tenant_id == self.tenant_id,
            )
        )
        entry = result.scalar_one_or_none()
        if not entry:
            raise ExamNotFoundError(f"Question entry {question_entry_id} not found.")
        await self.db.delete(entry)
        await self.db.commit()

    # ── Helpers ────────────────────────────────────────────────────────────────

    async def _get_config_or_404(self, exam_id: uuid.UUID) -> ExamConfiguration:
        result = await self.db.execute(
            select(ExamConfiguration).where(
                ExamConfiguration.exam_id == exam_id,
                ExamConfiguration.tenant_id == self.tenant_id,
            )
        )
        config = result.scalar_one_or_none()
        if not config:
            raise ExamNotFoundError(
                f"Exam configuration for exam {exam_id} not found."
            )
        return config

    async def _get_section_or_404(
        self, section_id: uuid.UUID, exam_id: uuid.UUID
    ) -> ExamSection:
        result = await self.db.execute(
            select(ExamSection).where(
                ExamSection.id == section_id,
                ExamSection.exam_id == exam_id,
                ExamSection.tenant_id == self.tenant_id,
            )
        )
        section = result.scalar_one_or_none()
        if not section:
            raise ExamNotFoundError(f"Section {section_id} not found.")
        return section
