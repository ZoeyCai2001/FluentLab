from __future__ import annotations

from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "FluentLab API"
    data_path: Path = Field(
        default=Path("backend/data/fluentlab_state.json"),
        validation_alias="FLUENTLAB_DATA_PATH",
    )
    cors_origins: list[str] = [
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://localhost:3000",
        "http://localhost:3001",
    ]
    kimi_api_key: str | None = Field(default=None, validation_alias="KIMI_API_KEY")
    kimi_api_base_url: str = Field(
        default="https://api.kimi.com/coding/v1",
        validation_alias="KIMI_API_BASE_URL",
    )
    kimi_model: str = Field(default="kimi-for-coding", validation_alias="KIMI_MODEL")
    project_llm_provider: str = Field(default="kimi", validation_alias="PROJECT_LLM_PROVIDER")
    shared_password: str | None = Field(default=None, validation_alias="FLUENTLAB_SHARED_PASSWORD")
    auth_token: str | None = Field(default=None, validation_alias="FLUENTLAB_AUTH_TOKEN")

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value
