const { chromium } = require('playwright');

const PORTAL_URL = 'http://localhost:5174';

async function testSuspendVendor() {
  console.log('==========================================');
  console.log('TEST: ADMIN SUSPEND VENDOR - V3 (Network Watch)');
  console.log('==========================================\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 300
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  const page = await context.newPage();

  // Watch all network requests
  page.on('request', request => {
    if (request.method() !== 'GET') {
      console.log('   [Request] ' + request.method() + ' ' + request.url().substring(0, 80));
    }
  });

  page.on('response', response => {
    if (response.request().method() !== 'GET') {
      console.log('   [Response] ' + response.status() + ' ' + response.url().substring(0, 80));
    }
  });

  try {
    // Navigate to Admin Vendors page
    console.log('>> Navigating to Admin Vendors page...');
    await page.goto(PORTAL_URL + '/admin/vendors');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Get vendor names to track
    const vendorCards = await page.locator('[class*="rounded-lg"], [class*="border"]').filter({
      has: page.locator('button:has-text("Suspend")')
    }).all();
    console.log('   Found ' + vendorCards.length + ' vendor cards with Suspend button');

    // Get first vendor's current status
    const firstCard = vendorCards[0];
    const vendorName = await firstCard.locator('h3, h4, h5').first().textContent().catch(() => 'Unknown');
    const statusBadge = await firstCard.locator('[class*="text-green"], [class*="Active"]').textContent().catch(() => 'Unknown');
    console.log('   First vendor: ' + vendorName.trim() + ' - Status: ' + statusBadge.trim());

    // Take before screenshot
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/suspend-v3-before.png' });

    // Find and click the Suspend button in the first card
    console.log('\n>> Clicking Suspend button on first vendor...');
    const suspendBtn = firstCard.locator('button:has-text("Suspend")');
    await suspendBtn.scrollIntoViewIfNeeded();
    await suspendBtn.highlight();
    await page.waitForTimeout(500);

    // Click and wait for any response
    await suspendBtn.click();
    console.log('   Button clicked - waiting for response...');

    // Wait to see if anything happens
    await page.waitForTimeout(3000);

    // Check for any dialog/modal/alert
    const allElements = await page.locator('body').innerHTML();
    const hasModal = allElements.includes('role="dialog"') || allElements.includes('modal');
    const hasAlert = allElements.includes('role="alert"') || allElements.includes('toast');

    console.log('   Modal detected: ' + hasModal);
    console.log('   Alert/Toast detected: ' + hasAlert);

    // Try to find any visible modal and click confirm
    const possibleConfirmButtons = [
      'button:has-text("Confirm")',
      'button:has-text("Yes")',
      'button:has-text("OK")',
      '[role="dialog"] button:last-child',
      '.modal button.bg-red-500',
      '.modal button.bg-red-600',
    ];

    for (const selector of possibleConfirmButtons) {
      const btn = page.locator(selector).first();
      const visible = await btn.isVisible().catch(() => false);
      if (visible) {
        console.log('   Found confirm button: ' + selector);
        await btn.click();
        await page.waitForTimeout(2000);
        break;
      }
    }

    // Final screenshot
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/suspend-v3-after.png' });
    console.log('\n✅ Screenshots saved');

    // Check final status
    const newStatusBadge = await firstCard.locator('[class*="text-green"], [class*="text-red"], [class*="Active"], [class*="Suspended"]').textContent().catch(() => 'Unknown');
    console.log('   Final status: ' + newStatusBadge.trim());

    // Check stats
    const statsText = await page.textContent('body');
    const activeMatch = statsText.match(/Active:\s*(\d+)/);
    const suspendedMatch = statsText.match(/Suspended:\s*(\d+)/);
    console.log('   Stats - Active: ' + (activeMatch ? activeMatch[1] : 'N/A') + ', Suspended: ' + (suspendedMatch ? suspendedMatch[1] : 'N/A'));

    console.log('\n⏳ Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.log('❌ Error: ' + error.message);
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/suspend-v3-error.png' });
  }

  await browser.close();
}

testSuspendVendor().catch(console.error);
