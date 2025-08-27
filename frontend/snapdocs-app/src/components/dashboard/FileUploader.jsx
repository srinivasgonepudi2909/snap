// UPDATE this file: frontend/snapdocs-app/src/components/dashboard/FileUploader.jsx
import React, { useState, useRef } from 'react';
import { Upload, Plus, AlertCircle, CheckCircle, Home } from 'lucide-react';
import PopupModal from './PopupModal'; // ADD THIS IMPORT

const FileUploader = ({ onFileUpload, selectedFolder }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  
  // ADD THESE POPUP STATES
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({});
  
  const fileInputRef = useRef(null);

  // Determine target folder - default to "General" if no folder selected
  const targetFolder = selectedFolder || 'General';
  const isDefaultUpload = !selectedFolder || selectedFolder === 'General';

  // ADD THIS HELPER FUNCTION
  const showUploadPopup = (type, title, message, details = null) => {
    setPopupConfig({
      type,
      title,
      message,
      details
    });
    setShowPopup(true);
  };

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

  // UPDATE THIS FUNCTION WITH POPUP NOTIFICATIONS
  const handleFiles = async (files) => {
    if (files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('Starting upload...');
    
    const token = localStorage.getItem('token');
    const results = [];
    const successfulUploads = [];
    const failedUploads = [];
    
    console.log(`🚀 Starting upload of ${files.length} files to folder: ${targetFolder}`);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder_name', targetFolder);
      
      try {
        setUploadStatus(`Uploading ${file.name} to ${targetFolder}... (${i + 1}/${files.length})`);
        console.log(`📤 Uploading: ${file.name} (${file.size} bytes) to ${targetFolder}`);
        
        const response = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/upload`, {
          method: 'POST',
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          body: formData
        });

        console.log(`📊 Upload response status: ${response.status}`);
        const result = await response.json();
        console.log(`📦 Upload response:`, result);

        if (response.ok && result.success) {
          const successInfo = { 
            file: file.name, 
            status: 'success', 
            message: `Uploaded successfully to ${targetFolder}`,
            data: result.data,
            folder: targetFolder,
            size: file.size
          };
          results.push(successInfo);
          successfulUploads.push(successInfo);
          console.log(`✅ Upload successful: ${file.name} -> ${targetFolder}`);
        } else {
          const errorInfo = { 
            file: file.name, 
            status: 'error', 
            message: result.message || result.detail || `Failed with status ${response.status}`,
            folder: targetFolder
          };
          results.push(errorInfo);
          failedUploads.push(errorInfo);
          console.error(`❌ Upload failed: ${file.name} - ${result.message || result.detail}`);
        }
      } catch (error) {
        const errorInfo = { 
          file: file.name, 
          status: 'error', 
          message: `Network error: ${error.message}`,
          folder: targetFolder
        };
        results.push(errorInfo);
        failedUploads.push(errorInfo);
        console.error(`❌ Upload error for ${file.name}:`, error);
      }
      
      setUploadProgress(((i + 1) / files.length) * 100);
    }
    
    setUploading(false);
    setUploadProgress(0);
    setUploadStatus('');
    
    // ADD POPUP LOGIC BASED ON RESULTS
    if (successfulUploads.length > 0 && failedUploads.length === 0) {
      // All uploads successful
      const details = successfulUploads.map(upload => 
        `✅ ${upload.file} → ${upload.folder} (${formatFileSize(upload.size)})`
      );
      
      showUploadPopup(
        'success',
        'Upload Successful! 🎉',
        `Successfully uploaded ${successfulUploads.length} file${successfulUploads.length > 1 ? 's' : ''} to ${targetFolder} folder.`,
        details
      );
      
      // Trigger parent component refresh
      setTimeout(() => {
        onFileUpload && onFileUpload();
      }, 1000);
    } else if (failedUploads.length > 0 && successfulUploads.length === 0) {
      // All uploads failed
      const details = failedUploads.map(upload => 
        `❌ ${upload.file}: ${upload.message}`
      );
      
      showUploadPopup(
        'error',
        'Upload Failed! ❌',
        `Failed to upload ${failedUploads.length} file${failedUploads.length > 1 ? 's' : ''}.`,
        details
      );
    } else if (successfulUploads.length > 0 && failedUploads.length > 0) {
      // Mixed results
      const successDetails = successfulUploads.map(upload => 
        `✅ ${upload.file} → ${upload.folder}`
      );
      const failDetails = failedUploads.map(upload => 
        `❌ ${upload.file}: ${upload.message}`
      );
      
      showUploadPopup(
        'upload',
        'Upload Completed with Issues! ⚠️',
        `${successfulUploads.length} file${successfulUploads.length > 1 ? 's' : ''} uploaded successfully, ${failedUploads.length} failed.`,
        [...successDetails, ...failDetails]
      );
      
      // Trigger refresh for successful uploads
      if (successfulUploads.length > 0) {
        setTimeout(() => {
          onFileUpload && onFileUpload();
        }, 1000);
      }
    }
  };

  // ADD THIS HELPER FUNCTION
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <>
      <div className="space-y-4">
        {/* Folder indicator */}
        <div className={`
          px-4 py-2 rounded-lg border flex items-center space-x-2 text-sm
          ${isDefaultUpload 
            ? 'bg-blue-500/10 border-blue-500/30 text-blue-200' 
            : 'bg-gray-700/50 border-gray-600/50 text-gray-300'
          }
        `}>
          {isDefaultUpload ? (
            <Home className="w-4 h-4" />
          ) : (
            <div className="text-lg">📁</div>
          )}
          <span>
            {isDefaultUpload 
              ? `Files will be uploaded to General folder (default)` 
              : `Files will be uploaded to "${targetFolder}" folder`
            }
          </span>
        </div>

        {/* Main upload area */}
        <div 
          className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-dashed transition-all duration-300 cursor-pointer ${
            isDragging 
              ? 'border-blue-400 bg-blue-400/10 scale-105' 
              : 'border-blue-400/50 hover:border-blue-400'
          } ${uploading ? 'pointer-events-none opacity-75' : ''}`}
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
              {uploading 
                ? `Uploading to ${targetFolder}...`
                : isDefaultUpload 
                ? 'Files will be saved to General folder by default'
                : `Or click to browse and upload to ${targetFolder}`
              }
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
            
            {!uploading && (
              <button 
                className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white hover:scale-105"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Choose Files
              </button>
            )}
            
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

        {/* Upload status */}
        {uploadStatus && (
          <div className="p-4 rounded-xl border bg-blue-600/20 border-blue-500/50 text-blue-300">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
              <span>{uploadStatus}</span>
            </div>
          </div>
        )}

        {/* Upload hints */}
        {!uploading && (
          <div className="text-center text-sm text-gray-400">
            <p>Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, GIF, TXT, ZIP, RAR</p>
            <p>Maximum file size: 50MB per file</p>
            {isDefaultUpload && (
              <p className="text-blue-400 mt-2 flex items-center justify-center space-x-1">
                <Home className="w-4 h-4" />
                <span>Files will be automatically organized in General folder</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* ADD THIS POPUP MODAL */}
      <PopupModal
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        type={popupConfig.type}
        title={popupConfig.title}
        message={popupConfig.message}
        details={popupConfig.details}
        showOkButton={true}
      />
    </>
  );
};

export default FileUploader;