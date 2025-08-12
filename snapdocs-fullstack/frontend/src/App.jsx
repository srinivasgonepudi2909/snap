import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Upload, Folder, Shield, Check, Star, Lock, ArrowRight, Phone, Mail, User, ChevronDown } from 'lucide-react';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000';

const SnapDocs = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState('login');
  const [selectedCountry, setSelectedCountry] = useState({ code: '+91', flag: '🇮🇳', name: 'India' });
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const countries = [
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+1', flag: '🇺🇸', name: 'United States' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+86', flag: '🇨🇳', name: 'China' },
    { code: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: '+33', flag: '🇫🇷', name: 'France' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setIsLoggedIn(true);
    } catch (error) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    }
  };

  const handleSignup = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/v1/auth/signup', formData);
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        setUser(response.data.user);
        setIsLoggedIn(true);
        setIsSignupOpen(false);
        setError('');
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/v1/auth/login', formData);
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        setUser(response.data.user);
        setIsLoggedIn(true);
        setIsLoginOpen(false);
        setError('');
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
  };

  // If user is logged in, show dashboard
  if (isLoggedIn && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <header className="bg-gray-900/95 backdrop-blur-md shadow-lg">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <SnapDocsLogo />
              <div className="flex items-center space-x-4">
                <span className="text-white">Welcome, {user.first_name}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to SnapDocs Dashboard! 🎉
            </h1>
            <p className="text-xl text-gray-300">
              Your secure document vault is ready. Start uploading your valuable documents!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <Upload className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Upload Documents</h3>
              <p className="text-gray-300">Drag and drop your files here</p>
              <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Choose Files
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <Folder className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Create Folders</h3>
              <p className="text-gray-300">Organize your documents</p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                New Folder
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <Shield className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Security Settings</h3>
              <p className="text-gray-300">Manage your account security</p>
              <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Settings
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Enhanced SnapDocs Logo Component
  const SnapDocsLogo = () => {
    return (
      <div className="flex items-center space-x-3 group cursor-pointer">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg group-hover:scale-110 transition-all duration-300">
          <div className="absolute top-0 right-0 w-7 h-7 bg-gradient-to-bl from-cyan-400 to-cyan-600 transform rotate-45 translate-x-2 -translate-y-2"></div>
          <div className="text-white font-bold text-base z-10">SD</div>
          <div className="absolute bottom-1 right-1 w-4 h-2 bg-white rounded-sm opacity-80"></div>
          <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-blue-600 rounded-sm"></div>
          <div className="absolute bottom-0.5 right-1 w-4 h-0.5 bg-blue-600 rounded-sm"></div>
        </div>
        <span className="text-2xl font-bold text-white group-hover:scale-110 transition-all duration-300">
          SnapDocs
        </span>
      </div>
    );
  };

  // Login Form with API integration
  const LoginForm = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = (e) => {
      e.preventDefault();
      handleLogin(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">Email</div>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:scale-[1.02] focus:scale-[1.02]"
            placeholder="your@email.com"
            required
          />
        </div>
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">Password</div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 hover:scale-[1.02] focus:scale-[1.02]"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 hover:scale-110 transition-all duration-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    );
  };

  // Signup Form with API integration
  const SignupForm = () => {
    const [formData, setFormData] = useState({
      email: '', 
      first_name: '', 
      last_name: '', 
      phone_number: '', 
      country_code: selectedCountry.code, 
      password: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      handleSignup({...formData, country_code: selectedCountry.code});
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">First Name</div>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:scale-[1.02] focus:scale-[1.02]"
              placeholder="John"
              required
            />
          </div>
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">Last Name</div>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:scale-[1.02] focus:scale-[1.02]"
              placeholder="Doe"
              required
            />
          </div>
        </div>
        
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">Email</div>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:scale-[1.02] focus:scale-[1.02]"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">Phone Number</div>
          <div className="flex">
            <CountrySelector />
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:scale-[1.02] focus:scale-[1.02]"
              placeholder="9876543210"
            />
          </div>
        </div>

        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">Password</div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 hover:scale-[1.02] focus:scale-[1.02]"
              placeholder="••••••••"
              required
              minLength="8"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 hover:scale-110 transition-all duration-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    );
  };

  // Country Selector Component
  const CountrySelector = () => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsCountryOpen(!isCountryOpen)}
        className="flex items-center space-x-2 px-3 py-3 border border-gray-300 rounded-l-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <span className="text-lg">{selectedCountry.flag}</span>
        <span className="text-sm font-medium text-gray-700">{selectedCountry.code}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>
      
      {isCountryOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          {countries.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => {
                setSelectedCountry(country);
                setIsCountryOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 transition-colors"
            >
              <span className="text-lg">{country.flag}</span>
              <span className="text-sm font-medium text-gray-700">{country.code}</span>
              <span className="text-sm text-gray-500 truncate">{country.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Rest of your existing components (Header, HeroSection, etc.) remain the same...
  // Just include the Modal, Header, HeroSection, FeaturesSection, etc. from your original code

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Include all your existing components here */}
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-white mb-8">SnapDocs Frontend Connected to Backend!</h1>
        <div className="space-x-4">
          <button
            onClick={() => setIsLoginOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Login
          </button>
          <button
            onClick={() => setIsSignupOpen(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Test Signup
          </button>
        </div>
      </div>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <button onClick={() => setIsLoginOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <LoginForm />
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {isSignupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Join SnapDocs</h2>
              <button onClick={() => setIsSignupOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <SignupForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default SnapDocs;
