#!/bin/bash

# GreenPantry API Startup Script
echo "🚀 Starting GreenPantry API..."

# Add .NET to PATH
export PATH="$HOME/.dotnet:$PATH"

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Run the API
echo "📍 Running from: $(pwd)"
echo "🌐 API will be available at: http://localhost:7001"
echo "💊 Health check: http://localhost:7001/health"
echo ""
echo "Press Ctrl+C to stop the API"
echo ""

dotnet run --project GreenPantry.API
