// components/auth/SignupModal.jsx - ENHANCED WITH PASSWORD POLICY & REAL-TIME VALIDATION

import React, { useState, useEffect, useCallback } from 'react';
import { X, Eye, EyeOff, ChevronDown, CheckCircle, AlertCircle, Clock } from 'lucide-react';

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

const PasswordPolicyIndicator = ({ password, confirmPassword }) => {
  const [policy, setPolicy] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,  
    hasNumber: false,
    hasSpecial: false,
    passwordsMatch: false
  });

  useEffect(() => {
    if (!password) {
      setPolicy({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false,
        passwordsMatch: false
      });
      return;
    }

    setPolicy({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      passwordsMatch: password === confirmPassword && password.length > 0 && confirmPassword.length > 0
    });
  }, [password, confirmPassword]);

  const allValid = Object.values(policy).every(Boolean);
  const passwordValid = policy.minLength && policy.hasUppercase && policy.hasLowercase && policy.hasNumber && policy.hasSpecial;

  const PolicyItem = ({ isValid, text }) => (
    <div className={`flex items-center space-x-2 text-sm transition-colors duration-200 ${
      isValid ? 'text-green-400' : 'text-gray-400'
    }`}>
      {isValid ? (
        <CheckCircle className="w-4 h-4 text-green-400" />
      ) : (
        <div className="w-4 h-4 rounded-full border border-gray-500"></div>
      )}
      <span>{text}</span>
    </div>
  );

  return (
    <div className={`mt-2 p-3 rounded-lg border transition-all duration-300 ${
      allValid 
        ? 'bg-green-600/20 border-green-500/50' 
        : 'bg-gray-700/50 border-gray-600/50'
    }`}>
      <div className="text-sm font-medium text-white mb-2 flex items-center space-x-2">
        <span>Password Requirements</span>
        {allValid && <CheckCircle className="w-4 h-4 text-green-400" />}
      </div>
      
      <div className="space-y-1">
        <PolicyItem isValid={policy.minLength} text="At least 8 characters" />
        <PolicyItem isValid={policy.hasUppercase} text="One uppercase letter (A-Z)" />
        <PolicyItem isValid={policy.hasLowercase} text="One lowercase letter (a-z)" />
        <PolicyItem isValid={policy.hasNumber} text="One number (0-9)" />
        <PolicyItem isValid={policy.hasSpecial} text="One special character (!@#$%^&*)" />
        {confirmPassword && (
          <PolicyItem isValid={policy.passwordsMatch} text="Passwords match" />
        )}
      </div>
      
      {passwordValid && !confirmPassword && (
        <div className="mt-2 text-xs text-blue-300 bg-blue-600/20 px-2 py-1 rounded">
          ✓ Password meets all requirements. Now confirm your password.
        </div>
      )}
    </div>
  );
};

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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ code: '+91', flag: '🇮🇳', name: 'India' });
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Real-time validation states
  const [emailAvailability, setEmailAvailability] = useState({ checking: false, available: null, message: '' });
  const [usernameAvailability, setUsernameAvailability] = useState({ checking: false, available: null, message: '' });
  
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
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      setIsCountryOpen(false);
      setErrors({});
      setEmailAvailability({ checking: false, available: null, message: '' });
      setUsernameAvailability({ checking: false, available: null, message: '' });
    }
  }, [isOpen]);

  // Debounced email availability check
  const checkEmailAvailability = useCallback(
    debounce(async (emailToCheck) => {
      if (!emailToCheck || !/\S+@\S+\.\S+/.test(emailToCheck)) return;
      
      setEmailAvailability({ checking: true, available: null, message: 'Checking...' });
      
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/check-email-availability`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailToCheck })
        });

        const result = await response.json();
        
        if (response.ok) {
          setEmailAvailability({ 
            checking: false, 
            available: result.data.is_available,
            message: result.data.message
          });
        } else {
          setEmailAvailability({ checking: false, available: null, message: 'Error checking email' });
        }
      } catch (error) {
        setEmailAvailability({ checking: false, available: null, message: 'Error checking email' });
      }
    }, 800),
    []
  );

  // Debounced username availability check
  const checkUsernameAvailability = useCallback(
    debounce(async (usernameToCheck) => {
      if (!usernameToCheck || usernameToCheck.length < 3) return;
      
      setUsernameAvailability({ checking: true, available: null, message: 'Checking...' });
      
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/check-username-availability`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: usernameToCheck })
        });

        const result = await response.json();
        
        if (response.ok) {
          setUsernameAvailability({ 
            checking: false, 
            available: result.data.is_available,
            message: result.data.message
          });
        } else {
          setUsernameAvailability({ checking: false, available: null, message: 'Error checking username' });
        }
      } catch (error) {
        setUsernameAvailability({ checking: false, available: null, message: 'Error checking username' });
      }
    }, 800),
    []
  );

  // Handle email change with availability check
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
    
    if (newEmail && /\S+@\S+\.\S+/.test(newEmail)) {
      checkEmailAvailability(newEmail);
    } else {
      setEmailAvailability({ checking: false, available: null, message: '' });
    }
  };

  // Handle username change with availability check
  const handleUsernameChange = (field, value) => {
    if (field === 'firstName') {
      setFirstName(value);
    } else {
      setLastName(value);
    }
    
    const fullUsername = field === 'firstName' 
      ? `${value} ${lastName}`.trim()
      : `${firstName} ${value}`.trim();
    
    if (fullUsername.length >= 3) {
      checkUsernameAvailability(fullUsername);
    } else {
      setUsernameAvailability({ checking: false, available: null, message: '' });
    }
    
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

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
    } else if (emailAvailability.available === false) {
      newErrors.email = 'Email is already registered';
    }
    
    const fullUsername = `${firstName.trim()} ${lastName.trim()}`;
    if (usernameAvailability.available === false) {
      newErrors.firstName = 'This name combination is already taken';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      // Check password policy
      const hasMinLength = password.length >= 8;
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
        newErrors.password = 'Password does not meet security requirements';
      }
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      password,
      confirm_password: confirmPassword
    });
  };

  const handleClose = () => {
    if (loading) return;
    
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhoneNumber('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsCountryOpen(false);
    setErrors({});
    setEmailAvailability({ checking: false, available: null, message: '' });
    setUsernameAvailability({ checking: false, available: null, message: '' });
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const isFormValid = firstName && lastName && email && password && confirmPassword && 
                     password === confirmPassword && emailAvailability.available !== false &&
                     usernameAvailability.available !== false &&
                     password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && 
                     /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    <div 
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full relative shadow-2xl border border-white/10 max-h-[95vh] overflow-y-auto animate-scale-in">
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
                onChange={(e) => handleUsernameChange('firstName', e.target.value)}
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
                onChange={(e) => handleUsernameChange('lastName', e.target.value)}
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

          {/* Username Availability Indicator */}
          {(firstName || lastName) && (
            <div className={`p-3 rounded-lg border ${
              usernameAvailability.checking 
                ? 'bg-blue-600/20 border-blue-500/50'
                : usernameAvailability.available === true
                ? 'bg-green-600/20 border-green-500/50'
                : usernameAvailability.available === false
                ? 'bg-red-600/20 border-red-500/50'
                : 'bg-gray-700/50 border-gray-600/50'
            }`}>
              <div className="flex items-center space-x-2">
                {usernameAvailability.checking ? (
                  <Clock className="w-4 h-4 text-blue-400 animate-spin" />
                ) : usernameAvailability.available === true ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : usernameAvailability.available === false ? (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                ) : null}
                <div>
                  <div className="text-sm font-medium text-white">
                    Username: {`${firstName} ${lastName}`.trim()}
                  </div>
                  <div className={`text-xs ${
                    usernameAvailability.checking ? 'text-blue-300' :
                    usernameAvailability.available === true ? 'text-green-300' :
                    usernameAvailability.available === false ? 'text-red-300' :
                    'text-gray-400'
                  }`}>
                    {usernameAvailability.message || 'Enter your full name to check availability'}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Email Field */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Email Address *
            </label>
            <input
              type="email" 
              value={email} 
              onChange={handleEmailChange}
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-400 focus:outline-none transition-colors ${
                errors.email 
                  ? 'border-red-500 focus:border-red-400' 
                  : emailAvailability.available === false
                  ? 'border-red-500 focus:border-red-400'
                  : emailAvailability.available === true
                  ? 'border-green-500 focus:border-green-400'
                  : 'border-white/20 focus:border-blue-500'
              }`}
              placeholder="Enter your email" 
              required 
              autoComplete="email"
              disabled={loading}
            />
            
            {/* Email Availability Indicator */}
            {emailAvailability.message && (
              <div className={`flex items-center space-x-2 mt-1 text-xs ${
                emailAvailability.checking ? 'text-blue-300' :
                emailAvailability.available === true ? 'text-green-300' :
                emailAvailability.available === false ? 'text-red-300' :
                'text-gray-400'
              }`}>
                {emailAvailability.checking ? (
                  <Clock className="w-3 h-3 animate-spin" />
                ) : emailAvailability.available === true ? (
                  <CheckCircle className="w-3 h-3" />
                ) : emailAvailability.available === false ? (
                  <AlertCircle className="w-3 h-3" />
                ) : null}
                <span>{emailAvailability.message}</span>
              </div>
            )}
            
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
                minLength="8" 
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
            
            {/* Password Policy Indicator */}
            <PasswordPolicyIndicator password={password} confirmPassword={confirmPassword} />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword} 
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-400 focus:outline-none transition-colors pr-12 ${
                  errors.confirmPassword 
                    ? 'border-red-500 focus:border-red-400'
                    : password && confirmPassword && password === confirmPassword
                    ? 'border-green-500 focus:border-green-400'
                    : 'border-white/20 focus:border-blue-500'
                }`}
                placeholder="Confirm your password" 
                required 
                minLength="8" 
                autoComplete="new-password"
                disabled={loading}
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
            )}
            
            {/* Password Match Indicator */}
            {password && confirmPassword && (
              <div className={`flex items-center space-x-2 mt-2 text-sm ${
                password === confirmPassword ? 'text-green-400' : 'text-red-400'
              }`}>
                {password === confirmPassword ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>
                  {password === confirmPassword ? 'Passwords match!' : 'Passwords do not match'}
                </span>
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading || !isFormValid}
            className={`w-full text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg disabled:cursor-not-allowed ${
              loading || !isFormValid
                ? 'bg-gray-600 opacity-50'
                : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transform hover:scale-105'
            }`}
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

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default SignupModal;