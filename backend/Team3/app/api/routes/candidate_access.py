import uuid
from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.security import require_role
from app.schemas.candidate_access import (
    CandidateAccessCreate,
    CandidateAccessResponse,
    InviteLinkResponse,
    PassphraseSet,
    PassphraseVerify,
    PassphraseVerifyResponse,
    CandidateEmailAdd,
    InvitedCandidateResponse,
    CandidateBulkAddResponse,
)
from app.services.access_service import AccessService

router = APIRouter()


@router.post(
    "/{exam_id}/access",
    response_model=CandidateAccessResponse,
    status_code=status.HTTP_201_CREATED,
)
async def configure_access(
    exam_id: uuid.UUID,
    payload: CandidateAccessCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin"])),
):
    """
    FR-038, FR-040: Configure access mode (email list, CSV or link) and timezone display label.
    """
    tenant_id = current_user["tenant_id"]
    service = AccessService(db, tenant_id)
    return await service.configure_access(exam_id, payload)


@router.get("/{exam_id}/access", response_model=CandidateAccessResponse)
async def get_access_config(
    exam_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin", "proctor", "candidate"])),
):
    """
    Retrieve access control settings.
    """
    tenant_id = current_user["tenant_id"]
    service = AccessService(db, tenant_id)
    return await service.get_access_config(exam_id)


@router.post(
    "/{exam_id}/access/candidates",
    response_model=CandidateBulkAddResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_candidates(
    exam_id: uuid.UUID,
    payload: CandidateEmailAdd,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin"])),
):
    """
    FR-038: Assign individual candidates by email list.
    """
    tenant_id = current_user["tenant_id"]
    service = AccessService(db, tenant_id)
    added, skipped, added_emails = await service.add_candidates_by_email(exam_id, payload.emails)
    return CandidateBulkAddResponse(
        added=added, skipped_duplicates=skipped, emails_added=added_emails
    )


@router.post(
    "/{exam_id}/access/candidates/csv",
    response_model=CandidateBulkAddResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_candidates_csv(
    exam_id: uuid.UUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin"])),
):
    """
    FR-038: Assign candidates via CSV upload containing an 'email' column.
    """
    tenant_id = current_user["tenant_id"]
    service = AccessService(db, tenant_id)
    csv_bytes = await file.read()
    csv_content = csv_bytes.decode("utf-8")
    added, skipped, added_emails = await service.add_candidates_by_csv(exam_id, csv_content)
    return CandidateBulkAddResponse(
        added=added, skipped_duplicates=skipped, emails_added=added_emails
    )


@router.get("/{exam_id}/access/candidates", response_model=List[InvitedCandidateResponse])
async def list_candidates(
    exam_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin", "proctor"])),
):
    """
    List all candidates explicitly assigned to the exam.
    """
    tenant_id = current_user["tenant_id"]
    service = AccessService(db, tenant_id)
    return await service.list_candidates(exam_id)


@router.post("/{exam_id}/access/invite-link", response_model=InviteLinkResponse)
async def generate_invite_link(
    exam_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin"])),
):
    """
    FR-038: Generate or rotate the shareable invitation link.
    """
    tenant_id = current_user["tenant_id"]
    service = AccessService(db, tenant_id)
    token = await service.generate_invite_link(exam_id)
    # Construct a friendly external URL for frontend use
    invite_url = f"https://exam.platform/join/{token}"
    return InviteLinkResponse(
        exam_id=exam_id, invite_link_token=token, invite_link_url=invite_url
    )


@router.post("/{exam_id}/access/passphrase", status_code=status.HTTP_204_NO_CONTENT)
async def set_passphrase(
    exam_id: uuid.UUID,
    payload: PassphraseSet,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin"])),
):
    """
    FR-039: Set an optional passphrase required for joining via invite link.
    """
    tenant_id = current_user["tenant_id"]
    service = AccessService(db, tenant_id)
    await service.set_passphrase(exam_id, payload.passphrase)


@router.post(
    "/{exam_id}/access/verify-passphrase",
    response_model=PassphraseVerifyResponse,
)
async def verify_passphrase(
    exam_id: uuid.UUID,
    payload: PassphraseVerify,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_role(["exam_creator", "tenant_admin", "candidate"])),
):
    """
    FR-039: Verify passphrase before allowing access via invite link.
    """
    tenant_id = current_user["tenant_id"]
    service = AccessService(db, tenant_id)
    valid = await service.verify_passphrase(exam_id, payload.passphrase)
    return PassphraseVerifyResponse(valid=valid)
