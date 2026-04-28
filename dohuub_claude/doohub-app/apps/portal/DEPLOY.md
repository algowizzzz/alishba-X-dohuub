# DoHuub Portal — Deployment Guide

The portal is a single Vite app serving both `/admin/*` and `/vendor/*`. It needs the Express API running at a public URL to work in production.

---

## Step 1 — Deploy API to Railway

The API is at `apps/api` (Express + Prisma).

### One-time setup
1. Create a Railway account: https://railway.app/
2. Click **New Project** → **Deploy from GitHub repo** (or **Empty Project** + push later)
3. Railway will detect Node.js. Set:
   - **Root Directory**: `dohuub_claude/doohub-app/apps/api`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add these environment variables (Railway → Variables):
   ```
   DATABASE_URL=postgresql://postgres.qiotpmjbhjpegylqgrwd:duhuub123!%40@aws-1-us-east-1.pooler.supabase.com:5432/postgres?schema=public
   SUPABASE_URL=https://qiotpmjbhjpegylqgrwd.supabase.co
   SUPABASE_ANON_KEY=sb_publishable_cyDVvfP9gm6PYGKtQ21EpQ_1DjEJDeA
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_2gv3hR2WTrHKdTbrhPIxwA_hNqbNFR5
   API_PORT=3001
   NODE_ENV=production
   JWT_SECRET=replace-with-32+-char-random-string
   FRONTEND_URL=https://dohuub-portal.vercel.app
   ```
5. Click **Deploy**. Railway will give you a URL like `https://dohuubclaude-production.up.railway.app`.
6. Visit `<that-url>/health` → should return `{"status":"ok","database":"connected"}`.

---

## Step 2 — Deploy Portal to Vercel

### Via CLI (fastest)
```bash
cd apps/portal
npx vercel login         # one-time, opens browser
npx vercel               # deploys preview
npx vercel --prod        # deploys to production
```

### Via Dashboard
1. https://vercel.com/new
2. Import the GitHub repo
3. **Root Directory**: `dohuub_claude/doohub-app/apps/portal`
4. **Framework Preset**: Vite
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. Add environment variable:
   ```
   VITE_API_URL=https://<your-railway-app>.up.railway.app
   ```
8. Click **Deploy**.

---

## Step 3 — Test the live deployment

1. Visit your Vercel URL.
2. **Admin login**: `admin@dohuub.com` / `DohuubAdmin2026!`
3. **Vendor signup**: create a new vendor with any email/password (no OTP).
4. Click around the dashboard, vendors, customers, orders. Real data from Supabase should load.

---

## Troubleshooting

- **Login returns 401**: Check that the API's `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` match what's in `lib/supabase.ts` of the portal.
- **API requests fail with CORS**: In `apps/api/src/index.ts`, add your Vercel URL to the `allowedOrigins` array, redeploy.
- **Build fails on Vercel with workspace error**: Vercel's monorepo support needs the root directory set correctly. Set it to `dohuub_claude/doohub-app/apps/portal`. If `npm install` fails, switch the install command to `npm install --legacy-peer-deps`.
- **Empty data on every page**: `VITE_API_URL` is missing on Vercel. Add it and redeploy.

---

## Default credentials for client demo

- **Admin**: `admin@dohuub.com` / `DohuubAdmin2026!`
- **Vendor**: anyone can sign up with email + password (auto-creates vendor profile)
