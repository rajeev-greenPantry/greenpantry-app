# 🚀 GreenPantry Azure Deployment Guide

## Overview
This guide will help you deploy your GreenPantry application to Azure and make it accessible at **https://greenpantry.in/**

## 🎯 Current Status
- **Local Development**: http://localhost:3001 (React Frontend)
- **Local API**: http://localhost:5001 (.NET Core Backend)
- **Target Production**: https://greenpantry.in/

## 📋 Prerequisites

### 1. Azure Account Setup
- [ ] Azure account with active subscription
- [ ] Azure CLI installed (`az --version`)
- [ ] Logged in to Azure (`az login`)

### 2. Domain Setup
- [ ] Access to greenpantry.in domain DNS settings
- [ ] Ability to create DNS records (A, CNAME, TXT)

### 3. Payment Provider Accounts
- [ ] Razorpay live account with API keys
- [ ] Paytm live account with API keys  
- [ ] PhonePe live account with API keys

## 🏗️ Azure Architecture

```
Internet → greenpantry.in → Azure CDN → Static Web App (Frontend)
                                    ↓
                              App Service (API)
                                    ↓
                              Cosmos DB (Database)
```

## 🚀 Quick Deployment

### Option 1: Automated Script (Recommended)
```bash
# Run the automated deployment script
cd "/home/raja/Projects/Rajeev's Pvt. Ltd./R's GreenPantry"
./azure-deploy.sh
```

### Option 2: Manual Step-by-Step

#### Step 1: Create Azure Resources
```bash
# Login to Azure
az login

# Create resource group
az group create --name greenpantry-rg --location "East US"

# Create App Service Plan
az appservice plan create --name greenpantry-plan --resource-group greenpantry-rg --sku B1 --is-linux

# Create Cosmos DB
az cosmosdb create --name greenpantry-db --resource-group greenpantry-rg --kind GlobalDocumentDB --locations regionName="East US" failoverPriority=0 isZoneRedundant=False

# Create API App Service
az webapp create --name greenpantry-api --resource-group greenpantry-rg --plan greenpantry-plan --runtime "DOTNETCORE|8.0"

# Create Static Web App
az staticwebapp create --name greenpantry --resource-group greenpantry-rg --source "https://github.com/yourusername/greenpantry" --location "East US" --branch main --app-location "/frontend" --output-location "dist"
```

#### Step 2: Configure Environment Variables
```bash
# Get Cosmos DB connection string
COSMOS_CONNECTION_STRING=$(az cosmosdb keys list --name greenpantry-db --resource-group greenpantry-rg --type connection-strings --query 'connectionStrings[0].connectionString' --output tsv)

# Configure API App Settings
az webapp config appsettings set --name greenpantry-api --resource-group greenpantry-rg --settings \
    ASPNETCORE_ENVIRONMENT=Production \
    ConnectionStrings__DefaultConnection="$COSMOS_CONNECTION_STRING" \
    PaymentProviders__Razorpay__ApiKey="YOUR_RAZORPAY_API_KEY" \
    PaymentProviders__Razorpay__ApiSecret="YOUR_RAZORPAY_API_SECRET"
```

#### Step 3: Deploy Applications
```bash
# Deploy API
cd "/home/raja/Projects/Rajeev's Pvt. Ltd./R's GreenPantry/backend/GreenPantry.API"
dotnet publish -c Release -o ./publish
cd publish
zip -r ../api-deployment.zip .
az webapp deployment source config-zip --name greenpantry-api --resource-group greenpantry-rg --src ../api-deployment.zip

# Deploy Frontend (via GitHub Actions)
# Push your code to GitHub repository
git add .
git commit -m "Deploy to Azure"
git push origin main
```

## 🌐 Custom Domain Setup

### Step 1: Configure DNS Records
Add these DNS records to your greenpantry.in domain:

```
Type: A
Name: @
Value: 20.190.159.132 (Azure Static Web App IP)

Type: CNAME  
Name: www
Value: greenpantry.azurestaticapps.net

Type: CNAME
Name: api
Value: greenpantry-api.azurewebsites.net
```

### Step 2: Add Custom Domain to Azure
```bash
# Add domain to Static Web App
az staticwebapp hostname set --name greenpantry --resource-group greenpantry-rg --hostname greenpantry.in

# Add domain to API App Service
az webapp config hostname add --webapp-name greenpantry-api --resource-group greenpantry-rg --hostname api.greenpantry.in
```

