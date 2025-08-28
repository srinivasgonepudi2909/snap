// components/home/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import SnapDocsLogo from './SnapDocsLogo';

const Footer = () => {
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
                <span>India 🇮🇳</span>
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