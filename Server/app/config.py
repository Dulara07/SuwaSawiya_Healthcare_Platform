import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:root@localhost:5432/suwasawiya_db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    FILE_UPLOAD_DIR: str = os.getenv("FILE_UPLOAD_DIR", "./uploads")

settings = Settings()
