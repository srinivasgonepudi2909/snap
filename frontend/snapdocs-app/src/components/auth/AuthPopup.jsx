// components/auth/AuthPopup.jsx - Beautiful Authentication Popup System
import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  User, 
  Mail, 
  Lock, 
  X, 
  Sparkles,
  Shield,
  UserPlus
} from 'lucide-react';

const AuthPopup = ({ 
  isOpen, 
  onClose, 
  type = 'success', // 'success', 'error', 'loading'
  action = 'login', // 'login', 'signup'
  title, 
  message, 
  details = null,
  autoClose = true,
  autoCloseDelay = 4000
}) => {
  const [isClosing, setIsClosing] = useState(false);

  // Auto close functionality
  useEffect(() => {
    if (isOpen && autoClose && type !== 'loading') {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, type]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && type !== 'loading') {
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
  }, [isOpen, type]);

  const handleClose = () => {
    if (type === 'loading') return; // Prevent closing during loading
    
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  // Get configuration based on type and action
  const getPopupConfig = () => {
    const configs = {
      login: {
        success: {
          icon: CheckCircle,
          iconColor: 'text-green-400',
          bgGradient: 'from-green-600/30 via-emerald-600/20 to-green-500/30',
          borderColor: 'border-green-400/50',
          accentColor: 'from-green-500 to-emerald-600',
          title: title || 'Welcome Back! 🎉',
          emoji: '✅',
          sparkle: true
        },
        error: {
          icon: AlertCircle,
          iconColor: 'text-red-400',
          bgGradient: 'from-red-600/30 via-red-500/20 to-red-600/30',
          borderColor: 'border-red-400/50',
          accentColor: 'from-red-500 to-red-600',
          title: title || 'Login Failed ❌',
          emoji: '❌',
          sparkle: false
        },
        loading: {
          icon: Lock,
          iconColor: 'text-blue-400',
          bgGradient: 'from-blue-600/30 via-purple-600/20 to-blue-500/30',
          borderColor: 'border-blue-400/50',
          accentColor: 'from-blue-500 to-purple-600',
          title: title || 'Signing In... 🔐',
          emoji: '🔐',
          sparkle: true
        }
      },
      signup: {
        success: {
          icon: UserPlus,
          iconColor: 'text-purple-400',
          bgGradient: 'from-purple-600/30 via-violet-600/20 to-purple-500/30',
          borderColor: 'border-purple-400/50',
          accentColor: 'from-purple-500 to-violet-600',
          title: title || 'Account Created! 🚀',
          emoji: '🎊',
          sparkle: true
        },
        error: {
          icon: AlertCircle,
          iconColor: 'text-orange-400',
          bgGradient: 'from-orange-600/30 via-red-500/20 to-orange-600/30',
          borderColor: 'border-orange-400/50',
          accentColor: 'from-orange-500 to-red-600',
          title: title || 'Signup Failed ⚠️',
          emoji: '⚠️',
          sparkle: false
        },
        loading: {
          icon: User,
          iconColor: 'text-purple-400',
          bgGradient: 'from-purple-600/30 via-blue-600/20 to-purple-500/30',
          borderColor: 'border-purple-400/50',
          accentColor: 'from-purple-500 to-blue-600',
          title: title || 'Creating Account... 👤',
          emoji: '⏳',
          sparkle: true
        }
      }
    };

    return configs[action]?.[type] || configs.login.success;
  };

  const config = getPopupConfig();
  const Icon = config.icon;

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && type !== 'loading') {
      handleClose();
    }
  };

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-md z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
          isClosing ? 'opacity-0 backdrop-blur-none' : 'opacity-100'
        }`}
        onClick={handleBackdropClick}
      >
        {/* Popup Container */}
        <div 
          className={`
            relative bg-gradient-to-br ${config.bgGradient} backdrop-blur-xl rounded-3xl 
            border-2 ${config.borderColor} shadow-2xl w-full max-w-md overflow-hidden
            transition-all duration-500 transform
            ${isClosing 
              ? 'opacity-0 scale-75 -translate-y-8' 
              : 'opacity-100 scale-100 translate-y-0'
            }
          `}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            {config.sparkle && (
              <>
                <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
                <div className="absolute top-8 right-6 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-10 right-4 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </>
            )}
          </div>

          {/* Close button (not shown during loading) */}
          {type !== 'loading' && (
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 z-20 group"
              title="Close"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          )}

          {/* Content */}
          <div className="relative z-10 p-8 text-center">
            {/* Icon Section */}
            <div className="relative mb-6">
              {/* Main icon container */}
              <div className={`
                w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${config.accentColor} 
                flex items-center justify-center shadow-xl relative overflow-hidden
                ${type === 'loading' ? 'animate-pulse' : 'animate-bounce'}
              `}>
                {/* Icon shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer"></div>
                
                {type === 'loading' ? (
                  <div className="relative">
                    <Icon className={`w-10 h-10 ${config.iconColor} animate-spin`} />
                    <div className="absolute inset-0 w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
                  </div>
                ) : (
                  <Icon className={`w-10 h-10 text-white drop-shadow-lg`} />
                )}
              </div>

              {/* Floating emoji */}
              <div className={`
                absolute -top-2 -right-2 text-2xl animate-bounce bg-white/20 backdrop-blur-sm 
                rounded-full w-10 h-10 flex items-center justify-center border border-white/30
              `} style={{ animationDelay: '0.2s' }}>
                {config.emoji}
              </div>

              {/* Success sparkles */}
              {type === 'success' && config.sparkle && (
                <>
                  <Sparkles className="absolute -top-1 -left-1 w-4 h-4 text-yellow-300 animate-pulse" />
                  <Sparkles className="absolute -bottom-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </>
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">
              {config.title}
            </h2>

            {/* Message */}
            <p className="text-gray-100 text-lg mb-6 leading-relaxed drop-shadow-sm">
              {message}
            </p>

            {/* Details */}
            {details && (
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/10">
                <div className="text-sm text-gray-200">
                  {Array.isArray(details) ? (
                    <ul className="space-y-1">
                      {details.map((detail, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className="text-gray-400">•</span>
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

            {/* Loading indicator */}
            {type === 'loading' && (
              <div className="mb-4">
                <div className="flex justify-center space-x-1">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
                <p className="text-xs text-gray-300 mt-2">Please wait...</p>
              </div>
            )}

            {/* Action Buttons */}
            {type !== 'loading' && (
              <div className="space-y-3">
                <button
                  onClick={handleClose}
                  className={`
                    w-full bg-gradient-to-r ${config.accentColor} text-white py-3 px-6 rounded-xl 
                    font-semibold text-lg transition-all duration-300 transform hover:scale-105 
                    shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-white/20
                    relative overflow-hidden group
                  `}
                >
                  <span className="relative z-10">
                    {type === 'success' ? 'Continue' : 'Try Again'}
                  </span>
                  
                  {/* Button shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>

                {/* Auto close indicator */}
                {autoClose && (
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-300">
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse"></div>
                    <span>Auto-closes in {Math.ceil(autoCloseDelay / 1000)} seconds</span>
                  </div>
                )}
              </div>
            )}

            {/* Brand footer for success messages */}
            {type === 'success' && (
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center space-x-2">
                <Shield className="w-4 h-4 text-white/60" />
                <span className="text-xs text-white/60">Secured by SnapDocs</span>
              </div>
            )}
          </div>

          {/* Bottom gradient accent */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${config.accentColor}`}></div>
        </div>
      </div>

      {/* Add custom keyframes for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(300%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </>
  );
};

// Hook for managing auth popups
export const useAuthPopup = () => {
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'success',
    action: 'login',
    title: '',
    message: '',
    details: null
  });

  const showPopup = (config) => {
    setPopup({
      isOpen: true,
      ...config
    });
  };

  const hidePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  const showLoginSuccess = (username) => {
    showPopup({
      type: 'success',
      action: 'login',
      title: 'Welcome Back! 🎉',
      message: `Hello ${username}! You've successfully signed in to your SnapDocs vault.`,
      details: [
        '🔐 Your documents are securely encrypted',
        '📱 Access from any device, anywhere',
        '⚡ Lightning-fast document management',
        '🚀 Ready to organize your digital life!'
      ]
    });
  };

  const showLoginError = (errorMessage) => {
    showPopup({
      type: 'error',
      action: 'login',
      title: 'Login Failed ❌',
      message: 'We couldn\'t sign you in. Please check your credentials and try again.',
      details: [
        `❌ Error: ${errorMessage}`,
        '🔍 Double-check your email and password',
        '🔐 Ensure Caps Lock is off',
        '🌐 Check your internet connection'
      ]
    });
  };

  const showLoginLoading = () => {
    showPopup({
      type: 'loading',
      action: 'login',
      title: 'Signing You In... 🔐',
      message: 'Please wait while we securely authenticate your account.',
      details: null
    });
  };

  const showSignupSuccess = (username) => {
    showPopup({
      type: 'success',
      action: 'signup',
      title: 'Account Created! 🚀',
      message: `Welcome to SnapDocs, ${username}! Your secure digital vault is ready.`,
      details: [
        '🎊 Account successfully created',
        '📄 Start uploading your documents',
        '📁 Organize with custom folders',
        '🔒 Military-grade security enabled',
        '✨ Ready to transform your document management!'
      ]
    });
  };

  const showSignupError = (errorMessage) => {
    showPopup({
      type: 'error',
      action: 'signup',
      title: 'Signup Failed ⚠️',
      message: 'We encountered an issue creating your account. Please try again.',
      details: [
        `⚠️ Error: ${errorMessage}`,
        '📧 Use a valid email address',
        '🔒 Password must be at least 6 characters',
        '👤 Username must be unique',
        '🌐 Check your internet connection'
      ]
    });
  };

  const showSignupLoading = () => {
    showPopup({
      type: 'loading',
      action: 'signup',
      title: 'Creating Your Account... 👤',
      message: 'Setting up your secure SnapDocs vault with military-grade encryption.',
      details: null
    });
  };

  return {
    popup,
    showPopup,
    hidePopup,
    showLoginSuccess,
    showLoginError,
    showLoginLoading,
    showSignupSuccess,
    showSignupError,
    showSignupLoading
  };
};

export default AuthPopup;