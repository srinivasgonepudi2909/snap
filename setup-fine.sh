#!/bin/bash

# SnapDocs Complete Enhanced Deployment
# Full home page layout + Enhanced separate pages with smooth transitions
# Combines the best features from both scripts

set -e

echo "🚀 SnapDocs Complete Enhanced Deployment"
echo "======================================"
echo "📋 Features: Full Home Layout + Enhanced Separate Pages + Smooth Transitions"
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
    "react-router-dom": "^6.8.0",
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
    <title>SnapDocs - Your Digital Vault Secured & Organized</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            animation: {
              'fade-in': 'fadeIn 0.8s ease-out',
              'slide-up': 'slideUp 0.6s ease-out',
              'scale-in': 'scaleIn 0.5s ease-out',
              'bounce-slow': 'bounce 2s infinite'
            },
            keyframes: {
              fadeIn: {
                '0%': { opacity: '0' },
                '100%': { opacity: '1' }
              },
              slideUp: {
                '0%': { opacity: '0', transform: 'translateY(30px)' },
                '100%': { opacity: '1', transform: 'translateY(0)' }
              },
              scaleIn: {
                '0%': { opacity: '0', transform: 'scale(0.95)' },
                '100%': { opacity: '1', transform: 'scale(1)' }
              }
            }
          }
        }
      }
    </script>
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
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
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
  background: linear-gradient(135deg, #1f2937 0%, #7c3aed 50%, #8b5cf6 100%);
  min-height: 100vh;
}

html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Page transitions */
.page-transition {
  animation: pageEnter 0.6s ease-out;
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
EOF

# Create main App.jsx with routing
echo -e "${BLUE}⚛️ Creating App.jsx with routing...${NC}"
cat > src/App.jsx << 'EOF'
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import HowItWorks from './components/HowItWorks';
import Contact from './components/Contact';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default App;
EOF

# Create components directory
echo -e "${BLUE}📁 Creating component files...${NC}"
mkdir -p src/components

# Create complete Home component with full layout
echo -e "${BLUE}🏠 Creating complete Home component...${NC}"
cat > src/components/Home.jsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Folder, Shield, Check, Star, Lock, ArrowRight, X, Eye, EyeOff, ChevronDown, 
         FileText, Users, Award, Phone, Mail, MapPin, Calendar } from 'lucide-react';

