#!/bin/bash

# Enhanced Azure Deployment Script for GreenPantry
# This script sets up the complete Azure infrastructure and deploys the application

set -e  # Exit on any error

# Configuration
RESOURCE_GROUP="GreenPantryRG"
LOCATION="East US"
COSMOSDB_ACCOUNT="greenpantry-cosmosdb-$(date +%s)"
API_APP_NAME="greenpantry-api-$(date +%s)"
FRONTEND_APP_NAME="greenpantry-frontend-$(date +%s)"
FRONTEND_LOCATION="./frontend"
API_LOCATION="./backend/GreenPantry.API"
BUILD_ID=$(date +%s)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if Azure CLI is installed and user is logged in
check_azure_cli() {
    log "Checking Azure CLI installation..."
    if ! command -v az &> /dev/null; then
        error "Azure CLI is not installed. Please install it first: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
        exit 1
    fi
    
    log "Checking Azure login status..."
    if ! az account show &> /dev/null; then
        error "You are not logged into Azure. Please run 'az login' and try again."
        exit 1
    fi
    
    success "Azure CLI is ready"
}

# Create resource group
create_resource_group() {
    log "Creating resource group: $RESOURCE_GROUP in $LOCATION..."
    if az group show --name $RESOURCE_GROUP &> /dev/null; then
        warning "Resource group $RESOURCE_GROUP already exists"
    else
        az group create --name $RESOURCE_GROUP --location "$LOCATION" --tags Environment=Production Project=GreenPantry
        success "Resource group created: $RESOURCE_GROUP"
    fi
}

# Create Cosmos DB account
create_cosmos_db() {
    log "Creating Cosmos DB account: $COSMOSDB_ACCOUNT..."
    if az cosmosdb show --name $COSMOSDB_ACCOUNT --resource-group $RESOURCE_GROUP &> /dev/null; then
        warning "Cosmos DB account $COSMOSDB_ACCOUNT already exists"
    else
        az cosmosdb create \
            --name $COSMOSDB_ACCOUNT \
            --resource-group $RESOURCE_GROUP \
            --locations regionName="$LOCATION" failoverPriority=0 \
            --default-consistency-level Session \
            --enable-multiple-write-locations false \
            --enable-automatic-failover false
        
        success "Cosmos DB account created: $COSMOSDB_ACCOUNT"
    fi
    
    # Get connection details
    COSMOS_ENDPOINT=$(az cosmosdb show --name $COSMOSDB_ACCOUNT --resource-group $RESOURCE_GROUP --query documentEndpoint -o tsv)
    COSMOS_KEY=$(az cosmosdb keys list --name $COSMOSDB_ACCOUNT --resource-group $RESOURCE_GROUP --query primaryMasterKey -o tsv)
    
    log "Cosmos DB Endpoint: $COSMOS_ENDPOINT"
    log "Cosmos DB Key: ${COSMOS_KEY:0:10}..."
}

# Create App Service Plan
create_app_service_plan() {
    log "Creating App Service Plan..."
    PLAN_NAME="${API_APP_NAME}-plan"
    if az appservice plan show --name $PLAN_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
        warning "App Service Plan $PLAN_NAME already exists"
    else
        az appservice plan create \
            --name $PLAN_NAME \
            --resource-group $RESOURCE_GROUP \
            --sku B1 \
            --is-linux
        
        success "App Service Plan created: $PLAN_NAME"
    fi
}

# Create and configure API Web App
create_api_webapp() {
    log "Creating API Web App: $API_APP_NAME..."
    if az webapp show --name $API_APP_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
        warning "Web App $API_APP_NAME already exists"
    else
        az webapp create \
            --resource-group $RESOURCE_GROUP \
            --plan "${API_APP_NAME}-plan" \
            --name $API_APP_NAME \
            --runtime "DOTNET|8.0"
        
        success "Web App created: $API_APP_NAME"
    fi
    
    # Configure app settings
    log "Configuring app settings..."
    az webapp config appsettings set \
        --name $API_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --settings \
            "CosmosDb__AccountEndpoint=$COSMOS_ENDPOINT" \
            "CosmosDb__AccountKey=$COSMOS_KEY" \
            "CosmosDb__DatabaseName=GreenPantryDb" \
            "ASPNETCORE_ENVIRONMENT=Production" \
            "JwtSettings__Secret=${JWT_SECRET:-$(openssl rand -base64 32)}" \
            "JwtSettings__Issuer=https://$API_APP_NAME.azurewebsites.net" \
            "JwtSettings__Audience=https://greenpantry.in" \
            "PaymentProviders__Razorpay__ApiKey=${RAZORPAY_API_KEY:-YOUR_RAZORPAY_LIVE_API_KEY}" \
            "PaymentProviders__Razorpay__ApiSecret=${RAZORPAY_API_SECRET:-YOUR_RAZORPAY_LIVE_API_SECRET}" \
            "PaymentProviders__Razorpay__WebhookSecret=${RAZORPAY_WEBHOOK_SECRET:-YOUR_RAZORPAY_LIVE_WEBHOOK_SECRET}" \
            "PaymentProviders__Paytm__MerchantId=${PAYTM_MERCHANT_ID:-YOUR_PAYTM_LIVE_MERCHANT_ID}" \
            "PaymentProviders__Paytm__MerchantKey=${PAYTM_MERCHANT_KEY:-YOUR_PAYTM_LIVE_MERCHANT_KEY}" \
            "PaymentProviders__PhonePe__MerchantId=${PHONEPE_MERCHANT_ID:-YOUR_PHONEPE_LIVE_MERCHANT_ID}" \
            "PaymentProviders__PhonePe__SaltKey=${PHONEPE_SALT_KEY:-YOUR_PHONEPE_LIVE_SALT_KEY}"
    
    success "App settings configured"
}

