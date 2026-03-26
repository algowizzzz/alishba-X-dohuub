# DoHuub - Multi-Service Lifestyle Marketplace

A comprehensive platform connecting users with service providers across six categories: Cleaning, Handyman, Groceries & Food, Beauty, Rentals, and Caregiving.

## Architecture

```
doohub-app/
├── apps/
│   ├── api/          # Express.js REST API
│   ├── mobile/       # React Native Expo app (iOS & Android)
│   ├── business-portal/  # Next.js Business Owner Portal (TBD)
│   └── admin-panel/      # Next.js Admin Panel (TBD)
├── packages/
│   ├── database/     # Prisma ORM + PostgreSQL schema
│   └── shared/       # Shared TypeScript types
└── docker-compose.yml
```

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- PostgreSQL client (optional, for direct DB access)

## Quick Start

### 1. Clone & Install Dependencies

```bash
cd doohub-app
npm install
```

### 2. Start Docker Services

```bash
# Start PostgreSQL and Redis
npm run docker:up

# Verify containers are running
docker ps
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Start Development Servers

```bash
# Terminal 1: Start API
npm run dev:api

# Terminal 2: Start Mobile App
npm run dev:mobile
```

### 5. Run on Device/Simulator

- **iOS Simulator**: Press `i` in the Expo CLI
- **Android Emulator**: Press `a` in the Expo CLI
- **Physical Device**: Scan QR code with Expo Go app

## Test Accounts

After seeding, these accounts are available:

| Role | Email | Notes |
|------|-------|-------|
| Admin (Michelle) | michelle@doohub.com | Platform owner |
| Customer | customer@example.com | Test customer |

## API Endpoints

Base URL: `http://localhost:3001/api/v1`

### Authentication
- `POST /auth/register` - Register with email
- `POST /auth/login` - Login with email
- `POST /auth/verify-otp` - Verify OTP code
- `POST /auth/google-signin` - Google Sign-In

### Services
- `GET /services/cleaning` - Cleaning listings
- `GET /services/handyman` - Handyman listings
- `GET /services/beauty` - Beauty listings
- `GET /services/groceries` - Grocery listings
- `GET /services/rentals` - Rental properties
- `GET /services/caregiving` - Caregiving services

### Bookings & Orders
- `GET /bookings` - User bookings
- `POST /bookings` - Create booking
- `GET /orders` - User orders
- `POST /orders` - Create order from cart

### AI Chat
- `POST /chat/send` - Send message to AI assistant

## Environment Variables

Create `.env` in the root:

```env
# Database
DATABASE_URL="postgresql://doohub:doohub_dev_password@localhost:5432/doohub?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# API
API_PORT=3001
API_URL="http://localhost:3001"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Stripe (optional for dev)
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""

# OpenAI (optional for dev)
OPENAI_API_KEY=""
```

## Scripts

```bash
# Development
npm run dev              # Start all services
npm run dev:api          # Start API only
npm run dev:mobile       # Start mobile app only

# Database
npm run db:push          # Push schema changes
npm run db:migrate       # Run migrations
npm run db:seed          # Seed sample data
npm run db:studio        # Open Prisma Studio

# Docker
npm run docker:up        # Start containers
npm run docker:down      # Stop containers

# Build
npm run build            # Build all packages
```

## Features

### Customer Mobile App
- ✅ Email + OTP Authentication
- ✅ Google Sign-In (structure ready)
- ✅ Home Dashboard with 6 Service Categories
- ✅ Service Browsing with Filters
- ✅ AI Chat Assistant
- ✅ Booking Management
- ✅ User Profile & Settings
- ✅ Address Management

### Michelle's Priority (Platform Owner)
- ✅ Michelle's listings always shown first
- ✅ "Powered by DoHuub" badge on platform listings
- ✅ Separate vendor account for Michelle

### Service Categories
1. **Cleaning** - Deep cleaning, laundry, office cleaning
2. **Handyman** - Plumbing, electrical, repairs, installations
3. **Groceries & Food** - Multi-vendor grocery marketplace
4. **Beauty** - Makeup, hair, nails, wellness
5. **Rentals** - Short/long-term property rentals
6. **Caregiving** - Ride assistance, companionship support

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart containers
npm run docker:down && npm run docker:up
```

### Expo Issues
```bash
# Clear Expo cache
expo start -c

# Reset Metro bundler
npx expo start --clear
```

### Port Conflicts
- API: 3001
- Expo: 8081
- PostgreSQL: 5432
- Redis: 6379

## License

Proprietary - DoHuub © 2024

