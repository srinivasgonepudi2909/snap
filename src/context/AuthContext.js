import React, { create#!/bin/bash

# SecureDocs Frontend Code Generator Script (Violet Theme with All Pages)
# This script creates all frontend files with violet background and new pages

set -e
PROJECT_NAME="secure-docs-frontend"

echo "🚀 Generating SecureDocs Frontend Code (Violet Theme)..."
echo "======================================================="

# Create main project directory
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

echo "📁 Creating project: $PROJECT_NAME"

# Create folder structure first
echo "📂 Creating folder structure..."
mkdir -p public
mkdir -p src/{components,hooks,context,utils,styles,assets,pages}
mkdir -p src/components/{common,auth,dashboard,landing}
mkdir -p src/assets/{images,fonts}
mkdir -p src/assets/images/icons

# =============================================
# PACKAGE.JSON
# =============================================
echo "📦 Creating package.json..."
cat > package.json << 'EOF'
{
  "name": "secure-docs-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "react-scripts": "5.0.1",
    "lucide-react": "^0.263.1",
    "react-dropzone": "^14.2.3",
    "js-cookie": "^3.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": ["react-app", "react-app/jest"]
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
