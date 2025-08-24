# app/utils/config.py

import os
from pymongo import MongoClient
from pydantic_settings import BaseSettings  # Updated import
from typing import List


class Settings(BaseSettings):
    # JWT Configuration
    SECRET_KEY: str = "snapdocs_documents_secret_key_2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # MongoDB Configuration
    MONGO_URI: str = "mongodb://Chaitra:changeme123@snapdocs-mongo:27017/snapdocs?authSource=admin"

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

# MongoDB connection with better error handling
client = None
db = None
documents_collection = None
folders_collection = None

try:
    print(f"🔗 Attempting to connect to MongoDB: {settings.MONGO_URI}")
    client = MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=5000)
    
    # Test connection
    client.admin.command('ping')
    print("✅ MongoDB ping successful")
    
    # Initialize database and collections
    db = client["snapdocs"]
    documents_collection = db["documents"]
    folders_collection = db["folders"]
    
    # Verify collections
    collection_names = db.list_collection_names()
    print(f"📚 Available collections: {collection_names}")
    
    # Create indexes for better performance (optional)
    try:
        documents_collection.create_index("folder_name")
        documents_collection.create_index("created_at")
        folders_collection.create_index("name", unique=True)
        print("📈 Database indexes created successfully")
    except Exception as idx_error:
        print(f"⚠️ Index creation warning: {idx_error}")
    
    print("✅ MongoDB connected successfully")
    
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    print(f"🔧 Connection string: {settings.MONGO_URI}")
    
    # Set to None so the application can handle gracefully
    client = None
    db = None
    documents_collection = None
    folders_collection = None

# Create upload directory if it doesn't exist
upload_path = os.path.abspath(settings.UPLOAD_DIRECTORY)
os.makedirs(upload_path, exist_ok=True)
print(f"📁 Upload directory: {upload_path}")

# Function to check database health
def check_database_health():
    """Check if database connection is healthy"""
    try:
        if client is None:
            return {"status": "error", "message": "No database connection"}
        
        client.admin.command('ping')
        return {"status": "healthy", "message": "Database connection is working"}
    except Exception as e:
        return {"status": "error", "message": f"Database connection failed: {str(e)}"}