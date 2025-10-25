#!/bin/bash

# Auto Deploy Setup Script for GreenPantry
# This script will create GitHub repo, push code, and set up CI/CD

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Auto Deploy Setup for GreenPantry${NC}"
echo "============================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${BLUE}📁 Initializing git repository...${NC}"
    git init
    git branch -M main
fi

# Check if GitHub CLI is available
if ! command -v gh &> /dev/null; then
    echo -e "${BLUE}📦 Installing GitHub CLI...${NC}"
    wget -qO- https://github.com/cli/cli/releases/download/v2.40.1/gh_2.40.1_linux_amd64.tar.gz | tar -xz
    mkdir -p ~/bin
    mv gh_2.40.1_linux_amd64/bin/gh ~/bin/
    echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
    source ~/.bashrc
    export PATH="$HOME/bin:$PATH"
fi

echo -e "${GREEN}✅ GitHub CLI ready${NC}"

# Authenticate with GitHub
echo -e "${BLUE}🔐 Authenticating with GitHub...${NC}"
echo "Please follow the authentication process:"
echo "1. Copy the one-time code"
echo "2. Open the provided URL in your browser"
echo "3. Enter the code and authorize the application"
echo ""

# Start authentication process
gh auth login --web --scopes repo,workflow,admin:org

# Create GitHub repository
echo -e "${BLUE}📦 Creating GitHub repository...${NC}"
gh repo create greenpantry \
    --public \
    --description "GreenPantry - Food Delivery Platform with Payment Integration" \
    --source=. \
    --remote=origin \
    --push

echo -e "${GREEN}✅ Repository created and code pushed!${NC}"

# Add all files and commit
echo -e "${BLUE}📁 Adding all files...${NC}"
git add .

# Create comprehensive commit message
git commit -m "🚀 Initial commit: GreenPantry with complete CI/CD setup

✨ Features:
- Complete payment integration (Razorpay, Paytm, PhonePe)
- React frontend with TypeScript
- .NET Core backend with Clean Architecture
- Cosmos DB integration
- GitHub Actions CI/CD pipeline
- Azure deployment configuration
- Custom domain support (greenpantry.in)

🔧 Technical Stack:
- Frontend: React + TypeScript + Vite
- Backend: .NET Core 8 + Clean Architecture
- Database: Azure Cosmos DB
- Payments: Razorpay, Paytm, PhonePe UPI
- Deployment: Azure App Service + Static Web Apps
- CI/CD: GitHub Actions

🌐 Domain: greenpantry.in
📱 Payment Methods: UPI QR, Cards, Net Banking
🔒 Security: JWT Authentication, HMAC Webhook Verification"

# Push to GitHub
echo -e "${BLUE}🚀 Pushing to GitHub...${NC}"
git push -u origin main

echo -e "${GREEN}✅ Code pushed successfully!${NC}"

# Set up GitHub secrets
echo -e "${BLUE}🔐 Setting up GitHub secrets...${NC}"

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Azure credentials (using the ones from your setup)
AZURE_CREDENTIALS='{"clientId":"YOUR_CLIENT_ID","clientSecret":"YOUR_CLIENT_SECRET","subscriptionId":"YOUR_SUBSCRIPTION_ID","tenantId":"YOUR_TENANT_ID","activeDirectoryEndpointUrl":"https://login.microsoftonline.com","resourceManagerEndpointUrl":"https://management.azure.com/","activeDirectoryGraphResourceId":"https://graph.windows.net/","sqlManagementEndpointUrl":"https://management.core.windows.net:8443/","galleryEndpointUrl":"https://gallery.azure.com/","managementEndpointUrl":"https://management.core.windows.net/"}'

# Set secrets
gh secret set AZURE_CREDENTIALS --body "$AZURE_CREDENTIALS"
gh secret set JWT_SECRET --body "$JWT_SECRET"
gh secret set RAZORPAY_API_KEY --body "YOUR_RAZORPAY_LIVE_API_KEY"
gh secret set RAZORPAY_API_SECRET --body "YOUR_RAZORPAY_LIVE_API_SECRET"
gh secret set RAZORPAY_WEBHOOK_SECRET --body "YOUR_RAZORPAY_LIVE_WEBHOOK_SECRET"
gh secret set PAYTM_MERCHANT_ID --body "YOUR_PAYTM_LIVE_MERCHANT_ID"
gh secret set PAYTM_MERCHANT_KEY --body "YOUR_PAYTM_LIVE_MERCHANT_KEY"
gh secret set PHONEPE_MERCHANT_ID --body "YOUR_PHONEPE_LIVE_MERCHANT_ID"
gh secret set PHONEPE_SALT_KEY --body "YOUR_PHONEPE_LIVE_SALT_KEY"

echo -e "${GREEN}✅ GitHub secrets configured!${NC}"

# Trigger GitHub Actions
echo -e "${BLUE}🔄 Triggering GitHub Actions deployment...${NC}"
gh workflow run "CI/CD Pipeline"

echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo -e "${BLUE}📋 What happens next:${NC}"
echo "========================"
echo "1. 🔄 GitHub Actions will automatically build and deploy your app"
echo "2. ⏱️  Deployment takes about 10-15 minutes"
echo "3. 🌐 Your app will be available at:"
echo "   - Frontend: https://greenpantry-frontend-[build-number].azurestaticapps.net"
echo "   - API: https://greenpantry-api-[build-number].azurewebsites.net"
echo "4. 🔗 Custom domain (greenpantry.in) will be configured after deployment"
echo ""
echo -e "${BLUE}📊 Monitor deployment:${NC}"
echo "Go to: https://github.com/$(gh api user --jq .login)/greenpantry/actions"
echo ""
echo -e "${BLUE}🔧 Next steps:${NC}"
echo "1. Update payment provider secrets with your live credentials"
echo "2. Configure DNS for greenpantry.in domain"
echo "3. Test the deployed application"
echo ""
echo -e "${GREEN}🚀 Your GreenPantry application is being deployed!${NC}"

