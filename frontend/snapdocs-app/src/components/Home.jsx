// components/Home.jsx - FINAL MODULARIZED VERSION
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import modularized home components
import Header from './home/Header';
import HeroSection from './home/HeroSection';
import FeaturesSection from './home/FeaturesSection';
import DocumentTypesSection from './home/DocumentTypesSection';
import TestimonialsSection from './home/TestimonialsSection';
import CTASection from './home/CTASection';
import Footer from './home/Footer';

// Import auth components (from auth folder)
import LoginModal from './auth/LoginModal';
import SignupModal from './auth/SignupModal';
import AuthPopup, { useAuthPopup } from './auth/AuthPopup';

const Home = () => {
  const navigate = useNavigate();

  // Authentication popup hook
  const {
    popup,
    hidePopup,
    showLoginSuccess,
    showLoginError,
    showLoginLoading,
    showSignupSuccess,
    showSignupError,
    showSignupLoading
  } = useAuthPopup();

  // User state
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");

  // Modal states
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [activeModal, setActiveModal] = useState('login');
  const [authLoading, setAuthLoading] = useState(false);

  // Check for existing user session on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);

    if (!token) return;

    // Fetch user info if token exists
    fetch(`${process.env.REACT_APP_BACKEND_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.email) {
          setUserEmail(data.email);
        }
        if (data?.username) {
          setUsername(data.username);
          localStorage.setItem("username", data.username);
        }
      })
      .catch((err) => console.error("Failed to fetch user info:", err));
  }, []);

  // Authentication handlers
  const handleLogin = async (credentials) => {
    console.log("🔍 Login attempt started");
    setAuthLoading(true);
    showLoginLoading();

    try {
      console.log("🌐 Sending request to:", `${process.env.REACT_APP_BACKEND_URL}/login`);
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      console.log("📊 Response status:", response.status);
      const data = await response.json();
      console.log("📦 Response data:", data);

      if (response.ok && data.access_token) {
        console.log("✅ Login successful, storing token");
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('username', data.username || 'User');
        setUserEmail(credentials.email);
        setUsername(data.username || 'User');
        
        hidePopup();
        setTimeout(() => {
          showLoginSuccess(data.username || 'User');
        }, 200);
        
        setIsLoginOpen(false);
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        console.log("❌ Login failed");
        hidePopup();
        setTimeout(() => {
          showLoginError(data.detail || 'Invalid credentials. Please check your email and password.');
        }, 200);
      }
    } catch (error) {
      console.error("🔥 Login error", error);
      hidePopup();
      setTimeout(() => {
        showLoginError('Network error. Please check your internet connection and try again.');
      }, 200);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (userData) => {
    console.log("🚀 Signup attempt started");
    setAuthLoading(true);
    showSignupLoading();

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (response.ok && data.message) {
        console.log("✅ Signup successful");
        
        hidePopup();
        setTimeout(() => {
          showSignupSuccess(userData.username);
        }, 200);
        
        setIsSignupOpen(false);
        setIsLoginOpen(true);
        setActiveModal('login');
      } else {
        console.log("❌ Signup failed");
        hidePopup();
        setTimeout(() => {
          showSignupError(data.detail || 'Account creation failed. Please try again with different credentials.');
        }, 200);
      }
    } catch (error) {
      console.error("🔥 Signup error", error);
      hidePopup();
      setTimeout(() => {
        showSignupError('Network error. Please check your internet connection and try again.');
      }, 200);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUserEmail('');
    setUsername('');
  };

  // Modal handlers
  const handleLoginClick = () => {
    setActiveModal('login');
    setIsLoginOpen(true);
  };

  const handleSignupClick = () => {
    setActiveModal('signup');
    setIsSignupOpen(true);
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleSwitchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
    setActiveModal('signup');
  };

  const handleSwitchToLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
    setActiveModal('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <Header
        userEmail={userEmail}
        username={username}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onDashboardClick={handleDashboardClick}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <HeroSection
        userEmail={userEmail}
        username={username}
        onGetStartedClick={handleSignupClick}
        onDashboardClick={handleDashboardClick}
      />

      {/* Features Section */}
      <FeaturesSection />

      {/* Document Types Section */}
      <DocumentTypesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Call to Action Section */}
      <CTASection
        userEmail={userEmail}
        onGetStartedClick={handleSignupClick}
        onDashboardClick={handleDashboardClick}
      />

      {/* Footer */}
      <Footer />

      {/* Authentication Modals - Using auth folder components */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSubmit={handleLogin}
        onSwitchToSignup={handleSwitchToSignup}
        loading={authLoading}
      />

      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSubmit={handleSignup}
        onSwitchToLogin={handleSwitchToLogin}
        loading={authLoading}
      />

      {/* Authentication Popup */}
      <AuthPopup
        isOpen={popup.isOpen}
        onClose={hidePopup}
        type={popup.type}
        action={popup.action}
        title={popup.title}
        message={popup.message}
        details={popup.details}
      />
    </div>
  );
};

export default Home;