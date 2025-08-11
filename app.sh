#!/bin/bash

# SnapDocs Name Fix Script
# Updates all remaining SecureDocs references to SnapDocs

set -e

PROJECT_DIR="snapdocs-frontend"

echo "🔧 Fixing all SnapDocs references..."
echo "===================================="

if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Project directory '$PROJECT_DIR' not found!"
    exit 1
fi

cd $PROJECT_DIR

echo "📝 Updating HowItWorks.js navigation..."
sed -i 's/SecureDocs/SnapDocs/g' src/pages/HowItWorks.js

echo "📝 Updating Contact.js navigation..."
sed -i 's/SecureDocs/SnapDocs/g' src/pages/Contact.js

echo "📝 Updating all logo icons to SnapDocs custom logo..."

# Update HowItWorks navigation logo
cat > temp_how_it_works.js << 'EOF'
import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, FolderPlus, Upload, Smartphone, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up",
      description: "Create your secure account in just 30 seconds with your email address.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: FolderPlus,
      title: "Create Folders",
      description: "Organize your documents by creating custom folders for different categories.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Upload,
      title: "Upload Documents",
      description: "Drag and drop your valuable documents, photos, and certificates securely.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Smartphone,
      title: "Access Anywhere",
      description: "View and download your files from any device, anywhere in the world.",
      color: "from-orange-500 to-orange-600"
    }
  ];

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
            <Link to="/about" className="text-white/80 hover:text-white transition-colors">About</Link>
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
            How <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SnapDocs</span> Works
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            User signs up first, then logs into the app where they can create folders and upload valuable documents to access anywhere.
          </p>
          <Link 
            to="/signup" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-xl hover:scale-105 transition-transform"
          >
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Steps Section */}
      <div className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple 4-Step Process</h2>
            <p className="text-xl text-gray-300">Get up and running in minutes</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:scale-105 transition-transform">
                <div className="relative mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
EOF

mv temp_how_it_works.js src/pages/HowItWorks.js

# Update Contact page
cat > temp_contact.js << 'EOF'
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, ArrowRight, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

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
            <Link to="/about" className="text-white/80 hover:text-white transition-colors">About</Link>
            <Link to="/how-it-works" className="text-white/80 hover:text-white transition-colors">How It Works</Link>
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
            Get in <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions about SnapDocs? We're here to help you secure your digital life.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="px-6 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Author Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">GS</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Gonepudi Srinivas</h3>
              <p className="text-lg text-blue-400 mb-4">Founder & Lead Developer</p>
              <div className="flex items-center justify-center space-x-2 text-gray-300 mb-6">
                <Mail className="w-5 h-5" />
                <a href="mailto:srigonepudi@gmail.com" className="hover:text-blue-400 transition-colors">
                  srigonepudi@gmail.com
                </a>
              </div>
              <p className="text-gray-300 text-center">
                Passionate about creating secure applications. Contact me directly for any questions about SnapDocs!
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-8">Send us a Message</h2>
            
            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-lg flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-green-400 font-medium">Message sent successfully!</p>
                  <p className="text-green-300 text-sm">We'll get back to you within 24 hours.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Name"
                required
              />
              
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Email"
                required
              />

              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feature">Feature Request</option>
              </select>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Your Message"
                required
              ></textarea>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform"
              >
                Send Message
                <Send className="ml-2 w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
EOF

mv temp_contact.js src/pages/Contact.js

# Update About page logo
cat > temp_about.js << 'EOF'
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
EOF

mv temp_about.js src/pages/About.js

echo "✅ All SnapDocs references updated!"
echo "🔨 Rebuilding Docker image..."

# Rebuild Docker image
docker build -t snapdocs .

echo "🛑 Stopping old container..."
docker stop snapdocs-app 2>/dev/null || echo "No container running"

echo "🗑️ Removing old container..."
docker rm snapdocs-app 2>/dev/null || echo "No container to remove"

echo "🚀 Starting new SnapDocs container..."
docker run -d -p 80:80 --name snapdocs-app snapdocs

echo ""
echo "🎉 SnapDocs Updated & Deployed!"
echo "==============================="
echo "📝 App Name: SnapDocs (fully updated)"
echo "🎨 Custom logo: Document with checkmark accent"
echo "🌐 Access at: http://localhost"
echo "👤 Author: Gonepudi Srinivas"
echo ""
echo "✅ All SecureDocs references now changed to SnapDocs!"