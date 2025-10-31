# ✅ Correct DNS Setup for greenpantry.in

## The Problem
GoDaddy shows "Record data is invalid" because:
- Your domain has A records pointing to GoDaddy's IPs
- You can't use CNAME at root (@) when A records exist
- Must choose: either CNAME OR A records at root

## Solution: Remove Old A Records, Add CNAME

### Step 1: In GoDaddy DNS Management

**DELETE these old A records** (they're pointing to GoDaddy):
- Find any A records with Name: @
- Delete them (click trash icon)

**Then ADD these records:**

1. **TXT Record (already added ✅):**
   - Type: TXT
   - Name: @
   - Value: `_mojjfavjbepxjffa163raf72mv9ufue`
   - TTL: 600

2. **CNAME Record:**
   - Type: CNAME
   - Name: @
   - Value: `salmon-stone-02e25c50f.3.azurestaticapps.net`
   - TTL: 600

3. **Click "Save All Records"**

### Why This Happens
- The domain greenpantry.in was previously used with GoDaddy's website builder
- Those old A records (13.248.243.5, 76.223.105.230) are still there
- We need to remove them to make room for CNAME

## After Saving

1. Wait 5-60 minutes for DNS propagation
2. Azure will verify the domain automatically
3. Visit: https://greenpantry.in

## Verification

After 10 minutes, run:
```bash
dig greenpantry.in
```

You should see it pointing to Azure, not GoDaddy.


