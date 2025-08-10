#!/bin/bash

# Define the root folder name (change as needed)
ROOT_DIR="snap"

# Create main project directories
mkdir -p $ROOT_DIR/{public,src}

# Create public folder files
mkdir -p $ROOT_DIR/public
touch $ROOT_DIR/public/index.html
touch $ROOT_DIR/public/favicon.ico

# Create src subfolders
mkdir -p $ROOT_DIR/src/{assets/{images,styles},components/{common,FeatureComponent},pages/{FeaturePage},hooks,utils,services,context,routes}

# Create base files
touch $ROOT_DIR/src/App.js
touch $ROOT_DIR/src/index.js
touch $ROOT_DIR/.gitignore
touch $ROOT_DIR/package.json
touch $ROOT_DIR/README.md

echo "✅ Folder structure created successfully in ./$ROOT_DIR"
