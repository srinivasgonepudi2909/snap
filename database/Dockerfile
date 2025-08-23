# Use official MongoDB base image
FROM mongo:6.0

# Copy initialization script to container's init directory
COPY init.js /docker-entrypoint-initdb.d/

# Set permissions (optional for safety)
RUN chmod 644 /docker-entrypoint-initdb.d/init.js

# No need for CMD or ENTRYPOINT — base image handles it
