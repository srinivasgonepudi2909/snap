// components/CreateFolderModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Folder, AlertCircle } from 'lucide-react';

const CreateFolderModal = ({ isOpen, onClose, onFolderCreated }) => {
  const [folderName, setFolderName] = useState('');
  const [folderColor, setFolderColor] = useState('#3B82F6');
  const [folderIcon, setFolderIcon] = useState('📁');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const colors = [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', 
    '#EF4444', '#6B7280', '#EC4899', '#14B8A6'
  ];

  const icons = ['📁', '📄', '🎓', '🏠', '💼', '🏥', '💰', '✈️', '📱', '🎵', '🎨', '⚡'];

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFolderName('');
      setFolderColor('#3B82F6');
      setFolderIcon('📁');
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) {
      setError('Folder name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🚀 Creating folder:', folderName);
      
      const response = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/folders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: folderName.trim(),
          color: folderColor,
          icon: folderIcon,
          description: `${folderName.trim()} folder`
        })
      });

      console.log('📊 Response status:', response.status);
      
      const result = await response.json();
      console.log('📦 Response data:', result);
      
      if (response.ok && result.success) {
        console.log('✅ Folder created successfully');
        handleClose();
        
        setTimeout(() => {
          onFolderCreated && onFolderCreated();
        }, 500);
      } else {
        console.error('❌ Folder creation failed:', result);
        if (response.status === 400 && result.detail) {
          setError(result.detail);
        } else if (response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(result.message || result.detail || `Failed to create folder (${response.status})`);
        }
      }
    } catch (error) {
      console.error('🔥 Network error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      setFolderName('');
      setFolderColor('#3B82F6');
      setFolderIcon('📁');
      setLoading(false);
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        handleClose();
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
  }, [isOpen, loading]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 w-full max-w-md relative shadow-2xl border border-white/10 animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button 
          onClick={handleClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 z-10"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Header */}
        <div className="text-center mb-6 pt-2">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Folder className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Create New Folder</h2>
          <p className="text-gray-400 text-sm">Organize your documents with custom folders</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-4 flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium">Error</div>
              <div className="text-sm">{error}</div>
            </div>
            <button 
              onClick={() => setError('')}
              className="text-red-300 hover:text-red-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Folder Name */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Folder Name *
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter folder name"
              required
              maxLength={50}
              disabled={loading}
              autoFocus
            />
            <div className="text-xs text-gray-400 mt-1">
              {folderName.length}/50 characters
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Choose Icon
            </label>
            <div className="grid grid-cols-6 gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => !loading && setFolderIcon(icon)}
                  disabled={loading}
                  className={`p-2 rounded-lg text-xl hover:bg-white/10 transition-colors disabled:opacity-50 ${
                    folderIcon === icon 
                      ? 'bg-blue-600/30 border border-blue-500' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Choose Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => !loading && setFolderColor(color)}
                  disabled={loading}
                  className={`w-10 h-10 rounded-lg transition-all hover:scale-110 disabled:opacity-50 ${
                    folderColor === color ? 'ring-2 ring-white scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all"
                style={{ backgroundColor: folderColor }}
              >
                {folderIcon}
              </div>
              <div>
                <div className="text-white font-semibold">
                  {folderName.trim() || 'Folder Name'}
                </div>
                <div className="text-gray-400 text-sm">Preview</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl text-gray-300 border border-gray-600 hover:bg-gray-600/20 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !folderName.trim()}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Folder'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderModal;