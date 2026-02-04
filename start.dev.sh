#!/bin/bash

# Real Estate Booking - Development Start Script
# This script starts both the frontend and backend servers concurrently

echo "🏠 Starting Real Estate Booking Development Environment..."
echo ""

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd client && npm install && cd ..
fi

echo ""
echo "🚀 Starting servers..."
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:5173"
echo ""

# Run both servers concurrently
npx concurrently \
    --names "SERVER,CLIENT" \
    --prefix-colors "blue,green" \
    "cd server && node index.js" \
    "cd client && npm run dev"
