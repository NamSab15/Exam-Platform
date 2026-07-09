import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.security import require_role
from app.schemas.result_release import (
    ResultReleaseCreate,
    ResultReleaseUpdate,
    ResultReleaseResponse,
)
from app.services.result_release_service import ResultReleaseService

router = APIRouter()


@router.post(
    "/{exam_id}/result-release",
    response_model=ResultReleaseResponse,
    status_code=status.HTTP_201_CREATED,
)
async def configure_release(
    exam_id: uuid.UUID,
    payload: ResultReleaseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin"])),
):
    """
    FR-046, FR-047, FR-048: Configure result release options, score display details and certificate issuance.
    """
    tenant_id = current_user["tenant_id"]
    service = ResultReleaseService(db, tenant_id)
    return await service.configure_release(exam_id, payload)


@router.patch("/{exam_id}/result-release", response_model=ResultReleaseResponse)
async def update_release(
    exam_id: uuid.UUID,
    payload: ResultReleaseUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin"])),
):
    """
    Partially update result release configuration.
    """
    tenant_id = current_user["tenant_id"]
    service = ResultReleaseService(db, tenant_id)
    return await service.update_release(exam_id, payload)


@router.get("/{exam_id}/result-release", response_model=ResultReleaseResponse)
async def get_release_config(
    exam_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin", "proctor", "candidate"])),
):
    """
    Retrieve result release rules.
    """
    tenant_id = current_user["tenant_id"]
    service = ResultReleaseService(db, tenant_id)
    return await service.get_release_config(exam_id)
