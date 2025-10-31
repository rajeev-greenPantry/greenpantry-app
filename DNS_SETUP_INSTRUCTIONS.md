# 🔧 DNS Setup Instructions for greenpantry.in

## Current Status
- ✅ Your app is live at: https://salmon-stone-02e25c50f.3.azurestaticapps.net
- ⏳ greenpantry.in needs DNS records added

## Step-by-Step Guide

### Option 1: GoDaddy Website (Easiest)

1. **Login**: Go to https://www.godaddy.com and login
2. **Navigate**: Click "My Products" → "Domains" → Find "greenpantry.in"
3. **DNS Settings**: Click "DNS" or "Manage DNS"
4. **Add Records**: 

   Click "Add" or "Add Record" twice to add these:

   **Record 1 - Verification TXT:**
   - **Type**: TXT
   - **Name**: @
   - **Value**: `_mojjfavjbepxjffa163raf72mv9ufue`
   - **TTL**: 600 seconds

   **Record 2 - CNAME to Azure:**
   - **Type**: CNAME
   - **Name**: @
   - **Value**: `salmon-stone-02e25c50f.3.azurestaticapps.net`
   - **TTL**: 600 seconds

5. **Save**: Click "Save" on each record
6. **Wait**: DNS changes take 5-60 minutes to propagate

### Option 2: Azure CLI (If you have access)

Run these commands in your terminal:

```bash
# Verify domain connection
az staticwebapp hostname show \
  --name greenpantry-app \
  --resource-group GreenPantryRG \
  --hostname greenpantry.in

# After DNS is added, Azure will auto-verify
```

## What Each Record Does

### TXT Record
- **Purpose**: Verifies you own the domain
- **Azure Token**: `_mojjfavjbepxjffa163raf72mv9ufue`
- Azure checks this record to confirm domain ownership

### CNAME Record
- **Purpose**: Routes traffic to your Azure Static Web App
- **Azure URL**: `salmon-stone-02e25c50f.3.azurestaticapps.net`
- When someone visits greenpantry.in, they'll see your app

## After Adding DNS

### 1. Check DNS Propagation
```bash
# Wait 5-60 minutes, then check:
nslookup greenpantry.in
```

### 2. Test Your Site
Visit: https://greenpantry.in

### 3. If It Works
You'll see your GreenPantry app instead of the GoDaddy placeholder!

## Troubleshooting

### DNS not working after 1 hour?
- Check if records were saved correctly
- Verify TTL wasn't set too high
- Try clearing browser cache
- Check: `nslookup greenpantry.in`

### Still seeing GoDaddy page?
- The CNAME record might not have propagated yet
- Wait another 30 minutes
- Check DNS propagation tools online

### Azure shows "Still validating"?
- The TXT record is required for verification
- Make sure it was added correctly
- Typo in the token value? Double-check it

## Verification Commands

After adding DNS, run these to check:

```bash
# Check if DNS is resolving
nslookup greenpantry.in

# Check if TXT record exists
dig TXT greenpantry.in +short

# Check if CNAME exists  
dig CNAME greenpantry.in +short

# Test the website
curl -I https://greenpantry.in
```

## Current Setup

- **Azure Static Web App Name**: greenpantry-app
- **Resource Group**: GreenPantryRG
- **Azure URL**: https://salmon-stone-02e25c50f.3.azurestaticapps.net
- **Custom Domain**: greenpantry.in (pending DNS setup)
- **Validation Status**: Waiting for TXT record

## Quick Reference

```
Add to GoDaddy DNS:

TXT Record:
Name: @
Value: _mojjfavjbepxjffa163raf72mv9ufue

CNAME Record:
Name: @  
Value: salmon-stone-02e25c50f.3.azurestaticapps.net
```

---

**Note**: The site is ALREADY WORKING at the Azure URL. Adding DNS just makes it available at your custom domain name.


