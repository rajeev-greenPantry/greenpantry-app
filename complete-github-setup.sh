#!/bin/bash

# Complete GitHub Setup Script for GreenPantry
# This script will help you set up the GitHub repository and push your code

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Complete GitHub Setup for GreenPantry${NC}"
echo "============================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Not a git repository. Please run 'git init' first.${NC}"
    exit 1
fi

# Get GitHub username
echo -e "${YELLOW}📝 Please enter your GitHub username:${NC}"
read -p "GitHub Username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}❌ GitHub username is required${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📋 Repository Details:${NC}"
echo "====================="
echo "Repository Name: greenpantry"
echo "GitHub Username: $GITHUB_USERNAME"
echo "Repository URL: https://github.com/$GITHUB_USERNAME/greenpantry"
echo ""

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    echo -e "${YELLOW}⚠️  Remote origin already exists: $(git remote get-url origin)${NC}"
    echo -e "${YELLOW}Do you want to update it? (y/n):${NC}"
    read -p "Update remote? " UPDATE_REMOTE
    
    if [[ $UPDATE_REMOTE =~ ^[Yy]$ ]]; then
        git remote remove origin
        echo -e "${GREEN}✅ Removed existing remote${NC}"
    else
        echo -e "${BLUE}ℹ️  Keeping existing remote${NC}"
        exit 0
    fi
fi

# Add remote origin
echo -e "${BLUE}🔗 Adding remote origin...${NC}"
git remote add origin "https://github.com/$GITHUB_USERNAME/greenpantry.git"

# Verify remote was added
echo -e "${GREEN}✅ Remote origin added successfully${NC}"
echo -e "${BLUE}📋 Remote details:${NC}"
git remote -v

echo ""
echo -e "${BLUE}📦 Preparing to push code...${NC}"

# Add all files
echo -e "${BLUE}📁 Adding all files to git...${NC}"
git add .

# Commit changes
echo -e "${BLUE}💾 Committing changes...${NC}"
git commit -m "Initial commit: GreenPantry with GitHub Actions CI/CD

- Complete payment integration (Razorpay, Paytm, PhonePe)
- React frontend with TypeScript
- .NET Core backend with Clean Architecture
- Cosmos DB integration
- GitHub Actions CI/CD pipeline
- Azure deployment configuration
- Comprehensive documentation and setup guides"

echo -e "${GREEN}✅ Code committed successfully${NC}"

echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Before pushing, you need to create the GitHub repository!${NC}"
echo ""
echo -e "${BLUE}📋 Steps to create the repository:${NC}"
echo "=================================="
echo "1. Go to: https://github.com/new"
echo "2. Repository name: greenpantry"
echo "3. Description: GreenPantry - Food Delivery Platform with Payment Integration"
echo "4. Make it PUBLIC ✅"
echo "5. DON'T initialize with README ❌"
echo "6. Click 'Create repository'"
echo ""

# Ask if repository is created
echo -e "${YELLOW}Have you created the GitHub repository? (y/n):${NC}"
read -p "Repository created? " REPO_CREATED

if [[ $REPO_CREATED =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🚀 Pushing code to GitHub...${NC}"
    
    # Push to GitHub
    if git push -u origin main; then
        echo -e "${GREEN}✅ Code pushed successfully to GitHub!${NC}"
        echo ""
        echo -e "${GREEN}🎉 Repository setup complete!${NC}"
        echo ""
        echo -e "${BLUE}📋 Next steps:${NC}"
        echo "============="
        echo ""
        echo "1. 🔐 Add GitHub Secrets:"
        echo "   Go to: https://github.com/$GITHUB_USERNAME/greenpantry/settings/secrets/actions"
        echo ""
        echo "2. 📝 Add these secrets:"
        echo "   - AZURE_CREDENTIALS: (JSON provided below)"
        echo "   - JWT_SECRET: $(openssl rand -base64 32)"
        echo "   - RAZORPAY_API_KEY: YOUR_RAZORPAY_LIVE_API_KEY"
        echo "   - RAZORPAY_API_SECRET: YOUR_RAZORPAY_LIVE_API_SECRET"
        echo "   - RAZORPAY_WEBHOOK_SECRET: YOUR_RAZORPAY_LIVE_WEBHOOK_SECRET"
        echo "   - PAYTM_MERCHANT_ID: YOUR_PAYTM_LIVE_MERCHANT_ID"
        echo "   - PAYTM_MERCHANT_KEY: YOUR_PAYTM_LIVE_MERCHANT_KEY"
        echo "   - PHONEPE_MERCHANT_ID: YOUR_PHONEPE_LIVE_MERCHANT_ID"
        echo "   - PHONEPE_SALT_KEY: YOUR_PHONEPE_LIVE_SALT_KEY"
        echo ""
        echo "3. 📊 Monitor deployment:"
        echo "   Go to: https://github.com/$GITHUB_USERNAME/greenpantry/actions"
        echo ""
        echo "4. 🌐 After deployment, your app will be at:"
        echo "   - Frontend: https://greenpantry-frontend-[build-number].azurestaticapps.net"
        echo "   - API: https://greenpantry-api-[build-number].azurewebsites.net"
        echo "   - Custom Domain: https://greenpantry.in"
        echo ""
        
        # Generate JWT secret
        JWT_SECRET=$(openssl rand -base64 32)
        echo -e "${YELLOW}🔑 Generated JWT Secret: $JWT_SECRET${NC}"
        echo ""
        
        # Display Azure credentials
        echo -e "${YELLOW}🔐 Azure Credentials (for AZURE_CREDENTIALS secret):${NC}"
        echo '{"clientId":"YOUR_CLIENT_ID","clientSecret":"YOUR_CLIENT_SECRET","subscriptionId":"YOUR_SUBSCRIPTION_ID","tenantId":"YOUR_TENANT_ID","activeDirectoryEndpointUrl":"https://login.microsoftonline.com","resourceManagerEndpointUrl":"https://management.azure.com/","activeDirectoryGraphResourceId":"https://graph.windows.net/","sqlManagementEndpointUrl":"https://management.core.windows.net:8443/","galleryEndpointUrl":"https://gallery.azure.com/","managementEndpointUrl":"https://management.core.windows.net/"}'
        echo ""
        
    else
        echo -e "${RED}❌ Failed to push to GitHub. Please check your repository URL and try again.${NC}"
        echo ""
        echo -e "${BLUE}💡 Troubleshooting:${NC}"
        echo "1. Make sure the repository exists on GitHub"
        echo "2. Check if you have push permissions"
        echo "3. Verify your GitHub credentials"
        echo "4. Try: git push -u origin main --force"
    fi
else
    echo -e "${YELLOW}⏳ Please create the GitHub repository first, then run this script again.${NC}"
    echo ""
    echo -e "${BLUE}📋 Repository creation steps:${NC}"
    echo "1. Go to: https://github.com/new"
    echo "2. Repository name: greenpantry"
    echo "3. Description: GreenPantry - Food Delivery Platform with Payment Integration"
    echo "4. Make it PUBLIC ✅"
    echo "5. DON'T initialize with README ❌"
    echo "6. Click 'Create repository'"
    echo ""
    echo -e "${GREEN}✅ Your code is ready to push! Run this script again after creating the repository.${NC}"
fi

echo ""
echo -e "${GREEN}🚀 Setup script complete!${NC}"



