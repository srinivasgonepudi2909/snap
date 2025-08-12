from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
import time
import logging

from app.config.settings import settings
from app.api.v1.api import api_router
from app.config.database import engine, Base
from app.utils.exceptions import SnapDocsException

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="SnapDocs API",
    description="""
    ## 🚀 Your Digital Vault - Secure Document Management API
    
    SnapDocs provides a secure, organized way to store and manage your important documents.
    
    ### 🔐 Authentication Features:
    - **User Registration**: Create account with email verification
    - **Secure Login**: JWT-based authentication
    - **Profile Management**: Update user information
    
    ### 📁 Document Management (Coming Soon):
    - **Custom Folders**: Organize documents your way
    - **Secure Upload**: Multiple file format support
    - **Easy Access**: Find documents instantly
    
    ### 🛡️ Security:
    - End-to-end encryption
    - JWT token authentication
    - Password hashing with bcrypt
    - Input validation and sanitization
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.backend_cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Custom exception handlers
@app.exception_handler(SnapDocsException)
async def snapdocs_exception_handler(request: Request, exc: SnapDocsException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.detail,
            "type": exc.__class__.__name__
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": True,
            "message": "Validation error",
            "details": exc.errors()
        }
    )

# Include API router
app.include_router(api_router, prefix=settings.api_v1_str)

# Root endpoint
@app.get("/", tags=["🏠 Home"])
def read_root():
    """Welcome to SnapDocs API."""
    return {
        "message": "🚀 Welcome to SnapDocs API - Your Digital Vault",
        "version": "1.0.0",
        "description": "Secure Document Management Made Simple",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health",
        "api": {
            "v1": settings.api_v1_str,
            "auth": f"{settings.api_v1_str}/auth",
            "users": f"{settings.api_v1_str}/users"
        },
        "features": [
            "🔐 Secure Authentication",
            "📁 Document Organization", 
            "🔒 End-to-end Encryption",
            "📱 Cross-platform Access"
        ],
        "contact": {
            "name": "Gonepudi Srinivas",
            "email": "srigonepudi@gmail.com",
            "role": "Founder & CEO"
        }
    }

# Health check endpoint
@app.get("/health", tags=["🏥 Health"])
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "snapdocs-api",
        "version": "1.0.0",
        "timestamp": time.time(),
        "database": "connected"
    }

# API info endpoint
@app.get("/info", tags=["ℹ️ Info"])
def api_info():
    """Get API information."""
    return {
        "app_name": settings.app_name,
        "version": "1.0.0",
        "debug": settings.debug,
        "api_prefix": settings.api_v1_str,
        "endpoints": {
            "authentication": [
                "POST /api/v1/auth/signup",
                "POST /api/v1/auth/login",
                "GET /api/v1/auth/me"
            ],
            "users": [
                "GET /api/v1/users/profile",
                "PUT /api/v1/users/profile",
                "GET /api/v1/users/stats"
            ]
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
