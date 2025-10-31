#!/bin/bash

# GreenPantry Production Deployment Script
# This script deploys GreenPantry to Azure

set -e

echo "🌱 GreenPantry Production Deployment"
echo "===================================="

# Configuration
RESOURCE_GROUP="GreenPantryRG"
LOCATION="eastus2"
APP_SERVICE_PLAN="greenpantry-api-plan"
API_APP_NAME="greenpantry-api"
STATIC_WEB_APP_NAME="greenpantry-app"
COSMOS_DB_NAME="greenpantry-cosmosdb-8"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check prerequisites
print_step "Checking prerequisites..."

if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed. Please install it first."
    exit 1
fi

if ! az account show &> /dev/null; then
    print_error "You are not logged in to Azure. Please run 'az login' first."
    exit 1
fi

print_status "Prerequisites check passed!"

# Check if App Service Plan exists
print_step "Checking for existing App Service Plan..."
APP_SERVICE_PLAN_EXISTS=$(az appservice plan list --resource-group $RESOURCE_GROUP --query "[?name=='$APP_SERVICE_PLAN'].name" -o tsv)

if [ -z "$APP_SERVICE_PLAN_EXISTS" ]; then
    print_warning "App Service Plan not found. Attempting to create..."
    
    print_status "Creating App Service Plan: $APP_SERVICE_PLAN"
    if az appservice plan create --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP --sku B1 --is-linux --location $LOCATION 2>&1 | tee /tmp/app-service-plan.log; then
        print_status "App Service Plan created successfully!"
    else
        print_error "Failed to create App Service Plan. Check quota limits."
        echo "The log is saved in /tmp/app-service-plan.log"
        print_warning "Please request quota increase or use an existing App Service Plan."
        exit 1
    fi
else
    print_status "App Service Plan already exists."
fi

# Create or check Web App
print_step "Checking for existing Web App..."
WEB_APP_EXISTS=$(az webapp list --resource-group $RESOURCE_GROUP --query "[?name=='$API_APP_NAME'].name" -o tsv)

if [ -z "$WEB_APP_EXISTS" ]; then
    print_status "Creating Web App: $API_APP_NAME"
    az webapp create \
        --name $API_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --plan $APP_SERVICE_PLAN \
        --runtime "DOTNETCORE:8.0" \
        --https-only true
    
    print_status "Web App created successfully!"
else
    print_status "Web App already exists."
fi

# Get Cosmos DB connection string
print_step "Retrieving Cosmos DB connection string..."
COSMOS_CONNECTION_STRING=$(az cosmosdb keys list \
    --name $COSMOS_DB_NAME \
    --resource-group $RESOURCE_GROUP \
    --type connection-strings \
    --query 'connectionStrings[0].connectionString' \
    --output tsv)

print_status "Cosmos DB connection string retrieved."

# Configure app settings
print_step "Configuring Web App settings..."
az webapp config appsettings set \
    --name $API_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --settings \
    ASPNETCORE_ENVIRONMENT=Production \
    ConnectionStrings__DefaultConnection="$COSMOS_CONNECTION_STRING" \
    CosmosDb__ConnectionString="$COSMOS_CONNECTION_STRING" \
    CosmosDb__DatabaseName="GreenPantryDB" \
    JwtSettings__SecretKey="GreenPantry_Production_Secret_Key_2024_Change_This" \
    JwtSettings__Issuer="GreenPantry" \
    JwtSettings__Audience="GreenPantryUsers" \
    JwtSettings__ExpiryMinutes="60" \
    PaymentProviders__Razorpay__IsEnabled="false" \
    PaymentProviders__Paytm__IsEnabled="false" \
    PaymentProviders__PhonePe__IsEnabled="false"

print_status "App settings configured."

# Configure CORS
print_step "Configuring CORS..."
az webapp cors add \
    --name $API_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --allowed-origins "https://greenpantry.in" "https://www.greenpantry.in" "https://${STATIC_WEB_APP_NAME}.azurestaticapps.net" "https://salmon-stone-02e25c50f.3.azurestaticapps.net"

print_status "CORS configured."

# Build and deploy API
print_step "Building API..."
cd "/home/raja/Projects/Rajeev's Pvt. Ltd./R's GreenPantry/backend/GreenPantry.API"

dotnet publish -c Release -o ./publish

print_status "API built successfully."

# Create deployment package
print_step "Creating deployment package..."
cd publish
zip -r ../api-deployment.zip . > /dev/null 2>&1
cd ..

print_status "Deployment package created."

# Deploy to Azure
print_step "Deploying API to Azure..."
az webapp deployment source config-zip \
    --name $API_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --src ./api-deployment.zip

print_status "API deployed successfully!"

# Get API URL
API_URL="https://$API_APP_NAME.azurewebsites.net"
print_status "API deployed to: $API_URL"

# Get Static Web App URL
STATIC_WEB_APP_URL=$(az staticwebapp show --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP --query "defaultHostname" -o tsv)
STATIC_WEB_APP_URL="https://${STATIC_WEB_APP_URL}"

print_step "Deployment Summary:"
echo ""
echo "✅ API deployed to: $API_URL"
echo "✅ Frontend available at: $STATIC_WEB_APP_URL"
echo ""
echo "📋 Next steps:"
echo "  1. Configure custom domain in Azure Portal"
echo "  2. Add DNS records for greenpantry.in"
echo "  3. Test the deployed application"
echo "  4. Update frontend environment with production API URL"
echo ""
echo "🔧 Custom domain setup:"
echo "  Frontend: https://greenpantry.in"
echo "  API: https://api.greenpantry.in"
echo ""
echo "📝 To configure custom domain, run:"
echo "  az staticwebapp hostname set --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP --hostname greenpantry.in"
echo "  az webapp config hostname add --webapp-name $API_APP_NAME --resource-group $RESOURCE_GROUP --hostname api.greenpantry.in"
echo ""
echo "🎉 Deployment completed successfully!"


