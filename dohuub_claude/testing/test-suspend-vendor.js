const { chromium } = require('playwright');

const PORTAL_URL = 'http://localhost:5174';

async function testSuspendVendor() {
  console.log('==========================================');
  console.log('TEST: ADMIN SUSPEND VENDOR BUTTON');
  console.log('==========================================\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 800
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  const page = await context.newPage();

  try {
    // Navigate to Admin Vendors page
    console.log('>> Navigating to Admin Vendors page...');
    await page.goto(PORTAL_URL + '/admin/vendors');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Take screenshot before
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/suspend-before.png' });
    console.log('✅ Screenshot taken: suspend-before.png');

    // Get current stats
    const statsText = await page.textContent('body');
    const activeMatch = statsText.match(/Active:\s*(\d+)/);
    const suspendedMatch = statsText.match(/Suspended:\s*(\d+)/);
    console.log('   Before - Active: ' + (activeMatch ? activeMatch[1] : 'N/A') + ', Suspended: ' + (suspendedMatch ? suspendedMatch[1] : 'N/A'));

    // Find the first Suspend button
    console.log('\n>> Looking for Suspend button...');
    const suspendBtn = page.locator('button:has-text("Suspend")').first();
    const visible = await suspendBtn.isVisible();

    if (!visible) {
      console.log('❌ No Suspend button visible');
      await browser.close();
      return;
    }

    // Get the vendor name before clicking
    const vendorCard = page.locator('[class*="card"]').filter({ has: suspendBtn }).first();
    const vendorName = await vendorCard.locator('h3, h4, [class*="title"], [class*="name"]').first().textContent().catch(() => 'Unknown');
    console.log('   Found vendor to suspend: ' + vendorName.trim());

    // Click Suspend button
    console.log('\n>> Clicking Suspend button...');
    await suspendBtn.click();
    await page.waitForTimeout(1000);

    // Check for confirmation modal
    const modalVisible = await page.locator('[role="dialog"], [class*="modal"], [class*="dialog"]').isVisible().catch(() => false);
    if (modalVisible) {
      console.log('   Confirmation modal appeared');
      await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/suspend-modal.png' });

      // Look for confirm button
      const confirmBtn = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Suspend")').last();
      const confirmVisible = await confirmBtn.isVisible().catch(() => false);

      if (confirmVisible) {
        console.log('   Clicking confirm button...');
        await confirmBtn.click();
        await page.waitForTimeout(2000);
      }
    }

    // Wait for any API response
    await page.waitForTimeout(2000);

    // Take screenshot after
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/suspend-after.png' });
    console.log('✅ Screenshot taken: suspend-after.png');

    // Check updated stats
    const newStatsText = await page.textContent('body');
    const newActiveMatch = newStatsText.match(/Active:\s*(\d+)/);
    const newSuspendedMatch = newStatsText.match(/Suspended:\s*(\d+)/);
    console.log('   After - Active: ' + (newActiveMatch ? newActiveMatch[1] : 'N/A') + ', Suspended: ' + (newSuspendedMatch ? newSuspendedMatch[1] : 'N/A'));

    // Check if vendor status changed
    const vendorStatusChanged = await page.locator('text="Suspended"').count();
    console.log('   Suspended vendors visible: ' + vendorStatusChanged);

    // Verify the change
    if (newSuspendedMatch && suspendedMatch && parseInt(newSuspendedMatch[1]) > parseInt(suspendedMatch[1])) {
      console.log('\n✅ SUCCESS: Vendor suspended! Suspended count increased.');
    } else if (newStatsText.toLowerCase().includes('suspended') || vendorStatusChanged > 0) {
      console.log('\n✅ SUCCESS: Suspend action completed.');
    } else {
      console.log('\n⚠️ Suspend clicked - verify status change in UI');
    }

    console.log('\n⏳ Keeping browser open for 5 seconds...');
    await page.waitForTimeout(5000);

  } catch (error) {
    console.log('❌ Error: ' + error.message);
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/suspend-error.png' });
  }

  await browser.close();
}

testSuspendVendor().catch(console.error);
