#!/bin/bash

# SnapDocs Backend Folder Structure Creation Script
# This script creates the complete backend folder structure for SnapDocs

set -e

echo "🚀 SnapDocs Backend - Folder Structure Creation"
echo "==============================================="
echo "📁 Creating Python FastAPI backend structure with PostgreSQL"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
BACKEND_DIR="snapdocs-backend"

echo -e "${BLUE}📁 Creating main backend directory: ${BACKEND_DIR}${NC}"

# Remove existing directory if it exists
if [ -d "$BACKEND_DIR" ]; then
    echo -e "${YELLOW}⚠️  Directory $BACKEND_DIR already exists. Removing...${NC}"
    rm -rf "$BACKEND_DIR"
fi

# Create main backend directory
mkdir -p "$BACKEND_DIR"
cd "$BACKEND_DIR"

echo -e "${BLUE}📂 Creating app directory structure...${NC}"

# Create main app structure
mkdir -p app
mkdir -p app/config
mkdir -p app/models
mkdir -p app/schemas
mkdir -p app/api
mkdir -p app/api/v1
mkdir -p app/api/v1/endpoints
mkdir -p app/services
mkdir -p app/utils
mkdir -p app/middleware

# Create additional directories
mkdir -p tests
mkdir -p alembic
mkdir -p alembic/versions
mkdir -p logs
mkdir -p scripts

echo -e "${BLUE}📄 Creating __init__.py files...${NC}"

# Create __init__.py files for proper Python package structure
touch app/__init__.py
touch app/config/__init__.py
touch app/models/__init__.py
touch app/schemas/__init__.py
touch app/api/__init__.py
touch app/api/v1/__init__.py
touch app/api/v1/endpoints/__init__.py
touch app/services/__init__.py
touch app/utils/__init__.py
touch app/middleware/__init__.py
touch tests/__init__.py

echo -e "${BLUE}📄 Creating empty Python files...${NC}"

# Create main application files
touch app/main.py

# Config files
touch app/config/settings.py
touch app/config/database.py

# Model files
touch app/models/base.py
touch app/models/user.py

# Schema files
touch app/schemas/auth.py
touch app/schemas/user.py

# API endpoint files
touch app/api/v1/api.py
touch app/api/v1/endpoints/auth.py
touch app/api/v1/endpoints/users.py

# Service files
touch app/services/auth_service.py
touch app/services/user_service.py

# Utility files
touch app/utils/security.py
touch app/utils/validators.py
touch app/utils/exceptions.py

# Middleware files
touch app/middleware/cors.py
touch app/middleware/auth.py

# Test files
touch tests/conftest.py
touch tests/test_auth.py
touch tests/test_users.py

echo -e "${BLUE}📄 Creating configuration files...${NC}"

# Create requirements.txt
touch requirements.txt

# Create Dockerfile
touch Dockerfile

# Create docker-compose.yml
touch docker-compose.yml

# Create alembic configuration
touch alembic.ini

# Create environment files
touch .env.example
touch .env

# Create other important files
touch .gitignore
touch .dockerignore
touch README.md

# Create scripts
touch scripts/init_db.py
touch scripts/create_admin.py

echo -e "${BLUE}📋 Creating project documentation files...${NC}"

# Create README.md with basic content
cat > README.md << 'EOF'
# SnapDocs Backend API

## 🚀 Your Digital Vault - Backend API

This is the backend API for SnapDocs, a secure document management system.

## 📁 Project Structure

```
snapdocs-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app entry point
│   ├── config/
│   │   ├── __init__.py
│   │   ├── database.py            # Database connection
│   │   └── settings.py            # Environment configuration
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py                # User SQLAlchemy model
│   │   └── base.py                # Base model
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py                # Pydantic schemas for user
│   │   └── auth.py                # Authentication schemas
│   ├── api/
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── api.py             # Main API router
│   │   │   └── endpoints/
│   │   │       ├── __init__.py
│   │   │       ├── auth.py        # Login/Signup endpoints
│   │   │       └── users.py       # User management endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py        # Authentication business logic
│   │   └── user_service.py        # User business logic
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── security.py            # Password hashing, JWT tokens
│   │   ├── validators.py          # Input validation utilities
│   │   └── exceptions.py          # Custom exceptions
│   └── middleware/
│       ├── __init__.py
│       ├── cors.py                # CORS middleware
│       └── auth.py                # JWT authentication middleware
├── alembic/                       # Database migrations
│   ├── versions/
│   ├── env.py
│   └── script.py.mako
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py
│   └── test_users.py
├── scripts/
│   ├── init_db.py
│   └── create_admin.py
├── logs/
├── requirements.txt               # Python dependencies
├── Dockerfile                     # Docker configuration
├── docker-compose.yml            # Docker compose for local development
├── alembic.ini                   # Alembic configuration
├── .env.example                  # Environment variables example
├── .gitignore
└── README.md
```

