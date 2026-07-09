import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.security import require_role
from app.schemas.exam_config import ExamConfigCreate, ExamConfigUpdate, ExamConfigResponse, LockStatusResponse
from app.schemas.exam_section import SectionCreate, SectionUpdate, SectionResponse, QuestionSelectionCreate, QuestionInSectionResponse
from app.services.exam_config_service import ExamConfigService

router = APIRouter()


@router.post(
    "/{exam_id}/configuration",
    response_model=ExamConfigResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_or_update_config(
    exam_id: uuid.UUID,
    payload: ExamConfigCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin"])),
):
    """
    FR-031: Create or fully replace an exam configuration.
    Enforces tenant isolation using tenant_id from JWT.
    """
    tenant_id = current_user["tenant_id"]
    service = ExamConfigService(db, tenant_id)
    return await service.create_or_update_config(exam_id, payload)


@router.patch("/{exam_id}/configuration", response_model=ExamConfigResponse)
async def patch_config(
    exam_id: uuid.UUID,
    payload: ExamConfigUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin"])),
):
    """
    Partially update an exam configuration.
    """
    tenant_id = current_user["tenant_id"]
    service = ExamConfigService(db, tenant_id)
    return await service.patch_config(exam_id, payload)


@router.get("/{exam_id}/configuration", response_model=ExamConfigResponse)
async def get_config(
    exam_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin", "proctor", "candidate"])),
):
    """
    Retrieve current exam configuration.
    """
    tenant_id = current_user["tenant_id"]
    service = ExamConfigService(db, tenant_id)
    return await service.get_config(exam_id)


@router.get("/{exam_id}/lock-status", response_model=LockStatusResponse)
async def get_lock_status(
    exam_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin", "proctor", "candidate"])),
):
    """
    FR-045: Returns whether the configuration is locked (i.e. candidates started).
    """
    tenant_id = current_user["tenant_id"]
    service = ExamConfigService(db, tenant_id)
    is_locked = await service.get_lock_status(exam_id)
    return LockStatusResponse(exam_id=exam_id, is_locked=is_locked)


# ── Sections ───────────────────────────────────────────────────────────────

@router.post(
    "/{exam_id}/sections",
    response_model=SectionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_section(
    exam_id: uuid.UUID,
    payload: SectionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin"])),
):
    """
    FR-032: Add a new section to the exam.
    """
    tenant_id = current_user["tenant_id"]
    service = ExamConfigService(db, tenant_id)
    return await service.add_section(exam_id, payload)


@router.put("/{exam_id}/sections/{section_id}", response_model=SectionResponse)
async def update_section(
    exam_id: uuid.UUID,
    section_id: uuid.UUID,
    payload: SectionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin"])),
):
    """
    FR-032: Update section instructions, time limit or negative marking override.
    """
    tenant_id = current_user["tenant_id"]
    service = ExamConfigService(db, tenant_id)
    return await service.update_section(exam_id, section_id, payload)


@router.delete("/{exam_id}/sections/{section_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_section(
    exam_id: uuid.UUID,
    section_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin"])),
):
    """
    FR-032: Remove section.
    """
    tenant_id = current_user["tenant_id"]
    service = ExamConfigService(db, tenant_id)
    await service.delete_section(exam_id, section_id)


@router.get("/{exam_id}/sections", response_model=List[SectionResponse])
async def list_sections(
    exam_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin", "proctor", "candidate"])),
):
    """
    List all sections for an exam ordered by order_index.
    """
    tenant_id = current_user["tenant_id"]
    service = ExamConfigService(db, tenant_id)
    return await service.list_sections(exam_id)


# ── Question Selection ─────────────────────────────────────────────────────

@router.post(
    "/{exam_id}/sections/{section_id}/questions",
    response_model=QuestionInSectionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_question(
    exam_id: uuid.UUID,
    section_id: uuid.UUID,
    payload: QuestionSelectionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin"])),
):
    """
    FR-033: Configure manual or random question draw for a section.
    """
    tenant_id = current_user["tenant_id"]
    service = ExamConfigService(db, tenant_id)
    return await service.add_question(exam_id, section_id, payload)


@router.delete(
    "/{exam_id}/sections/{section_id}/questions/{question_entry_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def remove_question(
    exam_id: uuid.UUID,
    section_id: uuid.UUID,
    question_entry_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin"])),
):
    """
    FR-033: Remove a question or random draw rule from the section.
    """
    tenant_id = current_user["tenant_id"]
    service = ExamConfigService(db, tenant_id)
    await service.remove_question(exam_id, section_id, question_entry_id)
