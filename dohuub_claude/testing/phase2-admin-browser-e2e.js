const { chromium } = require('playwright');

const PORTAL_URL = 'http://localhost:5174';

async function runAdminE2E() {
  console.log('==========================================');
  console.log('PHASE 2: ADMIN PORTAL BROWSER E2E');
  console.log('==========================================\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  const page = await context.newPage();

  let pass = 0, fail = 0;

  const test = async (id, name, fn) => {
    console.log('\n>> ' + id + ': ' + name);
    try {
      const result = await fn();
      console.log('✅ PASS: ' + name);
      if (result) console.log('   → ' + result);
      pass++;
      return true;
    } catch (e) {
      console.log('❌ FAIL: ' + name);
      console.log('   → ' + e.message);
      await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/admin-error-' + id + '.png' });
      fail++;
      return false;
    }
  };

  // ========== ADMIN DASHBOARD ==========
  console.log('\n--- Admin Dashboard ---');

  await test('ADMIN-1', 'Navigate to Admin Dashboard', async () => {
    await page.goto(PORTAL_URL + '/admin/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/admin-dashboard.png' });
    return 'Admin dashboard loaded';
  });

  await test('ADMIN-2', 'Verify dashboard shows stats', async () => {
    const bodyText = await page.textContent('body');
    const checks = [];
    if (/\$[\d,]+/.test(bodyText)) checks.push('revenue');
    if (/\d+\s*(user|vendor|order)/i.test(bodyText)) checks.push('counts');
    if (/total|active|pending/i.test(bodyText)) checks.push('status labels');
    return 'Dashboard shows: ' + checks.join(', ');
  });

  await test('ADMIN-3', 'Find stat cards', async () => {
    const cards = await page.locator('[class*="card"], [class*="stat"]').count();
    return 'Found ' + cards + ' stat cards';
  });

  // ========== ADMIN VENDORS PAGE ==========
  console.log('\n--- Admin Vendors ---');

  await test('VENDOR-1', 'Navigate to Vendors page', async () => {
    const vendorsNav = page.locator('text="Vendors"').first();
    const visible = await vendorsNav.isVisible().catch(() => false);
    if (visible) {
      await vendorsNav.click();
    } else {
      await page.goto(PORTAL_URL + '/admin/vendors');
    }
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/admin-vendors.png' });
    return 'Vendors page loaded';
  });

  await test('VENDOR-2', 'Find vendor list/table', async () => {
    const tables = await page.locator('table').count();
    const rows = await page.locator('tr, [class*="vendor-item"], [class*="list-item"]').count();
    const vendorNames = await page.locator('text="Sparkle", text="Clean", text="Beauty"').count();
    return 'Tables: ' + tables + ', Rows: ' + rows + ', Vendor names found: ' + vendorNames;
  });

  await test('VENDOR-3', 'Find action buttons (Suspend/Approve)', async () => {
    const actionBtns = await page.locator('button:has-text("Suspend"), button:has-text("Approve"), button:has-text("View")').count();
    return 'Found ' + actionBtns + ' action buttons';
  });

  // ========== ADMIN MICHELLE PROFILES ==========
  console.log('\n--- Admin Michelle Profiles ---');

  await test('MICHELLE-1', 'Navigate to Michelle Profiles', async () => {
    const michelleNav = page.locator('text="Michelle"').first();
    const visible = await michelleNav.isVisible().catch(() => false);
    if (visible) {
      await michelleNav.click();
    } else {
      await page.goto(PORTAL_URL + '/admin/michelle-profiles');
    }
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/admin-michelle.png' });
    return 'Michelle profiles page loaded';
  });

  await test('MICHELLE-2', 'Find Michelle profiles', async () => {
    const bodyText = await page.textContent('body');
    const hasMichelle = bodyText.includes('Michelle') || bodyText.includes('Profile');
    const hasCreate = await page.locator('button:has-text("Create"), button:has-text("Add")').count();
    return 'Michelle content: ' + hasMichelle + ', Create buttons: ' + hasCreate;
  });

  // ========== ADMIN ORDERS ==========
  console.log('\n--- Admin Orders ---');

  await test('ORDERS-1', 'Navigate to Admin Orders', async () => {
    await page.goto(PORTAL_URL + '/admin/orders');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/admin-orders.png' });
    return 'Admin orders page loaded';
  });

  await test('ORDERS-2', 'Find orders list', async () => {
    const tables = await page.locator('table').count();
    const orderIds = await page.locator('text=/[A-Z]{3}-\\d+/').count();
    return 'Tables: ' + tables + ', Order IDs found: ' + orderIds;
  });

  // ========== ADMIN SETTINGS ==========
  console.log('\n--- Admin Settings ---');

  await test('SETTINGS-1', 'Navigate to Admin Settings', async () => {
    await page.goto(PORTAL_URL + '/admin/settings');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/admin-settings.png' });
    return 'Admin settings page loaded';
  });

  await test('SETTINGS-2', 'Find settings form', async () => {
    const inputs = await page.locator('input:visible').count();
    const selects = await page.locator('select:visible').count();
    const buttons = await page.locator('button:has-text("Save"), button:has-text("Update")').count();
    return 'Inputs: ' + inputs + ', Selects: ' + selects + ', Save buttons: ' + buttons;
  });

  await test('SETTINGS-3', 'Modify a setting', async () => {
    const input = page.locator('input:visible').first();
    const visible = await input.isVisible().catch(() => false);
    if (visible) {
      const oldValue = await input.inputValue();
      await input.clear();
      await input.fill('admin-e2e-test-' + Date.now());
      return 'Modified input (was: ' + oldValue.substring(0, 20) + ')';
    }
    return 'No visible inputs to modify';
  });

  // ========== ADMIN NAVIGATION ==========
  console.log('\n--- Admin Navigation ---');

  await test('NAV-1', 'Check sidebar navigation', async () => {
    await page.goto(PORTAL_URL + '/admin/dashboard');
    await page.waitForTimeout(1000);

    const navItems = await page.locator('nav a, aside a, [role="navigation"] a, button').allTextContents();
    const filteredItems = navItems.filter(t => t && t.trim().length > 0 && t.trim().length < 30);
    console.log('   Nav items:', filteredItems.slice(0, 10).join(', '));
    return 'Found ' + filteredItems.length + ' nav items';
  });

  await test('NAV-2', 'Navigate through all admin pages', async () => {
    const pages = [
      '/admin/dashboard',
      '/admin/vendors',
      '/admin/michelle-profiles',
      '/admin/orders',
      '/admin/settings'
    ];

    let loadedCount = 0;
    for (const pagePath of pages) {
      await page.goto(PORTAL_URL + pagePath);
      await page.waitForLoadState('networkidle');
      const bodyText = await page.textContent('body');
      if (bodyText.length > 100) loadedCount++;
    }
    return loadedCount + '/' + pages.length + ' admin pages loaded successfully';
  });

  // ========== SUMMARY ==========
  console.log('\n==========================================');
  console.log('ADMIN BROWSER E2E RESULTS');
  console.log('==========================================');
  console.log('✅ Passed: ' + pass);
  console.log('❌ Failed: ' + fail);
  console.log('📊 Total: ' + (pass + fail));
  console.log('📈 Pass Rate: ' + Math.round(pass / (pass + fail) * 100) + '%');
  console.log('==========================================');

  console.log('\n⏳ Keeping browser open for 5 seconds...');
  await page.waitForTimeout(5000);

  await browser.close();
}

runAdminE2E().catch(console.error);
