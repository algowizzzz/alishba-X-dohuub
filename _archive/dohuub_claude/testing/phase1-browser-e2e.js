const { chromium } = require('playwright');

const PORTAL_URL = 'http://localhost:5174';
const API_URL = 'http://localhost:3001/api/v1';
const VENDOR_TOKEN = process.env.VENDOR_TOKEN;

async function runPhase1BrowserE2E() {
  console.log('==========================================');
  console.log('PHASE 1 TRUE E2E - BROWSER INTERACTION TESTS');
  console.log('==========================================\n');

  // Launch visible browser for debugging
  const browser = await chromium.launch({
    headless: false,
    slowMo: 300 // Slow down for visibility
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  const page = await context.newPage();

  let pass = 0, fail = 0;
  const results = [];

  const test = async (id, name, fn) => {
    console.log('\n>> Starting: ' + id + ' - ' + name);
    try {
      const result = await fn();
      console.log('✅ ' + id + ': ' + name);
      if (result) console.log('   → ' + result);
      pass++;
      results.push({ id, name, status: 'PASS', detail: result });
      return true;
    } catch (e) {
      console.log('❌ ' + id + ': ' + name);
      console.log('   → Error: ' + e.message);
      fail++;
      results.push({ id, name, status: 'FAIL', detail: e.message });
      return false;
    }
  };

  // ========== EXPLORE UI STRUCTURE ==========
  console.log('\n--- Exploring Vendor Portal UI Structure ---');

  await test('EXPLORE-1', 'Navigate to Vendor Services page', async () => {
    await page.goto(PORTAL_URL + '/vendor/services');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    return 'Page loaded';
  });

  await test('EXPLORE-2', 'Find all buttons on Services page', async () => {
    const buttons = await page.locator('button').all();
    const buttonTexts = [];
    for (const btn of buttons) {
      const text = await btn.textContent();
      if (text && text.trim()) buttonTexts.push(text.trim());
    }
    console.log('   Buttons found:', buttonTexts.slice(0, 10).join(', '));
    return 'Found ' + buttons.length + ' buttons';
  });

  await test('EXPLORE-3', 'Find links/navigation on page', async () => {
    const links = await page.locator('a').all();
    const linkTexts = [];
    for (const link of links) {
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      if (text && text.trim()) linkTexts.push(text.trim().substring(0, 30));
    }
    console.log('   Links found:', linkTexts.slice(0, 8).join(', '));
    return 'Found ' + links.length + ' links';
  });

  await test('EXPLORE-4', 'Find form inputs on page', async () => {
    const inputs = await page.locator('input, select, textarea').all();
    const inputInfo = [];
    for (const input of inputs) {
      const type = await input.getAttribute('type');
      const name = await input.getAttribute('name');
      const placeholder = await input.getAttribute('placeholder');
      inputInfo.push(type || name || placeholder || 'unknown');
    }
    console.log('   Inputs found:', inputInfo.slice(0, 10).join(', '));
    return 'Found ' + inputs.length + ' form inputs';
  });

  // ========== LOOK FOR CREATE/ADD BUTTONS ==========
  console.log('\n--- Looking for Create/Add Actions ---');

  await test('EXPLORE-5', 'Find Create/Add/New buttons', async () => {
    const createBtns = await page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New"), a:has-text("Create"), a:has-text("Add")').all();
    const texts = [];
    for (const btn of createBtns) {
      const text = await btn.textContent();
      texts.push(text.trim());
    }
    console.log('   Create/Add buttons:', texts.join(', ') || 'None found');
    return 'Found ' + createBtns.length + ' create/add buttons';
  });

  // ========== CHECK DASHBOARD ==========
  console.log('\n--- Exploring Dashboard ---');

  await test('EXPLORE-6', 'Navigate to Dashboard', async () => {
    await page.goto(PORTAL_URL + '/vendor/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Look for stats cards
    const cards = await page.locator('[class*="card"], [class*="stat"], [class*="metric"]').count();
    return 'Dashboard loaded, found ' + cards + ' card-like elements';
  });

  await test('EXPLORE-7', 'Find clickable elements on Dashboard', async () => {
    const clickable = await page.locator('button, a, [role="button"], [onclick]').all();
    const texts = [];
    for (const el of clickable.slice(0, 15)) {
      const text = await el.textContent();
      if (text && text.trim().length > 0 && text.trim().length < 50) {
        texts.push(text.trim());
      }
    }
    console.log('   Clickable:', texts.join(' | '));
    return 'Found ' + clickable.length + ' clickable elements';
  });

  // ========== CHECK SETTINGS PAGE ==========
  console.log('\n--- Exploring Settings Page ---');

  await test('EXPLORE-8', 'Navigate to Settings', async () => {
    await page.goto(PORTAL_URL + '/vendor/settings');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    return 'Settings page loaded';
  });

  await test('EXPLORE-9', 'Find form elements on Settings', async () => {
    const inputs = await page.locator('input, select, textarea').all();
    const buttons = await page.locator('button').all();

    // Get input details
    for (const input of inputs.slice(0, 5)) {
      const type = await input.getAttribute('type');
      const name = await input.getAttribute('name');
      const id = await input.getAttribute('id');
      console.log('   Input:', type, name || id || '');
    }

    // Get button texts
    const btnTexts = [];
    for (const btn of buttons.slice(0, 5)) {
      const text = await btn.textContent();
      if (text) btnTexts.push(text.trim());
    }
    console.log('   Buttons:', btnTexts.join(', '));

    return 'Found ' + inputs.length + ' inputs, ' + buttons.length + ' buttons';
  });

  // ========== TRY TO INTERACT WITH SETTINGS ==========
  console.log('\n--- Attempting Settings Interaction ---');

  await test('INTERACT-1', 'Toggle a switch/checkbox if present', async () => {
    // Look for switches, checkboxes, or toggle buttons
    const toggles = await page.locator('input[type="checkbox"], [role="switch"], [class*="switch"], [class*="toggle"]').all();

    if (toggles.length > 0) {
      const firstToggle = toggles[0];
      const beforeState = await firstToggle.isChecked().catch(() => null);
      await firstToggle.click();
      await page.waitForTimeout(500);
      const afterState = await firstToggle.isChecked().catch(() => null);
      return 'Toggle clicked. Before: ' + beforeState + ', After: ' + afterState;
    }
    return 'No toggles found to interact with';
  });

  await test('INTERACT-2', 'Click Save button if present', async () => {
    const saveBtn = await page.locator('button:has-text("Save"), button:has-text("Update"), button[type="submit"]').first();
    const isVisible = await saveBtn.isVisible().catch(() => false);

    if (isVisible) {
      await saveBtn.click();
      await page.waitForTimeout(1000);

      // Check for success message
      const successMsg = await page.locator('[class*="success"], [class*="toast"], [role="alert"]').textContent().catch(() => null);
      return 'Save clicked. Response: ' + (successMsg || 'No visible feedback');
    }
    return 'No save button visible';
  });

  // ========== CHECK ORDERS PAGE ==========
  console.log('\n--- Exploring Orders Page ---');

  await test('EXPLORE-10', 'Navigate to Orders', async () => {
    await page.goto(PORTAL_URL + '/vendor/orders');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const tables = await page.locator('table, [class*="table"], [class*="list"]').count();
    const rows = await page.locator('tr, [class*="row"], [class*="item"]').count();
    return 'Orders page loaded. Tables: ' + tables + ', Rows: ' + rows;
  });

  // ========== TAKE SCREENSHOT ==========
  await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/vendor-portal-screenshot.png', fullPage: true });
  console.log('\n📸 Screenshot saved to vendor-portal-screenshot.png');

  // Summary
  console.log('\n==========================================');
  console.log('EXPLORATION SUMMARY');
  console.log('==========================================');
  console.log('✅ Passed: ' + pass);
  console.log('❌ Failed: ' + fail);
  console.log('📊 Total: ' + (pass + fail));
  console.log('==========================================');

  console.log('\n⏳ Keeping browser open for 5 seconds for inspection...');
  await page.waitForTimeout(5000);

  await browser.close();
  return { pass, fail, results };
}

runPhase1BrowserE2E().catch(console.error);
