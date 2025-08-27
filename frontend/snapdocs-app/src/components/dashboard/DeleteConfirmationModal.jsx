// Create this file: frontend/snapdocs-app/src/components/dashboard/DeleteConfirmationModal.jsx
import React, { useEffect } from 'react';
import { Trash2, AlertTriangle, X, FileText } from 'lucide-react';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  file,
  formatFileSize 
}) => {
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

  const fileName = file.name || file.original_name;
  const fileSize = formatFileSize(file.file_size || file.size || 0);
  const folderName = file.folder_name || file.folder_id || 'General';

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 w-full max-w-md relative shadow-2xl border border-red-500/30 animate-scale-in">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Warning Icon */}
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="w-full h-full bg-red-600/20 rounded-full flex items-center justify-center border-2 border-red-500/50">
              <Trash2 className="w-10 h-10 text-red-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-4">
            Delete File? 🗑️
          </h2>

          {/* Warning Message */}
          <div className="text-gray-300 text-lg mb-6">
            <p className="mb-2">Are you sure you want to delete this file?</p>
            <p className="text-red-300 font-semibold text-sm">
              ⚠️ This action cannot be undone!
            </p>
          </div>

          {/* File Information */}
          <div className="bg-red-600/10 rounded-xl p-4 mb-6 border border-red-500/30">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-left flex-1">
                <div className="text-white font-semibold text-sm mb-1 break-all">
                  📄 {fileName}
                </div>
                <div className="text-gray-400 text-xs space-y-1">
                  <div>📦 Size: {fileSize}</div>
                  <div>📁 Folder: {folderName}</div>
                  <div>🕒 Created: {new Date(file.created_at).toLocaleDateString('en-US', {
                    timeZone: 'Asia/Kolkata',
                    year: 'numeric',
                    month: 'short', 
                    day: 'numeric'
                  })}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl text-gray-300 border border-gray-600 hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500/50"
            >
              Cancel
            </button>
            
            {/* Delete Button */}
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Forever</span>
            </button>
          </div>

          {/* Additional Warning */}
          <div className="mt-4 p-3 bg-orange-600/10 rounded-lg border border-orange-500/30">
            <div className="flex items-center justify-center space-x-2 text-sm text-orange-300">
              <AlertTriangle className="w-4 h-4" />
              <span>This file will be permanently removed from your SnapDocs vault</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;