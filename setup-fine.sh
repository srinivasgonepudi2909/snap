#!/bin/bash

# SnapDocs Final Deployment Script
# Complete deployment with all enhanced features
# - Beautiful About Us, How It Works, and Contact content
# - Enhanced forms with country selector and phone number
# - Dynamic button colors and zoom effects
# - Professional contact information

set -e

echo "🚀 SnapDocs Final Deployment"
echo "============================"
echo "📋 Features: Enhanced UI, Complete Content, Country Selector, Professional Contact"
echo ""

# Configuration
IMAGE_NAME="snapdocs-app"
IMAGE_VERSION="latest"
CONTAINER_NAME="snapdocs-container"
PORT="3000"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Stop existing container
echo -e "${BLUE}🛑 Stopping existing containers...${NC}"
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true
docker rmi $IMAGE_NAME:$IMAGE_VERSION 2>/dev/null || true

# Create Dockerfile
echo -e "${BLUE}🐳 Creating Dockerfile...${NC}"
cat > Dockerfile << 'EOF'
FROM node:18-alpine as build
WORKDIR /app
COPY package.json ./
RUN npm install --silent
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# Create nginx.conf
echo -e "${BLUE}🌐 Creating nginx.conf...${NC}"
cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, max-age=31536000";
        }
    }
}
EOF

# Create package.json
echo -e "${BLUE}📦 Creating package.json...${NC}"
cat > package.json << 'EOF'
{
  "name": "snapdocs-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "lucide-react": "^0.263.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
EOF

# Create public/index.html
echo -e "${BLUE}📄 Creating public/index.html...${NC}"
mkdir -p public
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="SnapDocs - Your Digital Vault Secured & Organized. Store, organize, and access your valuable documents with military-grade security." />
    <meta name="keywords" content="document management, secure storage, digital vault, file organization, cloud storage" />
    <meta name="author" content="Gonepudi Srinivas" />
    <title>SnapDocs - Your Digital Vault Secured & Organized</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📄</text></svg>">
  </head>
  <body>
    <noscript>You need to enable JavaScript to run SnapDocs application.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

# Create src/index.js
echo -e "${BLUE}📄 Creating src/index.js...${NC}"
mkdir -p src
cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SnapDocs from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SnapDocs />);
EOF

# Create src/index.css
echo -e "${BLUE}🎨 Creating src/index.css...${NC}"
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
EOF

# Create complete src/App.jsx with all features
echo -e "${BLUE}⚛️ Creating complete App.jsx...${NC}"
cat > src/App.jsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Upload, Folder, Shield, Check, Star, Lock, ArrowRight, Phone, Mail, User, ChevronDown } from 'lucide-react';

