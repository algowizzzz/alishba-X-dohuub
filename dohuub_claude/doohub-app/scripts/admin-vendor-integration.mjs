// admin-vendor-integration.mjs
// ----------------------------------------------------------------------------
// End-to-end integration check for the admin ↔ vendor ↔ customer surface that
// the recent admin-panel audit reshaped. For each scenario we drive the API
// like the portal/mobile would, then verify the expected cross-app effect.
//
// Usage:
//   node scripts/admin-vendor-integration.mjs
//
// Optional env overrides:
//   API=https://...           default Railway production
//   ADMIN_EMAIL / ADMIN_PWD
//   VENDOR_EMAIL / VENDOR_PWD
//   CUSTOMER_EMAIL / CUSTOMER_PWD
//
// Every scenario is independent and best-effort idempotent — created rows are
// either reverted or marked CLEANUP-prefixed so they can be filtered out.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qiotpmjbhjpegylqgrwd.supabase.co";
const ANON_KEY = "sb_publishable_cyDVvfP9gm6PYGKtQ21EpQ_1DjEJDeA";
const API = process.env.API || "https://alishba-x-dohuub-production.up.railway.app";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@dohuub.com";
const ADMIN_PWD = process.env.ADMIN_PWD || "DohuubAdmin2026!";
const VENDOR_EMAIL = process.env.VENDOR_EMAIL || "vendor@dohuub.com";
const VENDOR_PWD = process.env.VENDOR_PWD || "VendorDemo2026!";
const CUSTOMER_EMAIL = process.env.CUSTOMER_EMAIL || "customer@dohuub.com";
const CUSTOMER_PWD = process.env.CUSTOMER_PWD || "CustomerDemo2026!";

const sb = createClient(SUPABASE_URL, ANON_KEY);

// Fresh client so customer signin doesn't share storage with admin/vendor.
function newClient() {
  return createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
}

async function signin(email, password) {
  const client = newClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`signin ${email}: ${error.message}`);
  return { token: data.session.access_token, userId: data.user.id, email };
}

