const { chromium } = require('playwright');

const PORTAL_URL = 'http://localhost:5174';
const API_URL = 'http://localhost:3001';

async function runBrowserTests() {
  console.log('======================================');
  console.log('CHROME BROWSER MCP TESTS');
  console.log('======================================\n');

  // Launch visible Chrome browser
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500 // Slow down for visibility
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  let pass = 0, fail = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ ${name}`);
      pass++;
    } catch (e) {
      console.log(`❌ ${name} - ${e.message}`);
      fail++;
    }
  };

  // Test 1: Home Page
  await test('1. Home page loads', async () => {
    await page.goto(PORTAL_URL);
    await page.waitForLoadState('networkidle');
  });

  // Test 2: Vendor Login
  await test('2. Vendor login page', async () => {
    await page.goto(`${PORTAL_URL}/vendor/login`);
    await page.waitForLoadState('networkidle');
  });

  // Test 3: Vendor Dashboard
  await test('3. Vendor dashboard', async () => {
    await page.goto(`${PORTAL_URL}/vendor/dashboard`);
    await page.waitForLoadState('networkidle');
  });

  // Test 4: Vendor Services
  await test('4. Vendor services page', async () => {
    await page.goto(`${PORTAL_URL}/vendor/services`);
    await page.waitForLoadState('networkidle');
  });

  // Test 5: Vendor Orders
  await test('5. Vendor orders page', async () => {
    await page.goto(`${PORTAL_URL}/vendor/orders`);
    await page.waitForLoadState('networkidle');
  });

  // Test 6: Admin Login
  await test('6. Admin login page', async () => {
    await page.goto(`${PORTAL_URL}/admin/login`);
    await page.waitForLoadState('networkidle');
  });

  // Test 7: Admin Dashboard
  await test('7. Admin dashboard', async () => {
    await page.goto(`${PORTAL_URL}/admin/dashboard`);
    await page.waitForLoadState('networkidle');
  });

  // Test 8: Admin Vendors
  await test('8. Admin vendors page', async () => {
    await page.goto(`${PORTAL_URL}/admin/vendors`);
    await page.waitForLoadState('networkidle');
  });

  // Test 9: Admin Michelle Profiles
  await test('9. Admin Michelle profiles', async () => {
    await page.goto(`${PORTAL_URL}/admin/michelle-profiles`);
    await page.waitForLoadState('networkidle');
  });

  // Test 10: Admin Settings
  await test('10. Admin settings', async () => {
    await page.goto(`${PORTAL_URL}/admin/settings`);
    await page.waitForLoadState('networkidle');
  });

  // Summary
  console.log('\n======================================');
  console.log('SUMMARY');
  console.log('======================================');
  console.log(`✅ Passed: ${pass}`);
  console.log(`❌ Failed: ${fail}`);
  console.log(`📊 Total: ${pass + fail}`);
  console.log(`📈 Pass Rate: ${Math.round(pass/(pass+fail)*100)}%`);
  console.log('======================================');

  // Keep browser open for 3 seconds to view
  await page.waitForTimeout(3000);
  await browser.close();
}

runBrowserTests().catch(console.error);
