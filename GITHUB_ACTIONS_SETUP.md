# 🚀 GitHub Actions CI/CD Setup for GreenPantry

This guide will help you set up automated deployment using GitHub Actions for your GreenPantry application.

## 📋 Prerequisites

1. ✅ **Azure CLI** (already installed)
2. ✅ **Azure Service Principal** (already created)
3. 🔄 **GitHub Repository** (needs to be created)
4. 🔄 **GitHub Secrets** (needs to be configured)

## 🔧 Step-by-Step Setup

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** button → **"New repository"**
3. Repository name: `greenpantry`
4. Description: `GreenPantry - Food Delivery Platform with Payment Integration`
5. Make it **Public** (for free GitHub Actions minutes)
6. **Don't** initialize with README (we already have files)
7. Click **"Create repository"**

### Step 2: Add Remote Origin

```bash
cd "/home/raja/Projects/Rajeev's Pvt. Ltd./R's GreenPantry"
git remote add origin https://github.com/YOUR_USERNAME/greenpantry.git
```

### Step 3: Configure GitHub Secrets

Go to your repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets:

#### 🔐 Required Secrets

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `AZURE_CREDENTIALS` | `{"clientId":"YOUR_CLIENT_ID","clientSecret":"YOUR_CLIENT_SECRET","subscriptionId":"YOUR_SUBSCRIPTION_ID","tenantId":"YOUR_TENANT_ID","activeDirectoryEndpointUrl":"https://login.microsoftonline.com","resourceManagerEndpointUrl":"https://management.azure.com/","activeDirectoryGraphResourceId":"https://graph.windows.net/","sqlManagementEndpointUrl":"https://management.core.windows.net:8443/","galleryEndpointUrl":"https://gallery.azure.com/","managementEndpointUrl":"https://management.core.windows.net/"}` | Azure authentication |
| `JWT_SECRET` | `$(openssl rand -base64 32)` | JWT signing secret |
| `RAZORPAY_API_KEY` | `YOUR_RAZORPAY_LIVE_API_KEY` | Razorpay API key |
| `RAZORPAY_API_SECRET` | `YOUR_RAZORPAY_LIVE_API_SECRET` | Razorpay API secret |
| `RAZORPAY_WEBHOOK_SECRET` | `YOUR_RAZORPAY_LIVE_WEBHOOK_SECRET` | Razorpay webhook secret |
| `PAYTM_MERCHANT_ID` | `YOUR_PAYTM_LIVE_MERCHANT_ID` | Paytm merchant ID |
| `PAYTM_MERCHANT_KEY` | `YOUR_PAYTM_LIVE_MERCHANT_KEY` | Paytm merchant key |
| `PHONEPE_MERCHANT_ID` | `YOUR_PHONEPE_LIVE_MERCHANT_ID` | PhonePe merchant ID |
| `PHONEPE_SALT_KEY` | `YOUR_PHONEPE_LIVE_SALT_KEY` | PhonePe salt key |

### Step 4: Push Code to GitHub

```bash
# Add all files
git add .

# Commit changes
git commit -m "Initial commit: GreenPantry with GitHub Actions CI/CD"

# Push to GitHub
git push -u origin main
```

### Step 5: Monitor Deployment

1. Go to your GitHub repository
2. Click the **"Actions"** tab
3. You'll see the workflow running automatically
4. Click on the workflow run to see detailed logs

## 🏗️ What the GitHub Actions Workflow Does

### 1. **Build Stage**
- ✅ Sets up Node.js 18.x and .NET 8.0
- ✅ Installs frontend dependencies (`npm ci`)
- ✅ Builds React frontend with production API URL
- ✅ Restores .NET dependencies
- ✅ Builds .NET API
- ✅ Runs unit tests
- ✅ Creates deployment artifacts

### 2. **Deploy Infrastructure Stage**
- ✅ Creates Azure Resource Group (`GreenPantryRG`)
- ✅ Creates Cosmos DB account
- ✅ Creates App Service Plan
- ✅ Creates Web App for API
- ✅ Configures app settings with secrets

### 3. **Deploy API Stage**
- ✅ Downloads API artifacts
- ✅ Deploys .NET API to Azure Web App
- ✅ Configures health checks

### 4. **Deploy Frontend Stage**
- ✅ Creates Static Web App
- ✅ Deploys React frontend
- ✅ Configures custom domain (greenpantry.in)

### 5. **Notify Stage**
- ✅ Sends deployment status notification

## 🌐 Deployment URLs

After successful deployment, your application will be available at:

- **Frontend**: `https://greenpantry-frontend-[build-number].azurestaticapps.net`
- **API**: `https://greenpantry-api-[build-number].azurewebsites.net`
- **Custom Domain**: `https://greenpantry.in` (after DNS configuration)

## 🔄 Automatic Triggers

The workflow automatically runs on:
- ✅ **Push to main branch** (deploys to production)
- ✅ **Push to develop branch** (builds and tests only)
- ✅ **Pull requests to main** (builds and tests only)

## 🚨 Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   # Check Azure login
   az account show
   
   # Re-login if needed
   az login
   ```

2. **Secrets Not Found**
   - Verify all secrets are added in GitHub repository settings
   - Check secret names match exactly (case-sensitive)

3. **Build Failures**
   - Check the Actions tab for detailed error logs
   - Ensure all dependencies are properly configured

4. **Deployment Failures**
   - Verify Azure service principal has correct permissions
   - Check if resource names are unique

### Debug Commands

```bash
# Check git status
git status

# Check remote origin
git remote -v

# Check Azure login
az account show

# List Azure resource groups
az group list --query "[].name" -o table
```

## 📊 Monitoring

### GitHub Actions
- Go to **Actions** tab in your repository
- Click on any workflow run to see detailed logs
- Set up notifications for build failures

### Azure Portal
- Monitor resource usage in Azure Portal
- Check Application Insights for application logs
- Set up alerts for resource failures

## 🔐 Security Best Practices

1. **Secrets Management**: All sensitive data stored in GitHub Secrets
2. **Least Privilege**: Service principal has minimal required permissions
3. **HTTPS Only**: All endpoints use HTTPS
4. **Environment Isolation**: Separate environments for dev/prod

## 🎯 Next Steps

After successful deployment:

1. **Configure DNS**: Point greenpantry.in to your Azure resources
2. **SSL Certificates**: Set up SSL certificates for custom domains
3. **Payment Webhooks**: Update webhook URLs with new API endpoints
4. **Monitoring**: Set up Application Insights and alerts
5. **Backup**: Configure automated backups for Cosmos DB

## 📞 Support

If you encounter issues:

1. Check the GitHub Actions logs first
2. Verify all secrets are correctly configured
3. Ensure Azure permissions are properly set
4. Review the troubleshooting section above

---

**🎉 Congratulations!** Your GreenPantry application now has automated CI/CD with GitHub Actions!
