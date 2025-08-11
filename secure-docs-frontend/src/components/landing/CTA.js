import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <div className="px-6 py-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Secure Your Documents?</h2>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Join thousands who trust SecureDocs with their important files.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl transition-colors shadow-xl hover:shadow-2xl">
            Start Free Trial
          </Link>
          <button className="px-8 py-4 bg-white/10 text-white text-lg font-semibold rounded-xl hover:bg-white/20 transition-colors">
            Watch Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default CTA;
