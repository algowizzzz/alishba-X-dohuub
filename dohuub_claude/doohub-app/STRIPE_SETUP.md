# Stripe Setup — DoHuub

This guide takes you from "no Stripe account" to "real charges on a test card"
in about 15 minutes. The code in `apps/api/src/routes/payments.ts` and
`apps/mobile/app/checkout/payment.tsx` is already wired up — you just need to
add keys and configure a webhook.

> **Cost**: $0. Test mode is free forever. Live mode pays Stripe's standard fees
> (2.9% + 30¢ per US card) but only when you flip the switch.

---

## 1. Create a Stripe account

1. Go to <https://dashboard.stripe.com/register>
2. Sign up with the team email you want to own the account.
3. You don't need to fill in business details to use **test mode**. Stripe will
   prompt you to activate the account when you're ready to charge real cards —
   you can ignore that prompt for now.

When the dashboard loads, make sure the **Test mode** toggle (top-right of the
sidebar) is ON. Everything in this guide is in test mode.

---

## 2. Copy the test API keys

1. In the Stripe dashboard, click **Developers** (top right) → **API keys**.
2. You'll see two keys for test mode:
   - **Publishable key** — starts with `pk_test_…`. We don't use this on the
     backend, but the mobile app would need it if you ever switch to the embedded
     Payment Sheet. Save it somewhere; we don't need it right now.
   - **Secret key** — starts with `sk_test_…`. Click **Reveal test key** and
     copy the whole string.
3. Treat the secret key like a password. Never commit it to git. Never paste it
   in chat. We're going to give it only to Railway.

---

## 3. Add the secret key to Railway

1. Open <https://railway.app/>, sign in, open the `alishba-x-dohuub` project.
2. Click the **api** service.
3. Go to the **Variables** tab.
4. Add:
   - **Name**: `STRIPE_SECRET_KEY`
   - **Value**: `sk_test_…` (paste your test secret key from step 2)
5. Click **Add** (or **Update**). Railway will redeploy automatically.

> If you're also testing locally, add the same line to `apps/api/.env`:
>
> ```
> STRIPE_SECRET_KEY=sk_test_…
> ```

You can stop here for a half-working setup: the mobile app can create checkout
sessions and the hosted Stripe page will accept test cards. But your booking
won't flip to ACCEPTED automatically until you set up the webhook in step 5.

---

## 4. Run the one-off DB migration

This adds the `stripeCustomerId` column to the `User` table. Skipping this means
the API logs a Prisma error on first payment. From the repo root:

```bash
cd doohub-app
node scripts/add-stripe-customer-id.mjs
```

It's idempotent — safe to re-run. Then regenerate the Prisma client:

```bash
cd packages/database
npx prisma generate
```

Railway runs `npx prisma generate` during deploy, so on the server side this
happens automatically. You only need it locally for type-checking and local API
runs.

---

## 5. Set up the webhook

Stripe will POST to our API whenever a payment finishes. That's how the booking
flips from PENDING to ACCEPTED and the Transaction row gets created.

1. In the dashboard, click **Developers** → **Webhooks** → **Add an endpoint**.
2. Endpoint URL:

   ```
   https://alishba-x-dohuub-production.up.railway.app/api/v1/payments/webhook
   ```

3. Description: `DoHuub production` (just a label).
4. **Events to send**: click **Select events**, search for and tick:
   - `checkout.session.completed` (required)
   - `checkout.session.expired` (optional, helpful for logs)
   - `payment_intent.payment_failed` (optional)
5. Click **Add endpoint**.
6. On the endpoint detail page, find **Signing secret**, click **Reveal**, and
   copy the value (starts with `whsec_…`).
7. Back to Railway → api service → Variables. Add:
   - **Name**: `STRIPE_WEBHOOK_SECRET`
   - **Value**: `whsec_…`
8. Railway will redeploy. Done.

To test the webhook locally without Railway, use the Stripe CLI:

```bash
stripe login
stripe listen --forward-to localhost:3001/api/v1/payments/webhook
```

The CLI prints a `whsec_…` value for the local tunnel — put that in
`apps/api/.env` as `STRIPE_WEBHOOK_SECRET` while you're running `stripe listen`.

---

## 6. Test it end-to-end

1. Open the mobile app (Expo Go or a build) signed in as
   `customer@dohuub.com` / `CustomerDemo2026!`.
2. Pick a service → book it → tap **Pay with Card**.
3. Stripe Checkout opens in a browser.
4. Use a Stripe test card:

   | Field         | Value                  |
   |---------------|------------------------|
   | Card number   | `4242 4242 4242 4242`  |
   | Expiry        | any future date (e.g. `12 / 34`) |
   | CVC           | any 3 digits (e.g. `123`) |
   | ZIP           | any (e.g. `10001`)     |
   | Email         | auto-filled by Stripe  |

   Other useful test cards:
   - `4000 0000 0000 9995` — declined for insufficient funds
   - `4000 0025 0000 3155` — requires 3DS authentication
   - Full list: <https://stripe.com/docs/testing#cards>

5. Submit. Stripe redirects you back to the app (or you close the in-app
   browser in Expo Go).
6. The processing screen polls the session and should show **Payment received!**
   within ~2 seconds.
7. On the Stripe dashboard → **Payments**, you should see a new payment.
8. In your DB (`Transaction` table) you should see a new row with
   `status = 'COMPLETED'` and the `stripePaymentIntentId` populated.
9. The corresponding `Booking` row should now have `status = 'ACCEPTED'`.

---

## 7. Going live (later)

When you're ready to take real money:

1. Activate the Stripe account (Dashboard → **Activate account**, fill in the
   business profile and bank details).
2. Flip the **Test mode** toggle OFF.
3. Repeat steps 2 + 5 above with the **live** keys (start with `sk_live_…` and
   `whsec_…` from a fresh live-mode webhook).
4. Update the Railway variables.

That's it — the code doesn't change. Live and test keys use the same SDK; Stripe
just routes them to a different bank of accounts.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| API returns `503: Stripe not configured` on `POST /payments/checkout-session` | `STRIPE_SECRET_KEY` not in Railway / `.env` | Add it, redeploy |
| Webhook always 400s with "Missing stripe-signature header" | You're hitting `/payments/webhook` with the wrong content type or routing through the JSON body parser | Confirm in `apps/api/src/index.ts` that `express.raw` is mounted on `/api/v1/payments/webhook` BEFORE `express.json()` |
| Webhook 400s with "Webhook signature error: No signatures found matching the expected signature" | `STRIPE_WEBHOOK_SECRET` is wrong or stale | Re-copy from dashboard; redeploy |
| Booking stays PENDING after a successful test payment | Webhook hasn't fired or isn't pointed at the right URL | Stripe dashboard → Webhooks → click your endpoint → check **Recent events** for errors |
| In Expo Go, the browser doesn't auto-close after payment | `dohuub://` scheme isn't registered in Expo Go — that's expected | Tap the X to close; the app polls and shows the right state anyway |
