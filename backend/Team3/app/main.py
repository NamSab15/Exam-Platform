from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.db import engine


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
