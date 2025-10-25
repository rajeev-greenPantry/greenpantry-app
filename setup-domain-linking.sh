#!/bin/bash

echo "🌱 Setting up GreenPantry domain linking to greenpantry.in"
echo "=================================================="

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "❌ Please don't run this script as root. Run as regular user."
    exit 1
fi

echo "📝 Adding greenpantry.in to hosts file..."
echo "You'll need to enter your password to edit /etc/hosts"

# Add domain to hosts file
sudo bash -c 'echo "127.0.0.1 greenpantry.in" >> /etc/hosts'
sudo bash -c 'echo "127.0.0.1 www.greenpantry.in" >> /etc/hosts'

echo "✅ Domain added to hosts file"
echo ""

echo "🚀 Starting GreenPantry with domain configuration..."
echo "This will start the frontend to accept connections from greenpantry.in"
echo ""

# Start GreenPantry frontend with domain configuration
cd "/home/raja/Projects/Rajeev's Pvt. Ltd./R's GreenPantry/frontend"
VITE_API_BASE_URL=http://localhost:5001/api VITE_HOST=greenpantry.in npm run dev -- --host 0.0.0.0 --port 3001

echo ""
echo "🎉 Setup complete!"
echo "You can now access GreenPantry at:"
echo "  - http://greenpantry.in:3001"
echo "  - http://www.greenpantry.in:3001"
echo "  - http://localhost:3001"
echo ""
echo "Make sure the GreenPantry API is running on port 5001"



