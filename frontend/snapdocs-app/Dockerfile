# ---------- Stage 1: Build ----------
FROM node:18-alpine AS build
WORKDIR /app

# Install build deps for native modules (node-gyp, sharp, node-sass, etc.)
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy lockfile if present (faster & reproducible)
COPY package*.json ./

# Prefer npm ci when lockfile exists, fallback to npm install
RUN npm ci --silent || npm install --silent

# Copy app and env (React needs REACT_APP_* at build time)
COPY . .
COPY .env .env

# Helpful if react-scripts is chatty about warnings failing the build in CI
ENV CI=false

# Build React app
RUN npm run build

# ---------- Stage 2: NGINX ----------
FROM nginx:alpine
# If you intend to fully override nginx, keep this. Else you can delete it.
COPY nginx.conf /etc/nginx/nginx.conf

# Serve built files
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