### Step 3: Configure SSL Certificate
```bash
# SSL certificates are automatically managed by Azure
# No additional configuration needed
```

## 🔧 Configuration Files

### Frontend Environment (.env.production)
```env
VITE_API_BASE_URL=https://api.greenpantry.in/api
VITE_APP_NAME=GreenPantry
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
```

### Backend Configuration (appsettings.Production.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_COSMOS_DB_CONNECTION_STRING"
  },
  "PaymentProviders": {
    "Razorpay": {
      "IsEnabled": true,
      "IsTestMode": false,
      "ApiKey": "YOUR_LIVE_API_KEY",
      "ApiSecret": "YOUR_LIVE_API_SECRET"
    }
  }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
The deployment is automated using GitHub Actions:

1. **API Deployment**: Triggers on push to `main` branch
2. **Frontend Deployment**: Triggers on push to `main` branch
3. **Automatic Build**: Builds and tests the application
4. **Automatic Deploy**: Deploys to Azure services

### Manual Deployment
```bash
# Deploy API manually
az webapp deployment source config-zip --name greenpantry-api --resource-group greenpantry-rg --src api-deployment.zip

# Deploy Frontend manually
npm run build
# Upload dist folder to Static Web App
```

## 📊 Monitoring and Logs

### Application Insights
```bash
# Enable Application Insights
az monitor app-insights component create --app greenpantry-insights --location "East US" --resource-group greenpantry-rg

# Configure App Service to use Application Insights
az webapp config appsettings set --name greenpantry-api --resource-group greenpantry-rg --settings \
    APPINSIGHTS_INSTRUMENTATIONKEY="YOUR_INSTRUMENTATION_KEY"
```

### View Logs
```bash
# View API logs
az webapp log tail --name greenpantry-api --resource-group greenpantry-rg

# View Static Web App logs
az staticwebapp logs --name greenpantry --resource-group greenpantry-rg
```

## 🔐 Security Configuration

### 1. API Security
- [ ] Enable CORS for production domains
- [ ] Configure authentication and authorization
- [ ] Set up API rate limiting
- [ ] Enable HTTPS only

### 2. Database Security
- [ ] Enable Cosmos DB firewall rules
- [ ] Use managed identity for authentication
- [ ] Enable encryption at rest

### 3. Payment Security
- [ ] Use production API keys
- [ ] Configure webhook verification
- [ ] Enable SSL/TLS for all communications

## 🧪 Testing Production Deployment

### 1. Health Checks
```bash
# Test API health
curl https://api.greenpantry.in/health

# Test frontend
curl https://greenpantry.in
```

### 2. Payment Integration Test
1. Visit https://greenpantry.in
2. Add items to cart
3. Test checkout flow
4. Verify payment processing

## 📈 Performance Optimization

### 1. CDN Configuration
- Azure CDN is automatically enabled for Static Web Apps
- Configure custom caching rules if needed

### 2. Database Optimization
- Enable Cosmos DB autoscale
- Configure appropriate throughput
- Set up monitoring alerts

### 3. Application Optimization
- Enable compression
- Configure caching headers
- Optimize images and assets

## 🚨 Troubleshooting

### Common Issues

1. **Domain not resolving**
   - Check DNS propagation: `nslookup greenpantry.in`
   - Verify DNS records are correct
   - Wait for DNS propagation (up to 48 hours)

2. **API not accessible**
   - Check App Service status in Azure portal
   - Verify CORS configuration
   - Check application logs

3. **Payment integration not working**
   - Verify API keys are correct
   - Check webhook URLs are accessible
   - Test with payment provider test environment first

### Support Resources
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)

## 📞 Next Steps After Deployment

1. **Configure Monitoring**: Set up alerts and dashboards
2. **Security Review**: Conduct security audit
3. **Performance Testing**: Load test the application
4. **Backup Strategy**: Set up automated backups
5. **Documentation**: Update user documentation

---

## 🎉 Success!

Once deployed, your GreenPantry application will be accessible at:
- **Main Site**: https://greenpantry.in
- **API**: https://api.greenpantry.in
- **Admin Panel**: https://greenpantry.in/admin

Your application is now live and ready to serve customers! 🚀
