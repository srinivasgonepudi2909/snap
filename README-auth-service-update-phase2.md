
---

## 🧩 Backend Setup – Phase 2: Starting the Auth Service

### ✅ 1. `main.py` – FastAPI Startup File

This file sets up the FastAPI app, CORS, and includes a `/health` check route.

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="SnapDocs Auth Service",
    description="Handles user registration and login",
    version="1.0.0"
)

# Allow frontend to connect
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    os.getenv("FRONTEND_URL")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "Auth service running 🛡️"}
```
---

### ✅ 2. `.env` File

Create a `.env` file in the root of your auth-service folder:

```env
FRONTEND_URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=supersecretkey
JWT_EXPIRE_MINUTES=60
```

---

### ✅ 3. Run the Server

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Then open in browser:

```
http://<your-ec2-ip>:8000/docs
```

You should see Swagger UI and a working `/health` endpoint 🎉

---

### ✅ 4. Add User Auth API Boilerplate

#### 📁 `app/models/user.py`

```python
from pydantic import BaseModel, EmailStr, Field

class UserSignup(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
```

#### 📁 `app/api/routes.py`

```python
from fastapi import APIRouter, HTTPException, status
from app.models.user import UserSignup, UserLogin, TokenResponse

auth_router = APIRouter()

@auth_router.post("/signup", status_code=201)
def register_user(user: UserSignup):
    return {"message": f"User {user.email} registered successfully!"}

@auth_router.post("/login", response_model=TokenResponse)
def login_user(user: UserLogin):
    return TokenResponse(access_token="dummy-token")
```

#### 📌 Add Router to `main.py`

At the bottom of your `main.py`, add:

```python
from app.api.routes import auth_router

app.include_router(auth_router)
```

---

## ✅ Coming Next

- MongoDB connection with user collection
- Password hashing with `bcrypt`
- JWT token generation and validation
