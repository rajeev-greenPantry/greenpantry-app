# 🚀 Quick Deployment Summary for greenpantry.in

## ✅ What's Ready

1. **Static Web App**: greenpantry-app (already deployed)
   - URL: https://salmon-stone-02e25c50f.3.azurestaticapps.net
   - Connected to GitHub: https://github.com/rajeev-greenPantry/greenpantry-app

2. **Cosmos DB**: greenpantry-cosmosdb-8
   - Connection string ready
   - Database: GreenPantryDB

3. **Frontend**: Built and ready
   - Location: `/frontend/dist`
   - Production environment configured

4. **Backend API**: Built
   - Location: `/backend/GreenPantry.API/bin/Release`

## ⚠️ What Needs to Be Done

### 1. Request Azure App Service Quota

**Issue**: Your subscription doesn't have quota for App Service (Basic or Free tier)

**Solution**: Request quota increase

```bash
# Go to Azure Portal
# https://portal.azure.com → Subscriptions → Usage + quotas
# Request increase for Basic tier (B1) in East US 2 region
# Or request via Azure Support
```

**Alternative**: If quota is not approved quickly, consider:
- Deploy to Azure Container Apps (different quota)
- Use existing App Service Plan (if you have one)
- Deploy to a different region

### 2. Deploy Backend API

Once quota is approved, run:

```bash
cd "/home/raja/Projects/Rajeev's Pvt. Ltd./R's GreenPantry"
./deploy-production.sh
```

Or manually:

```bash
# Create App Service Plan
az appservice plan create --name greenpantry-api-plan --resource-group GreenPantryRG --sku B1 --is-linux --location eastus2

# Create Web App
az webapp create --name greenpantry-api --resource-group GreenPantryRG --plan greenpantry-api-plan --runtime "DOTNETCORE:8.0"

# Get Cosmos DB connection string
COSMOS_CONN_STR=$(az cosmosdb keys list --name greenpantry-cosmosdb-8 --resource-group GreenPantryRG --type connection-strings --query 'connectionStrings[0].connectionString' -o tsv)

# Configure app settings
az webapp config appsettings set --name greenpantry-api --resource-group GreenPantryRG --settings \
  ASPNETCORE_ENVIRONMENT=Production \
  ConnectionStrings__DefaultConnection="$COSMOS_CONN_STR" \
  CosmosDb__ConnectionString="$COSMOS_CONN_STR" \
  CosmosDb__DatabaseName="GreenPantryDB"

# Build and deploy
cd backend/GreenPantry.API
dotnet publish -c Release -o ./publish
cd publish
zip -r ../api-deployment.zip .
az webapp deployment source config-zip --name greenpantry-api --resource-group GreenPantryRG --src ../api-deployment.zip
```

### 3. Configure Custom Domain

Add DNS records for greenpantry.in:

#### For Frontend (greenpantry.in)
```bash
# Get Static Web App verification value
az staticwebapp hostname show --name greenpantry-app --resource-group GreenPantryRG --hostname greenpantry.in

# In your DNS provider, add:
# Type: CNAME or A record
# Name: @
# Value: [URL from above command]
```

#### For API (api.greenpantry.in)
```bash
# Get verification TXT record
az webapp config hostname add --webapp-name greenpantry-api --resource-group GreenPantryRG --hostname api.greenpantry.in

# In your DNS provider, add:
# Type: CNAME
# Name: api
# Value: greenpantry-api.azurewebsites.net
```

### 4. Update Frontend Production Config

After API is deployed:

```bash
# Edit frontend/.env.production
# Update VITE_API_BASE_URL to https://greenpantry-api.azurewebsites.net/api

# Rebuild frontend
cd frontend
npm run build

# Commit and push to trigger Static Web App deployment
git add .
git commit -m "Deploy with production API URL"
git push origin main
```

Or for custom domain:

```
VITE_API_BASE_URL=https://api.greenpantry.in/api
```

### 5. Test Deployment

```bash
# Test API
curl https://greenpantry-api.azurewebsites.net/health

# Test Static Web App
curl https://salmon-stone-02e25c50f.3.azurestaticapps.net

# After DNS is configured
curl https://greenpantry.in
```

## 📋 Step-by-Step Checklist

- [ ] Request Azure App Service quota increase
- [ ] Wait for quota approval (or use alternative deployment method)
- [ ] Create App Service Plan
- [ ] Create Web App (API)
- [ ] Configure app settings with Cosmos DB connection
- [ ] Deploy backend API
- [ ] Update frontend .env.production
- [ ] Rebuild and deploy frontend
- [ ] Configure custom domain in Azure
- [ ] Add DNS records
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Test application
- [ ] Configure payment provider API keys
- [ ] Set up monitoring and alerts

## 🔧 Useful Commands

```bash
# Check App Service Plan
az appservice plan list --resource-group GreenPantryRG

# Check Web App status
az webapp show --name greenpantry-api --resource-group GreenPantryRG --query "state"

# View API logs
az webapp log tail --name greenpantry-api --resource-group GreenPantryRG

# View Static Web App deployment status
az staticwebapp list --resource-group GreenPantryRG

# Get API URL
az webapp show --name greenpantry-api --resource-group GreenPantryRG --query "defaultHostName" -o tsv
```

## 📞 Getting Help

If you encounter issues:

1. Check Azure Portal for resource status
2. Review application logs
3. Verify DNS propagation: `nslookup greenpantry.in`
4. Check CORS configuration
5. Review deployment logs in Azure

## 🎯 Expected Final URLs

- **Production Frontend**: https://greenpantry.in
- **Production API**: https://api.greenpantry.in
- **Development**: http://localhost:3001 (frontend), http://localhost:7001 (API)

---

**Ready to deploy? Start with Step 1 (Request Quota)!**



