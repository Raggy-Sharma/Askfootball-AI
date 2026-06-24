from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    App configuration loaded from environment variables.
    Pydantic validates types automatically.
    """

    APP_NAME: str = "AskFootball AI API"
    DEBUG: bool = True
    DATABASE_URL: str = "sqlite:///../db/FC26.db"
    API_KEY: str = "dev-key-change-in-production"

class Config:
    env_file = ".env"  # Auto-loads from .env file

settings = Settings()
