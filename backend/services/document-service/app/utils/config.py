# app/utils/config.py

import os
from pymongo import MongoClient
from typing import List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    def __init__(self):
        # JWT Configuration
        self.SECRET_KEY = os.getenv("SECRET_KEY", "snapdocs_documents_secret_key_2024")
        self.ALGORITHM = os.getenv("ALGORITHM", "HS256")
        self.ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

        # MongoDB Configuration
        self.MONGO_URI = os.getenv("MONGO_URI", "mongodb://Chaitra:changeme123@snapdocs-mongo:27017/snapdocs?authSource=admin")

        # File Storage Configuration
        self.UPLOAD_DIRECTORY = os.getenv("UPLOAD_DIRECTORY", "./uploads")
        self.MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", "50000000"))  # 50MB
        self.ALLOWED_FILE_TYPES = os.getenv("ALLOWED_FILE_TYPES", "pdf,doc,docx,jpg,jpeg,png,gif,txt,xls,xlsx,ppt,pptx,zip,rar")

        # Auth Service Configuration
        self.AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://snapdocs-auth-container-backend:8000")

        # CORS Configuration
        self.FRONTEND_URLS = os.getenv("FRONTEND_URLS", "http://localhost:3000,http://127.0.0.1:3000")

        # Service Configuration
        self.SERVICE_NAME = os.getenv("SERVICE_NAME", "document-service")
        self.SERVICE_VERSION = os.getenv("SERVICE_VERSION", "1.0.0")
        self.DEBUG = os.getenv("DEBUG", "True").lower() == "true"

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
    client = MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=10000)
    
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
        folders_collection.create_index("name")
        print("📈 Database indexes created successfully")
    except Exception as idx_error:
        print(f"⚠️ Index creation warning: {idx_error}")
    
    print("✅ MongoDB connected successfully")
    
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    print(f"🔧 Connection string used: {settings.MONGO_URI}")
    
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