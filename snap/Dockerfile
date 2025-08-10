# ---- Build Stage ----
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy sources and build
COPY . .
RUN npm run build

# ---- Nginx Serve Stage ----
FROM nginx:alpine

# Copy production build from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Optional: custom SPA routing config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
