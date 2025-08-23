from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi.openapi.utils import get_openapi
from fastapi.security import OAuth2PasswordBearer
import os
from app.api.routes import auth_router

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Load environment variables
load_dotenv()

# App Initialization
app = FastAPI(
    title="SnapDocs Auth Service",
    description="Handles user registration and login",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://13.222.58.123:3000",  # Add your EC2 public IP
    os.getenv("FRONTEND_URL"),
    "*"  # Allow all origins for development (remove in production)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

@app.get("/health")
def health_check():
    return {"status": "Auth service running 🛡️"}

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="SnapDocs Auth Service",
        version="1.0.0",
        description="Handles user registration and login",
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "OAuth2PasswordBearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }

    for path in openapi_schema["paths"]:
        for method in openapi_schema["paths"][path]:
            if "security" not in openapi_schema["paths"][path][method]:
                openapi_schema["paths"][path][method]["security"] = [{"OAuth2PasswordBearer": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

