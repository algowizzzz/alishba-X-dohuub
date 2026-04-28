# Production Deployment Plan

**Project:** DoHuub Wireframe Frontend
**Date Created:** January 19, 2026
**Status:** 🟡 IN PROGRESS
**Last Updated:** January 19, 2026

---

## Overview

Deploy the DoHuub wireframe frontend application to production with full Supabase database integration.

**Goal:** Get the application live at a public URL where stakeholders can test all features.

---

## Current State

| Component | Status | Details |
|-----------|--------|---------|
| Supabase Database | ✅ Ready | PostgreSQL + Storage buckets configured |
| Railway Backend | ⚠️ Needs Fix | Deployed but DATABASE_URL points to localhost |
| Frontend (Vercel) | ❌ Not Started | Needs deployment |
| Local Testing | ✅ Working | API integration verified |

---

## Deployment Tasks

### Phase 1: Fix Railway Backend Database Connection
**Priority:** 🔴 CRITICAL
**Status:** ⏳ Pending
**Estimated Time:** 15 minutes

#### Task 1.1: Update Railway DATABASE_URL
- [ ] Go to Railway Dashboard: https://railway.app/project/a0bf5c81-97ab-41f1-9799-ee4c0b7eb58b
- [ ] Click on the Dohuub1 service
- [ ] Go to "Variables" tab
- [ ] Find `DATABASE_URL` variable
- [ ] Update value to Supabase pooler connection:
  ```
  postgresql://postgres.qiotpmjbhjpegylqgrwd:duhuub123!%40@aws-1-us-east-1.pooler.supabase.com:5432/postgres
  ```
- [ ] Click "Save" (Railway will auto-redeploy)

**Note:** Password is `duhuub123!@` - the `@` is URL encoded as `%40`

#### Task 1.2: Verify Backend is Running
- [ ] Wait for Railway redeploy (1-2 minutes)
- [ ] Test health endpoint:
  ```bash
  curl https://dohuub1-production.up.railway.app/api/v1/health
  ```
- [ ] Expected: `{"status":"ok"}` or similar success response
- [ ] If 502 error persists, check Railway logs for database connection errors

#### Task 1.3: Run Prisma Migrations on Production DB
- [ ] Only needed if tables don't exist in Supabase
- [ ] Run locally with production DATABASE_URL:
  ```bash
  cd doohub-app/packages/database
  DATABASE_URL="postgresql://postgres.qiotpmjbhjpegylqgrwd:duhuub123!%40@aws-1-us-east-1.pooler.supabase.com:5432/postgres" npx prisma db push
  ```

**Completion Criteria:**
- [ ] Backend returns 200 OK on health check
- [ ] API endpoints work (test with curl)

---

### Phase 2: Deploy Frontend to Vercel
**Priority:** 🔴 CRITICAL
**Status:** ⏳ Pending
**Estimated Time:** 30 minutes

#### Task 2.1: Prepare Frontend for Deployment
- [ ] Update `.env.production` in wireframes folder:
  ```env
  VITE_API_BASE_URL=https://dohuub1-production.up.railway.app/api/v1
  VITE_API_URL=https://dohuub1-production.up.railway.app
  ```

#### Task 2.2: Create Vercel Account (if needed)
- [ ] Go to https://vercel.com/
- [ ] Sign up with GitHub
- [ ] Authorize Vercel to access repositories

#### Task 2.3: Import Project to Vercel
- [ ] Click "Add New" → "Project"
- [ ] Select repository or import from folder
- [ ] Configure build settings:
  - **Framework Preset:** Vite
  - **Root Directory:** `Wireframesdohuubmobileresponsivevendorprotalandadminpanelwebappversion1withoutupsell`
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`
  - **Install Command:** `npm install`

#### Task 2.4: Add Environment Variables in Vercel
- [ ] Go to Project Settings → Environment Variables
- [ ] Add the following:
  | Key | Value |
  |-----|-------|
  | `VITE_API_BASE_URL` | `https://dohuub1-production.up.railway.app/api/v1` |
  | `VITE_API_URL` | `https://dohuub1-production.up.railway.app` |
  | `VITE_SUPABASE_URL` | `https://qiotpmjbhjpegylqgrwd.supabase.co` |
  | `VITE_SUPABASE_ANON_KEY` | `sb_publishable_cyDVvfP9gm6PYGKtQ21EpQ_1DjEJDeA` |

