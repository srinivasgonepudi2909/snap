
---

## 🧩 Backend Setup – Phase 3: Auth API Layer

In this phase, we’ve implemented the actual user-facing API endpoints for authentication using FastAPI.

---

### ✅ 1. Create User Schemas

📁 `app/models/user.py`

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
These Pydantic models ensure all inputs and outputs are validated before processing.

---

### ✅ 2. Add Auth Routes

📁 `app/api/routes.py`

```python
from fastapi import APIRouter, HTTPException, status
from app.models.user import UserSignup, UserLogin, TokenResponse

auth_router = APIRouter()

@auth_router.post("/signup", status_code=201)
def register_user(user: UserSignup):
    return {"message": f"User {user.email} registered successfully!"}

@auth_router.post("/login", response_model=TokenResponse)
def login_user(user: UserLogin):
    return TokenResponse(access_token="fake-jwt-token-for-now")
```
Right now, the logic is mocked. You'll see real MongoDB + JWT handling in the next phase.

---

### ✅ 3. Connect Routes to FastAPI

Update `app/main.py` to include the router:

```python
from app.api.routes import auth_router

app.include_router(auth_router)
```

---

### 🚀 Test the API

1. Run the server:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

2. Visit Swagger UI:

```
http://<your-ec2-ip>:8000/docs
```

3. Try these endpoints:

- `POST /signup` – Accepts JSON with `username`, `email`, and `password`
- `POST /login` – Accepts `email` and `password`, returns a dummy token

✅ If you see the endpoints working, you’re ready for the next step.

---

## 🔜 Coming in Phase 4

- Connect MongoDB and save registered users
- Hash passwords securely using `bcrypt`
- Generate and return JWT tokens on login
