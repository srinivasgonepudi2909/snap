# app/main.py

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

# CORS Configuration
cors_origins = [url.strip() for url in FRONTEND_URLS.split(",")] + ["*"]  # Allow all for dev

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mount static files for serving uploaded documents
if os.path.exists(UPLOAD_DIRECTORY):
    app.mount("/files", StaticFiles(directory=UPLOAD_DIRECTORY), name="files")

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
        upload_dir = os.path.abspath(UPLOAD_DIRECTORY)
        if os.path.exists(upload_dir) and os.access(upload_dir, os.W_OK):
            health_status["dependencies"]["file_storage"] = "available"
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
        "health": "/health"
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    """Startup tasks"""
    print(f"🚀 Starting {SERVICE_NAME} v{SERVICE_VERSION}")
    print(f"📁 Upload directory: {os.path.abspath(UPLOAD_DIRECTORY)}")
    print(f"🔧 Debug mode: {DEBUG}")
    print(f"🌐 CORS origins: {cors_origins}")

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