#### Task 2.5: Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Copy production URL (e.g., `https://dohuub-xxx.vercel.app`)

**Completion Criteria:**
- [ ] Frontend loads at Vercel URL
- [ ] No build errors in Vercel logs

---

### Phase 3: Configure CORS on Backend
**Priority:** 🟡 HIGH
**Status:** ⏳ Pending
**Estimated Time:** 15 minutes

#### Task 3.1: Add Vercel URL to CORS Origins
- [ ] Get Vercel production URL from Phase 2
- [ ] Go to Railway Dashboard → Variables
- [ ] Add/Update `FRONTEND_URL` variable:
  ```
  FRONTEND_URL=https://your-app.vercel.app
  ```
- [ ] Alternatively, update CORS in code:

  **File:** `doohub-app/apps/api/src/index.ts`
  ```typescript
  app.use(cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'https://your-app.vercel.app',  // Add Vercel URL
    ],
    credentials: true,
  }));
  ```
- [ ] Commit and push changes (Railway auto-deploys)

**Completion Criteria:**
- [ ] Frontend can make API calls without CORS errors

---

### Phase 4: End-to-End Testing
**Priority:** 🟡 HIGH
**Status:** ⏳ Pending
**Estimated Time:** 30 minutes

#### Task 4.1: Create Test Users in Production
- [ ] Register admin user via API:
  ```bash
  curl -X POST https://dohuub1-production.up.railway.app/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@dohuub.com","password":"Admin123!@#","firstName":"Admin","lastName":"User"}'
  ```
- [ ] Update user to ADMIN role in Supabase:
  - Go to Supabase Dashboard → Database → User table
  - Find the user and update `role` to `ADMIN`

- [ ] Register vendor user similarly

#### Task 4.2: Test Admin Flows
- [ ] Open Vercel URL in browser
- [ ] Login as admin
- [ ] Navigate to Vendors page
- [ ] Test suspend/unsuspend vendor
- [ ] Verify changes persist in Supabase (check database)

#### Task 4.3: Test Vendor Flows
- [ ] Login as vendor
- [ ] Create a new store
- [ ] Verify store appears in list
- [ ] Test store activate/deactivate

#### Task 4.4: Document Test Results
- [ ] Record any bugs found
- [ ] Note any UI/UX issues
- [ ] Update this plan with results

**Completion Criteria:**
- [ ] All major flows work end-to-end
- [ ] Data persists in Supabase database

---

### Phase 5: Final Configuration & Documentation
**Priority:** 🟢 MEDIUM
**Status:** ⏳ Pending
**Estimated Time:** 20 minutes

#### Task 5.1: Create Demo Credentials Document
- [ ] Document production login credentials
- [ ] Create demo walkthrough script
- [ ] Share with stakeholders

#### Task 5.2: Update Documentation
- [ ] Update IMPLEMENTATION_COMPLETE.md with production URLs
- [ ] Update deployment files with final status

#### Task 5.3: Configure Custom Domain (Optional)
- [ ] Add custom domain in Vercel settings
- [ ] Update DNS records
- [ ] Update CORS with custom domain

**Completion Criteria:**
- [ ] All documentation updated
- [ ] Stakeholders have access credentials

---

## Credentials Reference

