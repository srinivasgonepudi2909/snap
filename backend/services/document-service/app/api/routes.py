# app/api/routes.py

from fastapi import APIRouter, HTTPException, status

documents_router = APIRouter(tags=["documents"])

# Basic test endpoints (no authentication required for now)

@documents_router.get("/test")
async def test_endpoint():
    """Test endpoint to verify service is working"""
    return {
        "success": True,
        "message": "Document service is working! 🚀",
        "service": "document-service",
        "version": "1.0.0"
    }

@documents_router.get("/test/database")
async def test_database_endpoint():
    """Test endpoint to verify database connection"""
    try:
        # Try to import and test database
        from app.utils.config import documents_collection, folders_collection
        
        if documents_collection is None:
            return {
                "success": False,
                "message": "Database connection not available",
                "status": "disconnected"
            }
        
        # Test database connection with a simple operation
        result = documents_collection.find_one({}, {"_id": 1})
        
        # Get collection stats
        doc_count = documents_collection.estimated_document_count()
        folder_count = folders_collection.estimated_document_count() if folders_collection is not None else 0
        
        return {
            "success": True,
            "message": "Database connection is working! 🗄️",
            "database": "snapdocs",
            "collections": {
                "documents": doc_count,
                "folders": folder_count
            },
            "status": "connected"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Database error: {str(e)}",
            "status": "error"
        }

@documents_router.get("/folders")
async def list_folders():
    """List all folders (no auth for testing)"""
    try:
        from app.utils.config import folders_collection
        
        if folders_collection is None:
            return {
                "success": False,
                "message": "Database not available",
                "data": []
            }
        
        folders = list(folders_collection.find({}).limit(10))  # Limit to 10 for testing
        
        # Convert ObjectId to string for JSON serialization
        for folder in folders:
            folder["_id"] = str(folder["_id"])
        
        return {
            "success": True,
            "message": f"Found {len(folders)} folders",
            "data": folders
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error fetching folders: {str(e)}",
            "data": []
        }

@documents_router.get("/documents")
async def list_documents():
    """List all documents (no auth for testing)"""
    try:
        from app.utils.config import documents_collection
        
        if documents_collection is None:
            return {
                "success": False,
                "message": "Database not available",
                "data": []
            }
        
        documents = list(documents_collection.find({}).limit(10))  # Limit to 10 for testing
        
        # Convert ObjectId to string for JSON serialization
        for doc in documents:
            doc["_id"] = str(doc["_id"])
        
        return {
            "success": True,
            "message": f"Found {len(documents)} documents",
            "data": documents
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error fetching documents: {str(e)}",
            "data": []
        }

@documents_router.get("/info")
async def service_info():
    """Service information endpoint"""
    import os
    return {
        "service": "document-service",
        "version": "1.0.0",
        "status": "running",
        "upload_directory": os.path.abspath("./uploads"),
        "endpoints": {
            "test": "/api/v1/test",
            "database_test": "/api/v1/test/database", 
            "folders": "/api/v1/folders",
            "documents": "/api/v1/documents"
        }
    }