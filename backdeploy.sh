#!/bin/bash

echo "🚀 Setting up SecureDocs Full Stack with Docker..."

# Create main docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: securedocs-db
    environment:
      POSTGRES_DB: securedocs
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: securepass123
      POSTGRES_HOST_AUTH_METHOD: trust
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - securedocs-network
    restart: unless-stopped

  # Python FastAPI Auth Service
  auth-service:
    build: 
      context: ./services/auth-service
      dockerfile: Dockerfile
    container_name: securedocs-auth
    environment:
      DATABASE_URL: postgresql://postgres:securepass123@postgres:5432/securedocs
      SECRET_KEY: super-secret-jwt-key-for-securedocs-2024
      ACCESS_TOKEN_EXPIRE_HOURS: 24
      PORT: 8000
      FRONTEND_URL: http://localhost:3000
    ports:
      - "8000:8000"
    depends_on:
      - postgres
    networks:
      - securedocs-network
    restart: unless-stopped
    volumes:
      - ./services/auth-service:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload

  # React Frontend
  frontend:
    build:
      context: ./secure-docs-frontend
      dockerfile: Dockerfile
    container_name: securedocs-frontend
    ports:
      - "3000:80"
    networks:
      - securedocs-network
    restart: unless-stopped
    depends_on:
      - auth-service

networks:
  securedocs-network:
    driver: bridge

volumes:
  postgres_data:
EOF

# Create database initialization script
mkdir -p database
cat > database/init.sql << 'EOF'
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create blacklisted tokens table
CREATE TABLE IF NOT EXISTS blacklisted_tokens (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_blacklisted_tokens_token ON blacklisted_tokens(token);

-- Insert default admin user (optional)
INSERT INTO users (name, email, password, is_active) 
VALUES ('Admin User', 'admin@securedocs.com', '$2b$12$dummy.hash.for.testing', true)
ON CONFLICT (email) DO NOTHING;
EOF

# Create auth service directory structure
echo "📁 Creating auth service structure..."
mkdir -p services/auth-service/src/{config,models,schemas,utils}

# Create requirements.txt for auth service
cat > services/auth-service/requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
passlib[bcrypt]==1.7.4
python-jose[cryptography]==3.3.0
python-multipart==0.0.6
python-dotenv==1.0.0
email-validator==2.1.0
EOF

# Create Dockerfile for auth service
cat > services/auth-service/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

# Create main.py for auth service
cat > services/auth-service/main.py << 'EOF'
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
EOF

# Create all the supporting Python files
echo "📝 Creating Python modules..."

# Database config
cat > services/auth-service/src/config/database.py << 'EOF'
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/securedocs")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
EOF

# Models
cat > services/auth-service/src/models/models.py << 'EOF'
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from datetime import datetime
from src.config.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

class BlacklistedToken(Base):
    __tablename__ = "blacklisted_tokens"
    
    id = Column(Integer, primary_key=True, index=True)
    token = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
EOF

# Schemas
cat > services/auth-service/src/schemas/auth_schemas.py << 'EOF'
from pydantic import BaseModel, EmailStr, validator
from typing import Optional

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    
    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one number')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    success: bool
    message: str
    user: dict
    token: str
EOF

# Security utilities
cat > services/auth-service/src/utils/security.py << 'EOF'
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import os

SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-jwt-key-for-securedocs-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", "24"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str, db: Session):
    from src.models.models import User, BlacklistedToken
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        blacklisted = db.query(BlacklistedToken).filter(
            BlacklistedToken.token == token
        ).first()
        
        if blacklisted:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has been invalidated"
            )
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("userId")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if user is None:
        raise credentials_exception
    
    return user, token
EOF

# Create __init__.py files
touch services/auth-service/src/__init__.py
touch services/auth-service/src/config/__init__.py
touch services/auth-service/src/models/__init__.py
touch services/auth-service/src/schemas/__init__.py
touch services/auth-service/src/utils/__init__.py

# Create .env for auth service
cat > services/auth-service/.env << 'EOF'
DATABASE_URL=postgresql://postgres:securepass123@postgres:5432/securedocs
SECRET_KEY=super-secret-jwt-key-for-securedocs-2024
ACCESS_TOKEN_EXPIRE_HOURS=24
PORT=8000
FRONTEND_URL=http://localhost:3000
EOF

# Update frontend Dockerfile to work with backend
cat > secure-docs-frontend/Dockerfile << 'EOF'
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Create nginx config for SPA routing and API proxy
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Handle SPA routing \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Proxy API calls to backend \
    location /auth/ { \
        proxy_pass http://auth-service:8000/auth/; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# Create deployment scripts
mkdir -p scripts

# Build and start script
cat > scripts/deploy.sh << 'EOF'
#!/bin/bash

echo "🚀 Deploying SecureDocs Full Stack..."

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start all services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service health..."
docker-compose ps

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo "   Database: localhost:5432"
echo ""
echo "🔧 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop:"
echo "   docker-compose down"
EOF

# Stop script
cat > scripts/stop.sh << 'EOF'
#!/bin/bash

echo "🛑 Stopping SecureDocs services..."
docker-compose down

echo "✅ All services stopped"
EOF

# Logs script
cat > scripts/logs.sh << 'EOF'
#!/bin/bash

echo "📋 SecureDocs Service Logs:"
echo "Press Ctrl+C to exit"
echo ""

docker-compose logs -f
EOF

# Make scripts executable
chmod +x scripts/*.sh

echo ""
echo "✅ Docker Compose setup complete!"
echo ""
echo "🚀 To deploy everything:"
echo "   ./scripts/deploy.sh"
echo ""
echo "📋 To view logs:"
echo "   ./scripts/logs.sh"
echo ""
echo "🛑 To stop everything:"
echo "   ./scripts/stop.sh"
echo ""
echo "🌐 After deployment:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"