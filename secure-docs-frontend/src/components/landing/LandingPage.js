import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from './Hero';
import Features from './Features';
import Benefits from './Benefits';
import CTA from './CTA';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-orange-100 to-blue-100">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">SecureDocs</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-6 py-2 text-white/80 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/signup" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-lg hover:scale-105 transition-transform">
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
