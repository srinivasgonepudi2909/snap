#!/bin/bash

# Instant fix for SnapDocs deployment
# This overwrites the problematic files and deploys immediately

set -e

echo "🔧 Instant SnapDocs Fix"
echo "======================"

# Stop any running container
echo "🛑 Stopping containers..."
docker stop snapdocs-container 2>/dev/null || true
docker rm snapdocs-container 2>/dev/null || true

# Remove old image
echo "🧹 Cleaning old images..."
docker rmi snapdocs-app:latest 2>/dev/null || true

# Create working Dockerfile
echo "📄 Creating working Dockerfile..."
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

# Create working nginx.conf
echo "📄 Creating working nginx.conf..."
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

# Create minimal package.json if it doesn't exist
if [ ! -f "package.json" ]; then
echo "📄 Creating package.json..."
cat > package.json << 'EOF'
{
  "name": "snapdocs-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
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
fi

# Create public/index.html if it doesn't exist
mkdir -p public
if [ ! -f "public/index.html" ]; then
echo "📄 Creating public/index.html..."
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SnapDocs</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
EOF
fi

# Create src files if they don't exist
mkdir -p src
if [ ! -f "src/index.js" ]; then
echo "📄 Creating src/index.js..."
cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
EOF
fi

if [ ! -f "src/index.css" ]; then
echo "📄 Creating src/index.css..."
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
EOF
fi

if [ ! -f "src/App.jsx" ]; then
echo "📄 Creating src/App.jsx..."
cat > src/App.jsx << 'EOF'
import React from 'react';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-cyan-400 to-cyan-600 transform rotate-45 translate-x-2 -translate-y-2"></div>
                <div className="text-white font-bold text-sm z-10">SD</div>
                <div className="absolute bottom-1 right-1 w-3 h-2 bg-white rounded-sm opacity-80"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                SnapDocs
              </span>
            </div>
            <div className="flex space-x-4">
              <button className="text-blue-600 font-semibold">Login</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center min-h-screen relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full opacity-30 blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-200 rounded-full opacity-30 blur-xl animate-pulse"></div>
        </div>

        <div className="text-center relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-6">
            Your Documents,<br />
            <span className="text-blue-600">Organized Perfectly</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create custom folders, upload documents seamlessly, and access them anywhere. 
            SnapDocs makes document management simple, secure, and beautiful.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-2xl">
            Get Started Free
          </button>
          
          <div className="flex justify-center items-center space-x-8 mt-12 text-gray-500">
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
      </main>
    </div>
  );
};

export default App;
EOF
fi

# Build and deploy
echo "🔨 Building Docker image..."
docker build -t snapdocs-app:latest . || exit 1

echo "🚀 Starting container..."
docker run -d --name snapdocs-container --restart unless-stopped -p 3000:80 snapdocs-app:latest || exit 1

echo "✅ Verifying deployment..."
sleep 3

if docker ps | grep -q snapdocs-container; then
    echo "🎉 SUCCESS! SnapDocs is running at http://localhost:3000"
    echo "📊 Container status:"
    docker ps --filter "name=snapdocs-container" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
else
    echo "❌ Container failed to start"
    docker logs snapdocs-container
    exit 1
fi