from xebia_core.config import BaseXebiaSettings


class Settings(BaseXebiaSettings):
    # Keycloak / JWT
    KEYCLOAK_REALM_URL: str = "http://localhost:8080/realms/exam-platform"
    KEYCLOAK_CLIENT_ID: str = "exam-platform-service"
    KEYCLOAK_CLIENT_SECRET: str | None = None

    # Judge0 code execution service
    JUDGE0_API_URL: str = "http://localhost:2358"
    JUDGE0_API_KEY: str | None = None

    # CORS (comma-separated origins, or "*")
    BACKEND_CORS_ORIGINS: str = "*"


settings = Settings()
