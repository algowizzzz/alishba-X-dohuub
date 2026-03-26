# Deployment Setup Plan

**Date:** January 17, 2026  
**Purpose:** Complete deployment setup for backend and frontend using Supabase, SendGrid, and Railway/Render  
**Tech Stack:** Express.js + Prisma + PostgreSQL + React + Vite

---

## Overview

**Architecture:**
- **Backend:** Express.js API → Railway/Render
- **Database:** Supabase PostgreSQL
- **File Storage:** Supabase Storage (S3-compatible)
- **Email:** SendGrid API
- **Payment:** Stripe (mock data for now)
- **Frontend:** React + Vite → Vercel/Netlify

---

## Prerequisites & Required Items

### 1. Supabase Account & Credentials

**What you need:**
- ✅ Supabase account (free tier OK)
- ✅ Create new project
- ✅ PostgreSQL connection string
- ✅ Supabase Storage bucket created

**Items to provide:**
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE-ROLE-KEY]
```

**Actions:**
1. Sign up at supabase.com
2. Create new project
3. Go to Settings → API → Copy keys
4. Go to Settings → Database → Copy connection string
5. Go to Storage → Create bucket: `listings` (public), `uploads` (public)

**Supabase supports:**
- ✅ PostgreSQL with Prisma (full support)
- ✅ File uploads (S3-compatible API)
- ✅ Image storage with CDN
- ✅ All backend needs covered

---

### 2. SendGrid Account & API Key

**What you need:**
- ✅ SendGrid account (free tier: 100 emails/day)
- ✅ API key created
- ✅ Sender email verified

**Items to provide:**
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDER_EMAIL=noreply@yourdomain.com
```

**Actions:**
1. Sign up at sendgrid.com
2. Go to Settings → API Keys → Create API Key
   - Name: "DoHuub OTP"
   - Permissions: Full Access (or Mail Send only)
3. Copy API key (shown once - save it!)
4. Go to Settings → Sender Authentication
   - Option A: Single Sender Verification (quick, use any email)
   - Option B: Domain Authentication (production, requires DNS)

**What SendGrid provides:**
- ✅ OTP email sending
- ✅ Transactional emails
- ✅ Email templates (optional)
- ✅ 100 emails/day free tier

---

### 3. Deployment Platform

**Recommended: Railway** (easiest for Express.js)

**Items to provide:**
- ✅ GitHub repo connected
- ✅ Environment variables (added via Railway dashboard)

**Alternative: Render**
- Similar setup
- Auto-deploy from GitHub

---

### 4. Frontend Hosting

**Recommended: Vercel** (best for React + Vite)

**Items to provide:**
- ✅ GitHub repo connected
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Environment variables (API URL)

---

## Required Items Summary (From You)

### Quick Checklist:

- [ ] **Supabase:**
  - Account created
  - Project created
  - Database connection string copied
  - API keys copied (URL, ANON_KEY, SERVICE_ROLE_KEY)
  - Storage buckets created (`listings`, `uploads`)

- [ ] **SendGrid:**
  - Account created
  - API key created (`SG.xxxxx`)
  - Sender email verified

- [ ] **Railway (Backend):**
  - Account created (GitHub login)
  - Repo connected
  - Environment variables added via dashboard

- [ ] **Vercel (Frontend):**
  - Account created (GitHub login)
  - Repo connected
  - Environment variable: `VITE_API_URL` added

---

## Environment Variables

### Backend `.env` (Railway):

```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres

# Supabase Storage
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE-ROLE-KEY]

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDER_EMAIL=noreply@yourdomain.com

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# API
API_PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app

# Stripe (Mock/Test - Optional)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
```

### Frontend `.env` (Vercel):

```env
VITE_API_URL=https://your-backend.up.railway.app/api/v1
```

---

## Deployment Steps

### Backend (Railway):

1. Sign up: railway.app (GitHub login)
2. New Project → Deploy from GitHub repo
3. Configure:
   - Root Directory: `apps/api`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add all environment variables (from checklist above)
5. Deploy → Get URL: `https://your-app.up.railway.app`

### Frontend (Vercel):

1. Sign up: vercel.com (GitHub login)
2. Import Project → Select repo
3. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variable: `VITE_API_URL`
5. Deploy → Get URL: `https://your-app.vercel.app`

---

## Code Updates Required

1. **Replace Nodemailer → SendGrid** (in `apps/api/src/utils/otp.ts`)
2. **Add Supabase Storage** (create `apps/api/src/routes/upload.ts`)
3. **Install packages:** `@sendgrid/mail`, `@supabase/supabase-js`, `multer`

---

## Cost Estimates

**Free Tier (Development):**
- Supabase: Free (500MB DB, 1GB storage)
- SendGrid: Free (100 emails/day)
- Railway: Free ($5 credit/month)
- Vercel: Free (100GB bandwidth)

**Production:** ~$50/month for small scale

---

**Status:** 📋 Setup Plan Ready  
**Last Updated:** January 17, 2026
