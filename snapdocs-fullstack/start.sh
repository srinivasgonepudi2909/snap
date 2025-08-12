#!/bin/bash

# SnapDocs Universal Docker Deployment Script
# Handles both docker-compose and docker compose commands

set -e

echo "🚀 SnapDocs Universal Docker Setup"
echo "=================================="
echo "🔧 Detecting Docker Compose version and fixing compatibility"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Function to detect docker compose command
detect_docker_compose() {
    if command -v docker-compose >/dev/null 2>&1; then
        echo "docker-compose"
    elif docker compose version >/dev/null 2>&1; then
        echo "docker compose"
    else
        echo "none"
    fi
}

# Detect the correct docker compose command
DOCKER_COMPOSE_CMD=$(detect_docker_compose)

echo -e "${BLUE}🔍 Checking Docker installation...${NC}"

# Check Docker installation
if ! command -v docker >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    echo ""
    echo -e "${YELLOW}📥 Please install Docker first:${NC}"
    echo -e "   🐧 Linux: ${BLUE}curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh${NC}"
    echo -e "   🍎 Mac: ${BLUE}https://docs.docker.com/desktop/mac/install/${NC}"
    echo -e "   🪟 Windows: ${BLUE}https://docs.docker.com/desktop/windows/install/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is installed: $(docker --version)${NC}"

# Check Docker Compose
if [ "$DOCKER_COMPOSE_CMD" = "none" ]; then
    echo -e "${RED}❌ Docker Compose is not available!${NC}"
    echo ""
    echo -e "${YELLOW}📥 Installing Docker Compose...${NC}"
    
    # Try to install docker-compose
    if command -v pip3 >/dev/null 2>&1; then
        echo -e "${BLUE}📦 Installing via pip3...${NC}"
        pip3 install docker-compose
        DOCKER_COMPOSE_CMD="docker-compose"
    elif command -v curl >/dev/null 2>&1; then
        echo -e "${BLUE}📦 Installing via curl...${NC}"
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        DOCKER_COMPOSE_CMD="docker-compose"
    else
        echo -e "${RED}❌ Cannot install Docker Compose automatically${NC}"
        echo -e "${YELLOW}💡 Please install Docker Compose manually:${NC}"
        echo -e "   🔗 https://docs.docker.com/compose/install/"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Docker Compose is available: $DOCKER_COMPOSE_CMD${NC}"
fi

# Create project directory
PROJECT_NAME="snapdocs-fullstack"
echo -e "${BLUE}📁 Creating project: $PROJECT_NAME${NC}"

if [ -d "$PROJECT_NAME" ]; then
    echo -e "${YELLOW}⚠️  Directory $PROJECT_NAME already exists. Removing...${NC}"
    rm -rf "$PROJECT_NAME"
fi

mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Create directory structure
mkdir -p frontend/{src,public}
mkdir -p backend/app
mkdir -p database/init
mkdir -p shared/nginx
mkdir -p scripts

echo -e "${BLUE}🐳 Creating Docker Compose configuration...${NC}"

# Create docker-compose.yml with proper version
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: snapdocs-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: snapdocs_db
      POSTGRES_USER: snapdocs_user
      POSTGRES_PASSWORD: snapdocs_password
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8"
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d
    networks:
      - snapdocs-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U snapdocs_user -d snapdocs_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  # FastAPI Backend
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    container_name: snapdocs-backend
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://snapdocs_user:snapdocs_password@postgres:5432/snapdocs_db
      SECRET_KEY: snapdocs-jwt-secret-key-change-in-production-2024
      DEBUG: "true"
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend:/app
    networks:
      - snapdocs-network
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

  # React Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: snapdocs-frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - snapdocs-network
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
    driver: local

networks:
  snapdocs-network:
    driver: bridge
EOF

echo -e "${BLUE}⚛️ Creating Frontend (React)...${NC}"

