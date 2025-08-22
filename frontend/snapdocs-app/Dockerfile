# -------------------------------
# Stage 1: Build the React app
# -------------------------------
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files separately for caching
COPY package.json package-lock.json ./
RUN npm install

# Copy the full source
COPY . .

# Build the production app
RUN npm run build

# -------------------------------
# Stage 2: Serve with Nginx
# -------------------------------
FROM nginx:1.25-alpine

# Remove default config and use our custom one
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from the builder stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
