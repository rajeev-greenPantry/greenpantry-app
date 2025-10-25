#!/bin/bash

# Quick Deploy Script for GreenPantry to Azure
# This script will deploy your application to Azure and make it accessible at greenpantry.in

set -e

echo "🚀 GreenPantry Quick Deploy to Azure"
echo "===================================="

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first."
    echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if user is logged in
if ! az account show &> /dev/null; then
    echo "❌ You are not logged in to Azure. Please run 'az login' first."
    exit 1
fi

echo "✅ Azure CLI is installed and you are logged in."

# Get subscription info
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
SUBSCRIPTION_NAME=$(az account show --query name -o tsv)

echo "📋 Using Azure Subscription: $SUBSCRIPTION_NAME ($SUBSCRIPTION_ID)"

# Configuration
RESOURCE_GROUP="greenpantry-rg"
LOCATION="East US"
API_APP_NAME="greenpantry-api-$(date +%s)"
STATIC_WEB_APP_NAME="greenpantry-$(date +%s)"

echo ""
echo "🔧 Configuration:"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Location: $LOCATION"
echo "  API App: $API_APP_NAME"
echo "  Static Web App: $STATIC_WEB_APP_NAME"
echo ""

read -p "Do you want to proceed with deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

echo ""
echo "🏗️  Creating Azure resources..."

# Create resource group
echo "  Creating resource group..."
az group create --name $RESOURCE_GROUP --location "$LOCATION" --output none

# Create App Service Plan
echo "  Creating App Service Plan..."
az appservice plan create \
    --name "greenpantry-plan" \
    --resource-group $RESOURCE_GROUP \
    --sku B1 \
    --is-linux \
    --output none

# Create Cosmos DB
echo "  Creating Cosmos DB..."
az cosmosdb create \
    --name "greenpantry-db-$(date +%s)" \
    --resource-group $RESOURCE_GROUP \
    --kind GlobalDocumentDB \
    --locations regionName="$LOCATION" failoverPriority=0 isZoneRedundant=False \
    --output none

# Create API App Service
echo "  Creating API App Service..."
az webapp create \
    --name $API_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --plan "greenpantry-plan" \
    --runtime "DOTNETCORE|8.0" \
    --output none

# Get Cosmos DB connection string
echo "  Getting Cosmos DB connection string..."
COSMOS_CONNECTION_STRING=$(az cosmosdb keys list \
    --name "greenpantry-db-$(date +%s)" \
    --resource-group $RESOURCE_GROUP \
    --type connection-strings \
    --query 'connectionStrings[0].connectionString' \
    --output tsv)

# Configure API App Service
echo "  Configuring API App Service..."
az webapp config appsettings set \
    --name $API_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --settings \
        ASPNETCORE_ENVIRONMENT=Production \
        ConnectionStrings__DefaultConnection="$COSMOS_CONNECTION_STRING" \
        PaymentProviders__Razorpay__IsEnabled=true \
        PaymentProviders__Razorpay__IsTestMode=true \
        PaymentProviders__Paytm__IsEnabled=true \
        PaymentProviders__Paytm__IsTestMode=true \
        PaymentProviders__PhonePe__IsEnabled=true \
        PaymentProviders__PhonePe__IsTestMode=true \
    --output none

# Deploy API
echo "  Deploying API..."
cd "/home/raja/Projects/Rajeev's Pvt. Ltd./R's GreenPantry/backend/GreenPantry.API"
dotnet publish -c Release -o ./publish --output none
cd publish
zip -r ../api-deployment.zip . --quiet
az webapp deployment source config-zip \
    --name $API_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --src ../api-deployment.zip \
    --output none

# Get API URL
API_URL="https://$API_APP_NAME.azurewebsites.net"
echo "  ✅ API deployed to: $API_URL"

# Create Static Web App
echo "  Creating Static Web App..."
az staticwebapp create \
    --name $STATIC_WEB_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --source "https://github.com/yourusername/greenpantry" \
    --location "$LOCATION" \
    --branch main \
    --app-location "/frontend" \
    --output-location "dist" \
    --output none

# Get Static Web App URL
STATIC_WEB_APP_URL="https://$STATIC_WEB_APP_NAME.azurestaticapps.net"
echo "  ✅ Static Web App created: $STATIC_WEB_APP_URL"

# Update frontend environment
echo "  Updating frontend environment..."
cd "/home/raja/Projects/Rajeev's Pvt. Ltd./R's GreenPantry/frontend"
echo "VITE_API_BASE_URL=$API_URL/api" > .env.production

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "🌐 Your application URLs:"
echo "  API: $API_URL"
echo "  Frontend: $STATIC_WEB_APP_URL"
echo ""
echo "📋 Next steps:"
echo "  1. Test your API: curl $API_URL/health"
echo "  2. Test your frontend: curl $STATIC_WEB_APP_URL"
echo "  3. Configure custom domain: greenpantry.in"
echo "  4. Set up payment provider API keys"
echo "  5. Configure SSL certificates"
echo ""
echo "🔧 To configure custom domain:"
echo "  az webapp config hostname add --webapp-name $API_APP_NAME --resource-group $RESOURCE_GROUP --hostname greenpantry.in"
echo "  az staticwebapp hostname set --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP --hostname greenpantry.in"
echo ""
echo "📖 For detailed instructions, see: DEPLOYMENT_GUIDE.md"



