"""Application configuration loaded from environment variables."""
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):  # pylint: disable=too-few-public-methods
    """Application settings loaded from environment variables."""

    app_name: str = "StyleAI API"
    app_env: str = "development"
    base_url: str = "http://localhost:8000"
    cors_origins: str = "http://localhost:5173"

    replicate_api_token: str | None = None
    replicate_model: str = "stability-ai/stable-diffusion"

    use_mongodb: bool = False
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "styleai"

    uploads_dir: Path = Path("data/uploads")
    generated_dir: Path = Path("data/generated")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
