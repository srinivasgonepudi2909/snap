# 🚀 SnapDocs - Complete Full-Stack Application

## 📋 Overview

SnapDocs is a secure document management system built with:
- **Frontend**: React 18 with Tailwind CSS
- **Backend**: FastAPI with Python
- **Database**: PostgreSQL
- **Deployment**: Docker & Docker Compose

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   React App     │◄──►│   FastAPI       │◄──►│   PostgreSQL    │
│   (Frontend)    │    │   (Backend)     │    │   (Database)    │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 5432    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │                 │
                    │  Nginx Proxy    │
                    │  Port: 80       │
                    │                 │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### 1. Clone & Setup
```bash
git clone <your-repo>
cd snapdocs-fullstack
```

### 2. Start All Services
```bash
# Start all containers (Database + Backend + Frontend)
docker-compose up -d

# View logs
docker-compose logs -f
```

### 3. Access Applications
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Full App (via Nginx)**: http://localhost

## 📁 Project Structure

```
snapdocs-fullstack/
├── frontend/                   # React application
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Tailwind CSS
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── Dockerfile             # Frontend container
│   ├── nginx.conf             # Frontend nginx config
│   └── package.json           # Dependencies
├── backend/                    # FastAPI application
│   ├── app/
│   │   ├── main.py            # FastAPI entry point
│   │   ├── config/            # Configuration
│   │   ├── models/            # Database models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── api/v1/endpoints/  # API routes
│   │   ├── services/          # Business logic
│   │   └── utils/             # Utilities
│   ├── Dockerfile             # Backend container
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
├── database/
│   └── init/
│       └── init.sql           # Database initialization
├── shared/
│   └── nginx/
│       └── nginx.conf         # Reverse proxy config
└── docker-compose.yml         # Multi-container orchestration
```

## 🔐 Authentication Features

### Frontend
- **React Components**: Login/Signup forms with validation
- **State Management**: JWT token storage and user state
- **API Integration**: Axios for HTTP requests
- **UI Components**: Modern design with Tailwind CSS

### Backend
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Pydantic schemas
- **Database Models**: SQLAlchemy ORM

### API Endpoints
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login  
- `GET /api/v1/auth/me` - Get current user
- `GET /health` - Health check
- `GET /docs` - API documentation

## 🗄️ Database Schema

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    country_code VARCHAR(10),
    password_hash VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🐳 Docker Commands

### Start Services
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d postgres
docker-compose up -d backend
docker-compose up -d frontend
```

### Monitor Services
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Manage Services
```bash
# Stop all services
docker-compose down

# Restart services
docker-compose restart

# Rebuild and start
docker-compose up -d --build

# Reset everything (including volumes)
docker-compose down -v
docker-compose up -d --build
```

### Database Commands
```bash
# Connect to PostgreSQL
docker exec -it snapdocs-postgres psql -U snapdocs_user -d snapdocs_db

# View database
\dt                 # List tables
\d users           # Describe users table
SELECT * FROM users; # Query users
```

## 🔧 Development

### Local Development
```bash
# Frontend (React)
cd frontend
npm install
npm start           # http://localhost:3000

# Backend (FastAPI)
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000  # http://localhost:8000
```

### Environment Variables
```bash
# Backend (.env)
DATABASE_URL=postgresql://snapdocs_user:snapdocs_password@postgres:5432/snapdocs_db
SECRET_KEY=your-secret-key
DEBUG=true
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
```bash
# Health check
curl http://localhost:8000/health

# Test signup
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","first_name":"Test","last_name":"User","password":"password123"}'
```

## 🚀 Production Deployment

### Environment Setup
1. **Update environment variables**
2. **Configure SSL certificates**
3. **Set up domain names**
4. **Configure firewall rules**

### Deploy with Docker Compose
```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Service Health Checks

All services include health checks:
- **Frontend**: HTTP check on port 80
- **Backend**: HTTP check on /health endpoint
- **Database**: PostgreSQL connection check

## 🔗 Network Configuration

All services run in a custom Docker network `snapdocs-network`:
- **Subnet**: 172.20.0.0/16
- **Inter-service communication**: Via service names
- **External access**: Via exposed ports

## 📞 Support

**Gonepudi Srinivas**  
Founder & CEO, SnapDocs  
📧 Email: srigonepudi@gmail.com  

## 📝 License

Built with ❤️ for secure document management.
