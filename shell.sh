#!/bin/bash

# SecureDocs Frontend Structure Creation Script
set -e

PROJECT_NAME="secure-docs-frontend"
echo "🚀 Creating SecureDocs Frontend Structure..."
echo "============================================="

# Create main project directory
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

echo "📁 Creating project: $PROJECT_NAME"

# Create public folder structure
echo "📂 Creating public folder..."
mkdir -p public
touch public/{index.html,favicon.ico,logo192.png,logo512.png,manifest.json,robots.txt}

# Create src folder structure
echo "📂 Creating src folder structure..."
mkdir -p src/{components,hooks,context,utils,styles,assets,pages}

# Create component subfolders and files
echo "🧩 Creating component folders..."
mkdir -p src/components/{common,auth,dashboard,landing}

# Common components
echo "📄 Creating common components..."
touch src/components/common/{Header.js,Footer.js,Loading.js,Button.js,Modal.js}

# Auth components
echo "🔐 Creating auth components..."
touch src/components/auth/{Login.js,Signup.js,ForgotPassword.js,ProtectedRoute.js}

# Dashboard components
echo "📊 Creating dashboard components..."
touch src/components/dashboard/{Dashboard.js,FileUpload.js,FileList.js,FolderCreator.js,FileViewer.js,SearchBar.js,Sidebar.js}

# Landing components
echo "🏠 Creating landing components..."
touch src/components/landing/{LandingPage.js,Hero.js,Features.js,Benefits.js,CTA.js}

# Create hooks
echo "🪝 Creating hooks..."
touch src/hooks/{useAuth.js,useFileUpload.js,useLocalStorage.js,useSearch.js}

# Create context files
echo "🌍 Creating context files..."
touch src/context/{AuthContext.js,FileContext.js,ThemeContext.js}

# Create utility files
echo "🔧 Creating utility files..."
touch src/utils/{constants.js,helpers.js,validation.js,formatters.js,api.js}

# Create style files
echo "🎨 Creating style files..."
touch src/styles/{index.css,components.css,tailwind.css}

# Create asset folders
echo "🖼️ Creating asset folders..."
mkdir -p src/assets/{images,fonts}
mkdir -p src/assets/images/icons
touch src/assets/images/{logo.png,hero-bg.jpg}
touch src/assets/images/icons/{upload.svg,folder.svg,security.svg}

# Create page files
echo "📄 Creating page files..."
touch src/pages/{Home.js,Dashboard.js,Login.js,Signup.js,NotFound.js}

# Create main src files
echo "⚛️ Creating main React files..."
touch src/{App.js,App.css,index.js,index.css}

# Create root configuration files
echo "📋 Creating configuration files..."
touch {Dockerfile,.dockerignore,.gitignore,.env,.env.example,package.json,package-lock.json,tailwind.config.js,README.md}

echo ""
echo "✅ Frontend structure created successfully!"
echo "============================================="
echo "📊 Summary:"
echo "   📁 Main folder: $PROJECT_NAME"
echo "   📂 Component folders: common, auth, dashboard, landing"
echo "   🪝 Hooks: auth, file upload, local storage, search"
echo "   🌍 Context: auth, file, theme"
echo "   🔧 Utils: constants, helpers, validation, API"
echo "   🎨 Styles: CSS and Tailwind configuration"
echo "   🖼️ Assets: images, icons, fonts"
echo "   📄 Pages: routing components"
echo ""

# Display the created structure
echo "📂 Created folder structure:"
echo "============================================="
find . -type d | head -15 | sed 's/^/   /'
echo "   ... and more!"
echo ""

# Count files and folders
FILE_COUNT=$(find . -type f | wc -l)
FOLDER_COUNT=$(find . -type d | wc -l)
echo "📄 Total files created: $FILE_COUNT"
echo "📁 Total folders created: $FOLDER_COUNT"

echo ""
echo "🚀 Next steps:"
echo "   1. cd $PROJECT_NAME"
echo "   2. Create your package.json with dependencies"
echo "   3. Initialize React components"
echo "   4. Setup Tailwind CSS"
echo "   5. Build with Docker: docker build -t secure-docs ."
echo ""
echo "🎉 Happy coding!"

# Create a quick verification
echo ""
echo "🔍 Structure verification:"
echo "   Components: $(find src/components -name "*.js" | wc -l) files"
echo "   Hooks: $(find src/hooks -name "*.js" | wc -l) files"
echo "   Pages: $(find src/pages -name "*.js" | wc -l) files"
echo "   Utils: $(find src/utils -name "*.js" | wc -l) files"