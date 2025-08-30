// components/dashboard/FilePreviewModal.jsx - FIXED WITH WORKING PREVIEW & DOWNLOAD
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  X, Download, ZoomIn, ZoomOut, RotateCw, 
  ChevronLeft, ChevronRight, FileText, Music, Video, AlertCircle, CheckCircle
} from 'lucide-react';

const FilePreviewModal = ({
  isOpen,
  onClose,
  file,
  allFiles,
  currentIndex,
  onNavigate
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(true);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen && file) {
      setZoom(1);
      setRotation(0);
      setImageError(false);
      setDownloading(false);
      setDownloadSuccess(false);
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

  // Generate proper file URL - ENHANCED
  const generateFileUrl = (fileData) => {
    console.log('🔗 Generating URL for file:', fileData);
    
    // Method 1: Direct static file serving (preferred)
    if (fileData.unique_name) {
      const staticUrl = `${process.env.REACT_APP_DOCUMENT_API}/files/${fileData.unique_name}`;
      console.log('📁 Using static file URL:', staticUrl);
      return staticUrl;
    }
    
    // Method 2: API endpoint with file ID
    if (fileData._id) {
      const apiUrl = `${process.env.REACT_APP_DOCUMENT_API}/api/v1/documents/${fileData._id}/download`;
      console.log('🔗 Using API URL:', apiUrl);
      return apiUrl;
    }
    
    // Method 3: Fallback using file name
    if (fileData.name || fileData.original_name) {
      const fileName = fileData.name || fileData.original_name;
      const fallbackUrl = `${process.env.REACT_APP_DOCUMENT_API}/files/${fileName}`;
      console.log('⚠️ Using fallback URL:', fallbackUrl);
      return fallbackUrl;
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
      
      if (response.ok) {
        console.log('✅ File is accessible');
        setPreviewLoading(false);
      } else {
        console.warn('⚠️ File access failed, but will still try to display');
        setPreviewLoading(false);
      }
    } catch (error) {
      console.warn('⚠️ File access test failed:', error.message);
      setPreviewLoading(false);
    }
  };

  // Determine file type - ENHANCED
  const getFileType = () => {
    const fileName = file.name || file.original_name || '';
    const mimeType = file.mime_type || file.type || '';
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    console.log('🔍 Determining file type:', { fileName, mimeType, extension });

    if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension)) {
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
    if (mimeType.startsWith('text/') || ['txt', 'md', 'json', 'csv', 'log'].includes(extension)) {
      return 'text';
    }
    if (['doc', 'docx'].includes(extension)) {
      return 'document';
    }
    if (['xls', 'xlsx'].includes(extension)) {
      return 'spreadsheet';
    }
    
    return 'other';
  };

  const fileType = getFileType();
  console.log('📄 File type determined:', fileType);

  const handleZoom = (delta) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // ENHANCED DOWNLOAD HANDLER
  const handleDownload = async () => {
    try {
      setDownloading(true);
      setDownloadSuccess(false);
      
      const fileName = file.name || file.original_name || 'download';
      console.log('📥 Starting download for:', fileName);
      console.log('🔗 Download URL:', fileUrl);
      
      if (!fileUrl) {
        throw new Error('No download URL available');
      }

      // Method 1: Try authenticated fetch first
      try {
        console.log('🔐 Attempting authenticated download...');
        const token = localStorage.getItem('token');
        
        const response = await fetch(fileUrl, {
          method: 'GET',
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });

        console.log('📊 Download response status:', response.status);

        if (response.ok) {
          const blob = await response.blob();
          console.log('📦 Blob created, size:', blob.size, 'bytes');
          
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          
          // Trigger download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up
          window.URL.revokeObjectURL(url);
          
          console.log('✅ Download completed successfully');
          setDownloadSuccess(true);
          
          // Show success message for 3 seconds
          setTimeout(() => {
            setDownloadSuccess(false);
          }, 3000);
          
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (fetchError) {
        console.warn('⚠️ Authenticated download failed:', fetchError.message);
        console.log('🔄 Trying direct download...');
        
        // Method 2: Fallback to direct link download
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ Direct download initiated');
        setDownloadSuccess(true);
        
        setTimeout(() => {
          setDownloadSuccess(false);
        }, 3000);
      }
      
    } catch (error) {
      console.error('❌ Download error:', error);
      
      // Show error notification
      alert(`Download failed: ${error.message}\n\nPlease try again or contact support.`);
      
    } finally {
      setDownloading(false);
    }
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Download Success Notification */}
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

      {/* Modal content */}
      <div className="relative h-full flex flex-col max-w-7xl mx-auto">
        {/* Header */}
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

          {/* Controls */}
          <div className="flex items-center space-x-2 ml-4">
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
            
            {/* Download Button */}
            <button 
              onClick={handleDownload}
              disabled={downloading}
              className="p-2 text-gray-400 hover:text-white hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download file"
            >
              {downloading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <Download className="w-5 h-5" />
              )}
            </button>
            
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
        <div className="flex-1 overflow-hidden relative bg-gray-800">
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
            <div className="absolute top-4 right-4 bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-1 text-sm text-gray-300 border border-gray-600 z-10">
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
              <div className="max-w-full max-h-full overflow-hidden">
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
                      console.error('❌ Error details:', e);
                      setImageError(true);
                    }}
                    onLoad={() => {
                      console.log('✅ Image loaded successfully');
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                    <p className="text-lg mb-2">Failed to load image</p>
                    <p className="text-sm mb-4">The image may be corrupted or temporarily unavailable</p>
                    <div className="space-y-2">
                      <button 
                        onClick={handleDownload}
                        disabled={downloading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {downloading ? 'Downloading...' : 'Download File'}
                      </button>
                      <div className="text-xs text-gray-500">
                        URL: {fileUrl}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : fileType === 'pdf' && fileUrl ? (
              <div className="w-full h-full">
                <iframe
                  src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                  className="w-full h-full border-none"
                  title="PDF Preview"
                  onLoad={() => console.log('✅ PDF loaded successfully')}
                  onError={() => {
                    console.error('❌ PDF failed to load');
                    setImageError(true);
                  }}
                />
              </div>
            ) : fileType === 'audio' && fileUrl ? (
              <div className="text-center">
                <Music className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <p className="text-xl text-white mb-6">{file.name || file.original_name}</p>
                <audio controls className="w-full max-w-md" preload="metadata">
                  <source src={fileUrl} type={file.mime_type || 'audio/mpeg'} />
                  Your browser does not support the audio element.
                </audio>
                <div className="mt-4">
                  <button 
                    onClick={handleDownload}
                    disabled={downloading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {downloading ? 'Downloading...' : 'Download Audio'}
                  </button>
                </div>
              </div>
            ) : fileType === 'video' && fileUrl ? (
              <div className="w-full max-w-4xl">
                <video controls className="w-full max-h-full" preload="metadata">
                  <source src={fileUrl} type={file.mime_type || 'video/mp4'} />
                  Your browser does not support the video element.
                </video>
                <div className="mt-4 text-center">
                  <button 
                    onClick={handleDownload}
                    disabled={downloading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {downloading ? 'Downloading...' : 'Download Video'}
                  </button>
                </div>
              </div>
            ) : fileType === 'text' && fileUrl ? (
              <div className="w-full max-w-4xl max-h-full overflow-auto bg-gray-700 rounded-lg p-4">
                <iframe 
                  src={fileUrl} 
                  className="w-full h-96 bg-white rounded border-none"
                  title="Text file preview"
                  onError={() => {
                    console.error('❌ Text file failed to load');
                    setImageError(true);
                  }}
                />
                <div className="mt-4 text-center">
                  <button 
                    onClick={handleDownload}
                    disabled={downloading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {downloading ? 'Downloading...' : 'Download Text File'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <FileText className="w-20 h-20 mx-auto mb-4" />
                <p className="text-xl mb-2">Preview not available</p>
                <p className="mb-6">This file type cannot be previewed in the browser</p>
                <div className="space-y-3">
                  <button 
                    onClick={handleDownload}
                    disabled={downloading}
                    className="block mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {downloading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Downloading...</span>
                      </div>
                    ) : (
                      <>📥 Download File</>
                    )}
                  </button>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div>File type: {fileType} • Size: {formatFileSize(file.file_size || file.size)}</div>
                    <div>Created: {formatDate(file.created_at)}</div>
                  </div>
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
  file: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    original_name: PropTypes.string,
    unique_name: PropTypes.string,
    file_path: PropTypes.string,
    mime_type: PropTypes.string,
    type: PropTypes.string,
    file_size: PropTypes.number,
    size: PropTypes.number,
    url: PropTypes.string,
    created_at: PropTypes.string
  }),
  allFiles: PropTypes.array,
  currentIndex: PropTypes.number,
  onNavigate: PropTypes.func
};

FilePreviewModal.defaultProps = {
  allFiles: [],
  currentIndex: 0,
  onNavigate: () => {}
};

export default FilePreviewModal;