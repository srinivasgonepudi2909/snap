# backend/services/auth-service/app/models/user.py - COMPLETE FIX

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

# FIXED: Enhanced user signup model with proper validation
class UserSignup(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str = Field(..., min_length=8, max_length=128)  # CRITICAL: Must match frontend
    
    @validator('username')
    def validate_username(cls, v):
        # Remove leading/trailing whitespace
        v = v.strip()
        
        # Check minimum length after stripping
        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters long')
        
        # Allow letters, numbers, spaces, and basic punctuation for full names
        if not re.match(r'^[a-zA-Z0-9\s._-]+$', v):
            raise ValueError('Username can only contain letters, numbers, spaces, dots, underscores, and hyphens')
        
        # Ensure it's not just whitespace
        if not v.strip():
            raise ValueError('Username cannot be empty or just whitespace')
            
        return v
    
    @validator('email')
    def validate_email(cls, v):
        # Convert to lowercase and strip whitespace
        email = v.lower().strip()
        
        # Additional email validation
        if len(email) > 254:  # RFC 5321 limit
            raise ValueError('Email address is too long')
        
        return email
    
    @validator('password')
    def validate_password_policy(cls, v):
        """
        CRITICAL: This validation must match the frontend exactly
        """
        errors = []
        
        # Check minimum length
        if len(v) < 8:
            errors.append("Password must be at least 8 characters long")
        
        # Check maximum length
        if len(v) > 128:
            errors.append("Password must be less than 128 characters long")
        
        # Check for uppercase letter
        if not re.search(r'[A-Z]', v):
            errors.append("Password must contain at least one uppercase letter")
        
        # Check for lowercase letter  
        if not re.search(r'[a-z]', v):
            errors.append("Password must contain at least one lowercase letter")
        
        # Check for number
        if not re.search(r'\d', v):
            errors.append("Password must contain at least one number")
        
        # Check for special character - MUST match frontend exactly
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            errors.append("Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)")
        
        # Check for common weak passwords
        weak_passwords = ['password', '12345678', 'qwerty123', 'admin123']
        if v.lower() in weak_passwords:
            errors.append("Password is too common. Please choose a stronger password")
        
        if errors:
            raise ValueError("; ".join(errors))
            
        return v
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        """
        CRITICAL: Validate that passwords match
        """
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v
    
    class Config:
        # Enable validation on assignment
        validate_assignment = True
        # Provide example for documentation
        schema_extra = {
            "example": {
                "username": "John Doe",
                "email": "john.doe@example.com",
                "password": "SecurePass123!",
                "confirm_password": "SecurePass123!"
            }
        }

# Used for user login requests
class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)
    
    @validator('email')
    def validate_email(cls, v):
        return v.lower().strip()
    
    @validator('password')
    def validate_password_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Password cannot be empty')
        return v

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
    username: str = Field(..., min_length=3, max_length=50)
    
    @validator('username')
    def validate_username(cls, v):
        v = v.strip()
        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters long')
        if not re.match(r'^[a-zA-Z0-9\s._-]+$', v):
            raise ValueError('Username can only contain letters, numbers, spaces, dots, underscores, and hyphens')
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

# Error response model
class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    detail: Optional[dict] = None
    error_type: Optional[str] = None

# Success response model
class SuccessResponse(BaseModel):
    success: bool = True
    message: str
    data: Optional[dict] = None