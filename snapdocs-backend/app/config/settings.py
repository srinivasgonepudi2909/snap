from pydantic_settings import BaseSettings
from typing import List, Union
import secrets

class Settings(BaseSettings):
    # API Configuration
    api_v1_str: str = "/api/v1"
    app_name: str = "SnapDocs API"
    debug: bool = True
    
    # Database Configuration
    database_url: str = "postgresql://snapdocs_user:snapdocs_password@postgres:5432/snapdocs_db"
    
    # JWT Configuration
    secret_key: str = secrets.token_urlsafe(32)
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24 hours
    
    # CORS Configuration
    backend_cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
