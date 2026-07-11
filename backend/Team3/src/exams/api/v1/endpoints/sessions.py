"""Sessions API router — start, autosave, submit exam sessions."""
from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession

from exams.dependencies import get_db_session
from exams.models import ExamSession, ExamSessionStatus
from exams.schemas.session import (
    AutosavePayload,
    ExamResultResponse,
    SessionCreate,
    SessionResponse,
)
from exams.services.session import SessionService

router = APIRouter()


def _get_tenant_and_user(request_headers: dict) -> tuple[str, str]:  # noqa: ARG001
    """
    Placeholder — extract tenant_id and user_id from the verified JWT token.
    TODO: replace with xebia_core auth dependency once the shared auth module
    provides a get_current_user / require_role dependency.
    """
    return "default-tenant", "default-user"


@router.post(
    "/start",
    response_model=SessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Start a new exam session",
)
async def start_session(
    payload: SessionCreate,
    db: AsyncSession = Depends(get_db_session),
) -> SessionResponse:
    """
    Initialize and start a new exam session.
    Locks the exam configuration once the first candidate starts (FR-045).
    """
    # TODO: derive tenant_id and user_id from JWT dependency
    tenant_id = "default-tenant"
    user_id = "default-user"

    db_session = ExamSession(
        tenant_id=tenant_id,
        user_id=user_id,
        exam_assignment_id=payload.exam_assignment_id,
        status=ExamSessionStatus.IN_PROGRESS,
    )
    db.add(db_session)
    await db.commit()
    await db.refresh(db_session)

    service = SessionService(db, tenant_id)
    started = await service.start_exam_timer(db_session.id)
    return SessionResponse.model_validate(started)


@router.patch(
    "/{session_id}/autosave",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Autosave candidate answers",
)
async def process_session_autosave(
    session_id: uuid.UUID,
    payload: AutosavePayload,
    db: AsyncSession = Depends(get_db_session),
) -> None:
    """
    Persist candidate answers / code snippets mid-session.
    Called periodically from the frontend; only the final submit triggers grading.
    """
    tenant_id = "default-tenant"
    service = SessionService(db, tenant_id)
    try:
        await service.process_autosave(session_id, payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


@router.post(
    "/{session_id}/submit",
    response_model=ExamResultResponse,
    summary="Submit and finalize exam session",
)
async def submit_session(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db_session),
) -> ExamResultResponse:
    """
    Finalize the exam session, run grading, and return the result.
    Only the submit button makes this API call; all other state is cached client-side.
    """
    tenant_id = "default-tenant"
    service = SessionService(db, tenant_id)
    try:
        _session, result_record, cert_record = await service.finalize_exam(session_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return ExamResultResponse(
        session_id=session_id,
        total_score=result_record.total_score,
        passed=result_record.passed,
        certificate_url=cert_record.verification_url if cert_record else None,
    )
