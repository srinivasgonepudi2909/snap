#!/bin/bash

# SnapDocs Nginx Fix and Deploy Script
# Fixes the nginx configuration error and redeploys

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

echo -e "${BLUE}🔧 SnapDocs Nginx Fix & Deploy${NC}"
echo "================================"

# Function to create correct nginx.conf
fix_nginx_config() {
    echo -e "${BLUE}🔧 Creating corrected nginx.conf...${NC}"
    
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
    gzip_proxied any;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        application/xml
        image/svg+xml;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html index.htm;

        # Handle client-side routing (React Router)
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }

        # API proxy (if needed later)
        location /api/ {
            # Placeholder for future API integration
            return 404;
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # Error pages
        error_page 404 /index.html;
        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
}
EOF
    
    echo -e "${GREEN}✅ nginx.conf fixed${NC}"
}

# Function to create optimized Dockerfile
create_dockerfile() {
    echo -e "${BLUE}🐳 Creating optimized Dockerfile...${NC}"
    
    cat > Dockerfile << 'EOF'
# Multi-stage build for production
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json first for better caching
COPY package.json ./

# Install dependencies
RUN npm install --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=build /app/build /usr/share/nginx/html

# Create non-root user for security
RUN addgroup -g 1001 -S nginx && \
    adduser -S nginx -u 1001

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Create nginx.pid file and set permissions
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
EOF
    
    echo -e "${GREEN}✅ Dockerfile created${NC}"
}

# Function to stop existing container
stop_existing_container() {
    echo -e "${BLUE}🛑 Stopping existing container...${NC}"
    
    if docker ps -a --format "{{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        echo -e "${YELLOW}Found existing container: $CONTAINER_NAME${NC}"
        
        if docker ps --format "{{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
            echo -e "${BLUE}Stopping running container...${NC}"
            docker stop $CONTAINER_NAME
        fi
        
        echo -e "${BLUE}Removing container...${NC}"
        docker rm $CONTAINER_NAME
        echo -e "${GREEN}✅ Container removed${NC}"
    else
        echo -e "${GREEN}✅ No existing container found${NC}"
    fi
}

# Function to build and deploy
build_and_deploy() {
    echo -e "${BLUE}🔨 Building new image...${NC}"
    
    # Remove old image if exists
    docker rmi $IMAGE_NAME:$IMAGE_VERSION 2>/dev/null || true
    
    # Build new image
    docker build --no-cache -t $IMAGE_NAME:$IMAGE_VERSION . || {
        echo -e "${RED}❌ Docker build failed!${NC}"
        exit 1
    }
    
    echo -e "${GREEN}✅ Image built successfully${NC}"
    
    echo -e "${BLUE}🚀 Starting new container...${NC}"
    docker run -d \
        --name $CONTAINER_NAME \
        --restart unless-stopped \
        -p $PORT:80 \
        $IMAGE_NAME:$IMAGE_VERSION || {
        echo -e "${RED}❌ Failed to start container!${NC}"
        exit 1
    }
    
    echo -e "${GREEN}✅ Container started${NC}"
}

# Function to verify deployment
verify_deployment() {
    echo -e "${BLUE}✅ Verifying deployment...${NC}"
    
    # Wait for container to start
    sleep 5
    
    if docker ps | grep -q $CONTAINER_NAME; then
        echo -e "${GREEN}✅ Container is running${NC}"
        
        # Show container status
        echo -e "${BLUE}📊 Container Status:${NC}"
        docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        
        # Test if nginx is responding
        echo -e "${BLUE}🌐 Testing HTTP response...${NC}"
        sleep 3
        
        if command -v curl >/dev/null 2>&1; then
            if curl -f -s http://localhost:$PORT > /dev/null; then
                echo -e "${GREEN}✅ Application is responding on port $PORT${NC}"
            else
                echo -e "${YELLOW}⚠️  HTTP test failed, but container is running${NC}"
            fi
        else
            echo -e "${YELLOW}⚠️  curl not available, skipping HTTP test${NC}"
        fi
        
        # Show recent logs
        echo -e "${BLUE}📋 Recent logs:${NC}"
        docker logs --tail 10 $CONTAINER_NAME
        
        # Show access URLs
        echo -e "${GREEN}🎉 Deployment successful!${NC}"
        echo -e "${GREEN}🌐 Local: http://localhost:$PORT${NC}"
        
        # Try to get network IP
        NETWORK_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "YOUR_SERVER_IP")
        echo -e "${GREEN}🌐 Network: http://$NETWORK_IP:$PORT${NC}"
        
    else
        echo -e "${RED}❌ Container is not running!${NC}"
        echo -e "${RED}📋 Container logs:${NC}"
        docker logs $CONTAINER_NAME 2>/dev/null || true
        exit 1
    fi
}

# Function to cleanup
cleanup() {
    echo -e "${BLUE}🧹 Cleaning up...${NC}"
    docker image prune -f 2>/dev/null || true
    docker container prune -f 2>/dev/null || true
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}🎯 Starting nginx fix and deployment...${NC}"
    
    # Pull latest code
    echo -e "${BLUE}📥 Pulling latest code...${NC}"
    git pull origin main 2>/dev/null || git pull origin master 2>/dev/null || echo -e "${YELLOW}Git pull completed${NC}"
    
    # Fix the configuration files
    fix_nginx_config
    create_dockerfile
    
    # Deploy
    stop_existing_container
    build_and_deploy
    verify_deployment
    cleanup
    
    echo -e "${GREEN}🎉 SnapDocs successfully deployed with fixed nginx configuration!${NC}"
    echo ""
    echo -e "${BLUE}💡 Useful commands:${NC}"
    echo -e "   📊 View logs: ${YELLOW}docker logs -f $CONTAINER_NAME${NC}"
    echo -e "   ⏹️  Stop: ${YELLOW}docker stop $CONTAINER_NAME${NC}"
    echo -e "   🔄 Restart: ${YELLOW}docker restart $CONTAINER_NAME${NC}"
    echo -e "   🔍 Inspect: ${YELLOW}docker inspect $CONTAINER_NAME${NC}"
}

# Run main function
main "$@"