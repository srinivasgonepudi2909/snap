#!/bin/bash

# Deploy Enhanced SnapDocs with improved header styling
# - Larger app name (20% increase)
# - Bold navigation items
# - Zoom effects for all header elements

set -e

echo "🚀 Deploying Enhanced SnapDocs"
echo "=============================="

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
    <meta name="description" content="SnapDocs - Your Digital Vault Secured & Organized" />
    <title>SnapDocs - Your Digital Vault</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  scroll-behavior: smooth;
}
EOF

# Create enhanced src/App.jsx
echo -e "${BLUE}⚛️ Creating enhanced App.jsx...${NC}"
cat > src/App.jsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Upload, Folder, Shield, Check, Star, Lock, ArrowRight } from 'lucide-react';

const SnapDocs = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced SnapDocs Logo Component (20% larger)
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

  // Enhanced Header Component
  const Header = () => (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-900/95 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <SnapDocsLogo />
          
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#about" 
              className="text-gray-300 hover:text-white transition-all duration-300 font-bold text-lg hover:scale-110 transform cursor-pointer"
            >
              About Us
            </a>
            <a 
              href="#how-it-works" 
              className="text-gray-300 hover:text-white transition-all duration-300 font-bold text-lg hover:scale-110 transform cursor-pointer"
            >
              How It Works
            </a>
            <a 
              href="#contact" 
              className="text-gray-300 hover:text-white transition-all duration-300 font-bold text-lg hover:scale-110 transform cursor-pointer"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="text-gray-300 hover:text-white font-bold text-lg transition-all duration-300 hover:scale-110 transform"
            >
              Login
            </button>
            <button
              onClick={() => setIsSignupOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-110 transition-all duration-300 shadow-lg"
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
              onClick={() => setIsSignupOpen(true)}
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
          {/* Easy Upload */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 group hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Easy Upload</h3>
            <p className="text-gray-300 leading-relaxed">
              Drag and drop your documents, photos, and certificates. Support for all file types with instant upload processing.
            </p>
          </div>

          {/* Smart Organization */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 group hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Folder className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Smart Organization</h3>
            <p className="text-gray-300 leading-relaxed">
              Create custom folders and use intelligent search to find your documents instantly. Never lose track of important files.
            </p>
          </div>

          {/* Bank-Level Security */}
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
          {/* 99.9% Uptime */}
          <div className="text-center group cursor-pointer hover:scale-110 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">99.9% Uptime</h3>
            <p className="text-gray-400">Always accessible</p>
          </div>

          {/* 5-Star Rated */}
          <div className="text-center group cursor-pointer hover:scale-110 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">5-Star Rated</h3>
            <p className="text-gray-400">Loved by users</p>
          </div>

          {/* Enterprise Security */}
          <div className="text-center group cursor-pointer hover:scale-110 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Enterprise Security</h3>
            <p className="text-gray-400">Military-grade protection</p>
          </div>

          {/* Unlimited Storage */}
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
            onClick={() => setIsSignupOpen(true)}
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

  // Modal Component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100 hover:scale-105">
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

  // Login Form
  const LoginForm = () => (
    <div className="space-y-4">
      <div>
        <div className="block text-sm font-medium text-gray-700 mb-1">Email</div>
        <input
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:scale-105 focus:scale-105"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <div className="block text-sm font-medium text-gray-700 mb-1">Password</div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 hover:scale-105 focus:scale-105"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:scale-105 focus:scale-105"
            placeholder="John"
          />
        </div>
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">Last Name</div>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:scale-105 focus:scale-105"
            placeholder="Doe"
          />
        </div>
      </div>
      <div>
        <div className="block text-sm font-medium text-gray-700 mb-1">Email</div>
        <input
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:scale-105 focus:scale-105"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <div className="block text-sm font-medium text-gray-700 mb-1">Password</div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 hover:scale-105 focus:scale-105"
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

      <Modal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        title="Welcome Back"
      >
        <LoginForm />
      </Modal>

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
    echo -e "${GREEN}🎉 SUCCESS! Enhanced SnapDocs is running!${NC}"
    echo ""
    echo -e "${GREEN}🌐 Access URLs:${NC}"
    echo -e "   Local: ${YELLOW}http://localhost:$PORT${NC}"
    
    # Try to get network IP
    NETWORK_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "YOUR_SERVER_IP")
    echo -e "   Network: ${YELLOW}http://$NETWORK_IP:$PORT${NC}"
    
    echo ""
    echo -e "${BLUE}📊 Container Status:${NC}"
    docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo ""
    echo -e "${GREEN}✨ Enhanced Features:${NC}"
    echo "   📏 App name increased by 20% (text-2xl)"
    echo "   🔤 Navigation items in BOLD (font-bold)"
    echo "   🔍 Zoom effects on hover for all header elements"
    echo "   📱 Login/Signup buttons with zoom effects"
    echo "   🎨 Enhanced hover animations throughout"
    echo "   💫 Interactive elements scale on hover"
    
else
    echo -e "${RED}❌ Container failed to start!${NC}"
    echo -e "${RED}📋 Logs:${NC}"
    docker logs $CONTAINER_NAME 2>/dev/null || true
    exit 1
fi

echo -e "${BLUE}🧹 Cleaning up...${NC}"
docker image prune -f 2>/dev/null || true
docker container prune -f 2>/dev/null || true

echo -e "${GREEN}🎉 Enhanced SnapDocs deployment completed!${NC}"
echo ""
echo -e "${BLUE}💡 Management commands:${NC}"
echo -e "   📊 View logs: ${YELLOW}docker logs -f $CONTAINER_NAME${NC}"
echo -e "   ⏹️  Stop: ${YELLOW}docker stop $CONTAINER_NAME${NC}"
echo -e "   🔄 Restart: ${YELLOW}docker restart $CONTAINER_NAME${NC}"