### Supabase
```
URL: https://qiotpmjbhjpegylqgrwd.supabase.co
Anon Key: sb_publishable_cyDVvfP9gm6PYGKtQ21EpQ_1DjEJDeA
Service Key: sb_secret_2gv3hR2WTrHKdTbrhPIxwA_hNqbNFR5
Database Password: duhuub123!@
Pooler Connection: postgresql://postgres.qiotpmjbhjpegylqgrwd:duhuub123!%40@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

### Railway
```
Dashboard: https://railway.app/project/a0bf5c81-97ab-41f1-9799-ee4c0b7eb58b
Backend URL: https://dohuub1-production.up.railway.app
API Base: https://dohuub1-production.up.railway.app/api/v1
```

### SendGrid
```
API Key: <REDACTED - stored in Railway environment variables>
Sender Email: noreply@dohuub.com
```

### Vercel (To be filled after deployment)
```
Dashboard: https://vercel.com/
Frontend URL: _________________ (fill after deployment)
```

---

## Browser Actions Required

The following tasks require browser interaction:

| Task | URL | Action |
|------|-----|--------|
| 1.1 | https://railway.app/project/a0bf5c81-97ab-41f1-9799-ee4c0b7eb58b | Update DATABASE_URL variable |
| 2.2 | https://vercel.com/ | Create account / Sign in |
| 2.3 | Vercel Dashboard | Import project |
| 2.4 | Vercel Project Settings | Add environment variables |
| 2.5 | Vercel Dashboard | Trigger deployment |
| 3.1 | Railway Dashboard | Add FRONTEND_URL variable |
| 4.1 | Supabase Dashboard | Update user role to ADMIN |

---

## Quick Start Commands

```bash
# Test Railway backend
curl https://dohuub1-production.up.railway.app/api/v1/health

# Run Prisma migrations on production
cd doohub-app/packages/database
DATABASE_URL="postgresql://postgres.qiotpmjbhjpegylqgrwd:duhuub123!%40@aws-1-us-east-1.pooler.supabase.com:5432/postgres" npx prisma db push

# Build frontend locally to test
cd Wireframesdohuubmobileresponsivevendorprotalandadminpanelwebappversion1withoutupsell
npm run build

# Test production API login
curl -X POST https://dohuub1-production.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dohuub.com","password":"Admin123!@#"}'
```

---

## Progress Tracker

| Phase | Task | Status | Notes |
|-------|------|--------|-------|
| 1 | Fix Railway DATABASE_URL | ⏳ Pending | Requires browser |
| 1 | Verify backend health | ⏳ Pending | After DB fix |
| 1 | Run Prisma migrations | ⏳ Pending | If needed |
| 2 | Prepare frontend env | ⏳ Pending | |
| 2 | Create Vercel account | ⏳ Pending | Requires browser |
| 2 | Import project | ⏳ Pending | Requires browser |
| 2 | Add env variables | ⏳ Pending | Requires browser |
| 2 | Deploy to Vercel | ⏳ Pending | Requires browser |
| 3 | Configure CORS | ⏳ Pending | After Vercel URL known |
| 4 | Create test users | ⏳ Pending | |
| 4 | Test admin flows | ⏳ Pending | |
| 4 | Test vendor flows | ⏳ Pending | |
| 5 | Create demo docs | ⏳ Pending | |

---

## Timeline Estimate

| Phase | Duration |
|-------|----------|
| Phase 1: Fix Backend | 15-20 min |
| Phase 2: Deploy Frontend | 30-45 min |
| Phase 3: Configure CORS | 10-15 min |
| Phase 4: E2E Testing | 30-45 min |
| Phase 5: Documentation | 15-20 min |
| **Total** | **~2 hours** |

---

## Notes

- Railway auto-deploys when environment variables change
- Vercel auto-deploys from GitHub on push (if connected)
- Supabase free tier may pause after 7 days of inactivity
- Keep this document updated as tasks are completed

---

**Document Version:** 1.0
**Created By:** Claude AI Assistant
**Last Updated:** January 19, 2026
