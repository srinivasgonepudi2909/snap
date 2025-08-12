from pydantic import BaseModel, EmailStr, validator, Field
from typing import Optional

class UserSignup(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    first_name: str = Field(..., min_length=1, max_length=50, description="User's first name")
    last_name: str = Field(..., min_length=1, max_length=50, description="User's last name")
    phone_number: Optional[str] = Field(None, max_length=20, description="User's phone number")
    country_code: Optional[str] = Field(None, max_length=10, description="Country code for phone")
    password: str = Field(..., min_length=8, description="User's password")
    
    @validator('first_name', 'last_name')
    def name_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip().title()
    
    @validator('password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v
    
    @validator('phone_number')
    def validate_phone(cls, v):
        if v is not None and v.strip():
            # Remove any non-digit characters for validation
            digits_only = ''.join(filter(str.isdigit, v))
            if len(digits_only) < 10:
                raise ValueError('Phone number must be at least 10 digits')
        return v

class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: dict

class TokenData(BaseModel):
    email: Optional[str] = None

class UserSignupResponse(BaseModel):
    message: str
    user: dict
    access_token: str
    token_type: str
    expires_in: int

class UserLoginResponse(BaseModel):
    message: str
    access_token: str
    token_type: str
    expires_in: int
    user: dict
