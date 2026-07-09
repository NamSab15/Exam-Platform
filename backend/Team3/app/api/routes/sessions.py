import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.db import get_db
from app.core.security import get_current_user
from app.models.exam_session import ExamSession, ExamSessionStatus
from app.schemas.session import SessionCreate, SessionResponse
from app.schemas.autosave import AutosavePayload
from app.schemas.result import ExamResultResponse
from app.services.session import SessionService

router = APIRouter()


@router.post("/start", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def start_session(
    payload: SessionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Initializes and starts a new exam session.
    Enforces multi-tenancy by binding the session to the tenant_id from the verified token.
    """
    tenant_id = current_user["tenant_id"]
    user_id = current_user["user_id"]

    # Initialize a new session
    db_session = ExamSession(
        tenant_id=tenant_id,
        user_id=user_id,
        exam_assignment_id=payload.exam_assignment_id,
        status=ExamSessionStatus.IN_PROGRESS,
    )
    db.add(db_session)
    await db.commit()
    await db.refresh(db_session)

    # Start the exam timer using SessionService, enforcing multi-tenancy
    service = SessionService(db, tenant_id)
    started_session = await service.start_exam_timer(db_session.id)
    return started_session


@router.patch("/{session_id}/autosave", status_code=status.HTTP_204_NO_CONTENT)
async def process_session_autosave(
    session_id: uuid.UUID,
    payload: AutosavePayload,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Processes ongoing candidate answers/code snippets and updates candidate submissions.
    Enforces multi-tenancy by validating that the session belongs to the token's tenant.
    """
    tenant_id = current_user["tenant_id"]

    service = SessionService(db, tenant_id)
    try:
        await service.process_autosave(session_id, payload)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=str(e)
        )


@router.post("/{session_id}/submit", response_model=ExamResultResponse)
async def submit_session(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Finalizes the exam session, runs grading calculation, and saves results.
    Enforces multi-tenancy by verifying session ownership prior to evaluation.
    """
    tenant_id = current_user["tenant_id"]

    service = SessionService(db, tenant_id)
    try:
        finalized_session = await service.finalize_exam(session_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )

    # Load Result relationship for response mapping
    result_record = finalized_session.result
    certificate_record = finalized_session.certificate

    if not result_record:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Session calculation failed to generate results record.",
        )

    return ExamResultResponse(
        session_id=finalized_session.id,
        total_score=result_record.total_score,
        passed=result_record.passed,
        certificate_url=certificate_record.verification_url if certificate_record else None,
    )
