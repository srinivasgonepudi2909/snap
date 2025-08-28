// src/components/home/Footer.jsx - Fixed version with proper imports
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const SnapDocsLogo = () => (
    <Link to="/" className="flex items-center space-x-3 group">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg group-hover:scale-110 transition-all duration-300">
        <div className="absolute top-0 right-0 w-7 h-7 bg-gradient-to-bl from-cyan-400 to-cyan-600 transform rotate-45 translate-x-2 -translate-y-2"></div>
        <div className="text-white font-bold text-base z-10">SD</div>
        <div className="absolute bottom-1 right-1 w-4 h-2 bg-white rounded-sm opacity-80"></div>
      </div>
      <span className="text-2xl font-bold text-white">SnapDocs</span>
    </Link>
  );

  return (
    <footer className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <SnapDocsLogo />
            <p className="text-gray-400 mt-4 max-w-md">
              Your trusted partner for secure document storage and organization. 
              Keep your digital life organized with military-grade security.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">About Us</Link>
              <Link to="/how-it-works" className="block text-gray-400 hover:text-white transition-colors">How It Works</Link>
              <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>srigonepudi@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>India</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 SnapDocs. All rights reserved. Made with ❤️ by Gonepudi Srinivas</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;