# ---------- Stage 1: Build ----------
FROM node:18-alpine AS build
WORKDIR /app

# Install build deps for native modules
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy package files
COPY package*.json ./

# Debug: Show package.json content
RUN echo "=== Package.json content ===" && cat package.json

# Install dependencies with verbose logging
RUN npm ci --verbose || npm install --verbose

# Copy source files
COPY . .

# Debug: Show .env content (remove in production)
RUN echo "=== Environment Variables ===" && cat .env || echo "No .env file found"

# Set build environment variables
ENV CI=false
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Debug: Show source files
RUN echo "=== Source files ===" && ls -la src/

# Build with error handling
RUN echo "=== Starting React build ===" && \
    npm run build 2>&1 | tee build.log && \
    echo "=== Build completed ===" && \
    ls -la build/ || (echo "=== Build failed, showing log ===" && cat build.log && exit 1)

# ---------- Stage 2: NGINX ----------
FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files
COPY --from=build /app/build /usr/share/nginx/html

# Debug: Verify files copied
RUN echo "=== NGINX files ===" && ls -la /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]