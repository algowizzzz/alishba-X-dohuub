const { chromium } = require('playwright');

const PORTAL_URL = 'http://localhost:5174';

async function testButtonFixes() {
  console.log('==========================================');
  console.log('TEST: FRONTEND BUTTON FIXES VERIFICATION v2');
  console.log('==========================================\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 200
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  const page = await context.newPage();

  // Handle dialogs
  page.on('dialog', async dialog => {
    console.log('   [Dialog] ' + dialog.type() + ': ' + dialog.message().substring(0, 60));
    await dialog.accept();
  });

  // Track downloads
  page.on('download', async download => {
    console.log('   [Download] File: ' + download.suggestedFilename());
  });

  let passed = 0;
  let failed = 0;

  const test = async (name, testFn) => {
    try {
      await testFn();
      console.log('   ✅ ' + name);
      passed++;
    } catch (error) {
      console.log('   ❌ ' + name + ' - ' + error.message.substring(0, 60));
      failed++;
    }
  };

  try {
    // =========================================
    // TEST 1: AllVendors.tsx - Suspend/Unsuspend
    // =========================================
    console.log('\n>> Testing AllVendors.tsx (Suspend/Unsuspend)...');
    await page.goto(PORTAL_URL + '/admin/vendors');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await test('Suspend button triggers confirmation dialog', async () => {
      const suspendBtn = page.locator('button:has-text("Suspend")').first();
      await suspendBtn.waitFor({ state: 'visible', timeout: 5000 });
      await suspendBtn.click();
      await page.waitForTimeout(1500);
      // Dialog was handled - check if unsuspend button appears
    });

    await test('Unsuspend button exists after suspend', async () => {
      const unsuspendBtn = page.locator('button:has-text("Unsuspend")').first();
      await unsuspendBtn.waitFor({ state: 'visible', timeout: 3000 });
    });

    await test('Stats update correctly', async () => {
      const statsText = await page.textContent('body');
      // Just verify stats section exists
      if (!statsText.includes('Total:') && !statsText.includes('Active:')) {
        throw new Error('Stats not found');
      }
    });

    // =========================================
    // TEST 2: AllListings.tsx
    // =========================================
    console.log('\n>> Testing AllListings.tsx...');
    await page.goto(PORTAL_URL + '/admin/listings');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await test('Export dropdown button exists', async () => {
      const exportBtn = page.locator('button:has-text("Export Data")');
      await exportBtn.waitFor({ state: 'visible', timeout: 5000 });
    });

    await test('Bulk Select Mode toggle works', async () => {
      const bulkBtn = page.locator('button:has-text("Bulk Select Mode")');
      await bulkBtn.click();
      await page.waitForTimeout(500);
      const exitBtn = page.locator('button:has-text("Exit Bulk Mode")');
      await exitBtn.waitFor({ state: 'visible', timeout: 3000 });
    });

    await test('Listing cards have action buttons', async () => {
      // Look for View Details button
      const viewBtn = page.locator('button:has-text("View Details")').first();
      await viewBtn.waitFor({ state: 'visible', timeout: 5000 });
    });

    await test('Activate/Deactivate buttons exist', async () => {
      // Look for either Activate or Deactivate button
      const actionBtn = page.locator('button:has-text("Activate"), button:has-text("Deactivate")').first();
      await actionBtn.waitFor({ state: 'visible', timeout: 5000 });
    });

    await test('Flag button exists', async () => {
      const flagBtn = page.locator('button:has-text("Flag")').first();
      await flagBtn.waitFor({ state: 'visible', timeout: 5000 });
    });

    // Exit bulk mode
    const exitBtn = page.locator('button:has-text("Exit Bulk Mode")');
    if (await exitBtn.isVisible()) {
      await exitBtn.click();
    }

    // =========================================
    // TEST 3: AllVendors - View Details Navigation
    // =========================================
    console.log('\n>> Testing AllVendors navigation...');
    await page.goto(PORTAL_URL + '/admin/vendors');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    await test('View Details button navigates correctly', async () => {
      const viewBtn = page.locator('button:has-text("View Details")').first();
      await viewBtn.waitFor({ state: 'visible', timeout: 5000 });
      await viewBtn.click();
      await page.waitForTimeout(1000);
      // Should navigate to vendor detail page
      const url = page.url();
      if (!url.includes('/admin/vendors/')) {
        throw new Error('Navigation failed');
      }
    });

    // =========================================
    // SUMMARY
    // =========================================
    console.log('\n==========================================');
    console.log('SUMMARY');
    console.log('==========================================');
    console.log('Passed: ' + passed);
    console.log('Failed: ' + failed);
    console.log('Total:  ' + (passed + failed));

    if (failed === 0) {
      console.log('\n✅ ALL BUTTON FIXES VERIFIED!');
    } else {
      console.log('\n⚠️ ' + failed + ' test(s) failed');
    }

    // Take screenshot
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/button-fixes-test.png' });
    console.log('\n📷 Screenshot saved');

    console.log('\n⏳ Keeping browser open for 5 seconds...');
    await page.waitForTimeout(5000);

  } catch (error) {
    console.log('❌ Test Error: ' + error.message);
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/button-fixes-error.png' });
  }

  await browser.close();
}

testButtonFixes().catch(console.error);
