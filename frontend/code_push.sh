#!/bin/bash

# SnapDocs File Population Script
# This script adds code to all files, creating them if they don't exist

set -e  # Exit on any error

echo "🔧 Populating SnapDocs Application Files..."

# Get the project directory (default: snapdocs-app)
PROJECT_DIR=${1:-snapdocs-app}

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Project directory '$PROJECT_DIR' not found!"
    echo "💡 Run create_folder_structure.sh first or specify correct path"
    exit 1
fi

cd "$PROJECT_DIR"

echo "📁 Working in directory: $(pwd)"

# Function to create file with content if it doesn't exist, or overwrite if it does
create_or_update_file() {
    local file_path="$1"
    local content="$2"
    
    # Create directory if it doesn't exist
    mkdir -p "$(dirname "$file_path")"
    
    if [ -f "$file_path" ]; then
        echo "🔄 Updating existing file: $file_path"
    else
        echo "📝 Creating new file: $file_path"
    fi
    
    echo "$content" > "$file_path"
}

# 1. package.json
echo "📦 Creating package.json..."
create_or_update_file "package.json" '{
  "name": "snapdocs-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.4",
    "@testing-library/react": "^13.3.0",
    "@testing-library/user-event": "^13.5.0",
    "lucide-react": "^0.263.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}'

# 2. public/index.html
echo "🌐 Creating public/index.html..."
create_or_update_file "public/index.html" '<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="SnapDocs - Your documents, organized perfectly. Create custom folders, upload documents seamlessly, and access them anywhere." />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>SnapDocs - Document Management Made Simple</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>'

# 3. public/manifest.json
echo "📱 Creating public/manifest.json..."
create_or_update_file "public/manifest.json" '{
  "short_name": "SnapDocs",
  "name": "SnapDocs - Document Management",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}'

# 4. src/index.js
echo "⚛️ Creating src/index.js..."
create_or_update_file "src/index.js" 'import React from '\''react'\'';
import ReactDOM from '\''react-dom/client'\'';
import '\''./index.css'\'';
import SnapDocs from '\''./App'\'';

const root = ReactDOM.createRoot(document.getElementById('\''root'\''));
root.render(
  <React.StrictMode>
    <SnapDocs />
  </React.StrictMode>
);'

# 5. src/index.css
echo "🎨 Creating src/index.css..."
create_or_update_file "src/index.css" '@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, '\''Segoe UI'\'', '\''Roboto'\'', '\''Oxygen'\'',
    '\''Ubuntu'\'', '\''Cantarell'\'', '\''Fira Sans'\'', '\''Droid Sans'\'', '\''Helvetica Neue'\'',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  scroll-behavior: smooth;
}

/* Custom animations */
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0,-10px,0);
  }
  70% {
    transform: translate3d(0,-5px,0);
  }
  90% {
    transform: translate3d(0,-2px,0);
  }
}

.group:hover .group-hover\\:bounce {
  animation: bounce 1s;
}'

# 6. src/App.jsx (Main React Component)
echo "⚛️ Creating src/App.jsx..."
create_or_update_file "src/App.jsx" 'import React, { useState, useEffect } from '\''react'\'';
import { ChevronDown, Upload, Folder, Shield, Zap, Users, Star, ArrowRight, X, Eye, EyeOff } from '\''lucide-react'\'';

const SnapDocs = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('\''scroll'\'', handleScroll);
    return () => window.removeEventListener('\''scroll'\'', handleScroll);
  }, []);

  // SnapDocs Logo Component
  const SnapDocsLogo = ({ size = '\''normal'\'' }) => {
    const logoSize = size === '\''large'\'' ? '\''w-12 h-12'\'' : '\''w-8 h-8'\'';
    const textSize = size === '\''large'\'' ? '\''text-2xl'\'' : '\''text-xl'\'';
    
    return (
      <div className="flex items-center space-x-3">
        <div className={`${logoSize} bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg`}>
          <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-cyan-400 to-cyan-600 transform rotate-45 translate-x-2 -translate-y-2"></div>
          <div className="text-white font-bold text-sm z-10">SD</div>
          <div className="absolute bottom-1 right-1 w-3 h-2 bg-white rounded-sm opacity-80"></div>
          <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-blue-600 rounded-sm"></div>
          <div className="absolute bottom-0.5 right-1 w-3 h-0.5 bg-blue-600 rounded-sm"></div>
        </div>
        <span className={`${textSize} font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent`}>
          SnapDocs
        </span>
      </div>
    );
  };

  // Header Component
  const Header = () => (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? '\''bg-white/95 backdrop-blur-md shadow-lg'\'' : '\''bg-transparent'\''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <SnapDocsLogo />
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Features</a>
            <a href="#why-choose" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Why Choose Us</a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">About</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => setIsSignupOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
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
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-800 bg-clip-text text-transparent leading-tight">
              Your Documents,
              <br />
              <span className="text-blue-600">Organized Perfectly</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Create custom folders, upload documents seamlessly, and access them anywhere. 
              SnapDocs makes document management simple, secure, and beautiful.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setIsSignupOpen(true)}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="text-gray-700 hover:text-blue-600 font-semibold text-lg flex items-center space-x-2 group">
              <span>Watch Demo</span>
              <ChevronDown className="w-5 h-5 group-hover:bounce" />
            </button>
          </div>

          <div className="pt-8">
            <div className="flex flex-wrap justify-center items-center space-x-8 text-gray-500">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">50K+ Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">100% Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Features Section
  const FeaturesSection = () => (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Modern Teams</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage, organize, and collaborate on documents in one beautiful platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Folder className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Custom Folders</h3>
            <p className="text-gray-600 leading-relaxed">
              Create unlimited folders with custom names to organize your documents exactly how you want them.
            </p>
          </div>

          <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-100 hover:from-purple-100 hover:to-pink-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Easy Upload</h3>
            <p className="text-gray-600 leading-relaxed">
              Drag and drop or click to upload any document format. Support for PDFs, images, Word docs, and more.
            </p>
          </div>

          <div className="group p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Storage</h3>
            <p className="text-gray-600 leading-relaxed">
              Your documents are encrypted and stored securely with enterprise-grade security and privacy protection.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  // Why Choose Us Section
  const WhyChooseSection = () => (
    <section id="why-choose" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> SnapDocs?</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                We'\''ve built the most intuitive document management platform that grows with your needs.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                  <p className="text-gray-600">Upload and access your documents in seconds with our optimized infrastructure.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Collaboration</h3>
                  <p className="text-gray-600">Share folders and collaborate seamlessly with your team members.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bank-Level Security</h3>
                  <p className="text-gray-600">Your data is protected with 256-bit encryption and regular security audits.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <SnapDocsLogo />
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Folder className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium">Project Documents</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Folder className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium">Financial Reports</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Folder className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium">Team Resources</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Modal Component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  // Login Form
  const LoginForm = () => (
    <div className="space-y-4">
      <div>
        <div className="block text-sm font-medium text-gray-700 mb-1">Email</div>
        <input
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <div className="block text-sm font-medium text-gray-700 mb-1">Password</div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
        Don'\''t have an account?{'\'' '\'