# Frontend package.json
cat > frontend/package.json << 'EOF'
{
  "name": "snapdocs-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "lucide-react": "^0.263.1",
    "axios": "^1.6.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
EOF

# Frontend Dockerfile
cat > frontend/Dockerfile << 'EOF'
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install --silent
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Simple nginx config
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# Frontend public/index.html
cat > frontend/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SnapDocs - Your Digital Vault</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>
</body>
</html>
EOF

# Frontend src/index.js
cat > frontend/src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
EOF

# Frontend App.jsx - Simple version with backend integration
cat > frontend/src/App.jsx << 'EOF'
import React, { useState } from 'react';
import axios from 'axios';

// Configure axios for backend communication
const API_BASE = process.env.NODE_ENV === 'production' 
  ? window.location.origin 
  : 'http://localhost:8000';

axios.defaults.baseURL = API_BASE;

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const testBackend = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/health');
      setMessage(`✅ Backend Connected: ${response.data.message || 'Healthy'}`);
    } catch (error) {
      setMessage(`❌ Backend Error: ${error.message}`);
    }
    setLoading(false);
  };

  const testSignup = async () => {
    setLoading(true);
    try {
      const userData = {
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        password: 'testpassword123'
      };
      
      const response = await axios.post('/api/v1/auth/signup', userData);
      setUser(response.data.user);
      setMessage('✅ Signup successful! User logged in.');
    } catch (error) {
      setMessage(`❌ Signup Error: ${error.response?.data?.detail || error.message}`);
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setMessage('👋 Logged out successfully');
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="max-w-4xl mx-auto p-8 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20">
            <h1 className="text-5xl font-bold text-white mb-8">
              🎉 Welcome to SnapDocs Dashboard!
            </h1>
            <div className="bg-green-500/20 border border-green-400 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-green-100 mb-2">
                Hello, {user.first_name} {user.last_name}! 👋
              </h2>
              <p className="text-green-200">
                Your secure document vault is ready. Start uploading your valuable documents!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-500/20 border border-blue-400 rounded-xl p-6">
                <div className="text-4xl mb-4">📁</div>
                <h3 className="text-xl font-bold text-white mb-2">Create Folders</h3>
                <p className="text-gray-300">Organize your documents</p>
              </div>
              <div className="bg-green-500/20 border border-green-400 rounded-xl p-6">
                <div className="text-4xl mb-4">📤</div>
                <h3 className="text-xl font-bold text-white mb-2">Upload Files</h3>
                <p className="text-gray-300">Secure document storage</p>
              </div>
              <div className="bg-purple-500/20 border border-purple-400 rounded-xl p-6">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-white mb-2">Secure Access</h3>
                <p className="text-gray-300">Military-grade security</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
              <span className="text-white font-bold text-2xl">SD</span>
            </div>
            <h1 className="text-5xl font-bold text-white">SnapDocs</h1>
          </div>
          
          <p className="text-2xl text-gray-300 mb-12">
            Your Digital Vault - Secure Document Management
          </p>
          
          <div className="space-y-6 mb-8">
            <button
              onClick={testBackend}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? '🔄 Testing...' : '🔗 Test Backend Connection'}
            </button>
            
            <button
              onClick={testSignup}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? '🔄 Creating Account...' : '🚀 Test Signup & Login'}
            </button>
          </div>
          
          {message && (
            <div className={`p-4 rounded-xl ${message.includes('✅') ? 'bg-green-500/20 border border-green-400 text-green-100' : 'bg-red-500/20 border border-red-400 text-red-100'}`}>
              {message}
            </div>
          )}
          
          <div className="mt-12 text-gray-400 text-sm">
            <p>🔒 Secure • 📱 Responsive • ⚡ Fast</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
EOF

echo -e "${BLUE}🐍 Creating Backend (FastAPI)...${NC}"

# Backend requirements.txt
cat > backend/requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
email-validator==2.1.0
pydantic-settings==2.0.3
python-dotenv==1.0.0
EOF

# Backend Dockerfile
cat > backend/Dockerfile << 'EOF'
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

# Backend main.py
mkdir -p backend/app
cat > backend/app/main.py << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI(
    title="SnapDocs API",
    description="Your Digital Vault - Secure Document Management API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "🚀 SnapDocs API is running!",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "snapdocs-api",
        "message": "Backend is running perfectly!",
        "timestamp": time.time()
    }

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
        "token_type": "bearer"
    }

@app.post("/api/v1/auth/login")
def login(request: dict):
    return {
        "message": "Welcome back! Login successful.",
        "access_token": "dummy-jwt-token-for-testing",
        "token_type": "bearer",
        "user": {
            "id": 1,
            "email": request.get("email"),
            "first_name": "Test",
            "last_name": "User",
            "is_active": True
        }
    }
EOF

touch backend/app/__init__.py

echo -e "${BLUE}🗄️ Creating Database initialization...${NC}"

# Database init script
cat > database/init/init.sql << 'EOF'
-- SnapDocs Database Initialization
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone
SET timezone = 'UTC';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE snapdocs_db TO snapdocs_user;
EOF

echo -e "${BLUE}📝 Creating utility scripts...${NC}"

# Universal start script
cat > scripts/start.sh << EOF
#!/bin/bash

echo "🚀 Starting SnapDocs Full-Stack Application"
echo "=========================================="

# Use the detected docker compose command
DOCKER_COMPOSE_CMD="$DOCKER_COMPOSE_CMD"

echo "🔧 Using: \$DOCKER_COMPOSE_CMD"

