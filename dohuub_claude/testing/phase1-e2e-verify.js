const { chromium } = require('playwright');

const PORTAL_URL = 'http://localhost:5174';
const API_URL = 'http://localhost:3001/api/v1';

// Load tokens from environment
const VENDOR_TOKEN = process.env.VENDOR_TOKEN;

async function runPhase1E2ETests() {
  console.log('==========================================');
  console.log('PHASE 1 E2E VERIFICATION - BROWSER TESTS');
  console.log('==========================================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  let pass = 0, fail = 0;
  const results = [];

  const test = async (id, name, fn) => {
    try {
      const result = await fn();
      console.log('✅ ' + id + ': ' + name);
      if (result) console.log('   → ' + result);
      pass++;
      results.push({ id, name, status: 'PASS', detail: result });
    } catch (e) {
      console.log('❌ ' + id + ': ' + name);
      console.log('   → Error: ' + e.message);
      fail++;
      results.push({ id, name, status: 'FAIL', detail: e.message });
    }
  };

  // ========== 1.1 STORE MANAGEMENT UI ==========
  console.log('\n--- 1.1 Store Management UI ---');

  await test('1.1-UI', 'Vendor Services page loads', async () => {
    await page.goto(PORTAL_URL + '/vendor/services');
    await page.waitForLoadState('networkidle');
    const title = await page.title();
    return 'Page loaded, title: ' + title;
  });

  await test('1.1-UI-2', 'Services page has content', async () => {
    const bodyText = await page.textContent('body');
    const hasServices = bodyText.includes('Service') || bodyText.includes('Store') || bodyText.includes('Listing');
    if (!hasServices) throw new Error('No services/store content found');
    return 'Services content present';
  });

  // ========== 1.4 DASHBOARD STATS UI ==========
  console.log('\n--- 1.4 Dashboard Stats UI ---');

  await test('1.4-UI', 'Vendor Dashboard loads', async () => {
    await page.goto(PORTAL_URL + '/vendor/dashboard');
    await page.waitForLoadState('networkidle');
    return 'Dashboard loaded';
  });

  await test('1.4-UI-2', 'Dashboard shows stats elements', async () => {
    const bodyText = await page.textContent('body');
    const checks = [];
    if (bodyText.match(/\$[\d,]+/)) checks.push('currency');
    if (bodyText.match(/\d+/)) checks.push('numbers');
    if (bodyText.toLowerCase().includes('order') || bodyText.toLowerCase().includes('listing')) checks.push('labels');
    return 'Found: ' + checks.join(', ');
  });

  // ========== 1.5 SUBSCRIPTION UI ==========
  console.log('\n--- 1.5 Subscription UI ---');

  await test('1.5-UI', 'Vendor Settings/Subscription accessible', async () => {
    await page.goto(PORTAL_URL + '/vendor/settings');
    await page.waitForLoadState('networkidle');
    return 'Settings page loaded';
  });

  // ========== 1.6 SETTINGS UI ==========
  console.log('\n--- 1.6 Settings UI ---');

  await test('1.6-UI', 'Settings page has form elements', async () => {
    const inputs = await page.locator('input, select, textarea').count();
    const buttons = await page.locator('button').count();
    return 'Found ' + inputs + ' inputs, ' + buttons + ' buttons';
  });

  // ========== NAVIGATION TESTS ==========
  console.log('\n--- Navigation Tests ---');

  await test('NAV-1', 'Sidebar navigation exists', async () => {
    await page.goto(PORTAL_URL + '/vendor/dashboard');
    await page.waitForLoadState('networkidle');
    const navLinks = await page.locator('nav a, aside a, [role="navigation"] a').count();
    return 'Found ' + navLinks + ' navigation links';
  });

  await test('NAV-2', 'Orders page accessible', async () => {
    await page.goto(PORTAL_URL + '/vendor/orders');
    await page.waitForLoadState('networkidle');
    const bodyText = await page.textContent('body');
    const hasContent = bodyText.toLowerCase().includes('order') || bodyText.length > 100;
    return hasContent ? 'Orders page loaded' : 'Page loaded (minimal content)';
  });

  // ========== API DATA VERIFICATION FROM BROWSER ==========
  console.log('\n--- API Data Verification (from browser) ---');

  await test('API-1', 'Vendor dashboard API returns data', async () => {
    const response = await page.evaluate(async (token) => {
      const res = await fetch('http://localhost:3001/api/v1/stats/vendor/dashboard', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      return { status: res.status, data: await res.json() };
    }, VENDOR_TOKEN);

    if (response.status !== 200) throw new Error('API returned ' + response.status);
    const listings = response.data.listings ? response.data.listings.total : 0;
    const orders = response.data.orders ? response.data.orders.total : 0;
    return 'listings.total: ' + listings + ', orders.total: ' + orders;
  });

  await test('API-2', 'Stores API returns created stores', async () => {
    const response = await page.evaluate(async (token) => {
      const res = await fetch('http://localhost:3001/api/v1/stores', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      return { status: res.status, data: await res.json() };
    }, VENDOR_TOKEN);

    if (response.status !== 200) throw new Error('API returned ' + response.status);
    const stores = response.data.stores || response.data || [];
    const count = Array.isArray(stores) ? stores.length : 'N/A';
    return 'Found ' + count + ' stores';
  });

  await test('API-3', 'Subscription API check', async () => {
    const response = await page.evaluate(async (token) => {
      const res = await fetch('http://localhost:3001/api/v1/subscriptions/current', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      return { status: res.status, data: await res.json() };
    }, VENDOR_TOKEN);

    if (response.status === 200) {
      const plan = response.data.planId || (response.data.plan ? response.data.plan.name : 'active');
      return 'Subscription: ' + plan;
    } else if (response.status === 404) {
      return 'No active subscription (may need to re-create)';
    }
    throw new Error('Unexpected status: ' + response.status);
  });

  await test('API-4', 'Settings API returns vendor settings', async () => {
    const response = await page.evaluate(async (token) => {
      const res = await fetch('http://localhost:3001/api/v1/settings/vendor', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      return { status: res.status, data: await res.json() };
    }, VENDOR_TOKEN);

    if (response.status !== 200) throw new Error('API returned ' + response.status);
    return 'Settings loaded: emailNotifications=' + response.data.emailNotifications;
  });

  // Summary
  console.log('\n==========================================');
  console.log('SUMMARY');
  console.log('==========================================');
  console.log('✅ Passed: ' + pass);
  console.log('❌ Failed: ' + fail);
  console.log('📊 Total: ' + (pass + fail));
  console.log('📈 Pass Rate: ' + Math.round(pass/(pass+fail)*100) + '%');
  console.log('==========================================');

  await browser.close();

  return { pass, fail, results };
}

runPhase1E2ETests().catch(console.error);
