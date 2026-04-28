const { chromium } = require('playwright');

const PORTAL_URL = 'http://localhost:5174';

async function testUnsuspendVendor() {
  console.log('==========================================');
  console.log('TEST: ADMIN UNSUSPEND VENDOR');
  console.log('==========================================\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 300
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  const page = await context.newPage();

  // Handle native browser dialogs
  page.on('dialog', async dialog => {
    console.log('   [Dialog] Type: ' + dialog.type() + ' - Message: ' + dialog.message());
    await dialog.accept();
  });

  try {
    // Navigate to Admin Vendors page
    console.log('>> Navigating to Admin Vendors page...');
    await page.goto(PORTAL_URL + '/admin/vendors');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Find vendor cards with Unsuspend button (suspended vendors)
    const suspendedCards = await page.locator('[class*="rounded-xl"][class*="border"]').filter({
      has: page.locator('button:has-text("Unsuspend")')
    }).all();
    console.log('   Found ' + suspendedCards.length + ' vendor cards with Unsuspend button');

    if (suspendedCards.length === 0) {
      console.log('   No suspended vendors found, let\'s suspend one first...');

      // Find and suspend a vendor first
      const activeCards = await page.locator('[class*="rounded-xl"][class*="border"]').filter({
        has: page.locator('button:has-text("Suspend")')
      }).all();

      if (activeCards.length > 0) {
        await activeCards[0].locator('button:has-text("Suspend")').click();
        await page.waitForTimeout(2000);
        console.log('   Suspended a vendor for testing');
      }
    }

    // Now find suspended vendor cards again
    const refreshedCards = await page.locator('[class*="rounded-xl"][class*="border"]').filter({
      has: page.locator('button:has-text("Unsuspend")')
    }).all();

    if (refreshedCards.length === 0) {
      console.log('❌ No suspended vendors available to unsuspend');
      await browser.close();
      return;
    }

    const firstSuspendedCard = refreshedCards[0];

    // Get vendor name and initial status
    const vendorName = await firstSuspendedCard.locator('button.text-left, a.text-left, h3, h4, h5').first().textContent().catch(() => 'Unknown');
    console.log('   Target vendor: ' + vendorName.trim());

    const initialStatus = await firstSuspendedCard.locator('span.font-semibold').filter({
      hasText: /Active|Suspended|Trial|Inactive/
    }).textContent().catch(() => 'Unknown');
    console.log('   Initial status: ' + initialStatus.trim());

    // Get initial stats
    const initialActiveCount = await page.locator('text=Active:').locator('..').locator('span.font-bold').textContent().catch(() => '?');
    const initialSuspendedCount = await page.locator('text=Suspended:').locator('..').locator('span.font-bold').textContent().catch(() => '?');
    console.log('   Initial stats - Active: ' + initialActiveCount.trim() + ', Suspended: ' + initialSuspendedCount.trim());

    // Take before screenshot
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/unsuspend-before.png' });

    // Click Unsuspend button
    console.log('\n>> Clicking Unsuspend button...');
    const unsuspendBtn = firstSuspendedCard.locator('button:has-text("Unsuspend")');
    await unsuspendBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await unsuspendBtn.click();

    // Wait for state to update
    await page.waitForTimeout(2000);

    // Check new status
    const newStatus = await firstSuspendedCard.locator('span.font-semibold').filter({
      hasText: /Active|Suspended|Trial|Inactive/
    }).textContent().catch(() => 'Unknown');
    console.log('   New status: ' + newStatus.trim());

    // Check if Suspend button is now visible
    const suspendBtn = firstSuspendedCard.locator('button:has-text("Suspend")');
    const hasSuspendBtn = await suspendBtn.isVisible().catch(() => false);
    console.log('   Suspend button visible: ' + hasSuspendBtn);

    // Get new stats
    const newActiveCount = await page.locator('text=Active:').locator('..').locator('span.font-bold').textContent().catch(() => '?');
    const newSuspendedCount = await page.locator('text=Suspended:').locator('..').locator('span.font-bold').textContent().catch(() => '?');
    console.log('   New stats - Active: ' + newActiveCount.trim() + ', Suspended: ' + newSuspendedCount.trim());

    // Take after screenshot
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/unsuspend-after.png' });

    // Verify the change
    if (newStatus.trim() === 'Active' && hasSuspendBtn) {
      console.log('\n✅ SUCCESS: Vendor status changed to Active!');
    } else if (initialStatus.trim() === newStatus.trim()) {
      console.log('\n❌ FAILED: Status did not change');
    } else {
      console.log('\n⚠️ Status changed but unexpected result');
    }

    console.log('\n⏳ Keeping browser open for 5 seconds...');
    await page.waitForTimeout(5000);

  } catch (error) {
    console.log('❌ Error: ' + error.message);
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/unsuspend-error.png' });
  }

  await browser.close();
}

testUnsuspendVendor().catch(console.error);
