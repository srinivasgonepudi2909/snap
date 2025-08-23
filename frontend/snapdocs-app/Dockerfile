FROM node:18-alpine as build
WORKDIR /app

COPY frontend/snapdocs-app/package.json ./
COPY frontend/snapdocs-app/.env .env    
RUN npm install --silent
COPY frontend/snapdocs-app .
RUN npm run build

FROM nginx:alpine
COPY frontend/snapdocs-app/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]