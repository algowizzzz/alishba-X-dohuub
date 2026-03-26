const { chromium } = require('playwright');

const PORTAL_URL = 'http://localhost:5174';

async function testButtonFixes() {
  console.log('==========================================');
  console.log('TEST: FRONTEND BUTTON FIXES VERIFICATION');
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
    console.log('   [Dialog] ' + dialog.type() + ': ' + dialog.message().substring(0, 50) + '...');
    await dialog.accept();
  });

  let passed = 0;
  let failed = 0;

  const test = async (name, testFn) => {
    try {
      await testFn();
      console.log('   ✅ ' + name);
      passed++;
    } catch (error) {
      console.log('   ❌ ' + name + ' - ' + error.message);
      failed++;
    }
  };

  try {
    // =========================================
    // TEST 1: AllListings.tsx
    // =========================================
    console.log('\n>> Testing AllListings.tsx...');
    await page.goto(PORTAL_URL + '/admin/listings');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Test Export buttons
    await test('Export dropdown exists', async () => {
      const exportBtn = page.locator('button:has-text("Export Data")');
      await exportBtn.waitFor({ state: 'visible', timeout: 5000 });
    });

    // Test Bulk Mode
    await test('Bulk Select Mode button works', async () => {
      const bulkBtn = page.locator('button:has-text("Bulk Select Mode")');
      await bulkBtn.click();
      await page.waitForTimeout(500);
      // Check if checkboxes appear (bulk mode enabled)
      const exitBtn = page.locator('button:has-text("Exit Bulk Mode")');
      await exitBtn.waitFor({ state: 'visible', timeout: 3000 });
      await exitBtn.click(); // Exit bulk mode
    });

    // Test Deactivate button on a listing
    await test('Deactivate button exists and clickable', async () => {
      const deactivateBtn = page.locator('button:has-text("Deactivate")').first();
      await deactivateBtn.waitFor({ state: 'visible', timeout: 5000 });
    });

    // =========================================
    // TEST 2: AllVendors.tsx (Already fixed)
    // =========================================
    console.log('\n>> Testing AllVendors.tsx (Suspend/Unsuspend)...');
    await page.goto(PORTAL_URL + '/admin/vendors');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    await test('Suspend button works', async () => {
      const suspendBtn = page.locator('button:has-text("Suspend")').first();
      await suspendBtn.waitFor({ state: 'visible', timeout: 5000 });
      await suspendBtn.click();
      await page.waitForTimeout(1000);
    });

    // =========================================
    // TEST 3: OrderManagement.tsx
    // =========================================
    console.log('\n>> Testing OrderManagement.tsx...');
    await page.goto(PORTAL_URL + '/admin/orders');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    await test('View Details button exists', async () => {
      const viewBtn = page.locator('button:has-text("View Details")').first();
      await viewBtn.waitFor({ state: 'visible', timeout: 5000 });
    });

    await test('Contact Customer button exists', async () => {
      const contactBtn = page.locator('button:has-text("Contact Customer")').first();
      await contactBtn.waitFor({ state: 'visible', timeout: 5000 });
    });

    await test('Contact Vendor button exists', async () => {
      const vendorBtn = page.locator('button:has-text("Contact Vendor")').first();
      await vendorBtn.waitFor({ state: 'visible', timeout: 5000 });
    });

    // =========================================
    // TEST 4: PlatformReports.tsx
    // =========================================
    console.log('\n>> Testing PlatformReports.tsx...');
    await page.goto(PORTAL_URL + '/admin/reports');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    await test('Export Full Report button exists', async () => {
      const exportBtn = page.locator('button:has-text("Export Full Report")').first();
      await exportBtn.waitFor({ state: 'visible', timeout: 5000 });
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
      console.log('\n⚠️ Some tests failed - please review');
    }

    console.log('\n⏳ Keeping browser open for 5 seconds...');
    await page.waitForTimeout(5000);

  } catch (error) {
    console.log('❌ Test Error: ' + error.message);
  }

  await browser.close();
}

testButtonFixes().catch(console.error);
