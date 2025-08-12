#!/usr/bin/env python3
"""
Initialize SnapDocs database with tables and sample data.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from app.config.database import Base
from app.config.settings import settings
from app.models.user import User

def init_database():
    """Initialize database with tables."""
    print("🗄️ Initializing SnapDocs database...")
    
    # Create engine
    engine = create_engine(settings.database_url)
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    print("✅ Database initialized successfully!")
    print(f"📊 Tables created:")
    print(f"   - users")
    
if __name__ == "__main__":
    init_database()
