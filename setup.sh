#!/bin/bash

# GreenPantry Setup Script
# This script sets up the development environment for GreenPantry

set -e

echo "🚀 Setting up GreenPantry Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check .NET
    if ! command -v dotnet &> /dev/null; then
        print_error ".NET 8 SDK is not installed. Please install from https://dotnet.microsoft.com/download"
        exit 1
    fi
    
    DOTNET_VERSION=$(dotnet --version | cut -d'.' -f1)
    if [ "$DOTNET_VERSION" -lt 8 ]; then
        print_error ".NET 8+ is required. Current version: $(dotnet --version)"
        exit 1
    fi
    
    # Check Docker (optional)
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. Docker is optional but recommended for containerized development."
    fi
    
    print_success "All requirements satisfied!"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Restore packages
    print_status "Restoring .NET packages..."
    dotnet restore
    
    # Build solution
    print_status "Building solution..."
    dotnet build --configuration Release
    
    # Run tests
    print_status "Running tests..."
    dotnet test --configuration Release --no-build --verbosity normal
    
    print_success "Backend setup completed!"
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install packages
    print_status "Installing npm packages..."
    npm install
    
    # Build application
    print_status "Building frontend..."
    npm run build
    
    print_success "Frontend setup completed!"
    cd ..
}

# Create environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "backend/GreenPantry.API/appsettings.Development.json" ]; then
        cat > backend/GreenPantry.API/appsettings.Development.json << EOF
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "CosmosDb": {
    "ConnectionString": "YOUR_COSMOS_DB_CONNECTION_STRING_HERE",
    "DatabaseName": "GreenPantryDB"
  },
  "JwtSettings": {
    "SecretKey": "YOUR_SUPER_SECRET_KEY_THAT_IS_AT_LEAST_32_CHARACTERS_LONG",
    "Issuer": "GreenPantry",
    "Audience": "GreenPantryUsers",
    "ExpiryMinutes": 60,
    "RefreshTokenExpiryDays": 7
  }
}
EOF
        print_warning "Created backend/appsettings.Development.json - Please update with your Cosmos DB connection string!"
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env" ]; then
        cp frontend/env.example frontend/.env
        print_warning "Created frontend/.env - Please update with your API URL!"
    fi
    
    print_success "Environment files created!"
}

# Setup Docker (optional)
setup_docker() {
    if command -v docker &> /dev/null; then
        print_status "Setting up Docker environment..."
        
        # Create .env file for docker-compose
        if [ ! -f ".env" ]; then
            cat > .env << EOF
# Cosmos DB Configuration
COSMOS_DB_CONNECTION_STRING=YOUR_COSMOS_DB_CONNECTION_STRING_HERE

# JWT Configuration
JWT_SECRET_KEY=YOUR_SUPER_SECRET_KEY_THAT_IS_AT_LEAST_32_CHARACTERS_LONG

# API Configuration
API_BASE_URL=http://localhost:7001/api
EOF
            print_warning "Created .env file for Docker - Please update with your configuration!"
        fi
        
        print_success "Docker environment setup completed!"
    else
        print_warning "Docker not available - skipping Docker setup"
    fi
}

# Main setup function
main() {
    echo "🍽️  Welcome to GreenPantry Setup!"
    echo "=================================="
    
    check_requirements
    setup_backend
    setup_frontend
    setup_environment
    setup_docker
    
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Update your Cosmos DB connection string in backend/GreenPantry.API/appsettings.Development.json"
    echo "2. Update your API URL in frontend/.env"
    echo "3. Start the backend: cd backend && dotnet run"
    echo "4. Start the frontend: cd frontend && npm run dev"
    echo ""
    echo "For Docker setup:"
    echo "1. Update .env file with your configuration"
    echo "2. Run: docker-compose up -d"
    echo ""
    echo "Happy coding! 🚀"
}

# Run main function
main "$@"
