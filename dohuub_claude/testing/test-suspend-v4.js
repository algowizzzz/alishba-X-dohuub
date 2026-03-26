const { chromium } = require('playwright');

const PORTAL_URL = 'http://localhost:5174';

async function testSuspendVendor() {
  console.log('==========================================');
  console.log('TEST: ADMIN SUSPEND VENDOR - V4 (Dialog Handler)');
  console.log('==========================================\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 300
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  const page = await context.newPage();

  // Handle native browser dialogs (confirm, alert, prompt)
  page.on('dialog', async dialog => {
    console.log('   [Dialog] Type: ' + dialog.type() + ' - Message: ' + dialog.message());
    await dialog.accept(); // Click "OK" on the confirmation
  });

  try {
    // Navigate to Admin Vendors page
    console.log('>> Navigating to Admin Vendors page...');
    await page.goto(PORTAL_URL + '/admin/vendors');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Find vendor cards
    const vendorCards = await page.locator('[class*="rounded-xl"][class*="border"]').filter({
      has: page.locator('button:has-text("Suspend")')
    }).all();
    console.log('   Found ' + vendorCards.length + ' vendor cards with Suspend button');

    if (vendorCards.length === 0) {
      console.log('❌ No vendor cards found with Suspend button');
      await browser.close();
      return;
    }

    const firstCard = vendorCards[0];

    // Get vendor name and initial status
    const vendorName = await firstCard.locator('button.text-left, a.text-left, h3, h4, h5').first().textContent().catch(() => 'Unknown');
    console.log('   First vendor: ' + vendorName.trim());

    // Get initial status from the badge
    const initialStatusBadge = await firstCard.locator('span.font-semibold').filter({
      hasText: /Active|Suspended|Trial|Inactive/
    }).textContent().catch(() => 'Unknown');
    console.log('   Initial status: ' + initialStatusBadge.trim());

    // Get initial stats
    const initialActiveCount = await page.locator('text=Active:').locator('..').locator('span.font-bold').textContent().catch(() => '?');
    const initialSuspendedCount = await page.locator('text=Suspended:').locator('..').locator('span.font-bold').textContent().catch(() => '?');
    console.log('   Initial stats - Active: ' + initialActiveCount.trim() + ', Suspended: ' + initialSuspendedCount.trim());

    // Take before screenshot
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/suspend-v4-before.png' });

    // Find and click the Suspend button
    console.log('\n>> Clicking Suspend button...');
    const suspendBtn = firstCard.locator('button:has-text("Suspend")');
    await suspendBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await suspendBtn.click();

    // Wait for the dialog to be handled and state to update
    await page.waitForTimeout(2000);

    // Check new status on the card
    const newStatusBadge = await firstCard.locator('span.font-semibold').filter({
      hasText: /Active|Suspended|Trial|Inactive/
    }).textContent().catch(() => 'Unknown');
    console.log('   New status: ' + newStatusBadge.trim());

    // Check if Unsuspend button is now visible
    const unsuspendBtn = firstCard.locator('button:has-text("Unsuspend")');
    const hasUnsuspendBtn = await unsuspendBtn.isVisible().catch(() => false);
    console.log('   Unsuspend button visible: ' + hasUnsuspendBtn);

    // Get new stats
    const newActiveCount = await page.locator('text=Active:').locator('..').locator('span.font-bold').textContent().catch(() => '?');
    const newSuspendedCount = await page.locator('text=Suspended:').locator('..').locator('span.font-bold').textContent().catch(() => '?');
    console.log('   New stats - Active: ' + newActiveCount.trim() + ', Suspended: ' + newSuspendedCount.trim());

    // Take after screenshot
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/suspend-v4-after.png' });

    // Verify the change
    if (newStatusBadge.trim() === 'Suspended' && hasUnsuspendBtn) {
      console.log('\n✅ SUCCESS: Vendor status changed to Suspended!');
    } else if (initialStatusBadge.trim() === newStatusBadge.trim()) {
      console.log('\n❌ FAILED: Status did not change');
    } else {
      console.log('\n⚠️ Status changed but unexpected result');
    }

    console.log('\n⏳ Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.log('❌ Error: ' + error.message);
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/suspend-v4-error.png' });
  }

  await browser.close();
}

testSuspendVendor().catch(console.error);
