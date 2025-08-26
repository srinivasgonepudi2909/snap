import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  X, Download, ZoomIn, ZoomOut, RotateCw, 
  ChevronLeft, ChevronRight, FileText, Music, Video
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

  if (!isOpen || !file) return null;

  const isImage = file.type?.startsWith('image/');
  const isPDF = file.type === 'application/pdf';
  const isAudio = file.type?.startsWith('audio/');
  const isVideo = file.type?.startsWith('video/');

  const handleZoom = (delta) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    window.open(file.url, '_blank');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white truncate">
              {file.name}
            </h2>
            <div className="text-sm text-gray-400 space-x-4">
              <span>{formatFileSize(file.size)}</span>
              <span>•</span>
              <span>{formatDate(file.created_at)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {isImage && (
              <>
                <button 
                  onClick={() => handleZoom(-0.25)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleZoom(0.25)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleRotate}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </>
            )}
            <button 
              onClick={handleDownload}
              className="p-2 text-gray-400 hover:text-white"
            >
              <Download className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview content */}
        <div className="flex-1 overflow-hidden relative">
          {/* Navigation arrows */}
          {currentIndex > 0 && (
            <button
              onClick={() => onNavigate(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full
                       bg-gray-800/80 text-white hover:bg-gray-700/80 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {currentIndex < allFiles.length - 1 && (
            <button
              onClick={() => onNavigate(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full
                       bg-gray-800/80 text-white hover:bg-gray-700/80 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Preview content based on file type */}
          <div className="h-full flex items-center justify-center p-8">
            {isImage ? (
              <img
                src={file.url}
                alt={file.name}
                className="max-h-full object-contain transition-transform duration-200"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`
                }}
              />
            ) : isPDF ? (
              <div className="text-center text-gray-400">
                <FileText className="w-16 h-16 mx-auto mb-4" />
                <p>PDF preview not available</p>
                <button 
                  onClick={handleDownload}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg
                           hover:bg-blue-700 transition-colors"
                >
                  Download PDF
                </button>
              </div>
            ) : isAudio ? (
              <div className="text-center">
                <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <audio controls className="w-full max-w-md">
                  <source src={file.url} type={file.type} />
                </audio>
              </div>
            ) : isVideo ? (
              <div className="w-full max-w-4xl">
                <video controls className="w-full">
                  <source src={file.url} type={file.type} />
                </video>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <FileText className="w-16 h-16 mx-auto mb-4" />
                <p>Preview not available</p>
                <button 
                  onClick={handleDownload}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg
                           hover:bg-blue-700 transition-colors"
                >
                  Download File
                </button>
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
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    size: PropTypes.number,
    url: PropTypes.string.isRequired,
    created_at: PropTypes.string
  }),
  allFiles: PropTypes.array.isRequired,
  currentIndex: PropTypes.number.isRequired,
  onNavigate: PropTypes.func.isRequired
};

export default FilePreviewModal;