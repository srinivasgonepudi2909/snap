from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

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
    "http://localhost:3000",             # Local frontend
    "http://127.0.0.1:3000",             # Another local IP
    os.getenv("FRONTEND_URL")            # Dynamic if hosted
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TODO: Add route imports here (e.g. from app.api.routes import auth_router)
# app.include_router(auth_router)

@app.get("/health")
def health_check():
    return {"status": "Auth service running 🛡️"}
