// components/auth/SignupModal.jsx - ENHANCED VERSION
import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, ChevronDown } from 'lucide-react';

const SnapDocsLogo = () => (
  <div className="flex items-center space-x-3 group cursor-pointer justify-center">
    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg group-hover:scale-110 transition-all duration-300">
      <div className="absolute top-0 right-0 w-7 h-7 bg-gradient-to-bl from-cyan-400 to-cyan-600 transform rotate-45 translate-x-2 -translate-y-2"></div>
      <div className="text-white font-bold text-base z-10">SD</div>
      <div className="absolute bottom-1 right-1 w-4 h-2 bg-white rounded-sm opacity-80"></div>
    </div>
    <span className="text-2xl font-bold text-white group-hover:scale-110 transition-all duration-300">
      SnapDocs
    </span>
  </div>
);

const SignupModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onSwitchToLogin,
  loading = false 
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ code: '+91', flag: '🇮🇳', name: 'India' });
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const countries = [
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+1', flag: '🇺🇸', name: 'United States' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+86', flag: '🇨🇳', name: 'China' },
    { code: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: '+33', flag: '🇫🇷', name: 'France' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' },
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
      setShowPassword(false);
      setIsCountryOpen(false);
      setErrors({});
    }
  }, [isOpen]);

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        handleClose();
      }
    };

    const handleClickOutside = (e) => {
      if (isCountryOpen && !e.target.closest('.country-dropdown')) {
        setIsCountryOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, loading, isCountryOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const fullUsername = `${firstName.trim()} ${lastName.trim()}`;
    onSubmit({
      username: fullUsername,
      email,
      password
    });
  };

  const handleClose = () => {
    if (loading) return; // Prevent closing during loading
    
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhoneNumber('');
    setPassword('');
    setShowPassword(false);
    setIsCountryOpen(false);
    setErrors({});
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full relative shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Close button */}
        <button 
          onClick={handleClose} 
          disabled={loading}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Header */}
        <div className="text-center mb-8 pt-2">
          <SnapDocsLogo />
          <h2 className="text-3xl font-bold text-white mt-6 mb-2">Create Account</h2>
          <p className="text-gray-400">Join thousands securing their documents</p>
        </div>
        
        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                First Name *
              </label>
              <input
                type="text" 
                value={firstName} 
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errors.firstName) setErrors(prev => ({ ...prev, firstName: '' }));
                }}
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-400 focus:outline-none transition-colors ${
                  errors.firstName 
                    ? 'border-red-500 focus:border-red-400' 
                    : 'border-white/20 focus:border-blue-500'
                }`}
                placeholder="First name" 
                required 
                autoComplete="given-name"
                disabled={loading}
              />
              {errors.firstName && (
                <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Last Name *
              </label>
              <input
                type="text" 
                value={lastName} 
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName) setErrors(prev => ({ ...prev, lastName: '' }));
                }}
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-400 focus:outline-none transition-colors ${
                  errors.lastName 
                    ? 'border-red-500 focus:border-red-400' 
                    : 'border-white/20 focus:border-blue-500'
                }`}
                placeholder="Last name" 
                required 
                autoComplete="family-name"
                disabled={loading}
              />
              {errors.lastName && (
                <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
          
          {/* Email Field */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Email Address *
            </label>
            <input
              type="email" 
              value={email} 
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-400 focus:outline-none transition-colors ${
                errors.email 
                  ? 'border-red-500 focus:border-red-400' 
                  : 'border-white/20 focus:border-blue-500'
              }`}
              placeholder="Enter your email" 
              required 
              autoComplete="email"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          {/* Phone Number Field */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Phone Number (Optional)
            </label>
            <div className="flex gap-2">
              <div className="relative country-dropdown">
                <button
                  type="button"
                  onClick={() => !loading && setIsCountryOpen(!isCountryOpen)}
                  className="flex items-center gap-2 px-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  <span>{selectedCountry.flag}</span>
                  <span>{selectedCountry.code}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isCountryOpen && (
                  <div className="absolute top-full mt-1 left-0 bg-gray-800 rounded-xl border border-white/20 shadow-2xl z-10 w-64 max-h-48 overflow-y-auto">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(country);
                          setIsCountryOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-white text-left"
                      >
                        <span>{country.flag}</span>
                        <span>{country.code}</span>
                        <span className="text-sm text-gray-400">{country.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="tel" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                placeholder="Phone number" 
                autoComplete="tel"
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Password Field */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-400 focus:outline-none transition-colors pr-12 ${
                  errors.password 
                    ? 'border-red-500 focus:border-red-400' 
                    : 'border-white/20 focus:border-blue-500'
                }`}
                placeholder="Create a strong password" 
                required 
                minLength="6" 
                autoComplete="new-password"
                disabled={loading}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
            <div className="text-xs text-gray-400 mt-1">
              Password must be at least 6 characters long
            </div>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              'Create SnapDocs Account'
            )}
          </button>
        </form>
        
        {/* Switch to Login */}
        <div className="text-center mt-6">
          <span className="text-gray-400">Already have an account? </span>
          <button 
            onClick={onSwitchToLogin} 
            disabled={loading}
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;