async function call(token, method, path, body) {
  const r = await fetch(`${API}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try {
    json = await r.json();
  } catch {}
  return { status: r.status, body: json };
}

// ----------------------------------------------------------------------------
// Test harness
// ----------------------------------------------------------------------------
const tests = [];
const test = (name, fn) => tests.push({ name, fn });
const must = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
const eq = (actual, expected, label) => {
  if (actual !== expected) throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
};

// Tracks state mutations so an aborted run can be tidied up.
const cleanup = [];
const trackCleanup = (fn) => cleanup.push(fn);

// ----------------------------------------------------------------------------
// SUSPENSION ENFORCEMENT (vendor)
// ----------------------------------------------------------------------------
test("1. admin SUSPEND vendor → vendor write returns 403", async (ctx) => {
  const { adm, vTok, vendorId } = ctx;
  await call(adm.token, "PATCH", `/api/v1/admin/vendors/${vendorId}/status`, { status: "SUSPENDED" });

  const tryWrite = await call(vTok, "PUT", "/api/v1/vendors/me", { description: "should be blocked" });
  must(tryWrite.status === 403, `expected 403 on suspended vendor write, got ${tryWrite.status}`);

  // restore
  await call(adm.token, "PATCH", `/api/v1/admin/vendors/${vendorId}/status`, { status: "APPROVED" });
  return { suspendedThenRestored: true };
});

test("2. admin APPROVE restores vendor writes", async (ctx) => {
  const { adm, vTok, vendorId } = ctx;
  await call(adm.token, "PATCH", `/api/v1/admin/vendors/${vendorId}/status`, { status: "APPROVED" });
  const tryWrite = await call(vTok, "PUT", "/api/v1/vendors/me", { description: `restored at ${new Date().toISOString()}` });
  must(tryWrite.status === 200, `expected 200 after un-suspend, got ${tryWrite.status}`);
  return { restoreOk: true };
});

// ----------------------------------------------------------------------------
// SUSPENSION ENFORCEMENT (customer ban via /admin/customers)
// ----------------------------------------------------------------------------
test("3. admin SUSPEND customer → next API call returns 401 + status persists", async (ctx) => {
  const { adm, customerUserId, cust } = ctx;
  const res = await call(adm.token, "PATCH", `/api/v1/admin/customers/${customerUserId}/status`, { status: "SUSPENDED" });
  must(res.status === 200, `customer SUSPEND status ${res.status}`);
  // The customer's existing token is still valid in Supabase, but our auth
  // middleware re-reads User.status + isActive on every call and should 401.
  const blocked = await call(cust.token, "GET", "/api/v1/users/me");
  must(blocked.status === 401, `expected 401 for suspended customer, got ${blocked.status}`);

  // Restore
  await call(adm.token, "PATCH", `/api/v1/admin/customers/${customerUserId}/status`, { status: "ACTIVE" });
  return { suspended: true, restored: true };
});

// ----------------------------------------------------------------------------
// LISTING STATUS PROPAGATION → mobile browse
// ----------------------------------------------------------------------------
test("4. admin PAUSE listing → mobile browse drops it; ACTIVE → reappears", async (ctx) => {
  const { adm, cust } = ctx;
  const list = await call(cust.token, "GET", "/api/v1/services/cleaning?limit=10");
  const sample = (list.body?.data || []).find((l) => l.status === "ACTIVE");
  if (!sample) return { skipped: "no ACTIVE cleaning listing available" };

  await call(adm.token, "PATCH", `/api/v1/admin/listings/CLEANING/${sample.id}/status`, { status: "PAUSED" });
  const browseAfterPause = await call(cust.token, "GET", "/api/v1/services/cleaning?limit=50");
  const stillPresent = (browseAfterPause.body?.data || []).some((l) => l.id === sample.id);
  must(!stillPresent, "paused listing still appears in mobile customer browse");

  await call(adm.token, "PATCH", `/api/v1/admin/listings/CLEANING/${sample.id}/status`, { status: "ACTIVE" });
  const browseAfterReactivate = await call(cust.token, "GET", "/api/v1/services/cleaning?limit=50");
  const back = (browseAfterReactivate.body?.data || []).some((l) => l.id === sample.id);
  must(back, "re-activated listing does not reappear");
  return { listingId: sample.id };
});

// ----------------------------------------------------------------------------
// MICHELLE LISTING CRUD via the new /admin endpoint
// ----------------------------------------------------------------------------
test("5. admin creates Michelle listing → admin GET /listings includes it → DELETE removes it", async (ctx) => {
  const { adm } = ctx;
  // Pick a Michelle profile
  const profiles = await call(adm.token, "GET", "/api/v1/admin/michelle-profiles?limit=50");
  const profile = (profiles.body?.data || [])[0];
  if (!profile) return { skipped: "no Michelle profile available" };

  const cat = profile.categories?.[0]?.category || "CLEANING";
  const productCats = ["BEAUTY_PRODUCTS", "GROCERIES", "FOOD"];

  const title = `CLEANUP integration test ${Date.now()}`;
  const created = await call(adm.token, "POST", `/api/v1/admin/michelle-profiles/${profile.id}/listings`, {
    category: cat,
    title,
    description: "Integration check — safe to delete",
    price: 99.99,
    images: [],
    status: "DRAFT",
  });
  must(created.status === 201, `create listing status ${created.status}: ${JSON.stringify(created.body)}`);
  const listingId = created.body?.data?.id;
  must(listingId, "no listing id returned");
  trackCleanup(() => call(adm.token, "DELETE", `/api/v1/admin/michelle-profiles/${profile.id}/listings/${cat}/${listingId}`));

  // GET single
  const fetched = await call(adm.token, "GET", `/api/v1/admin/michelle-profiles/${profile.id}/listings/${cat}/${listingId}`);
  must(fetched.status === 200, `GET single status ${fetched.status}`);
  const nameField = productCats.includes(cat) ? fetched.body?.data?.name : fetched.body?.data?.title;
  eq(nameField, title, "single GET title field");

  // PUT update
  const updateTitle = `${title} (edited)`;
  const updated = await call(adm.token, "PUT", `/api/v1/admin/michelle-profiles/${profile.id}/listings/${cat}/${listingId}`, {
    title: updateTitle,
  });
  must(updated.status === 200, `PUT status ${updated.status}`);

  // DELETE
  const deleted = await call(adm.token, "DELETE", `/api/v1/admin/michelle-profiles/${profile.id}/listings/${cat}/${listingId}`);
  must(deleted.status === 200, `DELETE status ${deleted.status}`);

  // Verify gone
  const after = await call(adm.token, "GET", `/api/v1/admin/michelle-profiles/${profile.id}/listings/${cat}/${listingId}`);
  must(after.status === 404, `expected 404 after delete, got ${after.status}`);
  return { profileId: profile.id, category: cat, listingId };
});

// ----------------------------------------------------------------------------
// REPORTS FLOW with new restore endpoint
// ----------------------------------------------------------------------------
test("6. customer reports listing → admin restore-listing returns it to ACTIVE", async (ctx) => {
  const { adm, cust } = ctx;
  const list = await call(cust.token, "GET", "/api/v1/services/cleaning?limit=5");
  const target = (list.body?.data || []).find((l) => l.status === "ACTIVE");
  if (!target) return { skipped: "no ACTIVE cleaning listing to report" };

  // Submit a report (auto-pauses the listing per reports.ts:323)
  const reported = await call(cust.token, "POST", "/api/v1/reports", {
    listingType: "cleaning",
    listingId: target.id,
    reason: "Inappropriate content",
    comment: `INTEGRATION TEST ${Date.now()} — please ignore`,
  });
  must(reported.status === 201 || reported.status === 200, `report create status ${reported.status}`);
  const reportId = reported.body?.data?.id;
  must(reportId, "no report id returned");

  // Listing should now be PAUSED — verify via admin listing fetch
  const single = await call(adm.token, "GET", `/api/v1/admin/listings?vendorId=${target.vendorId}&limit=200`);
  const matched = (single.body?.data || []).find((l) => l.id === target.id);
  must(matched, "reported listing not visible in admin /listings");
  must(matched.status === "PAUSED", `expected PAUSED after report, got ${matched.status}`);

  // Restore via the new endpoint
  const restored = await call(adm.token, "POST", `/api/v1/admin/reports/${reportId}/restore-listing`, {});
  must(restored.status === 200, `restore-listing status ${restored.status}`);

  // Verify ACTIVE again
  const after = await call(adm.token, "GET", `/api/v1/admin/listings?vendorId=${target.vendorId}&limit=200`);
  const afterMatch = (after.body?.data || []).find((l) => l.id === target.id);
  must(afterMatch?.status === "ACTIVE", `expected ACTIVE after restore, got ${afterMatch?.status}`);
  return { reportId, listingId: target.id };
});

// ----------------------------------------------------------------------------
// REWARDS ADJUSTMENT
// ----------------------------------------------------------------------------
test("7. admin adjusts customer points → wallet reflects credit + debit (verified via admin GET)", async (ctx) => {
  // Customer-side wallet is read directly from Supabase by the mobile app —
  // there is no public REST endpoint. Verify via the admin detail endpoint
  // (/admin/customers/:id/rewards) which returns the wallet row.
  const { adm, customerUserId } = ctx;

  const before = await call(adm.token, "GET", `/api/v1/admin/customers/${customerUserId}/rewards`);
  const startPoints = before.body?.data?.wallet?.totalPoints ?? 0;

  const credit = await call(adm.token, "POST", `/api/v1/admin/customers/${customerUserId}/rewards/adjust`, {
    amount: 50,
    reason: "INTEGRATION TEST credit",
  });
  must(credit.status === 200, `credit status ${credit.status}: ${JSON.stringify(credit.body)}`);

  const afterCredit = await call(adm.token, "GET", `/api/v1/admin/customers/${customerUserId}/rewards`);
  eq(afterCredit.body?.data?.wallet?.totalPoints, startPoints + 50, "wallet after credit");

  const debit = await call(adm.token, "POST", `/api/v1/admin/customers/${customerUserId}/rewards/adjust`, {
    amount: -50,
    reason: "INTEGRATION TEST debit",
  });
  must(debit.status === 200, `debit status ${debit.status}`);

  const afterDebit = await call(adm.token, "GET", `/api/v1/admin/customers/${customerUserId}/rewards`);
  eq(afterDebit.body?.data?.wallet?.totalPoints, startPoints, "wallet after debit returns to start");
  return { startPoints };
});

// ----------------------------------------------------------------------------
// BOOKING STATUS SYNC: admin → both vendor and customer
// ----------------------------------------------------------------------------
test("8. admin PATCH booking status → vendor + customer both see the change", async (ctx) => {
  const { adm, vTok, cust } = ctx;
  const list = await call(adm.token, "GET", "/api/v1/admin/bookings?limit=20");
  const target = (list.body?.data || []).find(
    (b) => b.status !== "COMPLETED" && b.status !== "CANCELLED" && b.userId === cust.userId
  );
  if (!target) return { skipped: "no in-flight booking belonging to test customer" };

  const originalStatus = target.status;
  const nextStatus = originalStatus === "ACCEPTED" ? "IN_PROGRESS" : "ACCEPTED";

  const flipped = await call(adm.token, "PATCH", `/api/v1/admin/bookings/${target.id}/status`, { status: nextStatus });
  must(flipped.status === 200, `flip status ${flipped.status}: ${JSON.stringify(flipped.body)}`);

  const customerView = await call(cust.token, "GET", `/api/v1/bookings/${target.id}`);
  eq(customerView.body?.data?.status, nextStatus, "customer view sees new status");

  const vendorView = await call(vTok, "GET", "/api/v1/vendors/me/bookings");
  const vendorSees = (vendorView.body?.data || []).find((b) => b.id === target.id);
  if (vendorSees) {
    // Vendor sees it only if it's their booking; the demo vendor may not be
    // the booking's vendor, so this is best-effort.
    eq(vendorSees.status, nextStatus, "vendor view sees new status");
  }

  // Restore
  await call(adm.token, "PATCH", `/api/v1/admin/bookings/${target.id}/status`, { status: originalStatus });
  return { bookingId: target.id, flipped: nextStatus };
});

// ----------------------------------------------------------------------------
// PLATFORM SETTINGS → public /about + /faqs + /subscription-plans
// ----------------------------------------------------------------------------
test("9. admin saves mission/social → public /about reflects", async (ctx) => {
  const { adm } = ctx;
  const marker = `INTEGRATION TEST mission ${Date.now()}`;
  const save = await call(adm.token, "PUT", "/api/v1/admin/settings", {
    mission: marker,
    socialInstagram: "https://instagram.com/dohuub_test",
  });
  must(save.status === 200, `settings save status ${save.status}`);

  // Public no-auth read
  const publicAbout = await call(null, "GET", "/api/v1/about");
  must(publicAbout.status === 200, `public /about status ${publicAbout.status}`);
  eq(publicAbout.body?.data?.mission, marker, "public mission");
  eq(publicAbout.body?.data?.socialInstagram, "https://instagram.com/dohuub_test", "public Instagram");
  return { marker };
});

test("10. admin creates FAQ → public /faqs includes it; DELETE removes it", async (ctx) => {
  const { adm } = ctx;
  const q = `INTEGRATION TEST FAQ ${Date.now()}`;
  const created = await call(adm.token, "POST", "/api/v1/admin/faqs", {
    question: q,
    answer: "Yes, this is a test answer that should appear in /faqs.",
  });
  must(created.status === 200 || created.status === 201, `FAQ create status ${created.status}`);
  const faqId = created.body?.data?.id;
  trackCleanup(() => call(adm.token, "DELETE", `/api/v1/admin/faqs/${faqId}`));

  const publicList = await call(null, "GET", "/api/v1/faqs");
  must(publicList.status === 200, `public faqs status ${publicList.status}`);
  const found = (publicList.body?.data || []).find((f) => f.id === faqId);
  must(found, "newly created FAQ not visible in public /faqs");

  const del = await call(adm.token, "DELETE", `/api/v1/admin/faqs/${faqId}`);
  must(del.status === 200, `FAQ DELETE status ${del.status}`);
  return { faqId };
});

test("11. public /subscription-plans returns active plans (created in migration)", async () => {
  const r = await call(null, "GET", "/api/v1/subscription-plans");
  must(r.status === 200, `subscription-plans status ${r.status}`);
  const plans = r.body?.data || [];
  must(plans.length >= 1, "no subscription plans returned");
  return { count: plans.length };
});

// ----------------------------------------------------------------------------
// REGIONS — admin create + bulk + public read
// ----------------------------------------------------------------------------
test("12. admin creates region → public /regions includes it; bulk toggle works", async (ctx) => {
  const { adm } = ctx;
  const stamp = Date.now();
  const created = await call(adm.token, "POST", "/api/v1/admin/regions", {
    name: `Integration Test Region ${stamp}`,
    city: `IntegrationCity${stamp}`,
    state: "NY",
    country: "USA",
    countryCode: "US",
    isActive: true,
  });
  must(created.status === 200 || created.status === 201, `region create status ${created.status}`);
  const regionId = created.body?.data?.id;
  trackCleanup(() => call(adm.token, "DELETE", `/api/v1/admin/regions/${regionId}`));

  const publicList = await call(null, "GET", "/api/v1/regions?isActive=true&limit=500");
  const found = (publicList.body?.data || []).find((r) => r.id === regionId);
  must(found, "newly created region not in public /regions list");

  // Bulk deactivate
  const bulk = await call(adm.token, "PATCH", "/api/v1/admin/regions/bulk", {
    ids: [regionId],
    isActive: false,
  });
  must(bulk.status === 200, `bulk patch status ${bulk.status}`);

  const after = await call(null, "GET", `/api/v1/regions?isActive=true&limit=500`);
  const stillPresent = (after.body?.data || []).some((r) => r.id === regionId);
  must(!stillPresent, "bulk-deactivated region still appears in active list");

  await call(adm.token, "DELETE", `/api/v1/admin/regions/${regionId}`);
  return { regionId };
});

// ----------------------------------------------------------------------------
// SCHEDULED PUSH
// ----------------------------------------------------------------------------
test("13. admin schedules push → /admin/scheduled-pushes shows it; DELETE cancels", async (ctx) => {
  const { adm } = ctx;
  // Schedule 1 hour from now so cron doesn't try to send before we DELETE
  const when = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const created = await call(adm.token, "POST", "/api/v1/admin/scheduled-pushes", {
    title: "INTEGRATION TEST",
    body: "scheduled but will be cancelled",
    targetType: "ALL",
    scheduledFor: when,
  });
  must(created.status === 200 || created.status === 201, `scheduled push create ${created.status}`);
  const pushId = created.body?.data?.id;
  trackCleanup(() => call(adm.token, "DELETE", `/api/v1/admin/scheduled-pushes/${pushId}`));

  const list = await call(adm.token, "GET", "/api/v1/admin/scheduled-pushes");
  const found = (list.body?.data || []).find((p) => p.id === pushId);
  must(found, "scheduled push not visible in history");
  eq(found.status, "SCHEDULED", "scheduled status");

  const cancelled = await call(adm.token, "DELETE", `/api/v1/admin/scheduled-pushes/${pushId}`);
  must(cancelled.status === 200, `cancel status ${cancelled.status}`);

  const after = await call(adm.token, "GET", "/api/v1/admin/scheduled-pushes");
  const afterRow = (after.body?.data || []).find((p) => p.id === pushId);
  eq(afterRow?.status, "CANCELLED", "post-cancel status");
  return { pushId };
});

// ----------------------------------------------------------------------------
// CUSTOM REPORT BUILDER
// ----------------------------------------------------------------------------
test("14. admin POSTs /admin/reports/custom → returns aggregated metrics", async (ctx) => {
  const { adm } = ctx;
  const r = await call(adm.token, "POST", "/api/v1/admin/reports/custom", {
    dateRange: "30days",
    metrics: ["revenue", "bookings", "users", "vendors", "reviews"],
  });
  must(r.status === 200, `custom report status ${r.status}`);
  const d = r.body?.data;
  must(d, "no data returned from custom report");
  must(typeof d.bookings === "number", "custom report missing bookings number");
  must(typeof d.newUsers === "number", "custom report missing newUsers number");
  must(typeof d.newVendors === "number", "custom report missing newVendors number");
  return { revenue: d.revenue, bookings: d.bookings, users: d.totalUsers };
});

// ----------------------------------------------------------------------------
// USER COUNTS (push audience tile)
// ----------------------------------------------------------------------------
test("15. /admin/users/counts returns role split", async (ctx) => {
  const { adm } = ctx;
  const r = await call(adm.token, "GET", "/api/v1/admin/users/counts");
  must(r.status === 200, `user counts status ${r.status}`);
  const d = r.body?.data;
  must(d, "no data returned");
  must(typeof d.total === "number", "no total field");
  must(typeof d.customers === "number", "no customers field");
  must(typeof d.vendors === "number", "no vendors field");
  must(typeof d.admins === "number", "no admins field");
  return d;
});

// ----------------------------------------------------------------------------
// REWARDS TRANSACTIONS FEED + SUMMARY
// ----------------------------------------------------------------------------
test("16. /admin/rewards/transactions returns recent activity", async (ctx) => {
  const { adm } = ctx;
  const r = await call(adm.token, "GET", "/api/v1/admin/rewards/transactions?limit=5");
  must(r.status === 200, `rewards/transactions status ${r.status}`);
  const arr = r.body?.data || [];
  // Just verify the contract: every row has user info
  for (const t of arr) {
    must(typeof t.amount === "number", "missing amount");
    must(t.user, "missing user join");
  }
  return { count: arr.length };
});

test("17. /admin/rewards/summary returns period growth fields", async (ctx) => {
  const { adm } = ctx;
  const r = await call(adm.token, "GET", "/api/v1/admin/rewards/summary?timeRange=month");
  must(r.status === 200, `rewards/summary status ${r.status}`);
  const d = r.body?.data;
  must(d?.wallet, "missing wallet");
  must(d?.transactions, "missing transactions");
  must(d?.period, "missing period (new field from this audit)");
  must(typeof d.period.earnGrowthPct === "number", "no earnGrowthPct");
  must(typeof d.period.redeemGrowthPct === "number", "no redeemGrowthPct");
  return d.period;
});

// ----------------------------------------------------------------------------
// MICHELLE PROFILE DELETE cascades to listings (the new tx)
// ----------------------------------------------------------------------------
test("18. michelle profile DELETE cascades child listings to PAUSED (then restored)", async (ctx) => {
  const { adm } = ctx;
  const profiles = await call(adm.token, "GET", "/api/v1/admin/michelle-profiles?limit=50");
  const profile = (profiles.body?.data || [])[0];
  if (!profile) return { skipped: "no Michelle profile" };
  const profileId = profile.id;
  const cat = profile.categories?.[0]?.category || "CLEANING";

  // Create a temp listing to verify cascade
  const created = await call(adm.token, "POST", `/api/v1/admin/michelle-profiles/${profileId}/listings`, {
    category: cat,
    title: `CASCADE TEST ${Date.now()}`,
    description: "verify cascade pause on profile delete",
    price: 1,
    status: "ACTIVE",
  });
  must(created.status === 201, `seed listing status ${created.status}`);
  const listingId = created.body.data.id;

  trackCleanup(() => call(adm.token, "DELETE", `/api/v1/admin/michelle-profiles/${profileId}/listings/${cat}/${listingId}`));

  // Capture profile's current status so we can restore
  const before = await call(adm.token, "GET", `/api/v1/admin/michelle-profiles/${profileId}`);
  const beforeStatus = before.body?.data?.status;

  // DELETE = soft-delete + cascade
  const del = await call(adm.token, "DELETE", `/api/v1/admin/michelle-profiles/${profileId}`);
  must(del.status === 200, `michelle delete status ${del.status}`);

  // Listing should now be PAUSED
  const after = await call(adm.token, "GET", `/api/v1/admin/michelle-profiles/${profileId}/listings/${cat}/${listingId}`);
  must(after.body?.data?.status === "PAUSED", `expected PAUSED after profile delete, got ${after.body?.data?.status}`);

  // Restore profile back to APPROVED
  await call(adm.token, "PUT", `/api/v1/admin/michelle-profiles/${profileId}`, {
    status: beforeStatus || "APPROVED",
  });
  // Restore the test listing to ACTIVE then clean it up
  await call(adm.token, "PUT", `/api/v1/admin/michelle-profiles/${profileId}/listings/${cat}/${listingId}`, {
    status: "ACTIVE",
  });
  await call(adm.token, "DELETE", `/api/v1/admin/michelle-profiles/${profileId}/listings/${cat}/${listingId}`);
  return { profileId, listingId };
});

// ----------------------------------------------------------------------------
// Run all tests
// ----------------------------------------------------------------------------
async function main() {
  console.log(`API: ${API}\n`);
  console.log("Signing in test accounts...");
  const adm = await signin(ADMIN_EMAIL, ADMIN_PWD);
  const vendor = await signin(VENDOR_EMAIL, VENDOR_PWD);
  const cust = await signin(CUSTOMER_EMAIL, CUSTOMER_PWD);

  const vTok = vendor.token;
  // Resolve real ids for the test context
  const vMe = await call(vTok, "GET", "/api/v1/vendors/me");
  const vendorId = vMe.body?.data?.id;
  if (!vendorId) {
    console.error("Vendor /me did not return an id; suspending tests");
    process.exit(2);
  }
  const customerUserId = cust.userId;

  console.log(`  admin user: ${adm.email} (${adm.userId})`);
  console.log(`  vendor:     ${vendor.email} → vendorId ${vendorId}`);
  console.log(`  customer:   ${cust.email} (${customerUserId})`);

  const ctx = { adm, vTok, vendorId, customerUserId, cust };
  console.log(`\nRunning ${tests.length} scenarios...\n`);

  const results = [];
  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const t of tests) {
    const start = Date.now();
    try {
      const out = await t.fn(ctx);
      const elapsed = Date.now() - start;
      if (out?.skipped) {
        console.log(`  SKIP  ${t.name} (${out.skipped})`);
        skipped++;
        results.push({ name: t.name, status: "SKIP", reason: out.skipped, elapsedMs: elapsed });
      } else {
        console.log(`  PASS  ${t.name} (${elapsed}ms)`);
        passed++;
        results.push({ name: t.name, status: "PASS", out, elapsedMs: elapsed });
      }
    } catch (e) {
      const elapsed = Date.now() - start;
      console.log(`  FAIL  ${t.name} (${elapsed}ms)`);
      console.log(`        ${e.message}`);
      failed++;
      results.push({ name: t.name, status: "FAIL", error: e.message, elapsedMs: elapsed });
    }
  }

  // Final cleanup
  console.log("\nRunning cleanup hooks...");
  for (const fn of cleanup) {
    try {
      await fn();
    } catch {
      // swallow — cleanup is best effort
    }
  }

  console.log("\n========================================");
  console.log(`PASSED: ${passed}    FAILED: ${failed}    SKIPPED: ${skipped}    TOTAL: ${tests.length}`);
  console.log("========================================");

  if (failed > 0) {
    console.log("\nFailures:");
    for (const r of results.filter((r) => r.status === "FAIL")) {
      console.log(`  - ${r.name}: ${r.error}`);
    }
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Test harness crashed:", e);
  process.exit(2);
});