const SnapDocs = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState('login');
  const [selectedCountry, setSelectedCountry] = useState({ code: '+91', flag: '🇮🇳', name: 'India' });
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  const countries = [
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+1', flag: '🇺🇸', name: 'United States' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+86', flag: '🇨🇳', name: 'China' },
    { code: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: '+33', flag: '🇫🇷', name: 'France' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced SnapDocs Logo Component
  const SnapDocsLogo = () => {
    return (
      <div className="flex items-center space-x-3 group cursor-pointer">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg group-hover:scale-110 transition-all duration-300">
          <div className="absolute top-0 right-0 w-7 h-7 bg-gradient-to-bl from-cyan-400 to-cyan-600 transform rotate-45 translate-x-2 -translate-y-2"></div>
          <div className="text-white font-bold text-base z-10">SD</div>
          <div className="absolute bottom-1 right-1 w-4 h-2 bg-white rounded-sm opacity-80"></div>
          <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-blue-600 rounded-sm"></div>
          <div className="absolute bottom-0.5 right-1 w-4 h-0.5 bg-blue-600 rounded-sm"></div>
        </div>
        <span className="text-2xl font-bold text-white group-hover:scale-110 transition-all duration-300">
          SnapDocs
        </span>
      </div>
    );
  };

  // Header Component
  const Header = () => (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-900/95 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <SnapDocsLogo />
          
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setIsAboutOpen(true)}
              className="text-gray-300 hover:text-white transition-all duration-300 font-bold text-lg hover:scale-110 transform cursor-pointer"
            >
              About Us
            </button>
            <button 
              onClick={() => setIsHowItWorksOpen(true)}
              className="text-gray-300 hover:text-white transition-all duration-300 font-bold text-lg hover:scale-110 transform cursor-pointer"
            >
              How It Works
            </button>
            <button 
              onClick={() => setIsContactOpen(true)}
              className="text-gray-300 hover:text-white transition-all duration-300 font-bold text-lg hover:scale-110 transform cursor-pointer"
            >
              Contact
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setActiveModal('login');
                setIsLoginOpen(true);
              }}
              className={`font-bold text-lg transition-all duration-300 hover:scale-110 transform px-4 py-2 rounded-lg ${
                activeModal === 'login' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setActiveModal('signup');
                setIsSignupOpen(true);
              }}
              className={`font-bold text-lg transition-all duration-300 hover:scale-110 transform px-6 py-2 rounded-lg shadow-lg ${
                activeModal === 'signup' 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  // Hero Section
  const HeroSection = () => (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <div className="space-y-8 max-w-4xl mx-auto pt-20">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Your Digital Vault
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Secured & Organized
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Store, organize, and access your valuable documents, photos, and certificates with 
              military-grade security. Create custom folders and never lose important files again.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                setActiveModal('signup');
                setIsSignupOpen(true);
              }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-110 transition-all duration-300 shadow-2xl"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  // Features Section
  const FeaturesSection = () => (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 group hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Easy Upload</h3>
            <p className="text-gray-300 leading-relaxed">
              Drag and drop your documents, photos, and certificates. Support for all file types with instant upload processing.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 group hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Folder className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Smart Organization</h3>
            <p className="text-gray-300 leading-relaxed">
              Create custom folders and use intelligent search to find your documents instantly. Never lose track of important files.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Bank-Level Security</h3>
            <p className="text-gray-300 leading-relaxed">
              End-to-end encryption and secure cloud storage. Your sensitive documents are protected with military-grade security.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  // Why Choose Section
  const WhyChooseSection = () => (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">
          Why Choose SnapDocs?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          <div className="text-center group cursor-pointer hover:scale-110 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">99.9% Uptime</h3>
            <p className="text-gray-400">Always accessible</p>
          </div>

          <div className="text-center group cursor-pointer hover:scale-110 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">5-Star Rated</h3>
            <p className="text-gray-400">Loved by users</p>
          </div>

          <div className="text-center group cursor-pointer hover:scale-110 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Enterprise Security</h3>
            <p className="text-gray-400">Military-grade protection</p>
          </div>

          <div className="text-center group cursor-pointer hover:scale-110 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Unlimited Storage</h3>
            <p className="text-gray-400">Never worry about space</p>
          </div>
        </div>
      </div>
    </section>
  );

  // CTA Section
  const CTASection = () => (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Secure Your Documents?
        </h2>
        <p className="text-xl text-gray-300 mb-12">
          Join thousands who trust SnapDocs with their important files.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => {
              setActiveModal('signup');
              setIsSignupOpen(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-110 transition-all duration-300 shadow-2xl"
          >
            Start Free Trial
          </button>
          <button className="bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-700 transform hover:scale-110 transition-all duration-300">
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );

  // Profile Image Component
  const ProfileImage = () => (
    <div className="w-24 h-24 mx-auto mb-4 relative">
      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
            <User className="w-12 h-12 text-gray-600" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
    </div>
  );

  // Modal Component
  const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className={`bg-white rounded-2xl ${maxWidth} w-full p-6 transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors hover:scale-110 transform duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  // About Us Modal Content
  const AboutUsContent = () => (
    <div className="space-y-6">
      <ProfileImage />
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SnapDocs</h3>
        <p className="text-blue-600 font-semibold mb-4">Your Trusted Digital Document Partner</p>
      </div>
      
      <div className="text-gray-700 space-y-4">
        <p className="leading-relaxed">
          At SnapDocs, we believe that your important documents deserve the highest level of security and organization. 
          Founded with the vision of simplifying digital document management, we've created a platform that combines 
          cutting-edge security with intuitive design.
        </p>
        
        <p className="leading-relaxed">
          Our mission is to provide individuals and businesses with a secure, reliable, and accessible way to store, 
          organize, and manage their most valuable documents. From personal certificates and ID documents to business 
          contracts and property papers, SnapDocs ensures your files are always safe and within reach.
        </p>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-bold text-blue-900 mb-2">Why We're Different:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Military-grade encryption for maximum security</li>
            <li>• Intuitive folder organization system</li>
            <li>• 99.9% uptime guarantee</li>
            <li>• Access your documents from anywhere, anytime</li>
            <li>• Unlimited storage capacity</li>
          </ul>
        </div>

        <p className="leading-relaxed">
          Whether you're storing academic certificates, property documents, insurance papers, or business contracts, 
          SnapDocs provides the perfect solution for modern document management needs.
        </p>
      </div>
    </div>
  );

  // How It Works Modal Content
  const HowItWorksContent = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">How SnapDocs Works</h3>
        <p className="text-gray-600">Simple steps to secure document management</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Sign Up & Login</h4>
            <p className="text-gray-600 text-sm">Create your secure SnapDocs account with email verification and start your digital document journey.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Create Custom Folders</h4>
            <p className="text-gray-600 text-sm">Organize your documents with custom folders:</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-50 p-2 rounded flex items-center space-x-2">
                <Folder className="w-4 h-4 text-blue-500" />
                <span>📄 ID Documents</span>
              </div>
              <div className="bg-green-50 p-2 rounded flex items-center space-x-2">
                <Folder className="w-4 h-4 text-green-500" />
                <span>🎓 Study Certificates</span>
              </div>
              <div className="bg-orange-50 p-2 rounded flex items-center space-x-2">
                <Folder className="w-4 h-4 text-orange-500" />
                <span>🏠 Properties</span>
              </div>
              <div className="bg-purple-50 p-2 rounded flex items-center space-x-2">
                <Folder className="w-4 h-4 text-purple-500" />
                <span>💼 Business Docs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Upload Documents</h4>
            <p className="text-gray-600 text-sm">Open any folder and easily upload your documents with drag-and-drop functionality. Support for PDF, JPG, PNG, DOC, and more.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Access Anywhere</h4>
            <p className="text-gray-600 text-sm">Access your documents from any device, anywhere in the world. Your files are synchronized and always up-to-date.</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
        <h4 className="font-bold text-gray-900 mb-2">🔒 Security Features:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
          <div>• End-to-end encryption</div>
          <div>• Secure cloud storage</div>
          <div>• Two-factor authentication</div>
          <div>• Regular security audits</div>
        </div>
      </div>
    </div>
  );

  // Contact Modal Content
  const ContactContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <ProfileImage />
        <h3 className="text-2xl font-bold text-gray-900 mb-1">Gonepudi Srinivas</h3>
        <p className="text-blue-600 font-semibold mb-4">Founder & CEO, SnapDocs</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Email</h4>
            <a href="mailto:srigonepudi@gmail.com" className="text-blue-600 hover:text-blue-800">
              srigonepudi@gmail.com
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">About</h4>
            <p className="text-gray-600 text-sm">29 years old • Tech Entrepreneur • Document Security Expert</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
        <h4 className="font-bold text-gray-900 mb-3">Get in Touch</h4>
        <p className="text-gray-700 text-sm mb-4">
          Have questions about SnapDocs? Need help with your account? Want to provide feedback? 
          I'm here to help! Reach out anytime.
        </p>
        <div className="space-y-2 text-sm text-gray-600">
          <p>📍 Based in India 🇮🇳</p>
          <p>⏰ Response time: Usually within 24 hours</p>
          <p>💬 Available for: Support, Partnerships, Feedback</p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-500 text-sm">
          Thank you for choosing SnapDocs for your document management needs!
        </p>
      </div>
    </div>
  );

  // Country Selector Component
  const CountrySelector = () => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsCountryOpen(!isCountryOpen)}
        className="flex items-center space-x-2 px-3 py-3 border border-gray-300 rounded-l-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <span className="text-lg">{selectedCountry.flag}</span>
        <span className="text-sm font-medium text-gray-700">{selectedCountry.code}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>
      
      {isCountryOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          {countries.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => {
                setSelectedCountry(country);
                setIsCountryOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 transition-colors"
            >
              <span className="text-lg">{country.flag}</span>
              <span className="text-sm font-medium text-gray-700">{country.code}</span>
              <span className="text-sm text-gray-500 truncate">{country.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Login Form
  const LoginForm = () => (
    <div className="space-y-4">
      <div>
        <div className="block text-sm font-medium text-gray-700 mb-1">Email</div>
        <input
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:scale-[1.02] focus:scale-[1.02]"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <div className="block text-sm font-medium text-gray-700 mb-1">Password</div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 hover:scale-[1.02] focus:scale-[1.02]"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 hover:scale-110 transition-all duration-200"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <button
        type="button"
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
      >
        Sign In
      </button>
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => {
            setIsLoginOpen(false);
            setActiveModal('signup');
            setIsSignupOpen(true);
          }}
          className="text-blue-600 hover:text-blue-700 font-medium hover:scale-110 transition-all duration-200 inline-block transform"
        >
          Sign up
        </button>
      </p>
    </div>
  );

  // Signup Form
  const SignupForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">First Name</div>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:scale-[1.02] focus:scale-[1.02]"
            placeholder="John"
          />
        </div>
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">Last Name</div>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:scale-[1.02] focus:scale-[1.02]"
            placeholder="Doe"
          />
        </div>
      </div>
      
      <div>
        <div className="block text-sm font-medium text-gray-700 mb-1">Email</div>
        <input
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:scale-[1.02] focus:scale-[1.02]"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <div className="block text-sm font-medium text-gray-700 mb-1">Phone Number</div>
        <div className="flex">
          <CountrySelector />
          <input
            type="tel"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:scale-[1.02] focus:scale-[1.02]"
            placeholder="9876543210"
          />
        </div>
      </div>

      <div>
        <div className="block text-sm font-medium text-gray-700 mb-1">Password</div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 hover:scale-[1.02] focus:scale-[1.02]"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 hover:scale-110 transition-all duration-200"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="button"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
      >
        Create Account
      </button>
      
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => {
            setIsSignupOpen(false);
            setActiveModal('login');
            setIsLoginOpen(true);
          }}
          className="text-blue-600 hover:text-blue-700 font-medium hover:scale-110 transition-all duration-200 inline-block transform"
        >
          Sign in
        </button>
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <WhyChooseSection />
      <CTASection />

      {/* About Us Modal */}
      <Modal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        title="About SnapDocs"
        maxWidth="max-w-2xl"
      >
        <AboutUsContent />
      </Modal>

      {/* How It Works Modal */}
      <Modal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        title="How SnapDocs Works"
        maxWidth="max-w-2xl"
      >
        <HowItWorksContent />
      </Modal>

      {/* Contact Modal */}
      <Modal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        title="Contact Us"
        maxWidth="max-w-lg"
      >
        <ContactContent />
      </Modal>

      {/* Login Modal */}
      <Modal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        title="Welcome Back"
      >
        <LoginForm />
      </Modal>

      {/* Signup Modal */}
      <Modal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        title="Join SnapDocs"
      >
        <SignupForm />
      </Modal>
    </div>
  );
};

export default SnapDocs;
EOF

# Create .dockerignore
echo -e "${BLUE}🚫 Creating .dockerignore...${NC}"
cat > .dockerignore << 'EOF'
node_modules
npm-debug.log
build
.git
.gitignore
README.md
.env
coverage
.DS_Store
*.log
.nyc_output
EOF

# Create README.md
echo -e "${BLUE}📖 Creating README.md...${NC}"
cat > README.md << 'EOF'
# SnapDocs - Your Digital Vault

🔐 **Secure Document Management Made Simple**

## 🚀 Features

- **📁 Smart Organization** - Create custom folders for ID documents, study certificates, properties, and business docs
- **🔒 Bank-Level Security** - Military-grade encryption and secure cloud storage
- **📱 Access Anywhere** - Sync across all devices with 99.9% uptime
- **⚡ Easy Upload** - Drag and drop functionality for all file types
- **🌍 Multi-Country Support** - Phone number input with country selection
- **✨ Beautiful UI** - Modern design with smooth animations

## 👨‍💼 Contact

**Gonepudi Srinivas**  
Founder & CEO, SnapDocs  
📧 Email: srigonepudi@gmail.com  
🇮🇳 Based in India  
👨 29 years old Tech Entrepreneur

## 🏃‍♂️ Quick Start

```bash
# Development
npm install
npm start

# Production with Docker
./set-final.sh
```

## 🌐 Access

After deployment: http://localhost:3000

## 📋 Tech Stack

- React 18
- Tailwind CSS
- Lucide React Icons
- Docker & Nginx
- Responsive Design

Built with ❤️ for secure document management.
EOF

# Build and deploy
echo -e "${BLUE}🔨 Building Docker image...${NC}"
docker build --no-cache -t $IMAGE_NAME:$IMAGE_VERSION . || {
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
}

echo -e "${BLUE}🚀 Starting container...${NC}"
docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p $PORT:80 \
    $IMAGE_NAME:$IMAGE_VERSION || {
    echo -e "${RED}❌ Failed to start container!${NC}"
    exit 1
}

echo -e "${BLUE}✅ Verifying deployment...${NC}"
sleep 5

if docker ps | grep -q $CONTAINER_NAME; then
    echo ""
    echo -e "${GREEN}🎉 SUCCESS! SnapDocs Final Version is Live!${NC}"
    echo ""
    echo -e "${PURPLE}════════════════════════════════════════${NC}"
    echo -e "${PURPLE}   🚀 SNAPDOCS DEPLOYMENT COMPLETE 🚀   ${NC}"
    echo -e "${PURPLE}════════════════════════════════════════${NC}"
    echo ""
    echo -e "${GREEN}🌐 Access URLs:${NC}"
    echo -e "   🔗 Local: ${YELLOW}http://localhost:$PORT${NC}"
    
    # Try to get network IP
    NETWORK_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "YOUR_SERVER_IP")
    echo -e "   🔗 Network: ${YELLOW}http://$NETWORK_IP:$PORT${NC}"
    echo ""
    echo -e "${BLUE}📊 Container Status:${NC}"
    docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo ""
    echo -e "${GREEN}✨ Complete Features Deployed:${NC}"
    echo -e "   🎨 Beautiful purple gradient UI matching SecureDocs style"
    echo -e "   📏 App name increased by 20% with hover zoom effects"
    echo -e "   🔤 Bold navigation items (About Us, How It Works, Contact)"
    echo -e "   🔄 Dynamic button colors (Login = Blue, Signup = Purple)"
    echo -e "   📱 Enhanced signup form with phone number input"
    echo -e "   🌍 Country selector with flags (Default: India 🇮🇳 +91)"
    echo -e "   📋 Complete About Us content with company story"
    echo -e "   ⚙️  Detailed How It Works with folder examples"
    echo -e "   👨‍💼 Professional contact info: Gonepudi Srinivas"
    echo -e "   📧 Email: srigonepudi@gmail.com"
    echo -e "   🎯 29-year-old tech entrepreneur profile"
    echo -e "   💫 Zoom effects on all interactive elements"
    echo -e "   🔐 Professional modals with beautiful layouts"
    
    echo ""
    echo -e "${BLUE}📂 Document Organization Examples:${NC}"
    echo -e "   📄 ID Documents (Passport, License, etc.)"
    echo -e "   🎓 Study Certificates (Degrees, Courses)"
    echo -e "   🏠 Properties (Deeds, Insurance, etc.)"
    echo -e "   💼 Business Documents (Contracts, etc.)"
    
else
    echo -e "${RED}❌ Container failed to start!${NC}"
    echo -e "${RED}📋 Logs:${NC}"
    docker logs $CONTAINER_NAME 2>/dev/null || true
    exit 1
fi

echo -e "${BLUE}🧹 Cleaning up unused resources...${NC}"
docker image prune -f 2>/dev/null || true
docker container prune -f 2>/dev/null || true

echo ""
echo -e "${GREEN}🎉 SNAPDOCS FINAL DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
echo ""
echo -e "${BLUE}💡 Management Commands:${NC}"
echo -e "   📊 View logs: ${YELLOW}docker logs -f $CONTAINER_NAME${NC}"
echo -e "   ⏹️  Stop app: ${YELLOW}docker stop $CONTAINER_NAME${NC}"
echo -e "   🔄 Restart: ${YELLOW}docker restart $CONTAINER_NAME${NC}"
echo -e "   🔍 Inspect: ${YELLOW}docker inspect $CONTAINER_NAME${NC}"
echo ""
echo -e "${PURPLE}Thank you for using SnapDocs! 🙏${NC}"
echo -e "${PURPLE}Contact: srigonepudi@gmail.com${NC}"