// components/FileUploader.jsx
import React, { useState, useRef } from 'react';
import { Upload, Plus } from 'lucide-react';

const FileUploader = ({ onFileUpload, selectedFolder }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    e.target.value = ''; // Reset input
  };

  const handleFiles = async (files) => {
    if (files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('Starting upload...');
    
    const token = localStorage.getItem('token');
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder_name', selectedFolder || 'General');
      
      try {
        setUploadStatus(`Uploading ${file.name}...`);
        
        const response = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
        });

        if (response.ok) {
          successCount++;
          console.log(`✅ Uploaded: ${file.name}`);
        } else {
          failCount++;
          console.error(`❌ Failed to upload: ${file.name}`);
        }
      } catch (error) {
        failCount++;
        console.error(`❌ Upload error for ${file.name}:`, error);
      }
      
      setUploadProgress(((i + 1) / files.length) * 100);
    }
    
    setUploading(false);
    setUploadProgress(0);
    setUploadStatus('');
    
    // Show results
    if (successCount > 0) {
      setUploadStatus(`✅ Uploaded ${successCount} file${successCount > 1 ? 's' : ''} successfully!`);
      setTimeout(() => setUploadStatus(''), 3000);
      onFileUpload && onFileUpload();
    }
    
    if (failCount > 0) {
      console.warn(`❌ Failed to upload ${failCount} file${failCount > 1 ? 's' : ''}`);
    }
  };

  return (
    <div 
      className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-dashed transition-all duration-300 cursor-pointer ${
        isDragging 
          ? 'border-blue-400 bg-blue-400/10 scale-105' 
          : 'border-blue-400/50 hover:border-blue-400'
      } ${uploading ? 'pointer-events-none' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !uploading && fileInputRef.current?.click()}
    >
      <div className="text-center">
        <Upload className={`w-16 h-16 mx-auto mb-4 transition-all duration-300 ${
          isDragging ? 'text-blue-300 scale-110' : uploading ? 'text-green-400 animate-bounce' : 'text-blue-400'
        }`} />
        
        <h3 className="text-xl font-semibold text-white mb-2">
          {isDragging 
            ? 'Drop files here!' 
            : uploading 
            ? `Uploading... ${Math.round(uploadProgress)}%` 
            : 'Drag & Drop Files Here'}
        </h3>
        
        <p className="text-gray-400 mb-4">
          {uploadStatus || (selectedFolder ? `Upload to: ${selectedFolder}` : 'Or click to browse and upload')}
        </p>
        
        {uploading && (
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300 relative" 
              style={{width: `${uploadProgress}%`}}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        )}
        
        <button 
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            uploading 
              ? 'bg-green-600 text-white cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
          }`}
          disabled={uploading}
        >
          {uploading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Uploading...</span>
            </div>
          ) : (
            'Choose Files'
          )}
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
        />
      </div>
    </div>
  );
};

export default FileUploader;