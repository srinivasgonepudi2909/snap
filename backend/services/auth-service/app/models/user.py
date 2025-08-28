# backend/services/auth-service/app/models/user.py - ENHANCED VERSION

from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
import re

# Main user model used in responses and token decoding
class User(BaseModel):
    id: Optional[str] = Field(default=None)
    email: EmailStr
    username: Optional[str] = None
    
    class Config:
        allow_population_by_field_name = True
        extra = "ignore"

# Enhanced user signup model with validation
class UserSignup(BaseModel):
    username: str = Field(..., min_length=3, max_length=30)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str = Field(..., min_length=8, max_length=128)
    
    @validator('username')
    def validate_username(cls, v):
        # Remove leading/trailing whitespace
        v = v.strip()
        
        # Check minimum length after stripping
        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters long')
        
        # Check for valid characters (alphanumeric and underscore only)
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Username can only contain letters, numbers, and underscores')
        
        # Cannot start with number
        if v[0].isdigit():
            raise ValueError('Username cannot start with a number')
            
        return v
    
    @validator('email')
    def validate_email(cls, v):
        # Convert to lowercase and strip whitespace
        return v.lower().strip()
    
    @validator('password')
    def validate_password_policy(cls, v):
        errors = []
        
        # Check minimum length
        if len(v) < 8:
            errors.append("Password must be at least 8 characters long")
        
        # Check for uppercase letter
        if not re.search(r'[A-Z]', v):
            errors.append("Password must contain at least one uppercase letter")
        
        # Check for lowercase letter  
        if not re.search(r'[a-z]', v):
            errors.append("Password must contain at least one lowercase letter")
        
        # Check for number
        if not re.search(r'\d', v):
            errors.append("Password must contain at least one number")
        
        # Check for special character
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            errors.append("Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)")
        
        if errors:
            raise ValueError("; ".join(errors))
            
        return v
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v

# Used for user login requests
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
    @validator('email')
    def validate_email(cls, v):
        return v.lower().strip()

# Used for token response after login
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: Optional[str] = None

# Password policy check model
class PasswordPolicyCheck(BaseModel):
    password: str
    
    class Config:
        schema_extra = {
            "example": {
                "password": "MySecure123!"
            }
        }

# Email/Username availability check models
class EmailAvailabilityCheck(BaseModel):
    email: EmailStr
    
    @validator('email')
    def validate_email(cls, v):
        return v.lower().strip()

class UsernameAvailabilityCheck(BaseModel):
    username: str = Field(..., min_length=3, max_length=30)
    
    @validator('username')
    def validate_username(cls, v):
        v = v.strip()
        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters long')
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Username can only contain letters, numbers, and underscores')
        if v[0].isdigit():
            raise ValueError('Username cannot start with a number')
        return v

# Response models for API
class PasswordPolicyResponse(BaseModel):
    success: bool
    data: dict

class AvailabilityResponse(BaseModel):
    success: bool
    data: dict

class SignupResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None