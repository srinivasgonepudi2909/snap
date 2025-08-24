#!/bin/bash

# ========================================
# SnapDocs Phase 1 - Remaining Structure Setup
# Author: SnapDocs Team
# Version: 1.0
# Description: Completes document-service and creates frontend dashboard structure
# ========================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${PURPLE}========================================${NC}"
}

# Function to check if we're in the right directory
check_project_root() {
    if [[ ! -f "docker-compose.yaml" || ! -d "backend/services/auth-service" ]]; then
        print_error "Not in SnapDocs project root directory!"
        print_warning "Please run this script from the directory containing docker-compose.yaml"
        exit 1
    fi
    
    # Check if document-service structure already exists (from previous commands)
    if [[ ! -d "backend/services/document-service/app" ]]; then
        print_error "Document-service structure not found!"
        print_warning "Please run the previous commands first to create document-service structure"
        exit 1
    fi
    
    print_success "Confirmed: In SnapDocs project root directory"
    print_success "Document-service structure found"
}

# Function to complete document-service structure
complete_document_service() {
    print_header "COMPLETING DOCUMENT-SERVICE STRUCTURE"
    
    print_status "Creating missing Docker and dependency files..."
    touch backend/services/document-service/Dockerfile
    touch backend/services/document-service/pyproject.toml
    
    print_success "Document-service structure completed!"
}

# Function to create frontend dashboard structure
create_frontend_dashboard() {
    print_header "CREATING FRONTEND DASHBOARD STRUCTURE"
    
    # Navigate to frontend source
    print_status "Navigating to frontend source directory..."
    cd frontend/snapdocs-app/src
    
    # Create dashboard components
    print_status "Creating dashboard components directory..."
    mkdir -p components/dashboard
    
    print_status "Creating dashboard component files..."
    touch components/dashboard/Dashboard.jsx
    touch components/dashboard/FileExplorer.jsx
    touch components/dashboard/FileUploader.jsx
    touch components/dashboard/FolderManager.jsx
    touch components/dashboard/FileCard.jsx
    touch components/dashboard/FolderCard.jsx
    
    # Create common components directory (may already exist)
    print_status "Creating common components directory..."
    mkdir -p components/common
    
    print_status "Creating common component files..."
    touch components/common/Header.jsx
    touch components/common/Sidebar.jsx
    touch components/common/ProtectedRoute.jsx
    
    # Create hooks directory
    print_status "Creating React hooks directory..."
    mkdir -p hooks
    
    print_status "Creating hook files..."
    touch hooks/useAuth.js
    touch hooks/useDocuments.js
    touch hooks/useFolders.js
    
    # Create services directory
    print_status "Creating API services directory..."
    mkdir -p services
    
    print_status "Creating service files..."
    touch services/api.js
    touch services/authService.js
    touch services/documentService.js
    
    # Create/update utils directory (may already exist)
    print_status "Creating utils directory..."
    mkdir -p utils
    
    print_status "Creating utility files..."
    touch utils/constants.js
    touch utils/helpers.js
    
    # Go back to project root
    print_status "Returning to project root..."
    cd ../../../
    
    print_success "Frontend dashboard structure created successfully!"
}

# Function to verify complete structure
verify_complete_structure() {
    print_header "VERIFYING COMPLETE STRUCTURE"
    
    print_status "Checking document-service files..."
    DOC_SERVICE_FILES=$(find backend/services/document-service -type f | wc -l)
    print_success "Document-service has $DOC_SERVICE_FILES files"
    
    print_status "Checking frontend dashboard files..."
    DASHBOARD_FILES=$(find frontend/snapdocs-app/src/components/dashboard -type f 2>/dev/null | wc -l)
    HOOKS_FILES=$(find frontend/snapdocs-app/src/hooks -type f 2>/dev/null | wc -l)
    SERVICES_FILES=$(find frontend/snapdocs-app/src/services -type f 2>/dev/null | wc -l)
    
    print_success "Dashboard components: $DASHBOARD_FILES files"
    print_success "React hooks: $HOOKS_FILES files"
    print_success "API services: $SERVICES_FILES files"
    
    # Show structure if tree command exists
    if command -v tree &> /dev/null; then
        echo -e "\n${CYAN}Complete Document Service Structure:${NC}"
        tree backend/services/document-service/ -I '__pycache__'
        
        echo -e "\n${CYAN}Frontend New Structure:${NC}"
        tree frontend/snapdocs-app/src/components/dashboard/
        tree frontend/snapdocs-app/src/hooks/
        tree frontend/snapdocs-app/src/services/
    else
        echo -e "\n${CYAN}Document Service Files:${NC}"
        find backend/services/document-service -type f | sort
        
        echo -e "\n${CYAN}Frontend Dashboard Files:${NC}"
        find frontend/snapdocs-app/src -path "*/dashboard/*" -o -path "*/hooks/*" -o -path "*/services/*" -type f 2>/dev/null | sort
    fi
}

# Function to create final summary
create_final_summary() {
    print_header "PHASE 1 STRUCTURE COMPLETE - FINAL SUMMARY"
    
    echo -e "${GREEN}✅ Document Service - COMPLETE:${NC}"
    echo "   📁 backend/services/document-service/"
    echo "   🐍 Python files: app/, api/, models/, services/, utils/"
    echo "   🐳 Docker files: Dockerfile, pyproject.toml"
    echo "   📤 Upload directory: uploads/"
    
    echo -e "\n${GREEN}✅ Frontend Dashboard - COMPLETE:${NC}"
    echo "   📁 components/dashboard/ (6 React components)"
    echo "   📁 components/common/ (3 common components)"
    echo "   📁 hooks/ (3 custom React hooks)"
    echo "   📁 services/ (3 API service files)"
    echo "   📁 utils/ (helper utilities)"
    
    echo -e "\n${PURPLE}📋 Files Ready for Population:${NC}"
    echo -e "${YELLOW}Backend (Python/FastAPI):${NC}"
    echo "   • main.py, routes.py, models, services"
    echo "   • Dockerfile, pyproject.toml, .env"
    
    echo -e "${YELLOW}Frontend (React/JSX):${NC}"
    echo "   • Dashboard.jsx, FileExplorer.jsx, etc."
    echo "   • Custom hooks and API services"
    echo "   • Protected routes and navigation"
    
    echo -e "\n${BLUE}🚀 NEXT PHASE 1 STEPS:${NC}"
    echo "   1️⃣  Populate all files with actual code"
    echo "   2️⃣  Update docker-compose.yaml"
    echo "   3️⃣  Add dashboard route to App.jsx"
    echo "   4️⃣  Test document-service startup"
    
    echo -e "\n${CYAN}📞 READY FOR NEXT STEP:${NC}"
    echo "   Tell me when ready for file population!"
    
    print_success "SnapDocs Phase 1 folder structure is 100% complete!"
}

# Main execution
main() {
    print_header "SNAPDOCS REMAINING SETUP SCRIPT"
    echo -e "${BLUE}Completing SnapDocs Phase 1 folder structure...${NC}\n"
    
    # Check project and existing structure
    check_project_root
    
    # Complete document service
    complete_document_service
    
    # Create frontend dashboard
    create_frontend_dashboard
    
    # Verify everything
    verify_complete_structure
    
    # Final summary
    create_final_summary
    
    echo -e "\n${GREEN}🎉 Phase 1 Structure Setup Complete! Ready for file population!${NC}"
}

# Execute main function
main "$@"