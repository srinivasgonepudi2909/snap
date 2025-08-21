from app.utils.config import user_collection
from app.utils.hash import hash_password, verify_password
from app.services.jwt_handler import create_access_token
from app.models.user import UserSignup, UserLogin
from fastapi import HTTPException, status
from fastapi import Depends
from app.services.jwt_handler import decode_access_token, oauth2_scheme
from datetime import datetime, timedelta
from jose import jwt
from app.utils.config import settings
from app.models.user import User  # Add this if not already
from fastapi import HTTPException
from bson import ObjectId



def signup_user(user: UserSignup):
    if user_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = hash_password(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed

    user_collection.insert_one(user_dict)
    return {"message": "User registered successfully"}

def login_user(user: UserLogin):
    found = user_collection.find_one({"email": user.email})
    if not found:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(user.password, found["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def get_user_by_email(email: str):
    return user_collection.find_one({"email": email})

def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    payload = decode_access_token(token)
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_data = user_collection.find_one({"email": email})
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    return User(
        id=str(user_data.get("_id")),  # Convert ObjectId to string
        email=user_data["email"]
    )

