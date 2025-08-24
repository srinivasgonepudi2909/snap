# Create this file as: backend/services/document-service/test_db.py

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.utils.config import client, db, documents_collection, folders_collection, settings

def test_database_connection():
    print("🔍 Testing database connection...")
    print(f"MongoDB URI: {settings.MONGO_URI}")
    
    try:
        if client is None:
            print("❌ Client is None - connection failed")
            return False
        
        # Test ping
        result = client.admin.command('ping')
        print(f"✅ Ping result: {result}")
        
        # List databases
        databases = client.list_database_names()
        print(f"📚 Available databases: {databases}")
        
        if db is None:
            print("❌ Database is None")
            return False
            
        # List collections
        collections = db.list_collection_names()
        print(f"📋 Collections in 'snapdocs' database: {collections}")
        
        # Test collections
        if folders_collection is not None:
            folder_count = folders_collection.estimated_document_count()
            print(f"📁 Folders collection: {folder_count} documents")
            
            # Try to insert a test folder
            test_folder = {
                "name": "TEST_FOLDER_DELETE_ME",
                "description": "Test folder",
                "color": "#FF0000",
                "icon": "🧪",
                "created_at": "2024-01-01",
                "document_count": 0
            }
            
            result = folders_collection.insert_one(test_folder)
            print(f"✅ Test folder inserted with ID: {result.inserted_id}")
            
            # Delete the test folder
            folders_collection.delete_one({"_id": result.inserted_id})
            print("🗑️ Test folder deleted")
            
        else:
            print("❌ Folders collection is None")
            return False
            
        print("✅ Database connection test PASSED")
        return True
        
    except Exception as e:
        print(f"❌ Database connection test FAILED: {str(e)}")
        return False

if __name__ == "__main__":
    test_database_connection()