#!/bin/bash
# debug-build.sh - Run this to debug React build issues

echo "🔍 SnapDocs Frontend Build Debugger"
echo "================================="

cd frontend/snapdocs-app

echo ""
echo "📋 1. Checking Node.js and npm versions:"
node --version
npm --version

echo ""
echo "📦 2. Checking package.json:"
if [ -f package.json ]; then
    echo "✅ package.json exists"
    cat package.json
else
    echo "❌ package.json not found!"
    exit 1
fi

echo ""
echo "🔍 3. Checking source files:"
ls -la src/

echo ""
echo "📝 4. Checking for missing components:"
echo "Checking components/common/SnapDocsLogo.jsx:"
if [ -f src/components/common/SnapDocsLogo.jsx ]; then
    echo "✅ SnapDocsLogo exists"
else
    echo "❌ SnapDocsLogo missing - creating..."
    mkdir -p src/components/common
    cat > src/components/common/SnapDocsLogo.jsx << 'EOF'
import React from 'react';
import { Link } from 'react-router-dom';

const SnapDocsLogo = ({ linkTo = "/", className = "", textSize = "text-2xl" }) => {
  return (
    <Link to={linkTo} className={`flex items-center space-x-3 group cursor-pointer ${className}`}>
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg group-hover:scale-110 transition-all duration-300">
        <div className="text-white font-bold text-base z-10">SD</div>
      </div>
      <span className={`${textSize} font-bold text-white`}>SnapDocs</span>
    </Link>
  );
};

export default SnapDocsLogo;
EOF
    echo "✅ Created SnapDocsLogo component"
fi

echo ""
echo "🔧 5. Installing dependencies:"
npm install

echo ""
echo "🏗️ 6. Running build with verbose output:"
npm run build --verbose 2>&1 | tee build.log

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo "📁 Build output:"
    ls -la build/
else
    echo ""
    echo "❌ Build failed! Check build.log for details:"
    echo "=== Last 20 lines of build log ==="
    tail -20 build.log
    echo "================================="
    exit 1
fi