# Azure Deployment Setup for GreenPantry

## Overview
This guide will help you deploy your GreenPantry application to Azure and make it accessible at https://greenpantry.in/

## Current Status
- **Local Development**: http://localhost:3001 (React Frontend)
- **API**: http://localhost:5001 (.NET Core Backend)
- **Target**: https://greenpantry.in/ (Production)

## Azure Services Required

### 1. Azure App Service (for .NET Core API)
- **Service**: Azure App Service
- **Runtime**: .NET 8
- **Pricing Tier**: B1 (Basic) or higher
- **URL**: `https://greenpantry-api.azurewebsites.net`

### 2. Azure Static Web Apps (for React Frontend)
- **Service**: Azure Static Web Apps
- **Framework**: React
- **URL**: `https://greenpantry.azurestaticapps.net`

### 3. Azure Cosmos DB
- **Service**: Azure Cosmos DB
- **API**: Core (SQL)
- **Pricing Tier**: Serverless or Provisioned

### 4. Custom Domain Setup
- **Domain**: greenpantry.in
- **SSL Certificate**: Azure-managed SSL
- **DNS**: Point to Azure services

## Deployment Architecture

```
Internet → greenpantry.in → Azure CDN → Static Web App (Frontend)
                                    ↓
                              App Service (API)
                                    ↓
                              Cosmos DB (Database)
```

## Prerequisites
1. Azure CLI installed
2. Azure account with active subscription
3. Domain access for greenpantry.in
4. GitHub repository (for CI/CD)

## Next Steps
1. Create Azure resources
2. Configure deployment pipelines
3. Set up custom domain
4. Configure SSL certificates
5. Deploy application
