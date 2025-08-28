// components/home/HeroSection.jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection = ({
  userEmail,
  username,
  onGetStartedClick,
  onDashboardClick
}) => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <div className="space-y-8 max-w-4xl mx-auto pt-20 animate-fade-in">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight animate-slide-up">
              Your Digital Vault
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Secured & Organized
              </span>
            </h1>
            {userEmail && (
              <p className="text-lg text-gray-300 animate-slide-up mt-2">
                👋 Welcome, <span className="font-semibold text-white">{username}</span>!
              </p>
            )}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Store, organize, and access your valuable documents, photos, and certificates with 
              military-grade security. Create custom folders and never lose important files again.
            </p>
          </div>

          <div className="pt-4 animate-scale-in">
            {userEmail ? (
              <button
                onClick={onDashboardClick}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-110 transition-all duration-300 shadow-2xl"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={onGetStartedClick}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-110 transition-all duration-300 shadow-2xl"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">10K+</div>
              <div className="text-gray-400">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">50M+</div>
              <div className="text-gray-400">Documents Stored</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;