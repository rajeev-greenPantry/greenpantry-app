#!/bin/bash

# Azure Deployment Script for GreenPantry
# This script sets up Azure resources and deploys the application

set -e

echo "🌱 GreenPantry Azure Deployment Script"
echo "======================================"

# Configuration
RESOURCE_GROUP="greenpantry-rg"
LOCATION="East US"
APP_SERVICE_PLAN="greenpantry-plan"
API_APP_NAME="greenpantry-api"
STATIC_WEB_APP_NAME="greenpantry"
COSMOS_DB_NAME="greenpantry-db"
COSMOS_DB_CONTAINER="greenpantry-container"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed. Please install it first."
    echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if user is logged in
if ! az account show &> /dev/null; then
    print_error "You are not logged in to Azure. Please run 'az login' first."
    exit 1
fi

print_status "Starting Azure deployment..."

# Create resource group
print_status "Creating resource group: $RESOURCE_GROUP"
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# Create App Service Plan
print_status "Creating App Service Plan: $APP_SERVICE_PLAN"
az appservice plan create \
    --name $APP_SERVICE_PLAN \
    --resource-group $RESOURCE_GROUP \
    --sku B1 \
    --is-linux

# Create Cosmos DB
print_status "Creating Cosmos DB: $COSMOS_DB_NAME"
az cosmosdb create \
    --name $COSMOS_DB_NAME \
    --resource-group $RESOURCE_GROUP \
    --kind GlobalDocumentDB \
    --locations regionName="$LOCATION" failoverPriority=0 isZoneRedundant=False

# Create Cosmos DB container
print_status "Creating Cosmos DB container: $COSMOS_DB_CONTAINER"
az cosmosdb sql container create \
    --account-name $COSMOS_DB_NAME \
    --database-name "GreenPantryDB" \
    --name $COSMOS_DB_CONTAINER \
    --partition-key-path "/id" \
    --resource-group $RESOURCE_GROUP

# Get Cosmos DB connection string
print_status "Getting Cosmos DB connection string..."
COSMOS_CONNECTION_STRING=$(az cosmosdb keys list \
    --name $COSMOS_DB_NAME \
    --resource-group $RESOURCE_GROUP \
    --type connection-strings \
    --query 'connectionStrings[0].connectionString' \
    --output tsv)

# Create API App Service
print_status "Creating API App Service: $API_APP_NAME"
az webapp create \
    --name $API_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --plan $APP_SERVICE_PLAN \
    --runtime "DOTNETCORE|8.0"

# Configure API App Service
print_status "Configuring API App Service..."
az webapp config appsettings set \
    --name $API_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --settings \
        ASPNETCORE_ENVIRONMENT=Production \
        ConnectionStrings__DefaultConnection="$COSMOS_CONNECTION_STRING" \
        PaymentProviders__Razorpay__IsEnabled=true \
        PaymentProviders__Razorpay__IsTestMode=false \
        PaymentProviders__Paytm__IsEnabled=true \
        PaymentProviders__Paytm__IsTestMode=false \
        PaymentProviders__PhonePe__IsEnabled=true \
        PaymentProviders__PhonePe__IsTestMode=false

# Deploy API
print_status "Deploying API to Azure..."
cd "/home/raja/Projects/Rajeev's Pvt. Ltd./R's GreenPantry/backend/GreenPantry.API"
dotnet publish -c Release -o ./publish
cd publish
zip -r ../api-deployment.zip .
az webapp deployment source config-zip \
    --name $API_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --src ../api-deployment.zip

# Get API URL
API_URL="https://$API_APP_NAME.azurewebsites.net"
print_status "API deployed to: $API_URL"

# Create Static Web App
print_status "Creating Static Web App: $STATIC_WEB_APP_NAME"
az staticwebapp create \
    --name $STATIC_WEB_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --source "https://github.com/yourusername/greenpantry" \
    --location "$LOCATION" \
    --branch main \
    --app-location "/frontend" \
    --api-location "" \
    --output-location "dist"

# Get Static Web App URL
STATIC_WEB_APP_URL="https://$STATIC_WEB_APP_NAME.azurestaticapps.net"
print_status "Static Web App created: $STATIC_WEB_APP_URL"

# Update frontend environment
print_status "Updating frontend environment configuration..."
cd "/home/raja/Projects/Rajeev's Pvt. Ltd./R's GreenPantry/frontend"
echo "VITE_API_BASE_URL=$API_URL/api" > .env.production

print_status "Deployment completed successfully!"
echo ""
echo "🌐 Your application URLs:"
echo "  API: $API_URL"
echo "  Frontend: $STATIC_WEB_APP_URL"
echo ""
echo "📋 Next steps:"
echo "  1. Configure custom domain: greenpantry.in"
echo "  2. Set up SSL certificates"
echo "  3. Configure payment provider API keys"
echo "  4. Set up monitoring and logging"
echo ""
echo "🔧 To configure custom domain:"
echo "  az webapp config hostname add --webapp-name $API_APP_NAME --resource-group $RESOURCE_GROUP --hostname greenpantry.in"
echo "  az staticwebapp hostname set --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP --hostname greenpantry.in"



