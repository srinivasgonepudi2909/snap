// components/home/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SnapDocsLogo from './SnapDocsLogo';

const Header = ({
  userEmail,
  username,
  onLoginClick,
  onSignupClick,
  onDashboardClick,
  onLogout
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-900/95 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <SnapDocsLogo />
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/about"
              className="text-gray-300 hover:text-white transition-all duration-300 font-bold text-lg hover:scale-110 transform cursor-pointer"
            >
              About Us
            </Link>
            <Link 
              to="/how-it-works"
              className="text-gray-300 hover:text-white transition-all duration-300 font-bold text-lg hover:scale-110 transform cursor-pointer"
            >
              How It Works
            </Link>
            <Link 
              to="/contact"
              className="text-gray-300 hover:text-white transition-all duration-300 font-bold text-lg hover:scale-110 transform cursor-pointer"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {userEmail ? (
              <div className="flex items-center space-x-4">
                <span className="text-white font-semibold">Hello, {username}</span>
                <button
                  onClick={onDashboardClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
                >
                  Dashboard
                </button>
                <button
                  onClick={onLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="font-bold text-lg transition-all duration-300 hover:scale-110 transform px-4 py-2 rounded-lg text-gray-300 hover:text-white"
                >
                  Login
                </button>
                <button
                  onClick={onSignupClick}
                  className="font-bold text-lg transition-all duration-300 hover:scale-110 transform px-6 py-2 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;