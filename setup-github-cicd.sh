#!/bin/bash

# GitHub Actions CI/CD Setup Script for GreenPantry
# This script helps you set up GitHub Actions for automated deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🚀 GreenPantry GitHub Actions CI/CD Setup"
echo "=========================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    error "This is not a git repository. Please initialize git first."
    exit 1
fi

# Check if we have a remote origin
if ! git remote get-url origin &> /dev/null; then
    warning "No remote origin found. You'll need to add a GitHub repository."
    echo "Run: git remote add origin https://github.com/yourusername/greenpantry.git"
    exit 1
fi

log "Repository: $(git remote get-url origin)"

# Display the service principal credentials
echo ""
log "Azure Service Principal Created Successfully!"
echo ""
echo "📋 Azure Credentials (Save these securely):"
echo "=========================================="
echo "Client ID: YOUR_CLIENT_ID"
echo "Client Secret: YOUR_CLIENT_SECRET"
echo "Subscription ID: YOUR_SUBSCRIPTION_ID"
echo "Tenant ID: YOUR_TENANT_ID"
echo ""

# Create the JSON for AZURE_CREDENTIALS
AZURE_CREDENTIALS='{
  "clientId": "YOUR_CLIENT_ID",
  "clientSecret": "YOUR_CLIENT_SECRET",
  "subscriptionId": "YOUR_SUBSCRIPTION_ID",
  "tenantId": "YOUR_TENANT_ID",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}'

echo "🔐 GitHub Secrets Setup Instructions:"
echo "====================================="
echo ""
echo "1. Go to your GitHub repository: $(git remote get-url origin)"
echo "2. Navigate to Settings → Secrets and variables → Actions"
echo "3. Click 'New repository secret' and add the following secrets:"
echo ""
echo "Secret Name: AZURE_CREDENTIALS"
echo "Secret Value: (Copy the entire JSON below)"
echo "$AZURE_CREDENTIALS"
echo ""
echo "Secret Name: JWT_SECRET"
echo "Secret Value: $(openssl rand -base64 32)"
echo ""
echo "Secret Name: RAZORPAY_API_KEY"
echo "Secret Value: YOUR_RAZORPAY_LIVE_API_KEY"
echo ""
echo "Secret Name: RAZORPAY_API_SECRET"
echo "Secret Value: YOUR_RAZORPAY_LIVE_API_SECRET"
echo ""
echo "Secret Name: RAZORPAY_WEBHOOK_SECRET"
echo "Secret Value: YOUR_RAZORPAY_LIVE_WEBHOOK_SECRET"
echo ""
echo "Secret Name: PAYTM_MERCHANT_ID"
echo "Secret Value: YOUR_PAYTM_LIVE_MERCHANT_ID"
echo ""
echo "Secret Name: PAYTM_MERCHANT_KEY"
echo "Secret Value: YOUR_PAYTM_LIVE_MERCHANT_KEY"
echo ""
echo "Secret Name: PHONEPE_MERCHANT_ID"
echo "Secret Value: YOUR_PHONEPE_LIVE_MERCHANT_ID"
echo ""
echo "Secret Name: PHONEPE_SALT_KEY"
echo "Secret Value: YOUR_PHONEPE_LIVE_SALT_KEY"
echo ""

# Check if GitHub Actions workflow exists
if [ -f ".github/workflows/ci-cd.yml" ]; then
    success "GitHub Actions workflow found: .github/workflows/ci-cd.yml"
else
    error "GitHub Actions workflow not found. Please ensure the workflow file exists."
    exit 1
fi

echo "🎯 Next Steps:"
echo "============="
echo ""
echo "1. Add all the secrets to your GitHub repository"
echo "2. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Add GitHub Actions CI/CD'"
echo "   git push origin main"
echo ""
echo "3. Go to the Actions tab in your GitHub repository"
echo "4. The workflow will automatically run on every push to main branch"
echo ""
echo "5. Monitor the deployment in the Actions tab"
echo "6. Once deployed, your app will be available at:"
echo "   - Frontend: https://greenpantry-frontend-[build-number].azurestaticapps.net"
echo "   - API: https://greenpantry-api-[build-number].azurewebsites.net"
echo "   - Custom Domain: https://greenpantry.in (after DNS configuration)"
echo ""

# Create a quick test script
cat > test-github-actions.sh << 'EOF'
#!/bin/bash
echo "🧪 Testing GitHub Actions Setup"
echo "==============================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository"
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin &> /dev/null; then
    echo "❌ No remote origin found"
    exit 1
fi

echo "✅ Git repository: $(git remote get-url origin)"

# Check if workflow file exists
if [ -f ".github/workflows/ci-cd.yml" ]; then
    echo "✅ GitHub Actions workflow found"
else
    echo "❌ GitHub Actions workflow not found"
    exit 1
fi

echo "✅ Setup looks good! Ready to push to GitHub."
echo ""
echo "Run these commands to trigger the deployment:"
echo "git add ."
echo "git commit -m 'Trigger GitHub Actions deployment'"
echo "git push origin main"
EOF

chmod +x test-github-actions.sh
success "Created test script: test-github-actions.sh"

echo ""
success "🎉 GitHub Actions CI/CD setup complete!"
echo ""
echo "📚 For more information, see: CICD_SETUP_GUIDE.md"



