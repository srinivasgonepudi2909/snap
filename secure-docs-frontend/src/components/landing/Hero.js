import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="px-6 py-20">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-6xl font-bold mb-6 text-gray-800">
          Your Digital Vault
          <span className="block text-5xl bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            Secured & Organized
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Store, organize, and access your valuable documents, photos, and certificates with military-grade security. 
          Create custom folders and never lose important files again.
        </p>
        <Link to="/signup" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-orange-500 text-white text-lg font-semibold rounded-xl hover:scale-105 transition-transform">
          Get Started Free
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default Hero;
