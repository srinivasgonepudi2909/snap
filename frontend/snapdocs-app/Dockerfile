FROM node:18-alpine as build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install --silent

# Copy environment file before build
COPY .env.local .env.local

# Copy the rest of the app
COPY . .

# Build the React app
RUN npm run build

# Final image using nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built React app to nginx web folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port and run nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
