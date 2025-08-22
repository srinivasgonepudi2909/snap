import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Shield, Users, Award, Target, Heart } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 page-transition">
      <header className="bg-gray-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg group-hover:scale-110 transition-all duration-300">
                <div className="absolute top-0 right-0 w-7 h-7 bg-gradient-to-bl from-cyan-400 to-cyan-600 transform rotate-45 translate-x-2 -translate-y-2"></div>
                <div className="text-white font-bold text-base z-10">SD</div>
                <div className="absolute bottom-1 right-1 w-4 h-2 bg-white rounded-sm opacity-80"></div>
              </div>
              <span className="text-2xl font-bold text-white">SnapDocs</span>
            </Link>
            <Link to="/" className="flex items-center space-x-2 text-gray-300 hover:text-white font-bold transition-all duration-300 hover:scale-110">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-fade-in">
            <div className="w-40 h-40 mx-auto mb-8 relative">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 animate-scale-in">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <User className="w-20 h-20 text-gray-600" />
                </div>
              </div>
              <div className="absolute bottom-3 right-3 w-12 h-12 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
              About <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SnapDocs</span>
            </h1>
            <p className="text-2xl text-blue-400 font-semibold mb-4">Your Trusted Digital Document Partner</p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">Founded with a vision to revolutionize how people manage their digital documents</p>
          </div>

          {/* Mission Section */}
          <div className="mb-20">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-12 border border-white/20 text-center animate-slide-up">
              <Target className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                At SnapDocs, we believe your important documents deserve the highest level of security and organization. 
                We provide a secure, reliable way to store, organize, and manage your most valuable documents. Our mission 
                is to eliminate the stress of document management while ensuring your privacy and security are never compromised.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center group hover:bg-white/15 transition-all duration-300">
                <Shield className="w-16 h-16 text-blue-400 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold text-white mb-4">Security First</h3>
                <p className="text-gray-300">Military-grade encryption and security protocols to protect your most sensitive documents.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center group hover:bg-white/15 transition-all duration-300">
                <Users className="w-16 h-16 text-purple-400 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold text-white mb-4">User-Centric</h3>
                <p className="text-gray-300">Every feature is designed with our users in mind, ensuring simplicity and effectiveness.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center group hover:bg-white/15 transition-all duration-300">
                <Award className="w-16 h-16 text-green-400 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold text-white mb-4">Excellence</h3>
                <p className="text-gray-300">We strive for excellence in every aspect of our platform and customer service.</p>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 animate-slide-up">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Our Story</h2>
            <div className="max-w-4xl mx-auto text-gray-300 leading-relaxed space-y-6">
              <p className="text-lg">
                SnapDocs was born from a simple yet powerful idea: everyone deserves a secure, organized way to manage their digital documents. 
                In today's digital world, we accumulate countless important files - from personal identification to professional certificates, 
                property documents to cherished memories.
              </p>
              <p className="text-lg">
                Traditional storage methods often leave us vulnerable to loss, theft, or disorganization. Cloud storage solutions, while convenient, 
                often lack the specialized features needed for document management. We saw an opportunity to create something better.
              </p>
              <p className="text-lg">
                Founded by tech entrepreneur Gonepudi Srinivas, SnapDocs combines cutting-edge security with intuitive design. 
                Our platform is built on the principle that document management should be both secure and simple, accessible to everyone 
                regardless of their technical expertise.
              </p>
              <p className="text-lg">
                Today, we're proud to serve thousands of users worldwide, helping them protect and organize their most important documents. 
                From individual users managing personal files to businesses securing critical documents, SnapDocs has become the trusted 
                solution for digital document management.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;