## 🛠️ Tech Stack

- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Database
- **SQLAlchemy** - ORM
- **Alembic** - Database migrations
- **JWT** - Authentication
- **Docker** - Containerization
- **Pytest** - Testing

## 🚀 Quick Start

### Development Setup

1. **Clone and setup**
   ```bash
   cd snapdocs-backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Database Setup**
   ```bash
   # Start PostgreSQL with Docker
   docker-compose up postgres -d
   
   # Run migrations
   alembic upgrade head
   ```

3. **Start Development Server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Docker Setup

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login

### Health Check
- `GET /` - API welcome message
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation

## 🔐 Authentication Flow

1. **Signup**: User provides details → Validate → Hash password → Store in DB → Return JWT token
2. **Login**: User provides email/password → Validate → Check password → Generate JWT → Return token
3. **Protected Routes**: Verify JWT token → Extract user info → Allow access

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    phone_number VARCHAR,
    country_code VARCHAR,
    password_hash VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 Environment Variables

Create `.env` file:
```env
DATABASE_URL=postgresql://snapdocs_user:snapdocs_password@localhost:5432/snapdocs_db
SECRET_KEY=your-super-secret-jwt-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
APP_NAME=SnapDocs API
DEBUG=true
```

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app tests/
```

## 📊 Development Commands

```bash
# Create new migration
alembic revision --autogenerate -m "Add new table"

# Apply migrations
alembic upgrade head

# Downgrade migration
alembic downgrade -1

# Check database
docker exec -it snapdocs-postgres psql -U snapdocs_user -d snapdocs_db
```

## 🐳 Docker Commands

```bash
# Build backend image
docker build -t snapdocs-backend .

# Start only database
docker-compose up postgres -d

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Reset database
docker-compose down -v
docker-compose up postgres -d
```

## 📞 Contact

**Gonepudi Srinivas**  
Email: srigonepudi@gmail.com  
Role: Founder & CEO, SnapDocs

---

Built with ❤️ for secure document management.
EOF

echo -e "${GREEN}✅ Folder structure created successfully!${NC}"

echo ""
echo -e "${PURPLE}📊 Backend Directory Structure Summary:${NC}"
echo ""

# Display the created structure
tree -a . 2>/dev/null || find . -type d -exec echo "📁 {}" \; && find . -type f -exec echo "📄 {}" \;

echo ""
echo -e "${GREEN}🎉 SnapDocs Backend Structure Complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo -e "   1. ${YELLOW}cd $BACKEND_DIR${NC}"
echo -e "   2. ${YELLOW}Create virtual environment: python -m venv venv${NC}"
echo -e "   3. ${YELLOW}Activate virtual environment: source venv/bin/activate${NC}"
echo -e "   4. ${YELLOW}Install dependencies: pip install -r requirements.txt${NC}"
echo -e "   5. ${YELLOW}Configure .env file${NC}"
echo -e "   6. ${YELLOW}Start development: uvicorn app.main:app --reload${NC}"
echo ""
echo -e "${BLUE}🐳 Docker Setup:${NC}"
echo -e "   ${YELLOW}docker-compose up -d${NC} - Start all services"
echo -e "   ${YELLOW}docker-compose logs -f backend${NC} - View logs"
echo ""
echo -e "${BLUE}📡 API Access:${NC}"
echo -e "   🌐 API: ${YELLOW}http://localhost:8000${NC}"
echo -e "   📚 Docs: ${YELLOW}http://localhost:8000/docs${NC}"
echo -e "   🔍 Health: ${YELLOW}http://localhost:8000/health${NC}"
echo ""
echo -e "${PURPLE}Ready to implement login/signup functionality! 🚀${NC}"