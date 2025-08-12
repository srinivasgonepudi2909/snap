#!/bin/bash

# SnapDocs Folder Structure Creation Script
# This script creates the complete folder structure for SnapDocs React application

set -e  # Exit on any error

echo "🚀 Creating SnapDocs Application Folder Structure..."

# Get the project name (default: snapdocs-app)
PROJECT_NAME=${1:-snapdocs-app}

echo "📁 Creating project directory: $PROJECT_NAME"

# Create main project directory
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Create public folder structure
echo "📂 Creating public/ directory structure..."
mkdir -p public

# Create src folder structure
echo "📂 Creating src/ directory structure..."
mkdir -p src/components/common
mkdir -p src/components/home
mkdir -p src/components/auth
mkdir -p src/components/dashboard
mkdir -p src/pages
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/styles/components
mkdir -p src/assets/images/features
mkdir -p src/assets/icons

# Create root level files
echo "📄 Creating configuration files..."
touch Dockerfile
touch docker-compose.yml
touch .dockerignore
touch nginx.conf
touch package.json
touch package-lock.json
touch README.md

# Create public files
echo "📄 Creating public files..."
touch public/index.html
touch public/favicon.ico
touch public/manifest.json
touch public/logo192.png
touch public/logo512.png

# Create src files
echo "📄 Creating src files..."
touch src/index.js
touch src/index.css
touch src/App.jsx
touch src/App.css

# Create component files
echo "📄 Creating component files..."
touch src/components/common/Header.jsx
touch src/components/common/Footer.jsx
touch src/components/common/LoadingSpinner.jsx

touch src/components/home/HeroSection.jsx
touch src/components/home/FeaturesSection.jsx
touch src/components/home/WhyChooseUs.jsx
touch src/components/home/CTASection.jsx

touch src/components/auth/LoginModal.jsx
touch src/components/auth/SignupModal.jsx

touch src/components/dashboard/Dashboard.jsx
touch src/components/dashboard/FolderManager.jsx
touch src/components/dashboard/DocumentUploader.jsx

# Create page files
echo "📄 Creating page files..."
touch src/pages/Home.jsx
touch src/pages/Dashboard.jsx
touch src/pages/NotFound.jsx

# Create hook files
echo "📄 Creating hook files..."
touch src/hooks/useAuth.js
touch src/hooks/useLocalStorage.js

# Create utility files
echo "📄 Creating utility files..."
touch src/utils/constants.js
touch src/utils/helpers.js

# Create style files
echo "📄 Creating style files..."
touch src/styles/globals.css
touch src/styles/components/Header.css
touch src/styles/components/Home.css
touch src/styles/components/Dashboard.css

# Create environment files
echo "📄 Creating environment files..."
touch .env
touch .env.local
touch .gitignore

# Make scripts executable
chmod +x create_folder_structure.sh 2>/dev/null || true

echo ""
echo "✅ Folder structure created successfully!"
echo ""
echo "📊 Project Structure Summary:"
echo "├── $PROJECT_NAME/"
echo "│   ├── public/"
echo "│   │   ├── index.html"
echo "│   │   ├── favicon.ico"
echo "│   │   └── manifest.json"
echo "│   ├── src/"
echo "│   │   ├── components/"
echo "│   │   │   ├── common/"
echo "│   │   │   ├── home/"
echo "│   │   │   ├── auth/"
echo "│   │   │   └── dashboard/"
echo "│   │   ├── pages/"
echo "│   │   ├── hooks/"
echo "│   │   ├── utils/"
echo "│   │   ├── styles/"
echo "│   │   └── assets/"
echo "│   ├── Dockerfile"
echo "│   ├── docker-compose.yml"
echo "│   ├── package.json"
echo "│   └── README.md"
echo ""
echo "🎉 Ready for code injection! Run the populate script next."
echo ""
echo "💡 Usage: ./create_folder_structure.sh [project-name]"
echo "   Default project name: snapdocs-app"