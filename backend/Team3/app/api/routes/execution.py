from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user
from app.schemas.judge0 import Judge0ExecutionRequest
from app.services.judge0 import Judge0Service

router = APIRouter()


@router.post("/run", status_code=status.HTTP_200_OK)
async def run_code(
    payload: Judge0ExecutionRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Submits code to Judge0 for evaluation.
    Requires verified JWT authentication to prevent abuse.
    """
    # Enforce multi-tenancy verification (valid token presence)
    # In a full production implementation, tenant quotas can be checked here using current_user["tenant_id"]
    
    service = Judge0Service()
    try:
        stdout, stderr, execution_time = await service.submit_code(
            source_code=payload.source_code,
            language_id=payload.language_id,
            stdin=payload.stdin,
        )
        return {
            "stdout": stdout,
            "stderr": stderr,
            "execution_time": execution_time,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Compiler execution failed: {str(e)}",
        )
