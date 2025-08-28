// src/components/home/SignupModal.jsx - Fixed version
import React, { useState } from 'react';
import { X, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';

const SignupModal = ({ isOpen, onClose, onSuccess, onError, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const SnapDocsLogo = () => (
    <div className="flex items-center space-x-3 justify-center">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-7 h-7 bg-gradient-to-bl from-cyan-400 to-cyan-600 transform rotate-45 translate-x-2 -translate-y-2"></div>
        <div className="text-white font-bold text-lg z-10">SD</div>
        <div className="absolute bottom-1 right-1 w-4 h-2 bg-white rounded-sm opacity-80"></div>
      </div>
      <span className="text-2xl font-bold text-white">SnapDocs</span>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('📝 Attempting signup for:', { username, email });
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      console.log('📊 Signup response status:', response.status);
      const data = await response.json();
      console.log('📦 Signup response data:', data);
      
      if (response.ok && data.success) {
        console.log('✅ Signup successful');
        
        setUsername('');
        setEmail('');
        setPassword('');
        onSuccess(username);
      } else {
        const errorMessage = data.detail || 'Signup failed';
        console.error('❌ Signup failed:', errorMessage);
        setError(errorMessage);
        onError(errorMessage);
      }
    } catch (error) {
      console.error('🔥 Network error during signup:', error);
      const errorMessage = 'Network error. Please check your connection.';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full relative shadow-2xl border border-white/10">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-8">
          <SnapDocsLogo />
          <h2 className="text-3xl font-bold text-white mt-6 mb-2">Create Account</h2>
          <p className="text-gray-400">Join SnapDocs today</p>
        </div>
        
        {error && (
          <div className="bg-red-600/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-4 flex items-center space-x-2">
            <Lock className="w-5 h-5 text-red-400" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Choose a username"
                required
                autoComplete="username"
                minLength={3}
                maxLength={30}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Create a strong password"
                required
                autoComplete="new-password"
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Password must be at least 8 characters with uppercase, number, and special character
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              'Create SnapDocs Account'
            )}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <span className="text-gray-400">Already have an account? </span>
          <button
            onClick={onSwitchToLogin}
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;