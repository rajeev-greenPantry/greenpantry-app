# 🔐 Admin Setup Guide for GreenPantry GitHub Repository

Since we have limited admin privileges on this system, here are alternative approaches to set up your GitHub repository and CI/CD.

## 🚀 Option 1: Manual GitHub Repository Creation (Recommended)

### Step 1: Create Repository on GitHub.com

1. **Go to GitHub.com** and sign in
2. **Click the "+" button** → **"New repository"**
3. **Repository settings:**
   - **Name**: `greenpantry`
   - **Description**: `GreenPantry - Food Delivery Platform with Payment Integration`
   - **Visibility**: ✅ **Public** (required for free GitHub Actions)
   - **Initialize**: ❌ **Don't check any boxes** (we have existing files)
4. **Click "Create repository"**

### Step 2: Set Up Remote Origin

After creating the repository, run these commands:

```bash
cd "/home/raja/Projects/Rajeev's Pvt. Ltd./R's GreenPantry"

# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/greenpantry.git

# Verify remote was added
git remote -v
```

### Step 3: Push Code to GitHub

```bash
# Add all files
git add .

# Commit changes
git commit -m "Initial commit: GreenPantry with GitHub Actions CI/CD

- Complete payment integration (Razorpay, Paytm, PhonePe)
- React frontend with TypeScript
- .NET Core backend with Clean Architecture
- Cosmos DB integration
- GitHub Actions CI/CD pipeline
- Azure deployment configuration"

# Push to GitHub
git push -u origin main
```

## 🔧 Option 2: Install GitHub CLI with Limited Permissions

### Try installing GitHub CLI in user space:

```bash
# Download GitHub CLI binary
wget https://github.com/cli/cli/releases/download/v2.40.1/gh_2.40.1_linux_amd64.tar.gz

# Extract to user directory
tar -xzf gh_2.40.1_linux_amd64.tar.gz

# Add to PATH
echo 'export PATH="$HOME/gh_2.40.1_linux_amd64/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify installation
gh --version
```

### If successful, create repository with GitHub CLI:

```bash
# Login to GitHub
gh auth login

# Create repository
gh repo create greenpantry --public --description "GreenPantry - Food Delivery Platform with Payment Integration" --source=. --remote=origin --push
```

## 🐳 Option 3: Use Docker (if available)

```bash
# Run GitHub CLI in Docker container
docker run -it --rm -v "$(pwd)":/workspace -w /workspace ghcr.io/cli/gh:latest auth login
docker run -it --rm -v "$(pwd)":/workspace -w /workspace ghcr.io/cli/gh:latest repo create greenpantry --public --source=. --remote=origin --push
```

## 🔑 Option 4: Use GitHub API Directly

### Create repository using curl:

```bash
# Set your GitHub token (get from https://github.com/settings/tokens)
export GITHUB_TOKEN="your_github_token_here"

# Create repository
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d '{
    "name": "greenpantry",
    "description": "GreenPantry - Food Delivery Platform with Payment Integration",
    "private": false,
    "auto_init": false
  }'

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/greenpantry.git
```

## 📋 Step 4: Configure GitHub Secrets

After creating the repository, add these secrets:

1. **Go to**: `https://github.com/YOUR_USERNAME/greenpantry/settings/secrets/actions`
2. **Add these secrets:**

| Secret Name | Value |
|-------------|-------|
| `AZURE_CREDENTIALS` | `{"clientId":"YOUR_CLIENT_ID","clientSecret":"YOUR_CLIENT_SECRET","subscriptionId":"YOUR_SUBSCRIPTION_ID","tenantId":"YOUR_TENANT_ID","activeDirectoryEndpointUrl":"https://login.microsoftonline.com","resourceManagerEndpointUrl":"https://management.azure.com/","activeDirectoryGraphResourceId":"https://graph.windows.net/","sqlManagementEndpointUrl":"https://management.core.windows.net:8443/","galleryEndpointUrl":"https://gallery.azure.com/","managementEndpointUrl":"https://management.core.windows.net/"}` |
| `JWT_SECRET` | `$(openssl rand -base64 32)` |
| `RAZORPAY_API_KEY` | `YOUR_RAZORPAY_LIVE_API_KEY` |
| `RAZORPAY_API_SECRET` | `YOUR_RAZORPAY_LIVE_API_SECRET` |
| `RAZORPAY_WEBHOOK_SECRET` | `YOUR_RAZORPAY_LIVE_WEBHOOK_SECRET` |
| `PAYTM_MERCHANT_ID` | `YOUR_PAYTM_LIVE_MERCHANT_ID` |
| `PAYTM_MERCHANT_KEY` | `YOUR_PAYTM_LIVE_MERCHANT_KEY` |
| `PHONEPE_MERCHANT_ID` | `YOUR_PHONEPE_LIVE_MERCHANT_ID` |
| `PHONEPE_SALT_KEY` | `YOUR_PHONEPE_LIVE_SALT_KEY` |

## 🎯 Quick Setup Script

I've created a script that will help you set up the remote origin once you create the repository:

```bash
# Run the setup script
cd "/home/raja/Projects/Rajeev's Pvt. Ltd./R's GreenPantry"
./setup-remote-origin.sh
```

## 🚨 Troubleshooting

### If you get permission errors:
```bash
# Check git configuration
git config --global user.name
git config --global user.email

# Set if needed
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### If remote already exists:
```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/greenpantry.git
```

### If push fails:
```bash
# Check if you're authenticated
git config --global credential.helper

# You might need to use personal access token
# Go to GitHub Settings → Developer settings → Personal access tokens
# Create a token with repo permissions
```

## 🎉 After Setup

Once the repository is created and code is pushed:

1. **GitHub Actions will automatically run**
2. **Monitor deployment** in the Actions tab
3. **Your app will be deployed to Azure** in about 10-15 minutes
4. **Access URLs** will be provided in the Actions logs

---

**Choose the option that works best for your system and follow the steps!**



