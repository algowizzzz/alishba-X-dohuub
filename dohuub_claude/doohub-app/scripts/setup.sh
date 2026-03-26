#!/bin/bash

echo "🚀 DoHuub Setup Script"
echo "======================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker and try again."
  exit 1
fi

echo "✅ Docker is running"

# Start Docker services
echo "📦 Starting PostgreSQL and Redis..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check PostgreSQL health
until docker exec doohub-postgres pg_isready -U doohub -d doohub > /dev/null 2>&1; do
  echo "   Waiting for PostgreSQL..."
  sleep 2
done
echo "✅ PostgreSQL is ready"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
cd packages/database
npx prisma generate

# Push database schema
echo "📊 Pushing database schema..."
npx prisma db push

# Seed the database
echo "🌱 Seeding database..."
npx prisma db seed

cd ../..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  Terminal 1: npm run dev:api"
echo "  Terminal 2: npm run dev:mobile"
echo ""
echo "Test accounts:"
echo "  Admin: michelle@doohub.com"
echo "  Customer: customer@example.com"
echo ""

