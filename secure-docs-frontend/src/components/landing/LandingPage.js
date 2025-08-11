import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from './Hero';
import Features from './Features';
import Benefits from './Benefits';
import CTA from './CTA';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">SecureDocs</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-6 py-2 text-white/80 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/signup" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <Hero />
      <Features />
      <Benefits />
      <CTA />
    </div>
  );
};

export default LandingPage;
