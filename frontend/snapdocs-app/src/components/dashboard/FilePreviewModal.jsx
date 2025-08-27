import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  X, Download, ZoomIn, ZoomOut, RotateCw, 
  ChevronLeft, ChevronRight, FileText, Music, Video, AlertCircle
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

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen && file) {
      setZoom(1);
      setRotation(0);
      setImageError(false);
      
      // Generate file URL based on file path
      const url = generateFileUrl(file);
      setFileUrl(url);
      
      console.log('🔍 FilePreviewModal opened for:', file.name || file.original_name);
      console.log('📁 File data:', file);
      console.log('🔗 Generated URL:', url);
    }
  }, [isOpen, file]);

  if (!isOpen || !file) return null;

  // Generate proper file URL
  const generateFileUrl = (fileData) => {
    // Try multiple approaches to get the file URL
    if (fileData.url) {
      return fileData.url;
    }
    
    if (fileData.file_path) {
      // Use document service to serve files
      const fileName = fileData.unique_name || fileData.name || fileData.original_name;
      return `${process.env.REACT_APP_DOCUMENT_API}/files/${fileName}`;
    }
    
    if (fileData._id) {
      // Fallback: use document ID to serve file
      return `${process.env.REACT_APP_DOCUMENT_API}/api/v1/documents/${fileData._id}/download`;
    }
    
    return '';
  };

  // Determine file type
  const getFileType = () => {
    const fileName = file.name || file.original_name || '';
    const mimeType = file.mime_type || file.type || '';
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'image';
    }
    if (mimeType === 'application/pdf' || extension === 'pdf') {
      return 'pdf';
    }
    if (mimeType.startsWith('audio/') || ['mp3', 'wav', 'flac', 'ogg'].includes(extension)) {
      return 'audio';
    }
    if (mimeType.startsWith('video/') || ['mp4', 'avi', 'mkv', 'mov'].includes(extension)) {
      return 'video';
    }
    if (['txt', 'md', 'json', 'csv'].includes(extension)) {
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

  const handleDownload = async () => {
    try {
      console.log('📥 Starting download for:', file.name || file.original_name);
      
      if (!fileUrl) {
        console.error('❌ No file URL available');
        alert('Download not available - no file URL');
        return;
      }

      // Create download link
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = file.name || file.original_name || 'download';
      link.target = '_blank';
      
      // Add authentication if needed
      const token = localStorage.getItem('token');
      if (token) {
        // For authenticated downloads, we might need to fetch and create blob
        try {
          const response = await fetch(fileUrl, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            console.log('✅ Download completed');
          } else {
            throw new Error('Download request failed');
          }
        } catch (error) {
          console.warn('⚠️ Authenticated download failed, trying direct link');
          // Fallback to direct link
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        // Direct download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('✅ Download initiated');
      }
    } catch (error) {
      console.error('❌ Download error:', error);
      alert('Download failed. Please try again.');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
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

      {/* Modal content */}
      <div className="relative h-full flex flex-col max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/90 backdrop-blur-sm">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-white truncate">
              {file.name || file.original_name}
            </h2>
            <div className="text-sm text-gray-400 space-x-4">
              <span>{formatFileSize(file.file_size || file.size)}</span>
              <span>•</span>
              <span>{formatDate(file.created_at)}</span>
              <span>•</span>
              <span className="capitalize">{fileType}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2 ml-4">
            {fileType === 'image' && (
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
            <button 
              onClick={handleDownload}
              className="p-2 text-gray-400 hover:text-white hover:bg-blue-600 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
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
          {allFiles.length > 1 && currentIndex > 0 && (
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
          {allFiles.length > 1 && currentIndex < allFiles.length - 1 && (
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
          {allFiles.length > 1 && (
            <div className="absolute top-4 right-4 bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-1 text-sm text-gray-300 border border-gray-600 z-10">
              {currentIndex + 1} of {allFiles.length}
            </div>
          )}

          {/* Preview content based on file type */}
          <div className="h-full flex items-center justify-center p-8">
            {fileType === 'image' && fileUrl ? (
              <div className="max-w-full max-h-full overflow-hidden">
                {!imageError ? (
                  <img
                    src={fileUrl}
                    alt={file.name || file.original_name}
                    className="max-h-full object-contain transition-transform duration-200"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`
                    }}
                    onError={() => {
                      console.error('❌ Image failed to load:', fileUrl);
                      setImageError(true);
                    }}
                    onLoad={() => {
                      console.log('✅ Image loaded successfully');
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg mb-2">Failed to load image</p>
                    <p className="text-sm mb-4">The image file may be corrupted or the server is unavailable</p>
                    <button 
                      onClick={handleDownload}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Try Download Instead
                    </button>
                  </div>
                )}
              </div>
            ) : fileType === 'pdf' ? (
              <div className="text-center text-gray-400">
                <FileText className="w-20 h-20 mx-auto mb-4" />
                <p className="text-xl mb-2">PDF Preview</p>
                <p className="mb-6">PDF preview is not available in this version</p>
                <div className="space-y-3">
                  <button 
                    onClick={handleDownload}
                    className="block mx-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    📄 Download PDF
                  </button>
                  {fileUrl && (
                    <button 
                      onClick={() => window.open(fileUrl, '_blank')}
                      className="block mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      🔗 Open in New Tab
                    </button>
                  )}
                </div>
              </div>
            ) : fileType === 'audio' && fileUrl ? (
              <div className="text-center">
                <Music className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <p className="text-xl text-white mb-6">{file.name || file.original_name}</p>
                <audio controls className="w-full max-w-md">
                  <source src={fileUrl} type={file.mime_type || 'audio/mpeg'} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : fileType === 'video' && fileUrl ? (
              <div className="w-full max-w-4xl">
                <video controls className="w-full max-h-full">
                  <source src={fileUrl} type={file.mime_type || 'video/mp4'} />
                  Your browser does not support the video element.
                </video>
              </div>
            ) : fileType === 'text' && fileUrl ? (
              <div className="w-full max-w-4xl max-h-full overflow-auto bg-gray-700 rounded-lg p-4">
                <iframe 
                  src={fileUrl} 
                  className="w-full h-96 bg-white rounded"
                  title="Text file preview"
                />
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <FileText className="w-20 h-20 mx-auto mb-4" />
                <p className="text-xl mb-2">Preview not available</p>
                <p className="mb-6">This file type cannot be previewed in the browser</p>
                <div className="space-y-3">
                  <button 
                    onClick={handleDownload}
                    className="block mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    📥 Download File
                  </button>
                  <div className="text-sm text-gray-500">
                    File type: {fileType} • Size: {formatFileSize(file.file_size || file.size)}
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
  allFiles: PropTypes.array.isRequired,
  currentIndex: PropTypes.number.isRequired,
  onNavigate: PropTypes.func.isRequired
};

export default FilePreviewModal;