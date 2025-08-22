import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, FolderPlus, Upload, Smartphone, Shield, Search, Share2, Clock } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Sign up with your email and create a secure SnapDocs account. Choose a strong password and enable two-factor authentication for maximum security.",
      icon: UserPlus,
      color: "from-blue-500 to-blue-600",
      features: ["Email verification", "Strong password setup", "2FA optional", "Privacy settings"]
    },
    {
      number: "02", 
      title: "Create Custom Folders",
      description: "Organize with smart folders: ID Documents, Study Certificates, Property Documents, Business Files, and more. Create as many categories as you need.",
      icon: FolderPlus,
      color: "from-purple-500 to-purple-600",
      features: ["Unlimited folders", "Custom categories", "Smart suggestions", "Color coding"]
    },
    {
      number: "03",
      title: "Upload Your Documents", 
      description: "Drag and drop any file type with our advanced processing engine. Automatic file recognition, OCR text extraction, and smart tagging.",
      icon: Upload,
      color: "from-green-500 to-green-600",
      features: ["All file formats", "OCR scanning", "Auto-tagging", "Bulk upload"]
    },
    {
      number: "04",
      title: "Access Anywhere",
      description: "Your documents sync across all devices with real-time updates. Access from web, mobile, or desktop with offline capability.",
      icon: Smartphone,
      color: "from-orange-500 to-orange-600",
      features: ["Cross-platform", "Real-time sync", "Offline access", "Mobile apps"]
    }
  ];

  const additionalFeatures = [
    {
      icon: Shield,
      title: "Advanced Security",
      description: "AES-256 encryption, secure servers, and regular security audits"
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find documents instantly with AI-powered search and filtering"
    },
    {
      icon: Share2,
      title: "Secure Sharing",
      description: "Share documents securely with controlled access and expiration"
    },
    {
      icon: Clock,
      title: "Version Control",
      description: "Track changes and maintain multiple versions of your documents"
    }
  ];

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
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
              How <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SnapDocs</span> Works
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Simple, secure, and powerful document management in four easy steps. Get started in minutes and 
              transform how you manage your digital documents forever.
            </p>
            <div className="inline-flex items-center space-x-2 bg-blue-600/20 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-500/30">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">Setup takes less than 5 minutes</span>
            </div>
          </div>

          {/* Main Steps */}
          <div className="space-y-20 mb-20">
            {steps.map((step, index) => (
              <div key={step.number} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 animate-slide-up`}>
                <div className="flex-1 space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className={`w-24 h-24 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center text-white font-bold text-4xl shadow-2xl`}>
                      {step.number}
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold text-white">{step.title}</h2>
                      <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mt-2"></div>
                    </div>
                  </div>
                  <p className="text-xl text-gray-300 leading-relaxed">{step.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {step.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                        <span className="text-gray-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className={`w-80 h-80 bg-gradient-to-br ${step.color} rounded-3xl flex items-center justify-center shadow-2xl group hover:scale-105 transition-all duration-300`}>
                    <step.icon className="w-40 h-40 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Features */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Powerful Features <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Built In</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center group hover:bg-white/15 transition-all duration-300">
                  <feature.icon className="w-12 h-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Get <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Started?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of users who have already transformed their document management with SnapDocs. 
                Your digital vault awaits!
              </p>
              <Link
                to="/"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <UserPlus className="w-5 h-5" />
                <span>Create Your Account</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