const Home = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
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

  const SnapDocsLogo = () => (
    <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg group-hover:scale-110 transition-all duration-300">
        <div className="absolute top-0 right-0 w-7 h-7 bg-gradient-to-bl from-cyan-400 to-cyan-600 transform rotate-45 translate-x-2 -translate-y-2"></div>
        <div className="text-white font-bold text-base z-10">SD</div>
        <div className="absolute bottom-1 right-1 w-4 h-2 bg-white rounded-sm opacity-80"></div>
      </div>
      <span className="text-2xl font-bold text-white group-hover:scale-110 transition-all duration-300">
        SnapDocs
      </span>
    </Link>
  );

  const Header = () => (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-900/95 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <SnapDocsLogo />
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/about"
              className="text-gray-300 hover:text-white transition-all duration-300 font-bold text-lg hover:scale-110 transform cursor-pointer"
            >
              About Us
            </Link>
            <Link 
              to="/how-it-works"
              className="text-gray-300 hover:text-white transition-all duration-300 font-bold text-lg hover:scale-110 transform cursor-pointer"
            >
              How It Works
            </Link>
            <Link 
              to="/contact"
              className="text-gray-300 hover:text-white transition-all duration-300 font-bold text-lg hover:scale-110 transform cursor-pointer"
            >
              Contact
            </Link>
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

  // Login Modal Component
  const LoginModal = () => (
    isLoginOpen && (
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full relative shadow-2xl border border-white/10 animate-scale-in">
          <button
            onClick={() => setIsLoginOpen(false)}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <SnapDocsLogo />
            <h2 className="text-3xl font-bold text-white mt-6 mb-2">Welcome Back</h2>
            <p className="text-gray-400">Login to access your digital vault</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Login to SnapDocs
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-400">Don't have an account? </span>
            <button
              onClick={() => {
                setIsLoginOpen(false);
                setIsSignupOpen(true);
                setActiveModal('signup');
              }}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Sign up here
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Signup Modal Component
  const SignupModal = () => (
    isSignupOpen && (
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full relative shadow-2xl border border-white/10 animate-scale-in max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setIsSignupOpen(false)}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <SnapDocsLogo />
            <h2 className="text-3xl font-bold text-white mt-6 mb-2">Create Account</h2>
            <p className="text-gray-400">Join thousands securing their documents</p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">First Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Last Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Last name"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Phone Number</label>
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCountryOpen(!isCountryOpen)}
                    className="flex items-center gap-2 px-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-colors"
                  >
                    <span>{selectedCountry.flag}</span>
                    <span>{selectedCountry.code}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {isCountryOpen && (
                    <div className="absolute top-full mt-1 left-0 bg-gray-800 rounded-xl border border-white/20 shadow-2xl z-10 w-64">
                      {countries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            setIsCountryOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-white text-left"
                        >
                          <span>{country.flag}</span>
                          <span>{country.code}</span>
                          <span className="text-sm text-gray-400">{country.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="tel"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Phone number"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors pr-12"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Create SnapDocs Account
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-400">Already have an account? </span>
            <button
              onClick={() => {
                setIsSignupOpen(false);
                setIsLoginOpen(true);
                setActiveModal('login');
              }}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Login here
            </button>
          </div>
        </div>
      </div>
    )
  );

  const features = [
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Drag and drop your documents or browse to upload. Support for all file types including PDF, images, and office documents."
    },
    {
      icon: Folder,
      title: "Smart Organization",
      description: "Create custom folders for different document types. Organize by category, date, or any system that works for you."
    },
    {
      icon: Shield,
      title: "Military-Grade Security",
      description: "Your documents are encrypted with AES-256 encryption. Multi-factor authentication and secure cloud storage."
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      content: "SnapDocs has revolutionized how I manage my documents. Everything is organized and secure in one place.",
      rating: 5,
      avatar: "👩‍💻"
    },
    {
      name: "Raj Patel",
      role: "Business Owner",
      content: "The folder system is incredible. I can find any document in seconds. Perfect for my business needs.",
      rating: 5,
      avatar: "👨‍💼"
    },
    {
      name: "Dr. Ananya Kumar",
      role: "Medical Professional",
      content: "Security is paramount for medical documents. SnapDocs gives me peace of mind with their encryption.",
      rating: 5,
      avatar: "👩‍⚕️"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Header />
      <LoginModal />
      <SignupModal />
      
      {/* Hero Section */}
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
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slide-up">
                Store, organize, and access your valuable documents, photos, and certificates with 
                military-grade security. Create custom folders and never lose important files again.
              </p>
            </div>

            <div className="pt-4 animate-scale-in">
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

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SnapDocs?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Powerful features designed to keep your documents safe, organized, and easily accessible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Document Types Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Organize Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Digital Life</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Create custom folders for different types of documents and keep everything perfectly organized
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "📄", title: "ID Documents", desc: "Passport, License, Aadhar, PAN Card" },
              { icon: "🎓", title: "Certificates", desc: "Degrees, Courses, Awards, Diplomas" },
              { icon: "🏠", title: "Property Docs", desc: "Deeds, Insurance, Agreements" },
              { icon: "💼", title: "Business Files", desc: "Contracts, Invoices, Reports" },
              { icon: "🏥", title: "Medical Records", desc: "Reports, Prescriptions, Insurance" },
              { icon: "💰", title: "Financial", desc: "Bank Statements, Tax Records, Investments" },
              { icon: "✈️", title: "Travel", desc: "Tickets, Visas, Bookings, Itineraries" },
              { icon: "📱", title: "Personal", desc: "Photos, Notes, Memories, Receipts" }
            ].map((type, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{type.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{type.title}</h3>
                <p className="text-gray-400 text-sm">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Loved by <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Thousands</span>
            </h2>
            <p className="text-xl text-gray-400">See what our users say about SnapDocs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Secure Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Digital Vault?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust SnapDocs with their most important documents. 
              Start organizing your digital life today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setActiveModal('signup');
                  setIsSignupOpen(true);
                }}
                className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/15 transition-all duration-300 border border-white/20"
              >
                <span>Learn More</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <SnapDocsLogo />
              <p className="text-gray-400 mt-4 max-w-md">
                Your trusted partner for secure document storage and organization. 
                Keep your digital life organized with military-grade security.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">About Us</Link>
                <Link to="/how-it-works" className="block text-gray-400 hover:text-white transition-colors">How It Works</Link>
                <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors">Contact</Link>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>srigonepudi@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>India 🇮🇳</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SnapDocs. All rights reserved. Made with ❤️ by Gonepudi Srinivas</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
EOF

echo -e "${BLUE}📖 Creating enhanced AboutUs component...${NC}"
cat > src/components/AboutUs.jsx << 'EOF'
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
EOF

echo -e "${BLUE}⚙️ Creating enhanced HowItWorks component...${NC}"
cat > src/components/HowItWorks.jsx << 'EOF'
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
EOF

echo -e "${BLUE}📞 Creating enhanced Contact component...${NC}"
cat > src/components/Contact.jsx << 'EOF'
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, User, MapPin, Clock, Phone, MessageCircle, Calendar, Award } from 'lucide-react';

const Contact = () => {
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
            <div className="w-48 h-48 mx-auto mb-8 relative">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 animate-scale-in">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <User className="w-24 h-24 text-gray-600" />
                </div>
              </div>
              <div className="absolute bottom-4 right-4 w-14 h-14 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Gonepudi Srinivas</span>
            </h1>
            <div className="space-y-3 mb-8">
              <p className="text-3xl text-blue-400 font-semibold">Founder & CEO, SnapDocs</p>
              <p className="text-xl text-gray-400">29 years old • Tech Entrepreneur • Document Security Expert</p>
              <div className="flex items-center justify-center space-x-8 text-gray-400 flex-wrap">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-orange-400" />
                  <span>Based in India 🇮🇳</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span>Usually responds within 24 hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span>5+ Years in Tech</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Primary Contact */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-8 border border-white/20 group hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-300">
              <div className="text-center">
                <Mail className="w-16 h-16 text-blue-400 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold text-white mb-4">Primary Contact</h3>
                <a 
                  href="mailto:srigonepudi@gmail.com"
                  className="text-2xl text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline block mb-4"
                >
                  srigonepudi@gmail.com
                </a>
                <p className="text-gray-300">
                  For all inquiries including support, partnerships, feedback, or general questions about SnapDocs.
                </p>
              </div>
            </div>

            {/* Business Inquiries */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-3xl p-8 border border-white/20 group hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-300">
              <div className="text-center">
                <Phone className="w-16 h-16 text-purple-400 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold text-white mb-4">Business Hours</h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="w-5 h-5 text-green-400" />
                    <span>Monday - Friday: 9 AM - 6 PM IST</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span>Weekend: Emergency support only</span>
                  </div>
                </div>
                <p className="text-gray-300 mt-4">
                  Available for urgent matters and business partnerships during extended hours.
                </p>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 mb-16 animate-slide-up">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">About the Founder</h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Gonepudi Srinivas is a passionate tech entrepreneur with over 5 years of experience in building 
                    secure digital solutions. With a background in computer science and cybersecurity, he founded 
                    SnapDocs to address the growing need for secure document management in the digital age.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    His vision for SnapDocs stems from personal experience with document loss and the frustration 
                    of existing solutions that compromise either security or usability. Under his leadership, 
                    SnapDocs has grown to serve thousands of users worldwide.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-2">Expertise</h3>
                    <div className="grid grid-cols-2 gap-2 text-gray-300">
                      <div>• Cybersecurity</div>
                      <div>• Cloud Architecture</div>
                      <div>• Product Design</div>
                      <div>• User Experience</div>
                      <div>• Data Privacy</div>
                      <div>• Scalable Systems</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Get in <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Touch</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Mail,
                  title: "General Support",
                  description: "Questions about features, billing, or technical issues",
                  contact: "srigonepudi@gmail.com",
                  color: "from-blue-500 to-blue-600"
                },
                {
                  icon: MessageCircle,
                  title: "Feedback & Suggestions",
                  description: "Share your ideas for improving SnapDocs",
                  contact: "srigonepudi@gmail.com",
                  color: "from-green-500 to-green-600"
                },
                {
                  icon: Award,
                  title: "Business Partnerships",
                  description: "Collaboration opportunities and enterprise solutions",
                  contact: "srigonepudi@gmail.com",
                  color: "from-purple-500 to-purple-600"
                }
              ].map((method, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center group hover:bg-white/15 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{method.description}</p>
                  <a 
                    href={`mailto:${method.contact}`}
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline"
                  >
                    {method.contact}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Response Time */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <Clock className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Quick Response Guaranteed</h3>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
                I personally read and respond to every email. You can expect a response within 24 hours, 
                often much sooner during business hours.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-400">< 4 hours</div>
                  <div className="text-gray-400">Business Hours</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-400">< 24 hours</div>
                  <div className="text-gray-400">General Inquiries</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-400">< 1 hour</div>
                  <div className="text-gray-400">Critical Issues</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
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
    echo -e "${GREEN}🎉 SUCCESS! Complete Enhanced SnapDocs is Live!${NC}"
    echo ""
    echo -e "${PURPLE}════════════════════════════════════════${NC}"
    echo -e "${PURPLE}   🌟 COMPLETE SNAPDOCS DEPLOYED 🌟    ${NC}"
    echo -e "${PURPLE}════════════════════════════════════════${NC}"
    echo ""
    echo -e "${GREEN}🌐 Access URLs:${NC}"
    echo -e "   🏠 Home (Full Layout): ${YELLOW}http://localhost:$PORT${NC}"
    echo -e "   📖 Enhanced About Us: ${YELLOW}http://localhost:$PORT/about${NC}"
    echo -e "   ⚙️  Enhanced How It Works: ${YELLOW}http://localhost:$PORT/how-it-works${NC}"
    echo -e "   📞 Enhanced Contact: ${YELLOW}http://localhost:$PORT/contact${NC}"
    
    # Try to get network IP
    NETWORK_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "YOUR_SERVER_IP")
    echo -e "   🌍 Network: ${YELLOW}http://$NETWORK_IP:$PORT${NC}"
    echo ""
    echo -e "${BLUE}📊 Container Status:${NC}"
    docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo ""
    echo -e "${GREEN}✨ Complete Features:${NC}"
    echo -e "   🏠 FULL HOME PAGE LAYOUT:"
    echo -e "      • Hero section with call-to-action"
    echo -e "      • Complete features showcase"
    echo -e "      • Document types organization grid"
    echo -e "      • Customer testimonials"
    echo -e "      • Statistics and social proof"
    echo -e "      • Complete footer with links"
    echo -e "      • Working login/signup modals"
    echo -e "      • Responsive header navigation"
    
    echo ""
    echo -e "   📖 ENHANCED ABOUT US PAGE:"
    echo -e "      • Professional founder profile"
    echo -e "      • Company mission and values"
    echo -e "      • Detailed company story"
    echo -e "      • Core values with icons"
    echo -e "      • Smooth page transitions"
    
    echo ""
    echo -e "   ⚙️  ENHANCED HOW IT WORKS:"
    echo -e "      • 4-step process with huge icons (40x40)"
    echo -e "      • Detailed feature explanations"
    echo -e "      • Feature bullet points for each step"
    echo -e "      • Additional features showcase"
    echo -e "      • Call-to-action section"
    
    echo ""
    echo -e "   📞 ENHANCED CONTACT PAGE:"
    echo -e "      • Professional founder profile: Gonepudi Srinivas"
    echo -e "      • Multiple contact methods"
    echo -e "      • Business hours and availability"
    echo -e "      • Founder background and expertise"
    echo -e "      • Response time guarantees"
    echo -e "      • Email: srigonepudi@gmail.com"
    
    echo ""
    echo -e "${BLUE}🎯 Key Improvements:${NC}"
    echo -e "   ✅ Complete home page with all sections"
    echo -e "   ✅ Enhanced separate pages (no modals)"
    echo -e "   ✅ Smooth page transitions and animations"
    echo -e "   ✅ Professional content and copy"
    echo -e "   ✅ Large, beautiful icons throughout"
    echo -e "   ✅ Responsive design for all devices"
    echo -e "   ✅ Consistent branding and design"
    echo -e "   ✅ Working navigation between pages"
    
    echo ""
    echo -e "${BLUE}📂 Document Management Features:${NC}"
    echo -e "   📄 ID Documents (Passport, License, Aadhar, PAN)"
    echo -e "   🎓 Study Certificates (Degrees, Courses, Diplomas)"
    echo -e "   🏠 Property Documents (Deeds, Insurance, Agreements)"
    echo -e "   💼 Business Files (Contracts, Invoices, Reports)"
    echo -e "   🏥 Medical Records (Reports, Prescriptions)"
    echo -e "   💰 Financial Documents (Statements, Tax Records)"
    echo -e "   ✈️  Travel Documents (Tickets, Visas, Bookings)"
    echo -e "   📱 Personal Files (Photos, Notes, Receipts)"
    
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
echo -e "${GREEN}🎉 COMPLETE SNAPDOCS DEPLOYMENT SUCCESSFUL!${NC}"
echo ""
echo -e "${BLUE}💡 Navigation Guide:${NC}"
echo -e "   🏠 Home page has full layout with all sections"
echo -e "   📖 Click 'About Us' → Opens enhanced ${YELLOW}/about${NC} page"
echo -e "   ⚙️  Click 'How It Works' → Opens enhanced ${YELLOW}/how-it-works${NC} page" 
echo -e "   📞 Click 'Contact' → Opens enhanced ${YELLOW}/contact${NC} page"
echo -e "   🔙 All pages have 'Back to Home' navigation"
echo -e "   🔐 Login/Signup buttons open functional modals"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo -e "   📊 View logs: ${YELLOW}docker logs -f $CONTAINER_NAME${NC}"
echo -e "   ⏹️  Stop app: ${YELLOW}docker stop $CONTAINER_NAME${NC}"
echo -e "   🔄 Restart: ${YELLOW}docker restart $CONTAINER_NAME${NC}"
echo -e "   🗑️  Remove: ${YELLOW}docker rm -f $CONTAINER_NAME${NC}"
echo ""
echo -e "${PURPLE}🎊 PERFECT! Complete SnapDocs with full home layout! ${NC}"
echo -e "${PURPLE}✨ Enhanced separate pages with smooth transitions! ${NC}"
echo ""
echo -e "${GREEN}Thank you for using SnapDocs Complete Edition! 🙏${NC}"
echo -e "${GREEN}Created by: Gonepudi Srinivas - srigonepudi@gmail.com${NC}"