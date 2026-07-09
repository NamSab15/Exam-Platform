from typing import Any
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Exam Platform Service"
    ENV: str = "local"
    API_V1_STR: str = "/api/v1"

    # Database Settings
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/exam_platform_db"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Any) -> Any:
        if isinstance(v, str):
            # Ensure we use asyncpg driver for SQLAlchemy async connection
            if v.startswith("postgresql://"):
                return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v

    # Keycloak Settings
    KEYCLOAK_REALM_URL: str = "http://localhost:8080/realms/exam-platform"
    KEYCLOAK_CLIENT_ID: str = "exam-platform-service"
    KEYCLOAK_CLIENT_SECRET: str | None = None

    # Judge0 Settings
    JUDGE0_API_URL: str = "http://localhost:2358"
    JUDGE0_API_KEY: str | None = None

    # CORS Origins (comma-separated origins)
    BACKEND_CORS_ORIGINS: str = "*"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )


settings = Settings()
