from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "MarketFlow AI API"
    api_v1_prefix: str = "/api"
    database_url: str = "sqlite:///./marketflow.db"
    # Override with CORS_ORIGINS=* in production, or a JSON-serialised list:
    # CORS_ORIGINS='["https://your-app.vercel.app","https://your-app.onrender.com"]'
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]
    # Convenience flag: if true, CORS allows every origin (set to "true" in env)
    cors_allow_all: bool = False
    environment: str = "development"
    llm_api_key: str | None = None
    llm_model: str = "gpt-4o-mini"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
