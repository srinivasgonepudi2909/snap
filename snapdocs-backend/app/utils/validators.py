import re
from typing import Optional
from email_validator import validate_email, EmailNotValidError

def validate_email_address(email: str) -> bool:
    """Validate email address format."""
    try:
        validate_email(email)
        return True
    except EmailNotValidError:
        return False

def validate_password_strength(password: str) -> dict:
    """Validate password strength and return detailed feedback."""
    result = {
        "is_valid": True,
        "errors": [],
        "suggestions": []
    }
    
    if len(password) < 8:
        result["is_valid"] = False
        result["errors"].append("Password must be at least 8 characters long")
    
    if not re.search(r"[A-Z]", password):
        result["suggestions"].append("Add uppercase letters for stronger security")
    
    if not re.search(r"[a-z]", password):
        result["suggestions"].append("Add lowercase letters for stronger security")
    
    if not re.search(r"\d", password):
        result["suggestions"].append("Add numbers for stronger security")
    
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        result["suggestions"].append("Add special characters for stronger security")
    
    return result

def validate_phone_number(phone: str, country_code: Optional[str] = None) -> bool:
    """Validate phone number format."""
    if not phone:
        return True  # Phone is optional
    
    # Remove any non-digit characters
    digits_only = re.sub(r'[^\d]', '', phone)
    
    # Check if it has minimum required digits
    if len(digits_only) < 10:
        return False
    
    # Country-specific validation can be added here
    return True

def validate_name(name: str) -> bool:
    """Validate name format."""
    if not name or len(name.strip()) == 0:
        return False
    
    # Check for valid characters (letters, spaces, hyphens, apostrophes)
    if not re.match(r"^[a-zA-Z\s\-']+$", name.strip()):
        return False
    
    return True
