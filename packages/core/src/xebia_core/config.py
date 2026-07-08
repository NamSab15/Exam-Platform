from pydantic_settings import BaseSettings, SettingsConfigDict


class BaseXebiaSettings(BaseSettings):
    ENV: str = "local"
    LOG_LEVEL: str = "INFO"
    VERSION: str = "0.1.0"
    DATABASE_URL: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )
