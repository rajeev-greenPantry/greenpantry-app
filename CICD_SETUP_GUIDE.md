# GreenPantry CI/CD Setup Guide

This guide will help you set up automated CI/CD pipelines for the GreenPantry application using Azure DevOps and GitHub Actions.

## 🚀 Overview

The CI/CD setup includes:
- **Azure DevOps Pipeline**: Complete infrastructure and application deployment
- **GitHub Actions**: Alternative CI/CD with GitHub integration
- **Automated Testing**: Unit tests for both frontend and backend
- **Infrastructure as Code**: Automated Azure resource creation
- **Custom Domain Configuration**: Automatic setup of greenpantry.in domain

## 📋 Prerequisites

1. **Azure CLI** (already installed)
2. **Azure Subscription** with appropriate permissions
3. **GitHub Repository** (if using GitHub Actions)
4. **Azure DevOps Organization** (if using Azure DevOps)

## 🔧 Setup Instructions

### 1. Azure DevOps Setup

#### Step 1: Create Service Connection
1. Go to your Azure DevOps project
2. Navigate to **Project Settings** → **Service connections**
3. Click **New service connection** → **Azure Resource Manager**
4. Choose **Service principal (automatic)**
5. Select your Azure subscription
6. Name it: `GreenPantryAzureConnection`
7. Click **Save**

#### Step 2: Configure Pipeline Variables
1. Go to **Pipelines** → **Library**
2. Create a new variable group: `GreenPantry-Secrets`
3. Add the following variables (mark as secret):
   - `JWT_SECRET`: Your JWT secret key
   - `RAZORPAY_API_KEY`: Your Razorpay API key
   - `RAZORPAY_API_SECRET`: Your Razorpay API secret
   - `RAZORPAY_WEBHOOK_SECRET`: Your Razorpay webhook secret
   - `PAYTM_MERCHANT_ID`: Your Paytm merchant ID
   - `PAYTM_MERCHANT_KEY`: Your Paytm merchant key
   - `PHONEPE_MERCHANT_ID`: Your PhonePe merchant ID
   - `PHONEPE_SALT_KEY`: Your PhonePe salt key

#### Step 3: Create Pipeline
1. Go to **Pipelines** → **Pipelines**
2. Click **New pipeline**
3. Select your repository
4. Choose **Existing Azure Pipelines YAML file**
5. Select the path: `backend/GreenPantry.API/azure-pipelines.yml`
6. Click **Save**

### 2. GitHub Actions Setup

#### Step 1: Create Azure Service Principal
```bash
# Login to Azure
az login

# Create service principal
az ad sp create-for-rbac --name "GreenPantry-GitHub-Actions" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/GreenPantryRG \
  --sdk-auth
```

#### Step 2: Add GitHub Secrets
1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:
   - `AZURE_CREDENTIALS`: Output from the service principal creation
   - `JWT_SECRET`: Your JWT secret key
   - `RAZORPAY_API_KEY`: Your Razorpay API key
   - `RAZORPAY_API_SECRET`: Your Razorpay API secret
   - `RAZORPAY_WEBHOOK_SECRET`: Your Razorpay webhook secret
   - `PAYTM_MERCHANT_ID`: Your Paytm merchant ID
   - `PAYTM_MERCHANT_KEY`: Your Paytm merchant key
   - `PHONEPE_MERCHANT_ID`: Your PhonePe merchant ID
   - `PHONEPE_SALT_KEY`: Your PhonePe salt key

### 3. Manual Deployment (Alternative)

If you prefer manual deployment, use the enhanced deployment script:

```bash
# Make the script executable
chmod +x azure-deploy-enhanced.sh

# Set environment variables (optional)
export JWT_SECRET="your-jwt-secret"
export RAZORPAY_API_KEY="your-razorpay-key"
export RAZORPAY_API_SECRET="your-razorpay-secret"
# ... other variables

# Run deployment
./azure-deploy-enhanced.sh
```

## 🏗️ Pipeline Stages

### 1. Build Stage
- **Frontend**: Install dependencies, build React app
- **Backend**: Restore packages, build .NET API, run tests
- **Artifacts**: Create deployment packages

### 2. Deploy Infrastructure Stage
- Create Azure Resource Group
- Create Cosmos DB Account
- Create App Service Plan
- Create Web App for API
- Create Static Web App for Frontend

### 3. Deploy API Stage
- Configure app settings with secrets
- Deploy .NET API to Azure Web App
- Set up health checks

### 4. Deploy Frontend Stage
- Deploy React app to Static Web App
- Configure custom domain (greenpantry.in)

### 5. Configure Custom Domain Stage
- Set up DNS records
- Configure SSL certificates
- Update webhook URLs

## 🔐 Security Considerations

1. **Secrets Management**: All sensitive data is stored in Azure Key Vault or pipeline variables
2. **Network Security**: Cosmos DB firewall rules configured
3. **HTTPS Only**: All endpoints use HTTPS
4. **JWT Security**: Strong JWT secrets with proper expiration

## 📊 Monitoring and Logging

The deployment includes:
- **Application Insights**: Automatic logging and monitoring
- **Health Checks**: API health endpoint monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time and throughput monitoring

## 🚨 Troubleshooting

### Common Issues

1. **Permission Errors**
   ```bash
   # Ensure you have the right permissions
   az role assignment list --assignee $(az account show --query user.name -o tsv)
   ```

2. **Resource Name Conflicts**
   ```bash
   # Use unique names with timestamps
   RESOURCE_NAME="greenpantry-$(date +%s)"
   ```

3. **Deployment Failures**
   - Check Azure Activity Log
   - Verify service connection permissions
   - Ensure all required secrets are set

### Debug Commands

```bash
# Check Azure login status
az account show

# List resource groups
az group list

# Check web app status
az webapp list --resource-group GreenPantryRG

# View deployment logs
az webapp log tail --name your-app-name --resource-group GreenPantryRG
```

## 📈 Scaling and Optimization

### Performance Optimization
1. **CDN**: Enable Azure CDN for static assets
2. **Caching**: Implement Redis cache for frequently accessed data
3. **Database**: Use Cosmos DB autoscale for variable workloads

### Cost Optimization
1. **App Service Plans**: Use appropriate SKU based on traffic
2. **Cosmos DB**: Configure autoscale and appropriate consistency levels
3. **Monitoring**: Set up cost alerts and budgets

## 🔄 Continuous Integration Best Practices

1. **Branch Protection**: Protect main branch, require PR reviews
2. **Automated Testing**: Run tests on every commit
3. **Code Quality**: Use SonarQube or similar tools
4. **Security Scanning**: Regular dependency vulnerability scans
5. **Deployment Gates**: Manual approval for production deployments

## 📞 Support

For issues with the CI/CD setup:
1. Check the pipeline logs in Azure DevOps or GitHub Actions
2. Verify all secrets and variables are correctly set
3. Ensure Azure permissions are properly configured
4. Review the troubleshooting section above

## 🎯 Next Steps

After successful deployment:
1. Configure custom domain DNS records
2. Set up SSL certificates
3. Configure payment provider webhooks
4. Set up monitoring and alerting
5. Plan for disaster recovery and backup strategies

---

**Note**: This CI/CD setup is designed for production use. Make sure to test thoroughly in a staging environment before deploying to production.



