import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.security import require_role
from app.schemas.proctoring import (
    ProctoringConfigCreate,
    ProctoringConfigUpdate,
    ProctoringConfigResponse,
    ProctoringFlagUpdate,
    ProctoringFlagResponse,
)
from app.services.proctoring_service import ProctoringService

router = APIRouter()


@router.post(
    "/{exam_id}/proctoring",
    response_model=ProctoringConfigResponse,
    status_code=status.HTTP_201_CREATED,
)
async def configure_proctoring(
    exam_id: uuid.UUID,
    payload: ProctoringConfigCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin"])),
):
    """
    FR-041, FR-043: Configure proctoring level and recording options.
    Enforces configuration lock check (FR-045).
    """
    tenant_id = current_user["tenant_id"]
    service = ProctoringService(db, tenant_id)
    return await service.configure_proctoring(exam_id, payload)


@router.patch("/{exam_id}/proctoring", response_model=ProctoringConfigResponse)
async def update_proctoring(
    exam_id: uuid.UUID,
    payload: ProctoringConfigUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin"])),
):
    """
    Update proctoring options. Enforces configuration lock (FR-045).
    """
    tenant_id = current_user["tenant_id"]
    service = ProctoringService(db, tenant_id)
    return await service.update_proctoring(exam_id, payload)


@router.get("/{exam_id}/proctoring", response_model=ProctoringConfigResponse)
async def get_proctoring_config(
    exam_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin", "proctor", "candidate"])),
):
    """
    Retrieve proctoring configuration and AI flags.
    """
    tenant_id = current_user["tenant_id"]
    service = ProctoringService(db, tenant_id)
    return await service.get_proctoring_config(exam_id)


@router.patch("/{exam_id}/proctoring/flags/{flag_type}", response_model=ProctoringFlagResponse)
async def update_flag(
    exam_id: uuid.UUID,
    flag_type: str,
    payload: ProctoringFlagUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin"])),
):
    """
    FR-042, FR-044: Enable/disable an individual AI flag type or change sensitivity thresholds.
    Enforces configuration lock check (FR-045).
    """
    tenant_id = current_user["tenant_id"]
    service = ProctoringService(db, tenant_id)
    return await service.update_flag(exam_id, flag_type, payload)
