#!/bin/bash

# SnapDocs Backend Structure Creation Script
# Creates complete microservices folder structure

set -e

PROJECT_NAME="secure-docs-backend"
echo "🚀 Creating SnapDocs Backend Structure..."
echo "========================================"

# Create main project directory
if [ -d "$PROJECT_NAME" ]; then
    echo "📁 Project '$PROJECT_NAME' already exists - updating structure..."
    cd $PROJECT_NAME
else
    echo "📁 Creating new project: $PROJECT_NAME"
    mkdir -p $PROJECT_NAME
    cd $PROJECT_NAME
fi

# =============================================
# SERVICES FOLDER STRUCTURE
# =============================================
echo "🔐 Creating Auth Service structure..."
mkdir -p services/auth-service/src/{controllers,middleware,models,routes,config,utils}
touch services/auth-service/src/controllers/{authController.js,userController.js}
touch services/auth-service/src/middleware/{auth.js,validation.js,errorHandler.js}
touch services/auth-service/src/models/User.js
touch services/auth-service/src/routes/{auth.js,users.js}
touch services/auth-service/src/config/{database.js,jwt.js,config.js}
touch services/auth-service/src/utils/{bcrypt.js,validators.js,response.js}
touch services/auth-service/src/app.js
touch services/auth-service/{package.json,Dockerfile,.env.example}

echo "📁 Creating Folder Service structure..."
mkdir -p services/folder-service/src/{controllers,middleware,models,routes,config,utils}
touch services/folder-service/src/controllers/folderController.js
touch services/folder-service/src/middleware/{auth.js,validation.js}
touch services/folder-service/src/models/Folder.js
touch services/folder-service/src/routes/folders.js
touch services/folder-service/src/config/{database.js,config.js}
touch services/folder-service/src/utils/{validators.js,response.js}
touch services/folder-service/src/app.js
touch services/folder-service/{package.json,Dockerfile,.env.example}

echo "📤 Creating Upload Service structure..."
mkdir -p services/upload-service/src/{controllers,middleware,models,routes,config,utils}
mkdir -p services/upload-service/uploads
touch services/upload-service/src/controllers/{uploadController.js,fileController.js}
touch services/upload-service/src/middleware/{auth.js,upload.js,validation.js}
touch services/upload-service/src/models/File.js
touch services/upload-service/src/routes/{upload.js,files.js}
touch services/upload-service/src/config/{database.js,s3.js,config.js}
touch services/upload-service/src/utils/{s3Utils.js,fileValidation.js,response.js}
touch services/upload-service/src/app.js
touch services/upload-service/{package.json,Dockerfile,.env.example}

echo "🔍 Creating Search Service structure..."
mkdir -p services/search-service/src/{controllers,middleware,models,routes,config,utils}
touch services/search-service/src/controllers/searchController.js
touch services/search-service/src/middleware/{auth.js,validation.js}
touch services/search-service/src/models/Search.js
touch services/search-service/src/routes/search.js
touch services/search-service/src/config/{database.js,config.js}
touch services/search-service/src/utils/{searchUtils.js,response.js}
touch services/search-service/src/app.js
touch services/search-service/{package.json,Dockerfile,.env.example}

# =============================================
# DATABASE STRUCTURE
# =============================================
echo "🐘 Creating Database structure..."
mkdir -p database/{migrations,seeds}
touch database/migrations/{001_create_users_table.sql,002_create_folders_table.sql,003_create_files_table.sql,004_create_search_indexes.sql}
touch database/seeds/{users.sql,folders.sql}
touch database/init.sql

# =============================================
# DOCKER CONFIGURATION
# =============================================
echo "🐳 Creating Docker configuration..."
mkdir -p docker/{nginx,postgres}
touch docker/{docker-compose.yml,docker-compose.dev.yml}
touch docker/nginx/nginx.conf
touch docker/postgres/init-db.sh

# =============================================
# SCRIPTS
# =============================================
echo "📜 Creating utility scripts..."
mkdir -p scripts
touch scripts/{setup-backend.sh,start-services.sh,stop-services.sh,reset-db.sh}

# =============================================
# SHARED RESOURCES
# =============================================
echo "🤝 Creating shared resources..."
mkdir -p shared/{middleware,utils,types}
touch shared/middleware/{cors.js,logger.js}
touch shared/utils/{constants.js,helpers.js}
touch shared/types/responses.js

# =============================================
# ROOT CONFIGURATION FILES
# =============================================
echo "📋 Creating root configuration files..."
touch {.env,.env.example,.gitignore,README.md,package.json}

echo ""
echo "✅ Backend structure created successfully!"
echo "========================================"
echo "📊 Summary:"
echo "   🔐 Auth Service: User authentication & JWT"
echo "   📁 Folder Service: Folder management"
echo "   📤 Upload Service: S3 file uploads"
echo "   🔍 Search Service: Document search"
echo "   🐘 PostgreSQL: Database structure"
echo "   🐳 Docker: Complete containerization"
echo "   📜 Scripts: Utility & deployment scripts"
echo ""

# Display the created structure
echo "📂 Created backend structure:"
echo "========================================"
find . -type d | head -20 | sed 's/^/   /'
echo "   ... and more!"
echo ""

# Count files and folders
FILE_COUNT=$(find . -type f | wc -l)
FOLDER_COUNT=$(find . -type d | wc -l)
echo "📄 Total files created: $FILE_COUNT"
echo "📁 Total folders created: $FOLDER_COUNT"

echo ""
echo "🎯 Service Ports:"
echo "   Frontend:      http://localhost:80"
echo "   Auth Service:  http://localhost:3001"
echo "   Folder Service: http://localhost:3002"
echo "   Upload Service: http://localhost:3003"
echo "   Search Service: http://localhost:3004"
echo "   PostgreSQL:    localhost:5432"
echo ""
echo "🔗 All services will communicate via 'snapdocs-network'"
echo ""
echo "🚀 Next steps:"
echo "   1. cd $PROJECT_NAME"
echo "   2. Start with Auth Service development"
echo "   3. Create PostgreSQL migrations"
echo "   4. Setup Docker Compose"
echo "   5. Build and test each service"
echo ""
echo "📋 Structure verification:"
echo "   Auth Service files: $(find services/auth-service -name "*.js" -o -name "*.json" | wc -l)"
echo "   Folder Service files: $(find services/folder-service -name "*.js" -o -name "*.json" | wc -l)"
echo "   Upload Service files: $(find services/upload-service -name "*.js" -o -name "*.json" | wc -l)"
echo "   Search Service files: $(find services/search-service -name "*.js" -o -name "*.json" | wc -l)"
echo "   Database files: $(find database -name "*.sql" | wc -l)"
echo "   Docker files: $(find docker -type f | wc -l)"
echo ""
echo "🎉 Ready to start coding the Auth Service!"