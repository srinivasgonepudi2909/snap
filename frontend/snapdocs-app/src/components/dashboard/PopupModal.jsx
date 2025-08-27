// Create this file: frontend/snapdocs-app/src/components/dashboard/PopupModal.jsx
import React from 'react';
import { CheckCircle, AlertCircle, X, Trash2, Upload } from 'lucide-react';

const PopupModal = ({ 
  isOpen, 
  onClose, 
  type = 'success', // 'success', 'error', 'info', 'upload', 'delete'
  title, 
  message, 
  details = null,
  showOkButton = true,
  autoClose = false,
  autoCloseDelay = 3000
}) => {
  // Auto close functionality
  React.useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  // Handle escape key
  React.useEffect(() => {
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

  if (!isOpen) return null;

  // Get icon and colors based on type
  const getIconAndColors = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-400',
          bgColor: 'from-green-600/20 to-green-500/10',
          borderColor: 'border-green-500/50',
          buttonColor: 'from-green-600 to-green-700',
          buttonHover: 'hover:from-green-700 hover:to-green-800'
        };
      case 'error':
        return {
          icon: AlertCircle,
          iconColor: 'text-red-400',
          bgColor: 'from-red-600/20 to-red-500/10',
          borderColor: 'border-red-500/50',
          buttonColor: 'from-red-600 to-red-700',
          buttonHover: 'hover:from-red-700 hover:to-red-800'
        };
      case 'upload':
        return {
          icon: Upload,
          iconColor: 'text-blue-400',
          bgColor: 'from-blue-600/20 to-blue-500/10',
          borderColor: 'border-blue-500/50',
          buttonColor: 'from-blue-600 to-blue-700',
          buttonHover: 'hover:from-blue-700 hover:to-blue-800'
        };
      case 'delete':
        return {
          icon: Trash2,
          iconColor: 'text-orange-400',
          bgColor: 'from-orange-600/20 to-orange-500/10',
          borderColor: 'border-orange-500/50',
          buttonColor: 'from-orange-600 to-orange-700',
          buttonHover: 'hover:from-orange-700 hover:to-orange-800'
        };
      default:
        return {
          icon: CheckCircle,
          iconColor: 'text-blue-400',
          bgColor: 'from-blue-600/20 to-blue-500/10',
          borderColor: 'border-blue-500/50',
          buttonColor: 'from-blue-600 to-blue-700',
          buttonHover: 'hover:from-blue-700 hover:to-blue-800'
        };
    }
  };

  const { icon: Icon, iconColor, bgColor, borderColor, buttonColor, buttonHover } = getIconAndColors();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className={`
        bg-gradient-to-br ${bgColor} backdrop-blur-md rounded-2xl p-8 w-full max-w-md
        border ${borderColor} shadow-2xl animate-scale-in relative
      `}>
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
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Icon className={`w-16 h-16 ${iconColor}`} />
          </div>

          {/* Title */}
          {title && (
            <h2 className="text-2xl font-bold text-white mb-4">
              {title}
            </h2>
          )}

          {/* Message */}
          <p className="text-gray-300 text-lg mb-6 leading-relaxed">
            {message}
          </p>

          {/* Details */}
          {details && (
            <div className="bg-white/5 rounded-lg p-4 mb-6 text-left">
              <div className="text-sm text-gray-400">
                {Array.isArray(details) ? (
                  <ul className="space-y-1">
                    {details.map((detail, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="text-gray-500">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  details
                )}
              </div>
            </div>
          )}

          {/* OK Button */}
          {showOkButton && (
            <button
              onClick={onClose}
              className={`
                w-full bg-gradient-to-r ${buttonColor} ${buttonHover}
                text-white py-3 px-6 rounded-xl font-semibold text-lg
                transition-all duration-300 transform hover:scale-105 shadow-lg
                focus:outline-none focus:ring-4 focus:ring-white/20
              `}
            >
              OK
            </button>
          )}

          {/* Auto close indicator */}
          {autoClose && (
            <div className="mt-4 text-xs text-gray-500 flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
              <span>Auto-closing in {Math.ceil(autoCloseDelay / 1000)} seconds</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupModal;