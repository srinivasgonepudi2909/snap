from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

app = FastAPI(
    title="SnapDocs API",
    description="Your Digital Vault - Secure Document Management API",
    version="1.0.0"
)

# CORS middleware - Allow all origins for Docker network
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

@app.get("/")
def read_root():
    return {
        "message": "🚀 SnapDocs API is running!",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "snapdocs-api",
        "version": "1.0.0"
    }

# Temporary auth endpoints for testing
@app.post("/api/v1/auth/signup")
def signup(request: dict):
    return {
        "message": "Account created successfully! Welcome to SnapDocs!",
        "user": {
            "id": 1,
            "email": request.get("email"),
            "first_name": request.get("first_name"),
            "last_name": request.get("last_name"),
            "is_active": True
        },
        "access_token": "dummy-jwt-token-for-testing",
        "token_type": "bearer",
        "expires_in": 86400
    }

@app.post("/api/v1/auth/login")
def login(request: dict):
    return {
        "message": f"Welcome back! Login successful.",
        "access_token": "dummy-jwt-token-for-testing",
        "token_type": "bearer",
        "expires_in": 86400,
        "user": {
            "id": 1,
            "email": request.get("email"),
            "first_name": "Test",
            "last_name": "User",
            "is_active": True
        }
    }

@app.get("/api/v1/auth/me")
def get_me():
    return {
        "id": 1,
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User",
        "is_active": True,
        "created_at": "2024-01-01T00:00:00"
    }
