# 🔧 Fixing GoDaddy DNS Error

## The Problem
You're getting "Record data is invalid" because:
- You can't use CNAME at root domain (@) 
- Your domain already has A records for @ pointing to GoDaddy

## Solution: Two Options

### Option 1: Use www Subdomain (Easier) ✅

**In GoDaddy DNS:**

1. **Keep the TXT record as is** ✅
   - Type: TXT
   - Name: @  
   - Value: `_mojjfavjbepxjffa163raf72mv9ufue`
   - TTL: 600

2. **Fix the CNAME record:**
   - Delete the CNAME with Name: @
   - Add a NEW CNAME:
     - Type: CNAME
     - Name: **www** (not @)
     - Value: `salmon-stone-02e25c50f.3.azurestaticapps.net`
     - TTL: 600

3. **Click "Save All Records"**

**Then:** Your site will work at:
- ✅ https://www.greenpantry.in
- ⚠️ https://greenpantry.in will still show GoDaddy page

**To add root domain:** We need to configure Azure to accept greenpantry.in (not www)

---

### Option 2: Configure Root Domain (Better for production)

Since Azure Static Web App currently has greenpantry.in configured (not www.greenpantry.in), we need to:

**Step 1: Remove the CNAME with @ as name**

**Step 2: Add a CNAME for www instead:**
- Type: CNAME
- Name: **www**
- Value: `salmon-stone-02e25c50f.3.azurestaticapps.net`
- TTL: 600

**Step 3: Azure needs both domains configured. Let me add that for you.**

Then update:
- Root domain (@) will need A records pointing to Azure
- This requires additional configuration in Azure

---

## Quick Fix Right Now

**In GoDaddy:**
1. Delete the CNAME record with Name: @
2. Add a CNAME with Name: **www** (instead of @)
3. Save

**Result:**
- Site will work at: https://www.greenpantry.in

Then I'll configure Azure to accept both www and root domain.


