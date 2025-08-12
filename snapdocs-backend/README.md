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
