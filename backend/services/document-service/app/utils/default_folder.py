# backend/services/document-service/app/utils/default_folder.py
from datetime import datetime
from app.utils.config import folders_collection

def ensure_general_folder_exists():
    """
    Ensures that a default "General" folder exists in the database.
    Creates it if it doesn't exist.
    """
    try:
        # Check if General folder already exists
        existing_general = folders_collection.find_one({"name": "General"})
        
        if not existing_general:
            print("📁 Creating default 'General' folder...")
            
            # Create the default General folder
            general_folder = {
                "name": "General",
                "description": "Default folder for documents uploaded directly to dashboard",
                "color": "#6B7280",  # Gray color
                "icon": "📂",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "document_count": 0,
                "is_default": True  # Mark as default folder
            }
            
            result = folders_collection.insert_one(general_folder)
            print(f"✅ General folder created with ID: {result.inserted_id}")
            return True
        else:
            print("📂 General folder already exists")
            return True
            
    except Exception as e:
        print(f"❌ Error creating General folder: {str(e)}")
        return False

def get_or_create_general_folder():
    """
    Gets the General folder, creating it if it doesn't exist.
    Returns the General folder document.
    """
    try:
        # Try to find existing General folder
        general_folder = folders_collection.find_one({"name": "General"})
        
        if not general_folder:
            # Create it if it doesn't exist
            ensure_general_folder_exists()
            general_folder = folders_collection.find_one({"name": "General"})
        
        return general_folder
        
    except Exception as e:
        print(f"❌ Error getting General folder: {str(e)}")
        return None