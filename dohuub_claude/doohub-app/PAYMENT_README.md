# User-Side Payments — Status & Go-Live Checklist

This is the source of truth for **customer payments** (mobile + API).

For step-by-step Stripe dashboard setup, see [`STRIPE_SETUP.md`](./STRIPE_SETUP.md).

---

## Current status

| Piece | Status |
|-------|--------|
| Book → Pay → Confirm UI | ✅ Done |
| Create booking API | ✅ Done |
| Mobile picks provider (`STRIPE` / `WIPAY` / `POWERTRANZ`) | ✅ Done |
| Hosted checkout (browser) + return deep link | ✅ Done |
| Processing screen (poll session) | ✅ Done |
| Webhook settlement → booking `ACCEPTED` | ✅ Done |
| Poll settles booking if webhook is slow | ✅ Done |
| Demo settle when **no** gateway keys set | ✅ Done (auto) |
| Real money charge | ⏳ Needs Stripe keys on Railway |

**Code is complete.** What’s left is **ops config** (keys + webhook), then push/deploy.

---

## User flow (live)

```
Book Service → Payment
  → POST /bookings
  → GET  /payments/providers   (pick enabled gateway)
  → POST /payments/checkout-session { provider, bookingId }
  → Open hosted checkout URL
  → Return dohuub://checkout/return
  → /checkout/processing (poll GET /payments/session/:id)
  → /checkout/confirmation
```

Webhook also settles in the background (source of truth when configured).

---

## Demo mode (no keys yet)

If Stripe/WiPay/PowerTranz are **not** configured on the API:

1. App creates the booking  
2. Calls `POST /payments/demo-complete`  
3. Booking is marked paid / `ACCEPTED`  
4. User sees Order Confirmed  

Once `STRIPE_SECRET_KEY` is set on Railway, demo stops automatically and real Checkout opens.

Force demo even with keys (dev only):

```env
ALLOW_DEMO_PAYMENTS=true
```

---

## Key files

**Mobile**

- `apps/mobile/app/checkout/payment.tsx` — pay + provider + demo fallback  
- `apps/mobile/app/checkout/processing.tsx` — poll status  
- `apps/mobile/app/checkout/return.tsx` — deep link landing  
- `apps/mobile/app/checkout/confirmation.tsx` — success UI  
- `apps/mobile/app.json` — scheme `dohuub`

**API**

- `apps/api/src/routes/payments.ts` — checkout-session, providers, session poll, demo-complete  
- `apps/api/src/lib/stripe.ts` — Stripe Checkout  
- `apps/api/src/routes/payments-stripe-webhook.ts` — webhook  
- `apps/api/src/lib/settlement.ts` — marks Transaction + Booking paid  

---

## What’s left for YOU (ops only)

Do these once, then the app is live for user payments:

### 1. Stripe test keys on Railway

1. Stripe Dashboard → **Test mode** → Developers → API keys  
2. Copy **Secret key** (`sk_test_…`)  
3. Railway → API service → Variables:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_RETURN_URL=dohuub://checkout/return
API_PUBLIC_URL=https://YOUR-API-HOST
```

Redeploy the API.

### 2. Stripe webhook

1. Stripe → Developers → Webhooks → Add endpoint  
2. URL: `https://YOUR-API-HOST/api/v1/payments/webhook/stripe`  
3. Events: `checkout.session.completed`, `checkout.session.expired`, `checkout.session.async_payment_failed`  
4. Copy signing secret → Railway:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

Redeploy again.

### 3. Push / deploy this code

- Push mobile + API changes  
- Deploy API to Railway  
- Rebuild / reload the mobile app (`npx expo run:android` or EAS build)

### 4. Smoke test

1. Book a cleaning service → Pay  
2. Stripe Checkout opens → test card `4242 4242 4242 4242`  
3. Return to app → Confirmed  
4. Booking should be `ACCEPTED` in admin / DB  

### 5. Go live (later)

- Switch Stripe to **live** keys (`sk_live_…`)  
- New live webhook + `whsec_…`  
- Same env var names on Railway  

---

## Not required for user checkout

- Stripe publishable key on mobile (hosted Checkout only needs secret on API)  
- In-app Payment Sheet  
- Vendor Stripe Connect (optional for auto vendor payouts; US vendors can onboard later)

---

## Caribbean (optional later)

Same mobile flow — API recommends WiPay when user country is Caribbean. Set WiPay env vars on Railway when ready.

---

## Related

- [`STRIPE_SETUP.md`](./STRIPE_SETUP.md) — detailed Stripe walkthrough  
- [`README.md`](./README.md) — project setup  
