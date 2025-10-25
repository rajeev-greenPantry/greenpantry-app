#!/bin/bash

# Setup Remote Origin for GreenPantry GitHub Repository
# Run this script after creating the GitHub repository

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔗 Setting up Remote Origin for GreenPantry${NC}"
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
echo -e "${GREEN}🎉 Remote origin setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "============="
echo ""
echo "1. 📤 Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Initial commit: GreenPantry with GitHub Actions CI/CD'"
echo "   git push -u origin main"
echo ""
echo "2. 🔐 Add GitHub Secrets:"
echo "   Go to: https://github.com/$GITHUB_USERNAME/greenpantry/settings/secrets/actions"
echo "   Add all the secrets listed in create-github-repo.md"
echo ""
echo "3. 📊 Monitor deployment:"
echo "   Go to: https://github.com/$GITHUB_USERNAME/greenpantry/actions"
echo ""

# Generate JWT secret for convenience
JWT_SECRET=$(openssl rand -base64 32)
echo -e "${YELLOW}🔑 Generated JWT Secret: $JWT_SECRET${NC}"
echo "   (Use this for the JWT_SECRET in GitHub Secrets)"
echo ""

echo -e "${GREEN}🚀 Ready to deploy!${NC}"



