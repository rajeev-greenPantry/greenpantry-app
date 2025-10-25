#!/bin/bash

echo "🌱 Starting R's GreenPantry..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Start backend if it exists
if [ -d "backend" ] && [ -f "backend/package.json" ]; then
    echo "🔧 Starting backend API..."
    cd backend
    npm install
    npm start &
    BACKEND_PID=$!
    cd ..
    sleep 2
fi

# Start frontend
echo "⚛️  Starting frontend..."
cd frontend
python3 -m http.server 3001 &
FRONTEND_PID=$!

echo ""
echo "✅ R's GreenPantry is starting up!"
echo "🌐 Frontend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop the application"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping R's GreenPantry..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
