from sqlalchemy.orm import Session
from typing import Optional
from app.models.user import User
from app.schemas.auth import UserSignup
from app.schemas.user import UserUpdate
from app.utils.security import get_password_hash, verify_password
from app.utils.exceptions import UserAlreadyExistsError, UserNotFoundError

class UserService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email address."""
        return self.db.query(User).filter(User.email == email.lower()).first()
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return self.db.query(User).filter(User.id == user_id).first()
    
    def create_user(self, user_data: UserSignup) -> User:
        """Create a new user account."""
        # Check if user already exists
        existing_user = self.get_user_by_email(user_data.email)
        if existing_user:
            raise UserAlreadyExistsError(
                detail=f"User with email {user_data.email} already exists"
            )
        
        # Hash the password
        password_hash = get_password_hash(user_data.password)
        
        # Create new user
        db_user = User(
            email=user_data.email.lower(),
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            phone_number=user_data.phone_number,
            country_code=user_data.country_code,
            password_hash=password_hash,
            is_active=True
        )
        
        # Save to database
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        
        return db_user
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password."""
        user = self.get_user_by_email(email)
        if not user:
            return None
        
        if not user.is_active:
            return None
            
        if not verify_password(password, user.password_hash):
            return None
            
        return user
    
    def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[User]:
        """Update user information."""
        user = self.get_user_by_id(user_id)
        if not user:
            raise UserNotFoundError()
        
        # Update fields if provided
        update_data = user_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        
        self.db.commit()
        self.db.refresh(user)
        
        return user
    
    def deactivate_user(self, user_id: int) -> bool:
        """Deactivate user account."""
        user = self.get_user_by_id(user_id)
        if not user:
            raise UserNotFoundError()
        
        user.is_active = False
        self.db.commit()
        
        return True
    
    def get_user_count(self) -> int:
        """Get total number of users."""
        return self.db.query(User).count()
    
    def get_active_user_count(self) -> int:
        """Get number of active users."""
        return self.db.query(User).filter(User.is_active == True).count()
