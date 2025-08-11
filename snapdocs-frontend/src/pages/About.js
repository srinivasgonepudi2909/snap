import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, Heart, ArrowRight, CheckCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="px-6 py-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center relative shadow-lg">
              {/* Document Icon */}
              <div className="absolute inset-1 bg-white/20 rounded-lg"></div>
              <div className="absolute top-2 left-2 w-6 h-4 bg-white rounded-sm"></div>
              <div className="absolute top-3 left-3 w-4 h-0.5 bg-blue-600"></div>
              <div className="absolute top-4 left-3 w-3 h-0.5 bg-blue-600"></div>
              <div className="absolute bottom-2 right-1 w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded transform rotate-45"></div>
            </div>
            <span className="text-2xl font-bold text-white tracking-wide">SnapDocs</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-white/80 hover:text-white transition-colors">Home</Link>
            <Link to="/how-it-works" className="text-white/80 hover:text-white transition-colors">How It Works</Link>
            <Link to="/contact" className="text-white/80 hover:text-white transition-colors">Contact</Link>
            <Link to="/login" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SnapDocs</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We revolutionize how people store, organize, and access their important documents with security and simplicity.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-12">Meet Our Team</h2>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 max-w-2xl mx-auto border border-white/20">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl font-bold text-white">GS</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Gonepudi Srinivas</h3>
            <p className="text-lg text-blue-400 mb-4">Founder & Lead Developer</p>
            <p className="text-gray-300 mb-6">
              Passionate about creating secure applications that solve real-world problems. 
              Srinivas founded SnapDocs to help people organize their digital lives safely.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform"
            >
              Get in Touch
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
