# GreenPantry Domain Linking Setup

## Current Status
✅ **All Services Running Successfully!**

- **🏢 Main Portal**: http://localhost:3000 (React + Vite)
- **🌱 GreenPantry**: http://localhost:3001 (React + Vite with Payment Integration)
- **🔌 Main Portal API**: http://localhost:5000 (Node.js)
- **🔌 GreenPantry API**: http://localhost:5001 (.NET Core with Payment Services)

## Domain Linking to greenpantry.in

### Option 1: Local Development with Domain Mapping
To link your local development to the greenpantry.in domain, you can:

1. **Edit your hosts file** (requires admin privileges):
   ```bash
   sudo nano /etc/hosts
   ```
   
2. **Add this line**:
   ```
   127.0.0.1 greenpantry.in
   127.0.0.1 www.greenpantry.in
   ```

3. **Update Vite configuration** to accept the domain:
   ```bash
   # In GreenPantry frontend directory
   VITE_API_BASE_URL=http://localhost:5001/api VITE_HOST=greenpantry.in npm run dev -- --host 0.0.0.0 --port 3001
   ```

### Option 2: Production Deployment
For production deployment to greenpantry.in:

1. **Build the applications**:
   ```bash
   # Frontend
   cd "/home/raja/Projects/Rajeev's Pvt. Ltd./R's GreenPantry/frontend"
   npm run build
   
   # Backend
   cd "/home/raja/Projects/Rajeev's Pvt. Ltd./R's GreenPantry/backend/GreenPantry.API"
   dotnet publish -c Release -o ./publish
   ```

2. **Deploy to your server** with domain configuration

### Option 3: Nginx Reverse Proxy (Recommended for Development)
Create an nginx configuration to proxy greenpantry.in to localhost:

```nginx
server {
    listen 80;
    server_name greenpantry.in www.greenpantry.in;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /api/ {
        proxy_pass http://localhost:5001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Payment Integration Features

### ✅ Implemented Features:
- **Dynamic Cart Amount Binding**: Real-time calculation of totals
- **Multi-Provider Payment Support**: Razorpay, Paytm, PhonePe
- **UPI QR Code Generation**: Dynamic QR codes for each order
- **Webhook Verification**: Secure payment status updates
- **Test Mode Configuration**: Safe development environment
- **Cart Integration Test**: Built-in testing component

### 🧪 Testing the Integration:
1. Visit http://localhost:3001 (or greenpantry.in if configured)
2. Scroll down to see the "Cart & Payment Integration Test" section
3. Add test items to cart
4. Click "Test Checkout" to see the complete payment flow
5. Test different payment methods and providers

## Next Steps:
1. Configure domain linking using one of the options above
2. Test the complete payment flow
3. Deploy to production when ready
4. Configure SSL certificates for HTTPS
5. Set up monitoring and logging

## Current Service URLs:
- **Main Portal**: http://localhost:3000
- **GreenPantry**: http://localhost:3001
- **GreenPantry API**: http://localhost:5001/health
- **Main Portal API**: http://localhost:5000



