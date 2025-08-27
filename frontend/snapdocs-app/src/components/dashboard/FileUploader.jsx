// components/FileUploader.jsx - UPDATED WITH GENERAL FOLDER DEFAULT
import React, { useState, useRef } from 'react';
import { Upload, Plus, AlertCircle, CheckCircle, Home } from 'lucide-react';

const FileUploader = ({ onFileUpload, selectedFolder }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadResults, setUploadResults] = useState([]);
  const fileInputRef = useRef(null);

  // Determine target folder - default to "General" if no folder selected
  const targetFolder = selectedFolder || 'General';
  const isDefaultUpload = !selectedFolder || selectedFolder === 'General';

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
    setUploadResults([]);
    
    const token = localStorage.getItem('token');
    const results = [];
    
    console.log(`🚀 Starting upload of ${files.length} files to folder: ${targetFolder}`);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder_name', targetFolder); // Always specify folder
      
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
          results.push({ 
            file: file.name, 
            status: 'success', 
            message: `Uploaded to ${targetFolder}`,
            data: result.data,
            folder: targetFolder
          });
          console.log(`✅ Upload successful: ${file.name} -> ${targetFolder}`);
        } else {
          results.push({ 
            file: file.name, 
            status: 'error', 
            message: result.message || result.detail || `Failed with status ${response.status}` 
          });
          console.error(`❌ Upload failed: ${file.name} - ${result.message || result.detail}`);
        }
      } catch (error) {
        results.push({ 
          file: file.name, 
          status: 'error', 
          message: `Network error: ${error.message}` 
        });
        console.error(`❌ Upload error for ${file.name}:`, error);
      }
      
      setUploadProgress(((i + 1) / files.length) * 100);
    }
    
    setUploading(false);
    setUploadProgress(0);
    setUploadResults(results);
    
    // Count successful uploads
    const successCount = results.filter(r => r.status === 'success').length;
    const failCount = results.filter(r => r.status === 'error').length;
    
    if (successCount > 0) {
      setUploadStatus(`✅ Successfully uploaded ${successCount} file${successCount > 1 ? 's' : ''} to ${targetFolder}!`);
      
      // Trigger parent component refresh
      setTimeout(() => {
        onFileUpload && onFileUpload();
      }, 1000);
    } else {
      setUploadStatus(`❌ Upload failed for all files`);
    }
    
    if (failCount > 0) {
      console.warn(`❌ ${failCount} file${failCount > 1 ? 's' : ''} failed to upload`);
    }
    
    // Clear status after 5 seconds
    setTimeout(() => {
      setUploadStatus('');
      setUploadResults([]);
    }, 5000);
  };

  return (
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
        <div className={`p-4 rounded-xl border ${
          uploadStatus.includes('✅') 
            ? 'bg-green-600/20 border-green-500/50 text-green-300'
            : uploadStatus.includes('❌')
            ? 'bg-red-600/20 border-red-500/50 text-red-300'
            : 'bg-blue-600/20 border-blue-500/50 text-blue-300'
        }`}>
          <div className="flex items-center space-x-2">
            {uploadStatus.includes('✅') ? (
              <CheckCircle className="w-5 h-5" />
            ) : uploadStatus.includes('❌') ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
            )}
            <span>{uploadStatus}</span>
          </div>
        </div>
      )}

      {/* Upload results */}
      {uploadResults.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <h4 className="text-white font-semibold mb-3">Upload Results</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uploadResults.map((result, index) => (
              <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${
                result.status === 'success' 
                  ? 'bg-green-600/20 text-green-300'
                  : 'bg-red-600/20 text-red-300'
              }`}>
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  {result.status === 'success' ? (
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="truncate font-medium">{result.file}</span>
                  {result.folder && result.status === 'success' && (
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      📁 {result.folder}
                    </span>
                  )}
                </div>
                <span className="text-xs ml-2 flex-shrink-0">{result.message}</span>
              </div>
            ))}
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
  );
};

export default FileUploader;