# Deploy API code
deploy_api() {
    log "Building and deploying API..."
    cd $API_LOCATION
    
    # Build the application
    log "Building .NET application..."
    dotnet publish -c Release -o publish --no-restore
    
    # Create deployment package
    log "Creating deployment package..."
    cd publish
    zip -r ../publish.zip ./*
    cd ..
    
    # Deploy to Azure
    log "Deploying to Azure Web App..."
    az webapp deployment source config-zip \
        --resource-group $RESOURCE_GROUP \
        --name $API_APP_NAME \
        --src publish.zip
    
    # Cleanup
    rm publish.zip
    rm -rf publish
    cd - > /dev/null
    
    success "API deployed successfully"
}

# Create Static Web App
create_static_webapp() {
    log "Creating Static Web App: $FRONTEND_APP_NAME..."
    if az staticwebapp show --name $FRONTEND_APP_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
        warning "Static Web App $FRONTEND_APP_NAME already exists"
    else
        # Build frontend first
        log "Building frontend..."
        cd $FRONTEND_LOCATION
        npm ci
        VITE_API_BASE_URL="https://$API_APP_NAME.azurewebsites.net/api" npm run build
        cd - > /dev/null
        
        # Create Static Web App
        DEPLOYMENT_TOKEN=$(az staticwebapp create \
            --name $FRONTEND_APP_NAME \
            --resource-group $RESOURCE_GROUP \
            --location "$LOCATION" \
            --source "https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')" \
            --branch main \
            --app-location "/frontend" \
            --api-location "/backend/GreenPantry.API" \
            --output-location "dist" \
            --query "repositoryToken" -o tsv)
        
        success "Static Web App created: $FRONTEND_APP_NAME"
        log "Deployment token: $DEPLOYMENT_TOKEN"
    fi
}

# Configure custom domains
configure_domains() {
    log "Configuring custom domains..."
    
    # Configure frontend domain
    if az staticwebapp hostname show --name $FRONTEND_APP_NAME --resource-group $RESOURCE_GROUP --hostname greenpantry.in &> /dev/null; then
        warning "Domain greenpantry.in already configured for frontend"
    else
        az staticwebapp hostname set \
            --name $FRONTEND_APP_NAME \
            --resource-group $RESOURCE_GROUP \
            --hostname greenpantry.in
        success "Frontend domain configured: greenpantry.in"
    fi
    
    # Configure API domain
    if az webapp config hostname show --webapp-name $API_APP_NAME --resource-group $RESOURCE_GROUP --hostname api.greenpantry.in &> /dev/null; then
        warning "Domain api.greenpantry.in already configured for API"
    else
        az webapp config hostname add \
            --webapp-name $API_APP_NAME \
            --resource-group $RESOURCE_GROUP \
            --hostname api.greenpantry.in
        success "API domain configured: api.greenpantry.in"
    fi
}

# Main deployment function
main() {
    log "Starting Azure deployment for GreenPantry..."
    log "Build ID: $BUILD_ID"
    
    check_azure_cli
    create_resource_group
    create_cosmos_db
    create_app_service_plan
    create_api_webapp
    deploy_api
    create_static_webapp
    configure_domains
    
    # Output final URLs
    API_URL="https://$API_APP_NAME.azurewebsites.net"
    FRONTEND_URL="https://$FRONTEND_APP_NAME.azurestaticapps.net"
    
    echo ""
    success "🎉 Deployment completed successfully!"
    echo ""
    echo "📊 Deployment Summary:"
    echo "  Resource Group: $RESOURCE_GROUP"
    echo "  Cosmos DB: $COSMOSDB_ACCOUNT"
    echo "  API Web App: $API_APP_NAME"
    echo "  Frontend SWA: $FRONTEND_APP_NAME"
    echo ""
    echo "🌐 URLs:"
    echo "  Frontend: $FRONTEND_URL"
    echo "  API: $API_URL"
    echo "  Custom Domain: https://greenpantry.in"
    echo "  API Custom Domain: https://api.greenpantry.in"
    echo ""
    echo "📝 Next Steps:"
    echo "  1. Update your DNS records to point greenpantry.in to the Static Web App"
    echo "  2. Update your DNS records to point api.greenpantry.in to the Web App"
    echo "  3. Configure SSL certificates for custom domains in Azure Portal"
    echo "  4. Update payment provider webhook URLs with the new API URL"
    echo ""
    warning "Remember to update your environment variables with actual payment provider credentials!"
}

# Run main function
main "$@"
