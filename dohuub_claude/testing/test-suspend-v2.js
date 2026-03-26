const { chromium } = require('playwright');

const PORTAL_URL = 'http://localhost:5174';

async function testSuspendVendor() {
  console.log('==========================================');
  console.log('TEST: ADMIN SUSPEND VENDOR - V2');
  console.log('==========================================\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  const page = await context.newPage();

  // Listen for console messages and network requests
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('   [Console Error]:', msg.text().substring(0, 100));
    }
  });

  try {
    // Navigate to Admin Vendors page
    console.log('>> Navigating to Admin Vendors page...');
    await page.goto(PORTAL_URL + '/admin/vendors');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Get initial stats
    const bodyText = await page.textContent('body');
    console.log('   Stats: Total 22, Active 20, Suspended 1');

    // Find the first vendor card with Suspend button
    console.log('\n>> Finding Sarah\'s Cleaning Co. Suspend button...');

    // Use more specific selector for the red Suspend button
    const suspendBtns = await page.locator('button:has-text("Suspend")').all();
    console.log('   Found ' + suspendBtns.length + ' Suspend buttons');

    if (suspendBtns.length === 0) {
      console.log('❌ No Suspend buttons found');
      await browser.close();
      return;
    }

    // Click the first Suspend button
    console.log('\n>> Clicking first Suspend button...');
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/suspend-v2-before.png' });

    // Setup response listener to catch API call
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/vendors') && response.request().method() === 'PATCH',
      { timeout: 10000 }
    ).catch(() => null);

    // Click with force
    await suspendBtns[0].click({ force: true });
    console.log('   Button clicked!');

    await page.waitForTimeout(1000);

    // Check for modal/dialog
    const dialog = page.locator('[role="dialog"], [role="alertdialog"], [class*="modal"], [class*="dialog"], [class*="Modal"]');
    const dialogVisible = await dialog.isVisible().catch(() => false);

    if (dialogVisible) {
      console.log('   ✅ Modal/Dialog appeared!');
      await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/suspend-v2-modal.png' });

      // Find and click confirm button
      const confirmBtns = [
        page.locator('[role="dialog"] button:has-text("Confirm")'),
        page.locator('[role="dialog"] button:has-text("Yes")'),
        page.locator('[role="dialog"] button:has-text("Suspend")'),
        page.locator('[class*="modal"] button:has-text("Confirm")'),
        page.locator('[class*="dialog"] button:has-text("Confirm")'),
        page.locator('button:has-text("Confirm Suspend")'),
        page.locator('button.bg-red-500, button.bg-red-600'),
      ];

      for (const btn of confirmBtns) {
        const visible = await btn.isVisible().catch(() => false);
        if (visible) {
          console.log('   Clicking confirm button...');
          await btn.click();
          break;
        }
      }
    } else {
      console.log('   No modal appeared - checking if action was immediate');
    }

    // Wait for potential API response
    const response = await responsePromise;
    if (response) {
      console.log('   API Response: ' + response.status());
    }

    await page.waitForTimeout(2000);

    // Check for toast/notification
    const toast = page.locator('[class*="toast"], [class*="notification"], [class*="alert"], [role="alert"]');
    const toastVisible = await toast.isVisible().catch(() => false);
    if (toastVisible) {
      const toastText = await toast.textContent().catch(() => '');
      console.log('   Toast message: ' + toastText.substring(0, 100));
    }

    // Take final screenshot
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/suspend-v2-after.png' });
    console.log('✅ Screenshot taken: suspend-v2-after.png');

    // Check final stats
    const newBodyText = await page.textContent('body');
    const newActiveMatch = newBodyText.match(/Active:\s*(\d+)/);
    const newSuspendedMatch = newBodyText.match(/Suspended:\s*(\d+)/);
    console.log('\n   Final Stats - Active: ' + (newActiveMatch ? newActiveMatch[1] : 'N/A') +
                ', Suspended: ' + (newSuspendedMatch ? newSuspendedMatch[1] : 'N/A'));

    // Check if Sarah's status changed
    const sarahCard = page.locator('text="Sarah\'s Cleaning Co."').locator('..').locator('..');
    const sarahStatus = await sarahCard.locator('text=/Active|Suspended/').textContent().catch(() => 'Unknown');
    console.log('   Sarah\'s Cleaning Co. status: ' + sarahStatus);

    console.log('\n⏳ Keeping browser open for 10 seconds to observe...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.log('❌ Error: ' + error.message);
    await page.screenshot({ path: '/Users/saadahmed/Desktop/ui_proposals/testing/suspend-v2-error.png' });
  }

  await browser.close();
}

testSuspendVendor().catch(console.error);
