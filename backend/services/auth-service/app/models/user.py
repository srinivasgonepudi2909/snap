from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
import re

class User(BaseModel):
    id: Optional[str] = Field(default=None)
    email: EmailStr
    
    class Config:
        allow_population_by_field_name = True
        extra = "ignore"

class UserSignup(BaseModel):
    username: str = Field(..., min_length=3, max_length=30)
    email: EmailStr
    password: str = Field(..., min_length=8)
    
    @validator('username')
    def validate_username(cls, v):
        if not re.match(r'^[a-zA-Z0-9_ ]+$', v):
            raise ValueError('Username can only contain letters, numbers, spaces, and underscores')
        return v
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one capital letter')
        
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        
        if not re.search(r'[!@#$%^&*()_+\-=\[\]{};:\'",.<>?/\\|`~]', v):
            raise ValueError('Password must contain at least one special character')
        
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: Optional[str] = None
    message: Optional[str] = None

class UserResponse(BaseModel):
    success: bool = True
    message: str
    user: Optional[dict] = None