#!/bin/bash

echo "🚀 Starting DoHuub Development Environment"
echo "==========================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker first."
  exit 1
fi

# Start Docker services if not running
if ! docker ps | grep -q doohub-postgres; then
  echo "📦 Starting Docker services..."
  docker-compose up -d
  sleep 5
fi

echo "✅ Docker services running"
echo ""
echo "Starting development servers..."
echo ""
echo "API will be available at: http://localhost:3001"
echo "Mobile app will start on Expo port 8081"
echo ""

# Run turbo dev
npm run dev

