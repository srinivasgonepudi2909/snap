#!/bin/bash

# SecureDocs Auto Deploy Script
# This script pulls latest code, builds new image, and redeploys container

set -e  # Exit on any error

# Configuration
PROJECT_DIR="snapdocs-frontend"  # Change this to your project folder
IMAGE_NAME="snap-docs-app"
CONTAINER_NAME="snap-docs"
PORT="80:80"

echo "🚀 SecureDocs Auto Deploy Starting..."
echo "====================================="

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Project directory '$PROJECT_DIR' not found!"
    echo "Please update PROJECT_DIR in the script or run from correct location."
    exit 1
fi

# Navigate to project directory
echo "📁 Navigating to project directory..."
cd $PROJECT_DIR

# Pull latest changes from git
echo "📦 Pulling latest changes from git..."
if [ -d ".git" ]; then
    git pull origin main || git pull origin master || echo "⚠️  Git pull failed or no remote configured"
else
    echo "⚠️  Not a git repository - skipping git pull"
fi

# Stop and remove existing container
echo "🛑 Stopping existing container..."
docker stop $CONTAINER_NAME 2>/dev/null || echo "Container not running"

echo "🗑️  Removing existing container..."
docker rm $CONTAINER_NAME 2>/dev/null || echo "Container not found"

# Remove old image (optional - uncomment if you want to remove old images)
# echo "🗑️  Removing old image..."
# docker rmi $IMAGE_NAME 2>/dev/null || echo "Image not found"

# Build new Docker image
echo "🔨 Building new Docker image..."
docker build -t $IMAGE_NAME .

# Remove dangling images to save space
echo "🧹 Cleaning up dangling images..."
docker image prune -f

# Run new container
echo "🏃 Starting new container..."
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT \
    --restart unless-stopped \
    $IMAGE_NAME

# Wait a moment for container to start
sleep 3

# Check if container is running
echo "🔍 Checking container status..."
if docker ps | grep -q $CONTAINER_NAME; then
    echo "✅ Container is running successfully!"
    
    # Show container info
    echo ""
    echo "📊 Container Status:"
    docker ps | grep $CONTAINER_NAME
    
    echo ""
    echo "🌐 Your app is now live at:"
    echo "   http://localhost"
    echo "   http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR-SERVER-IP')"
    
else
    echo "❌ Container failed to start!"
    echo "🔍 Checking logs..."
    docker logs $CONTAINER_NAME
    exit 1
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo "====================================="
echo "📋 Useful commands:"
echo "   docker logs $CONTAINER_NAME          # View logs"
echo "   docker stop $CONTAINER_NAME          # Stop container"
echo "   docker start $CONTAINER_NAME         # Start container"
echo "   docker restart $CONTAINER_NAME       # Restart container"
echo ""
echo "✨ Happy coding!"