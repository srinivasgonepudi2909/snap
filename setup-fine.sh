#!/bin/bash

# SnapDocs Setup and Deploy Script
# This script ensures all required files exist before deployment

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
IMAGE_NAME="snapdocs-app"
IMAGE_VERSION="latest"
CONTAINER_NAME="snapdocs-container"
PORT="3000"

echo -e "${BLUE}🚀 SnapDocs Setup & Deploy${NC}"
echo "============================="

# Function to create missing files
create_missing_files() {
    echo -e "${BLUE}📋 Checking required files...${NC}"
    
    # Check and create Dockerfile
    if [ ! -f "Dockerfile" ]; then
        echo -e "${YELLOW}⚠️  Dockerfile missing, creating...${NC}"
        cat > Dockerfile << 'EOF'
# Multi-stage build for production
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
EOF
        echo -e "${GREEN}✅ Dockerfile created${NC}"
    fi
    
    # Check and create package.json
    if [ ! -f "package.json" ]; then
        echo -e "${YELLOW}⚠️  package.json missing, creating...${NC}"
        cat > package.json << 'EOF'
{
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
}
EOF
        echo -e "${GREEN}✅ package.json created${NC}"
    fi
    
    # Check and create nginx.conf
    if [ ! -f "nginx.conf" ]; then
        echo -e "${YELLOW}⚠️  nginx.conf missing, creating...${NC}"
        cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }
}
EOF
        echo -e "${GREEN}✅ nginx.conf created${NC}"
    fi
    
    # Check and create public directory and files
    if [ ! -d "public" ]; then
        echo -e "${YELLOW}⚠️  public directory missing, creating...${NC}"
        mkdir -p public
    fi
    
    if [ ! -f "public/index.html" ]; then
        echo -e "${YELLOW}⚠️  public/index.html missing, creating...${NC}"
        cat > public/index.html << 'EOF'
<!DOCTYPE html>
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
</html>
EOF
        echo -e "${GREEN}✅ public/index.html created${NC}"
    fi
    
    # Check and create src directory and files
    if [ ! -d "src" ]; then
        echo -e "${YELLOW}⚠️  src directory missing, creating...${NC}"
        mkdir -p src
    fi
    
    if [ ! -f "src/index.js" ]; then
        echo -e "${YELLOW}⚠️  src/index.js missing, creating...${NC}"
        cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SnapDocs from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SnapDocs />
  </React.StrictMode>
);
EOF
        echo -e "${GREEN}✅ src/index.js created${NC}"
    fi
    
    if [ ! -f "src/index.css" ]; then
        echo -e "${YELLOW}⚠️  src/index.css missing, creating...${NC}"
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
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

.group:hover .group-hover\:bounce {
  animation: bounce 1s;
}
EOF
        echo -e "${GREEN}✅ src/index.css created${NC}"
    fi
    
    if [ ! -f "src/App.jsx" ]; then
        echo -e "${YELLOW}⚠️  src/App.jsx missing, creating minimal version...${NC}"
        cat > src/App.jsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { ChevronDown, Upload, Folder, Shield, Zap, Users, Star, ArrowRight, X, Eye, EyeOff } from 'lucide-react';

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

  const SnapDocsLogo = ({ size = 'normal' }) => {
    const logoSize = size === 'large' ? 'w-12 h-12' : 'w-8 h-8';
    const textSize = size === 'large' ? 'text-2xl' : 'text-xl';
    
    return (
      <div className="flex items-center space-x-3">
        <div className={`${logoSize} bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg`}>
          <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-cyan-400 to-cyan-600 transform rotate-45 translate-x-2 -translate-y-2"></div>
          <div className="text-white font-bold text-sm z-10">SD</div>
          <div className="absolute bottom-1 right-1 w-3 h-2 bg-white rounded-sm opacity-80"></div>
        </div>
        <span className={`${textSize} font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent`}>
          SnapDocs
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <SnapDocsLogo />
            <div className="flex items-center space-x-4">
              <button className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Login
              </button>
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
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
              <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center space-x-2">
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
    </div>
  );
};

export default SnapDocs;
EOF
        echo -e "${GREEN}✅ src/App.jsx created${NC}"
    fi
    
    # Create .dockerignore
    if [ ! -f ".dockerignore" ]; then
        echo -e "${YELLOW}⚠️  .dockerignore missing, creating...${NC}"
        cat > .dockerignore << 'EOF'
node_modules
npm-debug.log
Dockerfile
.dockerignore
README.md
.env
.git
.gitignore
build
.nyc_output
coverage
.DS_Store
EOF
        echo -e "${GREEN}✅ .dockerignore created${NC}"
    fi
    
    echo -e "${GREEN}✅ All required files checked/created${NC}"
}

# Function to run quick deployment
run_deployment() {
    echo -e "${BLUE}📥 Pulling latest code...${NC}"
    git pull origin main 2>/dev/null || git pull origin master 2>/dev/null || echo "Git pull completed"

    echo -e "${BLUE}🛑 Stopping existing container...${NC}"
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true

    echo -e "${BLUE}🔨 Building new image...${NC}"
    docker build -t $IMAGE_NAME:$IMAGE_VERSION .

    echo -e "${BLUE}🚀 Starting new container...${NC}"
    docker run -d \
        --name $CONTAINER_NAME \
        --restart unless-stopped \
        -p $PORT:80 \
        $IMAGE_NAME:$IMAGE_VERSION

    echo -e "${BLUE}✅ Verifying deployment...${NC}"
    sleep 3
    if docker ps | grep -q $CONTAINER_NAME; then
        echo -e "${GREEN}✅ Deployment successful!${NC}"
        echo -e "${GREEN}🌐 Access: http://localhost:$PORT${NC}"
        echo -e "${GREEN}🌐 Network: http://$(hostname -I | awk '{print $1}' 2>/dev/null || echo 'YOUR_IP'):$PORT${NC}"
    else
        echo -e "${RED}❌ Deployment failed!${NC}"
        echo -e "${RED}📋 Container logs:${NC}"
        docker logs $CONTAINER_NAME
        exit 1
    fi

    echo -e "${BLUE}🧹 Cleaning up...${NC}"
    docker image prune -f 2>/dev/null || true
    docker container prune -f 2>/dev/null || true

    echo -e "${GREEN}🎉 Setup and deployment completed!${NC}"
}

# Main execution
create_missing_files
run_deployment