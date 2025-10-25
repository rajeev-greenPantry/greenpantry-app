#!/bin/bash

# GreenPantry Full Stack Startup Script
echo "🚀 Starting GreenPantry Full Stack Application..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Add .NET to PATH
export PATH="$HOME/.dotnet:$PATH"

# Function to check if port is in use
check_port() {
    if ss -tlnp | grep -q ":$1 "; then
        echo -e "${YELLOW}⚠️  Port $1 is already in use${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Port $1 is available${NC}"
        return 0
    fi
}

# Kill any existing processes
echo -e "${BLUE}🧹 Cleaning up existing processes...${NC}"
pkill -f "GreenPantry.API" 2>/dev/null || true
pkill -f "dotnet.*GreenPantry" 2>/dev/null || true

# Wait a moment for cleanup
sleep 2

# Check ports
echo -e "${BLUE}🔍 Checking ports...${NC}"
check_port 5000
check_port 3001

# Start Backend API
echo -e "${BLUE}🔧 Starting Backend API...${NC}"
cd "$(dirname "$0")/backend"
echo "📍 Backend running from: $(pwd)"
echo "🌐 API will be available at: http://localhost:5000"
echo "💊 Health check: http://localhost:5000/health"

# Start API in background
dotnet run --project GreenPantry.API --urls "http://localhost:5000" &
API_PID=$!

# Wait for API to start
echo -e "${YELLOW}⏳ Waiting for API to start...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:5000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ API is ready!${NC}"
        break
    fi
    sleep 1
done

# Start Frontend
echo -e "${BLUE}🎨 Starting Frontend...${NC}"
cd "$(dirname "$0")/frontend"
echo "📍 Frontend running from: $(pwd)"
echo "🌐 Frontend will be available at: http://localhost:3001"
echo "🔗 API Base URL: http://localhost:5000/api"

# Start Frontend in background
VITE_API_BASE_URL=http://localhost:5000/api npm run dev -- --port 3001 &
FRONTEND_PID=$!

# Wait for Frontend to start
echo -e "${YELLOW}⏳ Waiting for Frontend to start...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:3001 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is ready!${NC}"
        break
    fi
    sleep 1
done

echo ""
echo -e "${GREEN}🎉 GreenPantry is now running!${NC}"
echo ""
echo -e "${BLUE}📱 Frontend:${NC} http://localhost:3001"
echo -e "${BLUE}🔧 API:${NC} http://localhost:5000"
echo -e "${BLUE}💊 Health Check:${NC} http://localhost:5000/health"
echo ""

# Open browser automatically
echo -e "${BLUE}🌐 Opening browser...${NC}"
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3001 &
elif command -v open > /dev/null; then
    open http://localhost:3001 &
elif command -v start > /dev/null; then
    start http://localhost:3001 &
else
    echo -e "${YELLOW}⚠️  Could not automatically open browser. Please open http://localhost:3001 manually${NC}"
fi

echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping services...${NC}"
    kill $API_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    pkill -f "GreenPantry.API" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    echo -e "${GREEN}✅ All services stopped${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
