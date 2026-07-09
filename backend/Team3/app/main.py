from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.db import engine
from app.core.exceptions import (
    ExamNotFoundError,
    ConfigLockedError,
    DuplicateCandidateError,
    InvalidCSVError,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    # (e.g., verifying connection or initializing caches)
    yield
    # Shutdown actions: Clean up database pool connections
    await engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)


@app.exception_handler(ExamNotFoundError)
async def exam_not_found_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": str(exc)},
    )


@app.exception_handler(ConfigLockedError)
async def config_locked_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"detail": str(exc)},
    )


@app.exception_handler(DuplicateCandidateError)
async def duplicate_candidate_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"detail": str(exc)},
    )


@app.exception_handler(InvalidCSVError)
async def invalid_csv_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": str(exc)},
    )


@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc)},
    )


app.include_router(api_router, prefix=settings.API_V1_STR)

# Configure CORS origins
origins = []
if settings.BACKEND_CORS_ORIGINS:
    if settings.BACKEND_CORS_ORIGINS == "*":
        origins = ["*"]
    else:
        origins = [
            origin.strip()
            for origin in settings.BACKEND_CORS_ORIGINS.split(",")
            if origin.strip()
        ]

# Note: Credentials cannot be allowed with wildcard "*" origin in CORS specification
allow_credentials = False if "*" in origins else True

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "environment": settings.ENV,
    }
