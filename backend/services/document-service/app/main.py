# backend/services/document-service/app/main.py - UPDATED WITH STATIC FILE SERVING

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os

from app.api.routes import documents_router

# Load environment variables
load_dotenv()

# Get settings from environment or use defaults
SERVICE_NAME = os.getenv("SERVICE_NAME", "document-service")
SERVICE_VERSION = os.getenv("SERVICE_VERSION", "1.0.0")
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
UPLOAD_DIRECTORY = os.getenv("UPLOAD_DIRECTORY", "./uploads")
FRONTEND_URLS = os.getenv("FRONTEND_URLS", "http://localhost:3000,http://127.0.0.1:3000")

# Create FastAPI app
app = FastAPI(
    title="SnapDocs Document Service",
    description="Handles document storage, organization, and management",
    version=SERVICE_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration - More permissive for file serving
cors_origins = [url.strip() for url in FRONTEND_URLS.split(",")] + ["*"]  # Allow all for dev

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition", "Content-Type", "Content-Length"]
)

# Create upload directory if it doesn't exist
upload_dir_path = os.path.abspath(UPLOAD_DIRECTORY)
os.makedirs(upload_dir_path, exist_ok=True)
print(f"📁 Upload directory: {upload_dir_path}")

# Mount static files for serving uploaded documents
# This serves files at /files/{filename} route
try:
    app.mount("/files", StaticFiles(directory=upload_dir_path), name="files")
    print(f"✅ Static files mounted at /files from {upload_dir_path}")
except Exception as e:
    print(f"⚠️ Warning: Could not mount static files: {e}")

# Include routers
app.include_router(documents_router, prefix="/api/v1")

# Health check endpoints
@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": SERVICE_NAME,
        "version": SERVICE_VERSION,
        "message": "Document service is running 📄"
    }

@app.get("/health/detailed")
def detailed_health_check():
    """Detailed health check with dependencies"""
    health_status = {
        "status": "healthy",
        "service": SERVICE_NAME,
        "version": SERVICE_VERSION,
        "dependencies": {}
    }
    
    # Check MongoDB connection
    try:
        from app.utils.config import documents_collection
        if documents_collection is not None:
            documents_collection.find_one()
            health_status["dependencies"]["mongodb"] = "connected"
        else:
            health_status["dependencies"]["mongodb"] = "disconnected"
            health_status["status"] = "degraded"
    except Exception as e:
        health_status["dependencies"]["mongodb"] = f"error: {str(e)}"
        health_status["status"] = "unhealthy"
    
    # Check upload directory
    try:
        if os.path.exists(upload_dir_path) and os.access(upload_dir_path, os.W_OK):
            file_count = len([f for f in os.listdir(upload_dir_path) if os.path.isfile(os.path.join(upload_dir_path, f))])
            health_status["dependencies"]["file_storage"] = f"available ({file_count} files)"
        else:
            health_status["dependencies"]["file_storage"] = "unavailable"
            health_status["status"] = "degraded"
    except Exception as e:
        health_status["dependencies"]["file_storage"] = f"error: {str(e)}"
        health_status["status"] = "unhealthy"
    
    return health_status

@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "SnapDocs Document Service API",
        "version": SERVICE_VERSION,
        "docs": "/docs",
        "health": "/health",
        "file_serving": "/files/{filename}",
        "api": "/api/v1"
    }

# Add a specific endpoint to test file serving
@app.get("/test/files")
def test_file_serving():
    """Test file serving capability"""
    try:
        files = []
        if os.path.exists(upload_dir_path):
            files = [f for f in os.listdir(upload_dir_path) if os.path.isfile(os.path.join(upload_dir_path, f))]
        
        return {
            "success": True,
            "upload_directory": upload_dir_path,
            "files_count": len(files),
            "sample_files": files[:5],  # Show first 5 files
            "file_serving_url": "/files/{filename}",
            "message": "File serving is configured"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "upload_directory": upload_dir_path
        }

# Startup event
@app.on_event("startup")
async def startup_event():
    """Startup tasks"""
    print(f"🚀 Starting {SERVICE_NAME} v{SERVICE_VERSION}")
    print(f"📁 Upload directory: {upload_dir_path}")
    print(f"🔧 Debug mode: {DEBUG}")
    print(f"🌐 CORS origins: {cors_origins}")
    print(f"📡 Static files serving from: /files/")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown tasks"""
    print(f"🛑 Shutting down {SERVICE_NAME}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=DEBUG
    )