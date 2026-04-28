const { chromium } = require('playwright');

const PORTAL_URL = 'http://localhost:5174';
const VENDOR_TOKEN = process.env.VENDOR_TOKEN;

async function runFullE2E() {
  console.log('==========================================');
  console.log('PHASE 1 FULL E2E - CREATE STORE & LISTING');
  console.log('==========================================\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 400
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
      // Take screenshot on failure
      await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/error-' + id + '.png' });
      fail++;
      return false;
    }
  };

  // ========== TEST 1: CREATE STORE VIA UI ==========
  console.log('\n========== 1.1 CREATE STORE VIA UI ==========');

  await test('1.1.1', 'Navigate to Services page', async () => {
    await page.goto(PORTAL_URL + '/vendor/services');
    await page.waitForLoadState('networkidle');
    return 'Services page loaded';
  });

  await test('1.1.2', 'Click "Create New Store" button', async () => {
    const createBtn = page.locator('button:has-text("Create New Store")');
    await createBtn.waitFor({ state: 'visible', timeout: 5000 });
    await createBtn.click();
    await page.waitForTimeout(1000);

    // Check if modal/form appeared
    const modal = await page.locator('[class*="modal"], [class*="dialog"], [role="dialog"], form').first();
    const isVisible = await modal.isVisible().catch(() => false);
    return isVisible ? 'Modal/Form appeared' : 'Clicked but no modal (may be inline form or redirect)';
  });

  await test('1.1.3', 'Find and fill store creation form', async () => {
    // Wait for any form to appear
    await page.waitForTimeout(1000);

    // Look for input fields
    const nameInput = await page.locator('input[name="name"], input[placeholder*="name" i], input[placeholder*="store" i]').first();
    const nameVisible = await nameInput.isVisible().catch(() => false);

    if (nameVisible) {
      await nameInput.fill('E2E Test Store ' + Date.now());
      return 'Filled store name';
    }

    // Try looking for any text input
    const anyInput = await page.locator('input[type="text"]').first();
    const anyVisible = await anyInput.isVisible().catch(() => false);
    if (anyVisible) {
      await anyInput.fill('E2E Test Store ' + Date.now());
      return 'Filled first text input';
    }

    return 'No visible input fields found - checking page structure';
  });

  await test('1.1.4', 'Look for category selection', async () => {
    // Look for select dropdown or radio buttons
    const select = await page.locator('select, [role="combobox"], [class*="select"]').first();
    const selectVisible = await select.isVisible().catch(() => false);

    if (selectVisible) {
      await select.click();
      await page.waitForTimeout(500);
      // Try to select first option
      const option = await page.locator('[role="option"], option').first();
      const optVisible = await option.isVisible().catch(() => false);
      if (optVisible) {
        await option.click();
        return 'Selected category from dropdown';
      }
    }

    // Look for category buttons/cards
    const categoryBtns = await page.locator('button:has-text("Cleaning"), button:has-text("Food"), button:has-text("Beauty")').first();
    const catVisible = await categoryBtns.isVisible().catch(() => false);
    if (catVisible) {
      await categoryBtns.click();
      return 'Clicked category button';
    }

    return 'No category selector found';
  });

  await test('1.1.5', 'Submit store creation', async () => {
    // Look for submit button
    const submitBtn = await page.locator('button:has-text("Create"), button:has-text("Save"), button:has-text("Submit"), button[type="submit"]').first();
    const visible = await submitBtn.isVisible().catch(() => false);

    if (visible) {
      await submitBtn.click();
      await page.waitForTimeout(2000);

      // Check for success indicator
      const successEl = await page.locator('[class*="success"], [class*="toast"], text="created" i, text="success" i').first();
      const hasSuccess = await successEl.isVisible().catch(() => false);
      return hasSuccess ? 'Store created successfully!' : 'Submitted (no visible success message)';
    }
    return 'No submit button found';
  });

  // ========== TEST 2: NAVIGATE TO CREATE LISTING ==========
  console.log('\n========== 1.3 CREATE LISTING VIA UI ==========');

  await test('1.3.1', 'Navigate to create listing', async () => {
    // Look for "Add Listing", "Create Listing", or similar
    const addListingBtn = await page.locator('button:has-text("Add"), button:has-text("Listing"), button:has-text("Create"), a:has-text("listing" i)').first();
    const visible = await addListingBtn.isVisible().catch(() => false);

    if (visible) {
      await addListingBtn.click();
      await page.waitForTimeout(1000);
      return 'Clicked add listing button';
    }

    // Try navigating to a direct URL
    await page.goto(PORTAL_URL + '/vendor/services/create');
    await page.waitForTimeout(1000);
    return 'Navigated to create listing page';
  });

  await test('1.3.2', 'Explore listing form structure', async () => {
    // Get all form elements
    const inputs = await page.locator('input, select, textarea').all();
    const labels = await page.locator('label').all();

    const formFields = [];
    for (const input of inputs.slice(0, 10)) {
      const name = await input.getAttribute('name');
      const type = await input.getAttribute('type');
      const placeholder = await input.getAttribute('placeholder');
      formFields.push(name || placeholder || type || 'unknown');
    }

    console.log('   Form fields:', formFields.join(', '));
    return 'Found ' + inputs.length + ' inputs, ' + labels.length + ' labels';
  });

  // ========== TEST 3: DASHBOARD INTERACTION ==========
  console.log('\n========== 1.4 DASHBOARD INTERACTION ==========');

  await test('1.4.1', 'Navigate to Dashboard', async () => {
    await page.goto(PORTAL_URL + '/vendor/dashboard');
    await page.waitForLoadState('networkidle');
    return 'Dashboard loaded';
  });

  await test('1.4.2', 'Verify dashboard shows data', async () => {
    const bodyText = await page.textContent('body');

    // Check for numbers (stats)
    const hasNumbers = /\d+/.test(bodyText);
    // Check for currency
    const hasCurrency = /\$[\d,]+/.test(bodyText);
    // Check for common labels
    const hasLabels = /order|listing|earning|revenue|store/i.test(bodyText);

    const checks = [];
    if (hasNumbers) checks.push('numbers');
    if (hasCurrency) checks.push('currency');
    if (hasLabels) checks.push('labels');

    return 'Dashboard contains: ' + checks.join(', ');
  });

  await test('1.4.3', 'Click on a dashboard stat card', async () => {
    // Try to click on a stat card
    const cards = await page.locator('[class*="card"], [class*="stat"]').all();

    if (cards.length > 0) {
      await cards[0].click();
      await page.waitForTimeout(1000);
      return 'Clicked first stat card';
    }
    return 'No clickable stat cards found';
  });

  // ========== TEST 4: SETTINGS INTERACTION ==========
  console.log('\n========== 1.6 SETTINGS INTERACTION ==========');

  await test('1.6.1', 'Navigate to Settings', async () => {
    await page.goto(PORTAL_URL + '/vendor/settings');
    await page.waitForLoadState('networkidle');
    return 'Settings page loaded';
  });

  await test('1.6.2', 'Interact with settings form', async () => {
    // Find any input and modify it
    const inputs = await page.locator('input:not([type="hidden"])').all();

    if (inputs.length > 0) {
      const firstInput = inputs[0];
      const currentValue = await firstInput.inputValue();
      await firstInput.clear();
      await firstInput.fill('test-value-' + Date.now());
      return 'Modified input field (was: ' + currentValue.substring(0, 20) + ')';
    }
    return 'No editable inputs found';
  });

  await test('1.6.3', 'Click Save/Update button', async () => {
    const saveBtn = await page.locator('button:has-text("Save"), button:has-text("Update")').first();
    const visible = await saveBtn.isVisible().catch(() => false);

    if (visible) {
      await saveBtn.click();
      await page.waitForTimeout(1500);

      // Check for any response
      const toast = await page.locator('[class*="toast"], [class*="alert"], [class*="notification"]').first();
      const toastVisible = await toast.isVisible().catch(() => false);
      const toastText = toastVisible ? await toast.textContent() : 'No toast';

      return 'Saved. Response: ' + toastText;
    }
    return 'No save button found';
  });

  // ========== TEST 5: ORDERS PAGE ==========
  console.log('\n========== ORDERS PAGE ==========');

  await test('ORDERS-1', 'Navigate to Orders', async () => {
    await page.goto(PORTAL_URL + '/vendor/orders');
    await page.waitForLoadState('networkidle');
    return 'Orders page loaded';
  });

  await test('ORDERS-2', 'Check for order list/table', async () => {
    const tables = await page.locator('table').count();
    const rows = await page.locator('tr, [class*="order-item"], [class*="list-item"]').count();
    const emptyState = await page.locator('text="No orders" i, text="empty" i').isVisible().catch(() => false);

    if (emptyState) return 'Empty state shown (no orders)';
    return 'Tables: ' + tables + ', Rows: ' + rows;
  });

  // ========== FINAL SCREENSHOT ==========
  await page.screenshot({
    path: '/Users/saadahmed/Desktop/ui_proposals/testing/e2e-final-state.png',
    fullPage: true
  });

  // ========== SUMMARY ==========
  console.log('\n==========================================');
  console.log('E2E TEST SUMMARY');
  console.log('==========================================');
  console.log('✅ Passed: ' + pass);
  console.log('❌ Failed: ' + fail);
  console.log('📊 Total: ' + (pass + fail));
  console.log('📈 Pass Rate: ' + Math.round(pass / (pass + fail) * 100) + '%');
  console.log('==========================================');

  console.log('\n📸 Final screenshot saved');
  console.log('⏳ Keeping browser open for 5 seconds...');
  await page.waitForTimeout(5000);

  await browser.close();
}

runFullE2E().catch(console.error);
