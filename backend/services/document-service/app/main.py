# app/utils/config.py

import os
from pymongo import MongoClient
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # JWT Configuration
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # MongoDB Configuration
    MONGO_URI: str

    # File Storage Configuration
    UPLOAD_DIRECTORY: str = "./uploads"
    MAX_FILE_SIZE: int = 50000000  # 50MB
    ALLOWED_FILE_TYPES: str = "pdf,doc,docx,jpg,jpeg,png,gif,txt,xls,xlsx,ppt,pptx,zip,rar"

    # Auth Service Configuration
    AUTH_SERVICE_URL: str = "http://snapdocs-auth-container-backend:8000"

    # CORS Configuration
    FRONTEND_URLS: str = "http://localhost:3000,http://127.0.0.1:3000"

    # Service Configuration
    SERVICE_NAME: str = "document-service"
    SERVICE_VERSION: str = "1.0.0"
    DEBUG: bool = True

    class Config:
        env_file = ".env"

    @property
    def allowed_file_extensions(self) -> List[str]:
        """Return list of allowed file extensions"""
        return [ext.strip().lower() for ext in self.ALLOWED_FILE_TYPES.split(",")]

    @property
    def cors_origins(self) -> List[str]:
        """Return list of CORS origins"""
        return [url.strip() for url in self.FRONTEND_URLS.split(",")]


# Create settings instance
settings = Settings()

# MongoDB connection
try:
    client = MongoClient(settings.MONGO_URI)
    db = client["snapdocs"]
    
    # Collections
    documents_collection = db["documents"]
    folders_collection = db["folders"]
    
    # Test connection
    client.admin.command('ping')
    print("✅ MongoDB connected successfully")
    
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    client = None
    db = None
    documents_collection = None
    folders_collection = None

# Create upload directory if it doesn't exist
upload_path = os.path.abspath(settings.UPLOAD_DIRECTORY)
os.makedirs(upload_path, exist_ok=True)
print(f"📁 Upload directory: {upload_path}")