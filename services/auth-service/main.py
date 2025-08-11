from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import os
from dotenv import load_dotenv
import uvicorn

from src.config.database import get_db, init_db
from src.models.models import User, BlacklistedToken
from src.schemas.auth_schemas import UserSignup, UserLogin, TokenResponse
from src.utils.security import hash_password, verify_password, create_access_token, verify_token

load_dotenv()

app = FastAPI(
    title="SecureDocs Auth Service",
    description="Authentication service for SecureDocs application",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    return verify_token(credentials.credentials, db)

@app.on_event("startup")
async def startup_event():
    init_db()
    print("🚀 SecureDocs Auth Service started successfully")

@app.get("/health")
async def health_check():
    return {
        "status": "OK",
        "service": "SecureDocs Auth Service",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/auth/signup", response_model=TokenResponse)
async def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists with this email"
        )
    
    hashed_password = hash_password(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email.lower(),
        password=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"userId": new_user.id})
    
    return TokenResponse(
        success=True,
        message="Account created successfully",
        user={
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "created_at": new_user.created_at.isoformat()
        },
        token=access_token
    )

@app.post("/auth/login", response_model=TokenResponse)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.email == user_credentials.email.lower(),
        User.is_active == True
    ).first()
    
    if not user or not verify_password(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    user.last_login = datetime.utcnow()
    db.commit()
    
    access_token = create_access_token(data={"userId": user.id})
    
    return TokenResponse(
        success=True,
        message="Login successful",
        user={
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "created_at": user.created_at.isoformat(),
            "last_login": user.last_login.isoformat() if user.last_login else None
        },
        token=access_token
    )

@app.get("/auth/welcome")
async def welcome(current_user_data = Depends(get_current_user)):
    user, _ = current_user_data
    
    stats = {
        "total_documents": 0,
        "total_folders": 3,
        "storage_used": "0 MB",
        "last_login_formatted": user.last_login.strftime("%B %d, %Y") if user.last_login else "First time!"
    }
    
    return {
        "success": True,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "created_at": user.created_at.isoformat(),
            "last_login": user.last_login.isoformat() if user.last_login else None
        },
        "stats": stats,
        "message": f"Welcome back, {user.name}!"
    }

@app.post("/auth/logout")
async def logout(current_user_data = Depends(get_current_user), db: Session = Depends(get_db)):
    user, token = current_user_data
    
    blacklisted_token = BlacklistedToken(token=token)
    db.add(blacklisted_token)
    db.commit()
    
    return {
        "success": True,
        "message": "Logged out successfully"
    }

@app.get("/auth/verify")
async def verify_token_endpoint(current_user_data = Depends(get_current_user)):
    user, _ = current_user_data
    return {
        "success": True,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=True
    )
