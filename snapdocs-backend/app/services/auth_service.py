from datetime import timedelta
from sqlalchemy.orm import Session
from app.services.user_service import UserService
from app.schemas.auth import UserSignup, UserLogin, UserSignupResponse, UserLoginResponse
from app.schemas.user import UserPublic
from app.utils.security import create_access_token
from app.utils.exceptions import InvalidCredentialsError, InactiveUserError
from app.config.settings import settings

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_service = UserService(db)
    
    def signup_user(self, user_data: UserSignup) -> UserSignupResponse:
        """Register a new user account."""
        # Create the user
        user = self.user_service.create_user(user_data)
        
        # Generate access token
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            subject=user.email, 
            expires_delta=access_token_expires
        )
        
        # Prepare user data for response
        user_data = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": user.phone_number,
            "country_code": user.country_code,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat()
        }
        
        return UserSignupResponse(
            message="Account created successfully! Welcome to SnapDocs!",
            user=user_data,
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.access_token_expire_minutes * 60  # in seconds
        )
    
    def login_user(self, login_data: UserLogin) -> UserLoginResponse:
        """Authenticate and login user."""
        # Authenticate user
        user = self.user_service.authenticate_user(
            login_data.email, 
            login_data.password
        )
        
        if not user:
            raise InvalidCredentialsError(
                detail="Invalid email or password. Please check your credentials."
            )
        
        if not user.is_active:
            raise InactiveUserError(
                detail="Your account is inactive. Please contact support."
            )
        
        # Generate access token
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            subject=user.email, 
            expires_delta=access_token_expires
        )
        
        # Prepare user data for response
        user_data = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": user.phone_number,
            "country_code": user.country_code,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat()
        }
        
        return UserLoginResponse(
            message=f"Welcome back, {user.first_name}! Login successful.",
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.access_token_expire_minutes * 60,  # in seconds
            user=user_data
        )
    
    def verify_token_and_get_user(self, token: str):
        """Verify JWT token and return user."""
        from app.utils.security import verify_token
        
        email = verify_token(token)
        if not email:
            return None
        
        user = self.user_service.get_user_by_email(email)
        return user