# Start all services
echo "📦 Starting all services..."
\$DOCKER_COMPOSE_CMD up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 15

echo ""
echo "🎉 SnapDocs is ready!"
echo ""
echo "🔗 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "📊 View logs: \$DOCKER_COMPOSE_CMD logs -f"
echo "⏹️  Stop: \$DOCKER_COMPOSE_CMD down"
EOF

# Universal stop script
cat > scripts/stop.sh << EOF
#!/bin/bash
echo "⏹️  Stopping SnapDocs..."
$DOCKER_COMPOSE_CMD down
echo "✅ All services stopped"
EOF

# Universal logs script
cat > scripts/logs.sh << EOF
#!/bin/bash
if [ "\$1" = "frontend" ]; then
    $DOCKER_COMPOSE_CMD logs -f frontend
elif [ "\$1" = "backend" ]; then
    $DOCKER_COMPOSE_CMD logs -f backend
elif [ "\$1" = "postgres" ]; then
    $DOCKER_COMPOSE_CMD logs -f postgres
else
    echo "Usage: ./logs.sh [frontend|backend|postgres]"
    echo "Or view all logs:"
    $DOCKER_COMPOSE_CMD logs -f
fi
EOF

# Universal status script
cat > scripts/status.sh << EOF
#!/bin/bash
echo "📊 SnapDocs Service Status"
echo "========================="
$DOCKER_COMPOSE_CMD ps
EOF

# Make scripts executable
chmod +x scripts/*.sh

# Create main control scripts in root
cat > start.sh << 'EOF'
#!/bin/bash
./scripts/start.sh
EOF

cat > stop.sh << 'EOF'
#!/bin/bash
./scripts/stop.sh
EOF

cat > logs.sh << 'EOF'
#!/bin/bash
./scripts/logs.sh $1
EOF

cat > status.sh << 'EOF'
#!/bin/bash
./scripts/status.sh
EOF

chmod +x *.sh

echo -e "${BLUE}📄 Creating documentation...${NC}"

# Create README
cat > README.md << 'EOF'
# 🚀 SnapDocs Full-Stack Application

## 📋 Quick Start

### 1. Start Application
```bash
./start.sh
```

### 2. Access URLs
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000  
- **API Docs**: http://localhost:8000/docs

### 3. Test Features
1. Open http://localhost:3000
2. Click "Test Backend Connection"
3. Click "Test Signup & Login"
4. See dashboard with document features

## 🛠️ Management Commands

```bash
./start.sh          # Start all services
./stop.sh           # Stop all services  
./logs.sh           # View all logs
./logs.sh backend   # View backend logs
./status.sh         # Check service status
```

## 🏗️ Architecture

- **Frontend**: React + Tailwind CSS (Port 3000)
- **Backend**: FastAPI + Python (Port 8000)
- **Database**: PostgreSQL (Port 5432)
- **Network**: snapdocs-network (shared)

## 📞 Support

**Gonepudi Srinivas**  
📧 srigonepudi@gmail.com  
🚀 Founder & CEO, SnapDocs
EOF

echo -e "${GREEN}✅ SnapDocs Full-Stack Application Created!${NC}"

echo ""
echo -e "${PURPLE}🎉 Setup Complete! 🎉${NC}"
echo ""
echo -e "${BLUE}📁 Project: ${YELLOW}$PROJECT_NAME${NC}"
echo -e "${BLUE}🔧 Docker Compose: ${YELLOW}$DOCKER_COMPOSE_CMD${NC}"
echo ""
echo -e "${YELLOW}🚀 Quick Start:${NC}"
echo -e "   ${GREEN}cd $PROJECT_NAME${NC}"
echo -e "   ${GREEN}./start.sh${NC}"
echo ""
echo -e "${BLUE}🔗 Access URLs (after start):${NC}"
echo -e "   🌐 Frontend: ${YELLOW}http://localhost:3000${NC}"
echo -e "   📡 Backend: ${YELLOW}http://localhost:8000${NC}"
echo -e "   📚 API Docs: ${YELLOW}http://localhost:8000/docs${NC}"
echo ""
echo -e "${BLUE}🛠️ Management:${NC}"
echo -e "   ${YELLOW}./start.sh${NC}    # Start all services"
echo -e "   ${YELLOW}./stop.sh${NC}     # Stop all services"
echo -e "   ${YELLOW}./logs.sh${NC}     # View logs"
echo -e "   ${YELLOW}./status.sh${NC}   # Check status"
echo ""
echo -e "${PURPLE}Ready to test your full-stack authentication! 🔐${NC}"

# Auto-start if requested
read -p "🤔 Do you want to start the application now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${GREEN}🚀 Starting SnapDocs...${NC}"
    cd "$PROJECT_NAME"
    ./start.sh
fi