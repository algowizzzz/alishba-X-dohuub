# DoHuub Environment Variables - Complete Reference

**Last Updated:** January 21, 2026  
**Project:** DoHuub Platform  
**Purpose:** Centralized documentation of all environment variables across the project

---

## Table of Contents

1. [Backend/Root Environment](#1-backendroot-environment)
2. [Database Package Environment](#2-database-package-environment)
3. [Web Portal Frontend Environment](#3-web-portal-frontend-environment)
4. [Wireframes Frontend Environment](#4-wireframes-frontend-environment)
5. [Missing API Environment](#5-missing-api-environment-recommended)
6. [Production Environment Variables](#6-production-environment-variables)
7. [Quick Setup Guide](#7-quick-setup-guide)

---

## 1. Backend/Root Environment

**Location:** `doohub-app/.env`

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.qiotpmjbhjpegylqgrwd:duhuub123!%40@aws-1-us-east-1.pooler.supabase.com:5432/postgres?schema=public"

# Supabase Storage
SUPABASE_URL=https://qiotpmjbhjpegylqgrwd.supabase.co
SUPABASE_ANON_KEY=sb_publishable_cyDVvfP9gm6PYGKtQ21EpQ_1DjEJDeA
SUPABASE_SERVICE_ROLE_KEY=sb_secret_2gv3hR2WTrHKdTbrhPIxwA_hNqbNFR5

# API
API_PORT=3001
API_URL=http://localhost:3001
NODE_ENV=development

# JWT Secrets (generate your own for production)
JWT_SECRET=doohub-dev-jwt-secret-change-in-production
JWT_REFRESH_SECRET=doohub-dev-refresh-secret-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

**Variables Breakdown:**

| Variable | Description | Value Type | Required |
|----------|-------------|------------|----------|
| `DATABASE_URL` | PostgreSQL connection string from Supabase | String | ✅ Yes |
| `SUPABASE_URL` | Supabase project URL | URL | ✅ Yes |
| `SUPABASE_ANON_KEY` | Public anonymous key for client-side | String | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Private server-side key (full access) | String | ✅ Yes |
| `API_PORT` | Port for backend server | Number | ✅ Yes |
| `API_URL` | Backend server URL | URL | ✅ Yes |
| `NODE_ENV` | Environment mode | String | ✅ Yes |
| `JWT_SECRET` | Secret for JWT token signing | String (32+ chars) | ✅ Yes |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | String (32+ chars) | ✅ Yes |
| `JWT_EXPIRES_IN` | JWT token expiration | String | ✅ Yes |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | String | ✅ Yes |

---

## 2. Database Package Environment

**Location:** `doohub-app/packages/database/.env`

```env
DATABASE_URL=postgresql://postgres.qiotpmjbhjpegylqgrwd:duhuub123!%40@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

**Variables Breakdown:**

| Variable | Description | Value Type | Required |
|----------|-------------|------------|----------|
| `DATABASE_URL` | PostgreSQL connection string for Prisma | String | ✅ Yes |

**Note:** This is used by Prisma for migrations and database operations.

---

## 3. Web Portal Frontend Environment

**Location:** `doohub-app/apps/web-portal-new/.env`

```env
# API Configuration (local backend)
VITE_API_BASE_URL=http://localhost:3001/api/v1

# Supabase (for direct file access if needed)
VITE_SUPABASE_URL=https://qiotpmjbhjpegylqgrwd.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_cyDVvfP9gm6PYGKtQ21EpQ_1DjEJDeA
```

**Variables Breakdown:**

| Variable | Description | Value Type | Required |
|----------|-------------|------------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | URL | ✅ Yes |
| `VITE_SUPABASE_URL` | Supabase project URL (for direct storage access) | URL | ⚠️ Optional |
| `VITE_SUPABASE_ANON_KEY` | Public Supabase key (for direct storage access) | String | ⚠️ Optional |

**Note:** `VITE_` prefix exposes variables to client-side code.

---

## 4. Wireframes Frontend Environment

**Location:** `Wireframesdohuubmobileresponsivevendorprotalandadminpanelwebappversion1withoutupsell/.env`

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api/v1

# Supabase (for direct file access if needed)
VITE_SUPABASE_URL=https://qiotpmjbhjpegylqgrwd.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_cyDVvfP9gm6PYGKtQ21EpQ_1DjEJDeA
```

**Variables Breakdown:**

| Variable | Description | Value Type | Required |
|----------|-------------|------------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | URL | ✅ Yes |
| `VITE_SUPABASE_URL` | Supabase project URL | URL | ⚠️ Optional |
| `VITE_SUPABASE_ANON_KEY` | Public Supabase key | String | ⚠️ Optional |

---

## 5. Missing: API Environment (Recommended)

**Location:** `doohub-app/apps/api/.env` ⚠️ **DOES NOT EXIST**

**Recommended to create this file:**

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.qiotpmjbhjpegylqgrwd:duhuub123!%40@aws-1-us-east-1.pooler.supabase.com:5432/postgres?schema=public"

# Supabase Storage
SUPABASE_URL=https://qiotpmjbhjpegylqgrwd.supabase.co
SUPABASE_ANON_KEY=sb_publishable_cyDVvfP9gm6PYGKtQ21EpQ_1DjEJDeA
SUPABASE_SERVICE_ROLE_KEY=sb_secret_2gv3hR2WTrHKdTbrhPIxwA_hNqbNFR5

# API Configuration
API_PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT Secrets
JWT_SECRET=doohub-dev-jwt-secret-change-in-production
JWT_REFRESH_SECRET=doohub-dev-refresh-secret-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Email (SendGrid) - TO BE CONFIGURED
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDER_EMAIL=noreply@dohuub.com

# Stripe (Optional - for payments)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
```

**Why create this file:**
- Separates API-specific configuration from root config
- Makes deployment easier (Railway/Render can use this directly)
- Keeps sensitive API keys isolated

---

## 6. Production Environment Variables

### Backend (Railway/Render)

**File:** Not committed to Git - set in platform UI

```env
# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres.qiotpmjbhjpegylqgrwd:duhuub123!%40@aws-1-us-east-1.pooler.supabase.com:5432/postgres

# Supabase Storage
SUPABASE_URL=https://qiotpmjbhjpegylqgrwd.supabase.co
SUPABASE_ANON_KEY=sb_publishable_cyDVvfP9gm6PYGKtQ21EpQ_1DjEJDeA
SUPABASE_SERVICE_ROLE_KEY=sb_secret_2gv3hR2WTrHKdTbrhPIxwA_hNqbNFR5

# API Configuration
API_PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app

# JWT Secrets (MUST CHANGE IN PRODUCTION)
JWT_SECRET=GENERATE_A_STRONG_RANDOM_SECRET_MIN_32_CHARS_FOR_PRODUCTION
JWT_REFRESH_SECRET=GENERATE_ANOTHER_STRONG_RANDOM_SECRET_MIN_32_CHARS
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Email (SendGrid) - TO BE CONFIGURED
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDER_EMAIL=noreply@dohuub.com

# Stripe (Production)
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
```

### Frontend (Vercel/Netlify)

**File:** Set in Vercel dashboard

```env
VITE_API_BASE_URL=https://your-backend.up.railway.app/api/v1
VITE_SUPABASE_URL=https://qiotpmjbhjpegylqgrwd.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_cyDVvfP9gm6PYGKtQ21EpQ_1DjEJDeA
```

---

## 7. Quick Setup Guide

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/algowizzzz/dohuub_claude.git
   cd dohuub_claude
   ```

2. **Install dependencies**
   ```bash
   # Root
   npm install
   
   # Backend
   cd doohub-app/apps/api
   npm install
   
   # Frontend
   cd doohub-app/apps/web-portal-new
   npm install
   ```

3. **Copy environment files**
   ```bash
   # Backend (currently uses root .env)
   # Already exists: doohub-app/.env
   
   # Frontend
   cd doohub-app/apps/web-portal-new
   cp .env.example .env
   # Edit .env with actual values
   
   # Database
   cd doohub-app/packages/database
   # Already has .env
   ```

4. **Run database migrations**
   ```bash
   cd doohub-app/packages/database
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd doohub-app/apps/api
   npm run dev
   
   # Terminal 2 - Frontend
   cd doohub-app/apps/web-portal-new
   npm run dev
   ```

### Production Deployment Setup

1. **Railway (Backend)**
   - Connect GitHub repo
   - Set root directory: `doohub-app/apps/api`
   - Add all environment variables from "Production" section above
   - Deploy

2. **Vercel (Frontend)**
   - Connect GitHub repo
   - Set root directory: `doohub-app/apps/web-portal-new`
   - Add environment variables
   - Deploy

---

## 🔒 Security Best Practices

### ⚠️ Critical Security Notes:

1. **Never commit `.env` files to Git**
   - Already in `.gitignore`
   - If accidentally committed, rotate all secrets immediately

2. **Production secrets MUST be different from development**
   - Generate new JWT secrets for production
   - Use platform environment variable UI (Railway, Vercel)

3. **Service Role Key is HIGHLY SENSITIVE**
   - `SUPABASE_SERVICE_ROLE_KEY` has full database access
   - Never expose to client-side code
   - Only use on backend/server-side

4. **Rotate secrets regularly**
   - JWT secrets every 6 months
   - API keys if compromised
   - Database passwords quarterly

### Generate Secure Secrets:

```bash
# Generate JWT secrets (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT secrets (OpenSSL)
openssl rand -hex 32
```

---

## 📋 Environment Variable Checklist

### Development (Local)

- [x] `doohub-app/.env` - Backend root config
- [x] `doohub-app/packages/database/.env` - Database URL
- [x] `doohub-app/apps/web-portal-new/.env` - Frontend config
- [x] Supabase credentials configured
- [x] API running on port 3001
- [ ] SendGrid API key (optional for dev)

### Production

- [ ] Railway environment variables set
- [ ] Vercel environment variables set
- [ ] Production JWT secrets generated
- [ ] SendGrid API key configured
- [ ] Sender email verified
- [ ] Stripe keys (if using payments)
- [ ] FRONTEND_URL updated in backend
- [ ] API_BASE_URL updated in frontend

---

## 🆘 Troubleshooting

### Common Issues:

| Issue | Solution |
|-------|----------|
| `DATABASE_URL` connection fails | Check password encoding (`%40` for `@`), verify Supabase dashboard |
| API can't connect to database | Ensure `DATABASE_URL` in correct .env file |
| Frontend can't reach API | Verify `VITE_API_BASE_URL` matches backend URL |
| CORS errors | Add `FRONTEND_URL` to backend CORS config |
| JWT errors | Ensure `JWT_SECRET` is set and matches between requests |
| Image upload fails | Verify `SUPABASE_SERVICE_ROLE_KEY` is set in backend |
| SendGrid emails fail | Check API key, verify sender email |

---

## 📞 Support Resources

| Resource | URL |
|----------|-----|
| Supabase Dashboard | https://supabase.com/dashboard/project/qiotpmjbhjpegylqgrwd |
| Supabase Storage | https://supabase.com/dashboard/project/qiotpmjbhjpegylqgrwd/storage/files |
| Supabase API Keys | https://supabase.com/dashboard/project/qiotpmjbhjpegylqgrwd/settings/api-keys |
| GitHub Repository | https://github.com/algowizzzz/dohuub_claude |
| Deployment Docs | See `DEPLOYMENT_CREDENTIALS.md` |

---

## 📊 Summary

**Total Environment Files:** 4 active + 2 examples  
**Configured Services:** Supabase (Database + Storage)  
**Pending Services:** SendGrid (Email), Railway (Backend), Vercel (Frontend)  
**Security Status:** Development keys in use - Production keys needed

---

**Last Updated:** January 21, 2026  
**Maintained by:** Development Team  
**Version:** 1.0
