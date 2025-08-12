#!/bin/bash

# SnapDocs Fix and Deploy Script
# Fixes the npm ci issue and deploys successfully

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

echo -e "${BLUE}🔧 SnapDocs Fix & Deploy${NC}"
echo "=========================="

# Function to check if Node.js is available
check_node() {
    if command -v node >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Node.js is available$(NC)"
        return 0
    else
        echo -e "${YELLOW}⚠️  Node.js not found locally, will use Docker for everything${NC}"
        return 1
    fi
}

# Function to create/fix all required files
create_and_fix_files() {
    echo -e "${BLUE}📋 Creating/fixing required files...${NC}"
    
    # Create Dockerfile with correct npm commands
    echo -e "${YELLOW}📄 Creating optimized Dockerfile...${NC}"
    cat > Dockerfile << 'EOF'
# Multi-stage build for production
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json first for better layer caching
COPY package.json ./

# Install dependencies (will create package-lock.json)
RUN npm install

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

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
EOF
    echo -e "${GREEN}✅ Dockerfile created${NC}"
    
    # Create package.json
    if [ ! -f "package.json" ]; then
        echo -e "${YELLOW}📄 Creating package.json...${NC}"
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
    
    # Create nginx.conf
    echo -e "${YELLOW}📄 Creating nginx.conf...${NC}"
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
    
    # Create public directory and files
    mkdir -p public
    
    if [ ! -f "public/index.html" ]; then
        echo -e "${YELLOW}📄 Creating public/index.html...${NC}"
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
    
    # Create basic manifest.json
    if [ ! -f "public/manifest.json" ]; then
        echo -e "${YELLOW}📄 Creating public/manifest.json...${NC}"
        cat > public/manifest.json << 'EOF'
{
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
}
EOF
        echo -e "${GREEN}✅ public/manifest.json created${NC}"
    fi
    
    # Create src directory and files
    mkdir -p src
    
    if [ ! -f "src/index.js" ]; then
        echo -e "${YELLOW}📄 Creating src/index.js...${NC}"
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
        echo -e "${YELLOW}📄 Creating src/index.css...${NC}"
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
EOF
        echo -e "${GREEN}✅ src/index.css created${NC}"
    fi
    
    if [ ! -f "src/App.jsx" ]; then
        echo -e "${YELLOW}📄 Creating src/App.jsx...${NC}"
        cat > src/App.jsx << 'EOF'
import React, { useState, useEffect } from 'react';

const SnapDocs = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const SnapDocsLogo = () => {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-cyan-400 to-cyan-600 transform rotate-45 translate-x-2 -translate-y-2"></div>
          <div className="text-white font-bold text-sm z-10">SD</div>
          <div className="absolute bottom-1 right-1 w-3 h-2 bg-white rounded-sm opacity-80"></div>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
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
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
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
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="pt-8">
              <div className="flex flex-wrap justify-center items-center space-x-8 text-gray-500">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="text-sm font-medium">4.9/5 Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <span className="text-sm font-medium">50K+ Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm font-medium">100% Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
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
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Custom Folders</h3>
              <p className="text-gray-600 leading-relaxed">
                Create unlimited folders with custom names to organize your documents exactly how you want them.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-100 hover:from-purple-100 hover:to-pink-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Easy Upload</h3>
              <p className="text-gray-600 leading-relaxed">
                Drag and drop or click to upload any document format. Support for PDFs, images, Word docs, and more.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Storage</h3>
              <p className="text-gray-600 leading-relaxed">
                Your documents are encrypted and stored securely with enterprise-grade security and privacy protection.
              </p>
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
*.log
EOF
    echo -e "${GREEN}✅ .dockerignore created${NC}"
    
    echo -e "${GREEN}✅ All files created successfully${NC}"
}

# Function to generate package-lock.json locally if possible
generate_package_lock() {
    if check_node; then
        echo -e "${BLUE}📦 Generating package-lock.json locally...${NC}"
        if [ ! -f "package-lock.json" ]; then
            npm install --package-lock-only
            echo -e "${GREEN}✅ package-lock.json generated${NC}"
        else
            echo -e "${GREEN}✅ package-lock.json already exists${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Will generate package-lock.json during Docker build${NC}"
    fi
}

# Function to run deployment
run_deployment() {
    echo -e "${BLUE}📥 Pulling latest code...${NC}"
    git pull origin main 2>/dev/null || git pull origin master 2>/dev/null || echo -e "${YELLOW}Git pull completed (no changes or no remote)${NC}"

    echo -e "${BLUE}🛑 Stopping existing containers...${NC}"
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true

    echo -e "${BLUE}🧹 Cleaning old images...${NC}"
    docker rmi $IMAGE_NAME:$IMAGE_VERSION 2>/dev/null || true

    echo -e "${BLUE}🔨 Building new image (this may take a few minutes)...${NC}"
    docker build --no-cache -t $IMAGE_NAME:$IMAGE_VERSION . || {
        echo -e "${RED}❌ Docker build failed!${NC}"
        echo -e "${RED}📋 Check the error above and ensure all files are correct${NC}"
        exit 1
    }

    echo -e "${BLUE}🚀 Starting new container...${NC}"
    docker run -d \
        --name $CONTAINER_NAME \
        --restart unless-stopped \
        -p $PORT:80 \
        $IMAGE_NAME:$IMAGE_VERSION || {
        echo -e "${RED}❌ Failed to start container!${NC}"
        docker logs $CONTAINER_NAME 2>/dev/null || true
        exit 1
    }

    echo -e "${BLUE}✅ Verifying deployment...${NC}"
    sleep 5
    
    if docker ps | grep -q $CONTAINER_NAME; then
        echo -e "${GREEN}✅ Deployment successful!${NC}"
        echo -e "${GREEN}🌐 Local: http://localhost:$PORT${NC}"
        
        # Try to get network IP
        NETWORK_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "YOUR_SERVER_IP")
        echo -e "${GREEN}🌐 Network: http://$NETWORK_IP:$PORT${NC}"
        
        # Show container status
        echo -e "${BLUE}📊 Container Status:${NC}"
        docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        
        # Show recent logs
        echo -e "${BLUE}📋 Recent logs:${NC}"
        docker logs --tail 5 $CONTAINER_NAME
        
    else
        echo -e "${RED}❌ Deployment failed!${NC}"
        echo -e "${RED}📋 Container logs:${NC}"
        docker logs $CONTAINER_NAME 2>/dev/null || true
        exit 1
    fi

    echo -e "${BLUE}🧹 Cleaning up unused Docker resources...${NC}"
    docker image prune -f 2>/dev/null || true
    docker container prune -f 2>/dev/null || true

    echo -e "${GREEN}🎉 SnapDocs deployed successfully!${NC}"
    echo -e "${BLUE}💡 Useful commands:${NC}"
    echo -e "   📊 View logs: ${YELLOW}docker logs -f $CONTAINER_NAME${NC}"
    echo -e "   ⏹️  Stop app: ${YELLOW}docker stop $CONTAINER_NAME${NC}"
    echo -e "   🔄 Restart: ${YELLOW}docker restart $CONTAINER_NAME${NC}"
}

# Main execution
echo -e "${BLUE}🎯 Starting fix and deploy process...${NC}"
create_and_fix_files
generate_package_lock
run_deployment