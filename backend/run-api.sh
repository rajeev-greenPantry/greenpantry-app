#!/bin/bash

# GreenPantry API Runner Script
echo "🚀 Starting GreenPantry API..."

# Add .NET to PATH
export PATH="$HOME/.dotnet:$PATH"

# Run the API on port 7001
echo "📍 Running from: $(pwd)"
echo "🌐 API will be available at: http://localhost:7001"
echo "💊 Health check: http://localhost:7001/health"
echo ""
echo "Press Ctrl+C to stop the API"
echo ""

dotnet run --project GreenPantry.API --urls "http://localhost:7001"
