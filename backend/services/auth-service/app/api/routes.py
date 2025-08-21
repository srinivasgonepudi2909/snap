from fastapi import APIRouter, HTTPException, status
from app.models.user import UserSignup, UserLogin, TokenResponse
from app.services.auth import get_current_user
from fastapi import Depends
from fastapi import APIRouter, Depends
from app.services.auth import get_current_user
from app.models.user import User
from app.services.auth import get_user_by_email, verify_password
from app.services.jwt_handler import create_access_token  # or wherever you added it

auth_router = APIRouter()

@auth_router.post("/signup", status_code=201)
def register_user(user: UserSignup):
    # Later: hash password & save to MongoDB
    return {"message": f"User {user.email} registered successfully!"}

@auth_router.post("/login", response_model=TokenResponse)
def login_user(user: UserLogin):
    # Later: verify credentials, return real JWT
    return TokenResponse(access_token="fake-jwt-token-for-now")

@auth_router.get("/dashboard")
def get_dashboard(current_user: str = Depends(get_current_user)):
    return {"message": f"Welcome back, {current_user}!"}

@auth_router.get("/me", response_model=User)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/login")
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = get_user_by_email(db, user_credentials.email)
    if not user or not verify_password(user_credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}