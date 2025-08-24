# app/utils/file_handler.py

import os
import uuid
import aiofiles
from pathlib import Path
from typing import Optional
from fastapi import UploadFile, HTTPException

class FileHandler:
    def __init__(self, upload_directory: str, max_file_size: int, allowed_extensions: list):
        self.upload_directory = Path(upload_directory)
        self.max_file_size = max_file_size
        self.allowed_extensions = [ext.lower() for ext in allowed_extensions]
        
        # Create upload directory if it doesn't exist
        self.upload_directory.mkdir(parents=True, exist_ok=True)
    
    def validate_file(self, file: UploadFile) -> bool:
        """Validate file extension and other constraints"""
        if not file.filename:
            raise HTTPException(status_code=400, detail="No filename provided")
        
        file_extension = Path(file.filename).suffix.lower().lstrip('.')
        if file_extension not in self.allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"File type '{file_extension}' not allowed. Allowed types: {', '.join(self.allowed_extensions)}"
            )
        
        return True
    
    async def save_file(self, file: UploadFile, folder_name: Optional[str] = None) -> dict:
        """Save uploaded file and return file info"""
        self.validate_file(file)
        
        # Read file content
        content = await file.read()
        file_size = len(content)
        
        # Check file size
        if file_size > self.max_file_size:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size is {self.max_file_size} bytes ({self.max_file_size / 1024 / 1024:.1f} MB)"
            )
        
        # Generate unique filename
        file_extension = Path(file.filename).suffix.lower()
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Create folder-specific directory if needed
        save_directory = self.upload_directory
        if folder_name:
            save_directory = self.upload_directory / self.sanitize_folder_name(folder_name)
            save_directory.mkdir(exist_ok=True)
        
        # Save file
        file_path = save_directory / unique_filename
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)
        
        return {
            "original_name": file.filename,
            "saved_name": unique_filename,
            "file_path": str(file_path),
            "file_size": file_size,
            "file_type": file_extension,
            "mime_type": file.content_type,
            "folder_name": folder_name
        }
    
    def delete_file(self, file_path: str) -> bool:
        """Delete a file from storage"""
        try:
            path = Path(file_path)
            if path.exists() and path.is_file():
                path.unlink()
                return True
            return False
        except Exception as e:
            print(f"Error deleting file {file_path}: {e}")
            return False
    
    @staticmethod
    def sanitize_folder_name(folder_name: str) -> str:
        """Sanitize folder name for filesystem"""
        # Remove or replace invalid characters
        invalid_chars = '<>:"/\\|?*'
        for char in invalid_chars:
            folder_name = folder_name.replace(char, '_')
        return folder_name.strip()
    
    def get_file_info(self, file_path: str) -> Optional[dict]:
        """Get file information"""
        try:
            path = Path(file_path)
            if path.exists():
                stat = path.stat()
                return {
                    "exists": True,
                    "size": stat.st_size,
                    "created": stat.st_ctime,
                    "modified": stat.st_mtime
                }
            return {"exists": False}
        except Exception as e:
            print(f"Error getting file info for {file_path}: {e}")
            return {"exists": False, "error": str(e)}