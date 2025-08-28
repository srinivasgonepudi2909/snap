// src/components/Home.jsx - Main Home Component (Fixed)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './home/Header';
import LoginModal from './home/LoginModal';
import SignupModal from './home/SignupModal';
import HeroSection from './home/HeroSection';
import FeaturesSection from './home/FeaturesSection';
import DocumentTypesSection from './home/DocumentTypesSection';
import TestimonialsSection from './home/TestimonialsSection';
import CTASection from './home/CTASection';
import Footer from './home/Footer';
import PopupModal from './dashboard/PopupModal';

const Home = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [activeModal, setActiveModal] = useState('login');
  const [userEmail, setUserEmail] = useState('');
  const [username, setUsername] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);

    if (!token) return;

    fetch(`${process.env.REACT_APP_BACKEND_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.email) setUserEmail(data.email);
        if (data?.username) {
          setUsername(data.username);
          localStorage.setItem('username', data.username);
        }
      })
      .catch((err) => console.error('Failed to fetch user info:', err));
  }, []);

  const showPopupMessage = (type, title, message, details = null, autoClose = false) => {
    setPopupConfig({ type, title, message, details, autoClose });
    setShowPopup(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUserEmail('');
    setUsername('');
    showPopupMessage(
      'success',
      'Logged Out Successfully!',
      'You have been safely logged out of your SnapDocs account.',
      ['Your session has been cleared', 'All data is secure', 'Come back anytime!'],
      true
    );
  };

  const openLogin = () => {
    setActiveModal('login');
    setIsLoginOpen(true);
  };

  const openSignup = () => {
    setActiveModal('signup');
    setIsSignupOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Header
        userEmail={userEmail}
        username={username}
        activeModal={activeModal}
        onLogin={openLogin}
        onSignup={openSignup}
        onLogout={handleLogout}
        onNavigateToDashboard={() => navigate('/dashboard')}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={(email, user) => {
          setUserEmail(email);
          setUsername(user);
          setIsLoginOpen(false);
          showPopupMessage(
            'success',
            'Welcome Back!',
            `Successfully logged in. Welcome back, ${user}!`
          );
          setTimeout(() => navigate('/dashboard'), 2000);
        }}
        onError={(error) => {
          showPopupMessage('error', 'Login Failed!', error);
        }}
        onSwitchToSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
          setActiveModal('signup');
        }}
      />

      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSuccess={(fullName) => {
          setIsSignupOpen(false);
          showPopupMessage(
            'success',
            'Account Created Successfully!',
            `Welcome to SnapDocs, ${fullName}! Your account is ready.`
          );
          setTimeout(() => {
            setIsLoginOpen(true);
            setActiveModal('login');
          }, 3000);
        }}
        onError={(error) => {
          showPopupMessage('error', 'Account Creation Failed!', error);
        }}
        onSwitchToLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
          setActiveModal('login');
        }}
      />

      <HeroSection
        userEmail={userEmail}
        username={username}
        onNavigateToDashboard={() => navigate('/dashboard')}
        onSignup={openSignup}
      />

      <FeaturesSection />
      <DocumentTypesSection />
      <TestimonialsSection />
      <CTASection
        userEmail={userEmail}
        onNavigateToDashboard={() => navigate('/dashboard')}
        onSignup={openSignup}
      />
      <Footer />

      <PopupModal
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        type={popupConfig.type}
        title={popupConfig.title}
        message={popupConfig.message}
        details={popupConfig.details}
        showOkButton={true}
        autoClose={popupConfig.autoClose}
        autoCloseDelay={3000}
      />
    </div>
  );
};

export default Home;