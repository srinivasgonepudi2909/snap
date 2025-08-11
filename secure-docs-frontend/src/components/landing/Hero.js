import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="px-6 py-20">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
          Your Digital Vault
          <span className="block text-4xl md:text-5xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Secured & Organized
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Store, organize, and access your valuable documents, photos, and certificates with military-grade security. 
          Create custom folders and never lose important files again.
        </p>
        <Link to="/signup" className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl transition-colors shadow-xl hover:shadow-2xl">
          Get Started Free
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default Hero;
