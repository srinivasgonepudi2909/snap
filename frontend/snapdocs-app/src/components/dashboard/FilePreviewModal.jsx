// components/dashboard/FilePreviewModal.jsx - FIXED BACK NAVIGATION & DOWNLOAD
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  X, Download, ZoomIn, ZoomOut, RotateCw, 
  ChevronLeft, ChevronRight, FileText, Music, Video, 
  AlertCircle, CheckCircle, ArrowLeft, Trash2, Eye
} from 'lucide-react';

const FilePreviewModal = ({
  isOpen,
  onClose,
  file,
  allFiles,
  currentIndex,
  onNavigate,
  onBackToDashboard, // This should navigate back to dashboard home
  onDeleteFile
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [previewLoading, setPreviewLoading] = useState(true);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen && file) {
      setZoom(1);
      setRotation(0);
      setImageError(false);
      setDownloading(false);
      setDownloadSuccess(false);
      setDownloadError('');
      setPreviewLoading(true);
      
      // Generate file URL based on file path
      const url = generateFileUrl(file);
      setFileUrl(url);
      
      console.log('🔍 FilePreviewModal opened for:', file.name || file.original_name);
      console.log('📁 File data:', file);
      console.log('🔗 Generated URL:', url);
      
      // Check if URL is accessible
      testFileAccess(url);
    }
  }, [isOpen, file]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !file) return null;

  // Generate proper file URL with multiple fallback methods
  const generateFileUrl = (fileData) => {
    console.log('🔗 Generating URL for file:', fileData);
    
    const baseUrl = process.env.REACT_APP_DOCUMENT_API || 'http://localhost:8001';
    
    // Method 1: Direct static file serving (preferred)
    if (fileData.unique_name) {
      const staticUrl = `${baseUrl}/files/${fileData.unique_name}`;
      console.log('📁 Using static file URL:', staticUrl);
      return staticUrl;
    }
    
    // Method 2: API endpoint with file ID for download
    if (fileData._id) {
      const apiUrl = `${baseUrl}/api/v1/documents/${fileData._id}/download`;
      console.log('🔗 Using API download URL:', apiUrl);
      return apiUrl;
    }
    
    console.error('❌ Could not generate file URL for:', fileData);
    return '';
  };

  // Test file access
  const testFileAccess = async (url) => {
    if (!url) {
      setPreviewLoading(false);
      setImageError(true);
      return;
    }

    try {
      console.log('🧪 Testing file access:', url);
      
      const response = await fetch(url, { 
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      console.log('📊 File access test result:', response.status, response.statusText);
      setPreviewLoading(false);
      
    } catch (error) {
      console.warn('⚠️ File access test failed:', error.message);
      setPreviewLoading(false);
    }
  };

  // Determine file type with better detection
  const getFileType = () => {
    const fileName = file.name || file.original_name || '';
    const mimeType = file.mime_type || file.type || '';
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(extension)) {
      return 'image';
    }
    if (mimeType === 'application/pdf' || extension === 'pdf') {
      return 'pdf';
    }
    if (mimeType.startsWith('audio/') || ['mp3', 'wav', 'flac', 'ogg', 'm4a', 'aac'].includes(extension)) {
      return 'audio';
    }
    if (mimeType.startsWith('video/') || ['mp4', 'avi', 'mkv', 'mov', 'webm', 'wmv'].includes(extension)) {
      return 'video';
    }
    if (mimeType.startsWith('text/') || ['txt', 'md', 'json', 'csv', 'log', 'js', 'html', 'css'].includes(extension)) {
      return 'text';
    }
    
    return 'other';
  };

  const fileType = getFileType();

  const handleZoom = (delta) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // FIXED: Enhanced download handler that actually downloads files
  const handleDownload = async () => {
    try {
      setDownloading(true);
      setDownloadSuccess(false);
      setDownloadError('');
      
      const fileName = file.name || file.original_name || 'download';
      console.log('📥 Starting download for:', fileName);
      console.log('🔗 Download URL:', fileUrl);
      
      if (!fileUrl) {
        throw new Error('No download URL available');
      }

      // Method 1: Try direct blob download with authentication
      const token = localStorage.getItem('token');
      const baseUrl = process.env.REACT_APP_DOCUMENT_API || 'http://localhost:8001';
      
      // FIXED: Use proper download endpoint
      let downloadUrl;
      if (file._id) {
        downloadUrl = `${baseUrl}/api/v1/documents/${file._id}/download`;
      } else if (file.unique_name) {
        downloadUrl = `${baseUrl}/files/${file.unique_name}`;
      } else {
        downloadUrl = fileUrl;
      }
      
      console.log('🔐 Attempting download from:', downloadUrl);
      
      // FIXED: Use proper fetch with authentication
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': '*/*'
        },
        credentials: 'include'
      });

      console.log('📊 Download response:', response.status, response.statusText);
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }

      // FIXED: Get the actual file blob
      const blob = await response.blob();
      console.log('📦 Blob created, size:', blob.size, 'bytes, type:', blob.type);
      
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }
      
      // FIXED: Create and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      
      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up object URL
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
      
      console.log('✅ Download completed successfully');
      setDownloadSuccess(true);
      
      // Show success message for 3 seconds
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('❌ Download error:', error);
      setDownloadError(error.message);
      
      // FIXED: Fallback download method - open in new tab
      if (fileUrl) {
        console.log('🔄 Trying fallback download method...');
        try {
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = file.name || file.original_name || 'download';
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 3000);
          
        } catch (fallbackError) {
          console.error('❌ Fallback download also failed:', fallbackError);
        }
      }
      
      // Show error for 5 seconds
      setTimeout(() => {
        setDownloadError('');
      }, 5000);
    } finally {
      setDownloading(false);
    }
  };

  // Handle delete action
  const handleDelete = () => {
    if (onDeleteFile) {
      onDeleteFile(file);
    }
  };

  // FIXED: Handle back to dashboard - close modal first, then navigate
  const handleBackToDashboard = () => {
    console.log('🏠 Back to dashboard clicked');
    
    // Close the modal first
    onClose();
    
    // Small delay to ensure modal closes smoothly, then navigate
    setTimeout(() => {
      if (onBackToDashboard) {
        console.log('🔄 Calling onBackToDashboard');
        onBackToDashboard();
      }
    }, 100);
  };

  // Helper functions
  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/90">
      {/* Success Notification */}
      {downloadSuccess && (
        <div className="fixed top-4 right-4 z-[60] animate-slide-in">
          <div className="bg-green-600/20 backdrop-blur-sm border border-green-500/50 rounded-xl p-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <div className="text-green-300 font-semibold">Download Successful! 🎉</div>
                <div className="text-green-400 text-sm">
                  {file.name || file.original_name} saved to Downloads
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {downloadError && (
        <div className="fixed top-4 right-4 z-[60] animate-slide-in">
          <div className="bg-red-600/20 backdrop-blur-sm border border-red-500/50 rounded-xl p-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <div>
                <div className="text-red-300 font-semibold">Download Failed! ❌</div>
                <div className="text-red-400 text-sm">{downloadError}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal content */}
      <div className="relative h-full flex flex-col max-w-7xl mx-auto">
        {/* FIXED: Header with proper back button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/90 backdrop-blur-sm">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-white truncate flex items-center space-x-2">
              <span>📄</span>
              <span>{file.name || file.original_name}</span>
            </h2>
            <div className="text-sm text-gray-400 space-x-4">
              <span>📦 {formatFileSize(file.file_size || file.size)}</span>
              <span>•</span>
              <span>🕒 {formatDate(file.created_at)}</span>
              <span>•</span>
              <span className="capitalize">📄 {fileType}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-4">
            {/* FIXED: Back to Dashboard with proper icon and navigation */}
            <button 
              onClick={handleBackToDashboard}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            
            {/* Zoom Controls (only for images) */}
            {fileType === 'image' && !imageError && (
              <>
                <button 
                  onClick={() => handleZoom(-0.25)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  title="Zoom out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleZoom(0.25)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  title="Zoom in"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleRotate}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  title="Rotate"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </>
            )}
            
            {/* FIXED: Download Button with proper functionality */}
            <button 
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600/80 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              title="Download file"
            >
              {downloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </>
              )}
            </button>
            
            {/* Delete Button */}
            <button 
              onClick={handleDelete}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
              title="Delete file"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview content */}
        <div className="flex-1 overflow-hidden relative bg-gray-900">
          {/* Navigation arrows */}
          {allFiles && allFiles.length > 1 && currentIndex > 0 && (
            <button
              onClick={() => onNavigate(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full
                       bg-gray-800/80 text-white hover:bg-gray-700/80 transition-colors z-10
                       backdrop-blur-sm border border-gray-600"
              title="Previous file"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          
          {allFiles && allFiles.length > 1 && currentIndex < allFiles.length - 1 && (
            <button
              onClick={() => onNavigate(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full
                       bg-gray-800/80 text-white hover:bg-gray-700/80 transition-colors z-10
                       backdrop-blur-sm border border-gray-600"
              title="Next file"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* File counter */}
          {allFiles && allFiles.length > 1 && (
            <div className="absolute top-4 left-4 bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-1 text-sm text-gray-300 border border-gray-600 z-10">
              {currentIndex + 1} of {allFiles.length}
            </div>
          )}

          {/* Preview content based on file type */}
          <div className="h-full flex items-center justify-center p-8">
            {previewLoading ? (
              <div className="text-center text-gray-400">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-lg mb-2">Loading preview...</p>
                <p className="text-sm">Preparing your file for viewing</p>
              </div>
            ) : fileType === 'image' && fileUrl ? (
              <div className="max-w-full max-h-full overflow-hidden flex items-center justify-center">
                {!imageError ? (
                  <img
                    src={fileUrl}
                    alt={file.name || file.original_name}
                    className="max-h-full max-w-full object-contain transition-transform duration-200 cursor-zoom-in"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`
                    }}
                    onError={(e) => {
                      console.error('❌ Image failed to load:', fileUrl);
                      setImageError(true);
                    }}
                    onLoad={() => {
                      console.log('✅ Image loaded successfully');
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-400 bg-gray-800/50 rounded-xl p-8">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                    <p className="text-lg mb-2">Failed to load image</p>
                    <p className="text-sm mb-4">The image may be corrupted or temporarily unavailable</p>
                    <button 
                      onClick={handleDownload}
                      disabled={downloading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {downloading ? 'Downloading...' : 'Download File'}
                    </button>
                  </div>
                )}
              </div>
            ) : fileType === 'pdf' && fileUrl ? (
              <div className="w-full h-full">
                <iframe
                  src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                  className="w-full h-full border-none rounded-lg"
                  title="PDF Preview"
                  onLoad={() => console.log('✅ PDF loaded successfully')}
                  onError={() => {
                    console.error('❌ PDF failed to load');
                    setImageError(true);
                  }}
                />
              </div>
            ) : fileType === 'audio' && fileUrl ? (
              <div className="text-center bg-gray-800/50 rounded-xl p-8">
                <Music className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <p className="text-xl text-white mb-6">{file.name || file.original_name}</p>
                <audio controls className="w-full max-w-md mb-4" preload="metadata">
                  <source src={fileUrl} type={file.mime_type || 'audio/mpeg'} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : fileType === 'video' && fileUrl ? (
              <div className="w-full max-w-4xl">
                <video controls className="w-full max-h-full rounded-lg" preload="metadata">
                  <source src={fileUrl} type={file.mime_type || 'video/mp4'} />
                  Your browser does not support the video element.
                </video>
              </div>
            ) : (
              <div className="text-center text-gray-400 bg-gray-800/50 rounded-xl p-8">
                <FileText className="w-20 h-20 mx-auto mb-4" />
                <p className="text-xl mb-2">Preview not available</p>
                <p className="mb-6">This file type cannot be previewed in the browser</p>
                <div className="space-y-3">
                  <div className="text-sm text-gray-500 space-y-1">
                    <div>File: {file.name || file.original_name}</div>
                    <div>Type: {fileType} • Size: {formatFileSize(file.file_size || file.size)}</div>
                    <div>Created: {formatDate(file.created_at)}</div>
                  </div>
                  <button 
                    onClick={handleDownload}
                    disabled={downloading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2 mx-auto"
                  >
                    <Download className="w-4 h-4" />
                    <span>{downloading ? 'Downloading...' : 'Download File'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

FilePreviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  file: PropTypes.object,
  allFiles: PropTypes.array,
  currentIndex: PropTypes.number,
  onNavigate: PropTypes.func,
  onBackToDashboard: PropTypes.func,
  onDeleteFile: PropTypes.func
};

FilePreviewModal.defaultProps = {
  allFiles: [],
  currentIndex: 0,
  onNavigate: () => {},
  onBackToDashboard: () => {},
  onDeleteFile: () => {}
};

export default FilePreviewModal;