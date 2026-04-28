from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "CV Analyzer API"
    app_version: str = "1.0.0"
    debug: bool = True
    database_url: str = "sqlite:///./cv_analyzer.db"
    max_upload_size_mb: int = 10
    top_keywords_limit: int = 15

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
