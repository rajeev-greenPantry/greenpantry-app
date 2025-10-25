#!/bin/bash

# Quick GitHub Actions Setup for GreenPantry
# This script helps you quickly set up GitHub Actions CI/CD

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Quick GitHub Actions Setup for GreenPantry${NC}"
echo "=============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing git repository...${NC}"
    git init
fi

# Check if remote origin exists
if ! git remote get-url origin &> /dev/null; then
    echo -e "${YELLOW}No remote origin found.${NC}"
    echo "Please add your GitHub repository:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/greenpantry.git"
    echo ""
    echo "Replace YOUR_USERNAME with your actual GitHub username"
    exit 1
fi

echo -e "${GREEN}✅ Git repository ready: $(git remote get-url origin)${NC}"

# Check if workflow exists
if [ -f ".github/workflows/ci-cd.yml" ]; then
    echo -e "${GREEN}✅ GitHub Actions workflow found${NC}"
else
    echo -e "${YELLOW}❌ GitHub Actions workflow not found${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "============="
echo ""
echo "1. 🔐 Add GitHub Secrets:"
echo "   Go to: https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/settings/secrets/actions"
echo ""
echo "2. 📝 Add these secrets:"
echo "   - AZURE_CREDENTIALS: (JSON from setup-github-cicd.sh)"
echo "   - JWT_SECRET: $(openssl rand -base64 32)"
echo "   - RAZORPAY_API_KEY: YOUR_RAZORPAY_LIVE_API_KEY"
echo "   - RAZORPAY_API_SECRET: YOUR_RAZORPAY_LIVE_API_SECRET"
echo "   - RAZORPAY_WEBHOOK_SECRET: YOUR_RAZORPAY_LIVE_WEBHOOK_SECRET"
echo "   - PAYTM_MERCHANT_ID: YOUR_PAYTM_LIVE_MERCHANT_ID"
echo "   - PAYTM_MERCHANT_KEY: YOUR_PAYTM_LIVE_MERCHANT_KEY"
echo "   - PHONEPE_MERCHANT_ID: YOUR_PHONEPE_LIVE_MERCHANT_ID"
echo "   - PHONEPE_SALT_KEY: YOUR_PHONEPE_LIVE_SALT_KEY"
echo ""
echo "3. 🚀 Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Add GitHub Actions CI/CD'"
echo "   git push origin main"
echo ""
echo "4. 📊 Monitor deployment:"
echo "   Go to Actions tab in your GitHub repository"
echo ""

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)
echo -e "${YELLOW}🔑 Generated JWT Secret: $JWT_SECRET${NC}"
echo ""

echo -e "${GREEN}🎉 Ready to deploy!${NC}"
echo ""
echo "For detailed instructions, see: GITHUB_ACTIONS_SETUP.md"



