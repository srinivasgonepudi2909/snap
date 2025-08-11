import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from './Hero';
import Features from './Features';
import Benefits from './Benefits';
import CTA from './CTA';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center relative shadow-lg">
              {/* Document Icon */}
              <div className="absolute inset-1 bg-white/20 rounded-lg"></div>
              <div className="absolute top-2 left-2 w-6 h-4 bg-white rounded-sm"></div>
              <div className="absolute top-3 left-3 w-4 h-0.5 bg-blue-600"></div>
              <div className="absolute top-4 left-3 w-3 h-0.5 bg-blue-600"></div>
              <div className="absolute bottom-2 right-1 w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded transform rotate-45"></div>
            </div>
            <span className="text-2xl font-bold text-white tracking-wide">SnapDocs</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/about" className="text-white/80 hover:text-white transition-colors font-medium">
              About Us
            </Link>
            <Link to="/how-it-works" className="text-white/80 hover:text-white transition-colors font-medium">
              How It Works
            </Link>
            <Link to="/contact" className="text-white/80 hover:text-white transition-colors font-medium">
              Contact
            </Link>
            <Link to="/login" className="px-6 py-2 text-white/80 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/signup" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform">
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
