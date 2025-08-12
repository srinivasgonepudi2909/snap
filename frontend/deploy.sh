#!/bin/bash

# SnapDocs Quick Deployment Script
# Simplified version for rapid deployments

set -e

# Default configuration
IMAGE_NAME="snapdocs-app"
IMAGE_VERSION="latest"
CONTAINER_NAME="snapdocs-container"
PORT="3000"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 SnapDocs Quick Deploy${NC}"
echo "=========================="

# 1. Git Pull
echo -e "${BLUE}📥 Pulling latest code...${NC}"
git pull origin main || git pull origin master

# 2. Stop and remove existing container
echo -e "${BLUE}🛑 Stopping existing container...${NC}"
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# 3. Build new image
echo -e "${BLUE}🔨 Building new image...${NC}"
docker build -t $IMAGE_NAME:$IMAGE_VERSION .

# 4. Run new container
echo -e "${BLUE}🚀 Starting new container...${NC}"
docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p $PORT:80 \
    $IMAGE_NAME:$IMAGE_VERSION

# 5. Verify
echo -e "${BLUE}✅ Verifying deployment...${NC}"
sleep 3
if docker ps | grep -q $CONTAINER_NAME; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}🌐 Access: http://localhost:$PORT${NC}"
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    docker logs $CONTAINER_NAME
    exit 1
fi

# 6. Cleanup
echo -e "${BLUE}🧹 Cleaning up...${NC}"
docker image prune -f
docker container prune -f

echo -e "${GREEN}🎉 Quick deployment completed!${NC}"