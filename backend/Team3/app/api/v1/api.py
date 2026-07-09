from fastapi import APIRouter
from app.api.routes.sessions import router as sessions_router
from app.api.routes.execution import router as execution_router
from app.api.routes.exam_config import router as exam_config_router
from app.api.routes.candidate_access import router as candidate_access_router
from app.api.routes.proctoring import router as proctoring_router
from app.api.routes.result_release import router as result_release_router

api_router = APIRouter()

# Register routes with corresponding prefixes and tags
api_router.include_router(sessions_router, prefix="/sessions", tags=["Sessions"])
api_router.include_router(execution_router, prefix="/execution", tags=["Execution"])

# Exam Configuration routes (FR-031–FR-048)
api_router.include_router(exam_config_router, prefix="/exams", tags=["Exam Configuration"])
api_router.include_router(candidate_access_router, prefix="/exams", tags=["Candidate Access"])
api_router.include_router(proctoring_router, prefix="/exams", tags=["Proctoring Configuration"])
api_router.include_router(result_release_router, prefix="/exams", tags=["Result Release"])
