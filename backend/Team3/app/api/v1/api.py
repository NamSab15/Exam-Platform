from fastapi import APIRouter
from app.api.routes.sessions import router as sessions_router
from app.api.routes.execution import router as execution_router

api_router = APIRouter()

# Register routes with corresponding prefixes and tags
api_router.include_router(sessions_router, prefix="/sessions", tags=["Sessions"])
api_router.include_router(execution_router, prefix="/execution", tags=["Execution"])
