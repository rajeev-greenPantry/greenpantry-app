# 🚀 Create GitHub Repository for GreenPantry

Since we don't have admin access to install GitHub CLI, here's a step-by-step guide to create the repository manually.

## 📋 Step 1: Create GitHub Repository

### Option A: Using GitHub Web Interface (Recommended)

1. **Go to GitHub.com** and sign in to your account
2. **Click the "+" button** in the top-right corner
3. **Select "New repository"**
4. **Fill in the repository details:**
   - **Repository name**: `greenpantry`
   - **Description**: `GreenPantry - Food Delivery Platform with Payment Integration (Razorpay, Paytm, PhonePe)`
   - **Visibility**: ✅ **Public** (required for free GitHub Actions)
   - **Initialize repository**: ❌ **Don't check** (we already have files)
   - **Add .gitignore**: ❌ **Don't check** (we already have one)
   - **Choose a license**: ❌ **Don't check** (optional)

5. **Click "Create repository"**

### Option B: Using GitHub CLI (if you have it)

```bash
# Login to GitHub
gh auth login

# Create repository
gh repo create greenpantry --public --description "GreenPantry - Food Delivery Platform with Payment Integration" --source=. --remote=origin --push
```

## 🔗 Step 2: Add Remote Origin

After creating the repository, GitHub will show you the commands. Run these in your terminal:

```bash
cd "/home/raja/Projects/Rajeev's Pvt. Ltd./R's GreenPantry"

# Add remote origin (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/greenpantry.git

# Verify remote was added
git remote -v
```

## 📤 Step 3: Push Code to GitHub

```bash
# Add all files to git
git add .

# Commit the changes
git commit -m "Initial commit: GreenPantry with GitHub Actions CI/CD

- Complete payment integration (Razorpay, Paytm, PhonePe)
- React frontend with TypeScript
- .NET Core backend with Clean Architecture
- Cosmos DB integration
- GitHub Actions CI/CD pipeline
- Azure deployment configuration"

# Push to GitHub (this will trigger the first GitHub Actions run)
git push -u origin main
```

## 🔐 Step 4: Configure GitHub Secrets

After pushing, go to your repository and add the required secrets:

1. **Go to**: `https://github.com/YOUR_USERNAME/greenpantry/settings/secrets/actions`
2. **Click "New repository secret"** for each secret below:

### Required Secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `AZURE_CREDENTIALS` | `{"clientId":"YOUR_CLIENT_ID","clientSecret":"YOUR_CLIENT_SECRET","subscriptionId":"YOUR_SUBSCRIPTION_ID","tenantId":"YOUR_TENANT_ID","activeDirectoryEndpointUrl":"https://login.microsoftonline.com","resourceManagerEndpointUrl":"https://management.azure.com/","activeDirectoryGraphResourceId":"https://graph.windows.net/","sqlManagementEndpointUrl":"https://management.core.windows.net:8443/","galleryEndpointUrl":"https://gallery.azure.com/","managementEndpointUrl":"https://management.core.windows.net/"}` | Azure authentication credentials |
| `JWT_SECRET` | `$(openssl rand -base64 32)` | JWT signing secret (generate with: `openssl rand -base64 32`) |
| `RAZORPAY_API_KEY` | `YOUR_RAZORPAY_LIVE_API_KEY` | Your Razorpay live API key |
| `RAZORPAY_API_SECRET` | `YOUR_RAZORPAY_LIVE_API_SECRET` | Your Razorpay live API secret |
| `RAZORPAY_WEBHOOK_SECRET` | `YOUR_RAZORPAY_LIVE_WEBHOOK_SECRET` | Your Razorpay webhook secret |
| `PAYTM_MERCHANT_ID` | `YOUR_PAYTM_LIVE_MERCHANT_ID` | Your Paytm live merchant ID |
| `PAYTM_MERCHANT_KEY` | `YOUR_PAYTM_LIVE_MERCHANT_KEY` | Your Paytm live merchant key |
| `PHONEPE_MERCHANT_ID` | `YOUR_PHONEPE_LIVE_MERCHANT_ID` | Your PhonePe live merchant ID |
| `PHONEPE_SALT_KEY` | `YOUR_PHONEPE_LIVE_SALT_KEY` | Your PhonePe live salt key |

## 🎯 Step 5: Monitor Deployment

1. **Go to the Actions tab** in your GitHub repository
2. **You'll see the workflow running** automatically after the push
3. **Click on the workflow run** to see detailed logs
4. **The deployment will take about 10-15 minutes**

## 🌐 Step 6: Access Your Deployed Application

After successful deployment, your application will be available at:

- **Frontend**: `https://greenpantry-frontend-[build-number].azurestaticapps.net`
- **API**: `https://greenpantry-api-[build-number].azurewebsites.net`
- **Custom Domain**: `https://greenpantry.in` (after DNS configuration)

## 🚨 Troubleshooting

### If you get "Repository already exists" error:
```bash
# Remove existing remote
git remote remove origin

# Add the correct remote
git remote add origin https://github.com/YOUR_USERNAME/greenpantry.git
```

### If you get "Permission denied" error:
```bash
# Check your GitHub username
git config --global user.name

# Check your GitHub email
git config --global user.email

# Set them if needed
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### If GitHub Actions fails:
1. Check the Actions tab for error details
2. Verify all secrets are correctly added
3. Ensure the repository is public (required for free GitHub Actions)

## 📚 Additional Resources

- **GitHub Actions Documentation**: https://docs.github.com/en/actions
- **Azure Static Web Apps**: https://docs.microsoft.com/en-us/azure/static-web-apps/
- **Azure App Service**: https://docs.microsoft.com/en-us/azure/app-service/

---

**🎉 Once completed, your GreenPantry application will have automated CI/CD with GitHub Actions!**



