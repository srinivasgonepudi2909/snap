#!/bin/bash

# SnapDocs Auth Service Project Setup (with Poetry)
# Author: Srinivas Gonepudi

set -e

echo "📁 Creating folder structure for auth-service..."

# Define root
ROOT="backend/services/auth-service"

# Create directories
mkdir -p $ROOT/app/{api,models,services,utils}

# Create base files
touch $ROOT/app/api/routes.py
touch $ROOT/app/models/user.py
touch $ROOT/app/services/auth.py
touch $ROOT/app/services/jwt_handler.py
touch $ROOT/app/utils/hash.py
touch $ROOT/app/utils/config.py
touch $ROOT/app/main.py
touch $ROOT/Dockerfile

# Navigate into the service directory
cd $ROOT

echo "📦 Initializing Poetry project..."
poetry init --name "auth-service" \
            --description "SnapDocs Auth Microservice with FastAPI + MongoDB" \
            --author "Srinivas Gonepudi <srinivas@example.com>" \
            --python "^3.10" \
            --dependency fastapi \
            --dependency uvicorn[standard] \
            --dependency pymongo \
            --dependency python-dotenv \
            --dependency bcrypt \
            --dependency python-jose \
            --dependency pydantic \
            --dependency email-validator \
            --dev-dependency pytest -n

echo "✅ Poetry project initialized"

# Lock dependencies
poetry lock

echo "🎉 Done! Auth-service structure ready with Poetry by Srinivas Gonepudi"
