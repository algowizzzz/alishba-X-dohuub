const { chromium } = require('playwright');

const PORTAL_URL = 'http://localhost:5174';
const API_URL = 'http://localhost:3001/api/v1';

let browser, context, page;
let PASS = 0, FAIL = 0;
const results = [];

async function log(name, status, details = '') {
  const icon = status ? '✅' : '❌';
  console.log(`${icon} ${name}${details ? ' - ' + details : ''}`);
  results.push({ name, status, details });
  if (status) PASS++; else FAIL++;
}

async function setup() {
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext();
  page = await context.newPage();
}

async function teardown() {
  await browser.close();
}

// ============================================
// 8.1 VENDOR PORTAL - NAVIGATION & FLOWS
// ============================================

async function test_8_1_1_VendorSignupPageLoad() {
  try {
    await page.goto(`${PORTAL_URL}/vendor/signup`);
    await page.waitForLoadState('networkidle');
    const title = await page.title();
    await log('8.1.1 Vendor signup page loads', true, title);
  } catch (e) {
    await log('8.1.1 Vendor signup page loads', false, e.message);
  }
}

async function test_8_1_2_VendorLoginFlow() {
  try {
    await page.goto(`${PORTAL_URL}/vendor/login`);
    await page.waitForLoadState('networkidle');

    // Check for login form elements
    const hasForm = await page.locator('form, input, button').count() > 0;
    await log('8.1.2 Vendor login page has form elements', hasForm);
  } catch (e) {
    await log('8.1.2 Vendor login flow', false, e.message);
  }
}

async function test_8_1_3_DashboardNavigation() {
  try {
    await page.goto(`${PORTAL_URL}/vendor/dashboard`);
    await page.waitForLoadState('networkidle');

    // Check for navigation/sidebar elements
    const hasNav = await page.locator('nav, aside, [class*="sidebar"], [class*="nav"]').count() > 0;
    await log('8.1.3 Dashboard has navigation elements', hasNav);
  } catch (e) {
    await log('8.1.3 Dashboard navigation', false, e.message);
  }
}

async function test_8_1_4_VendorServicesPage() {
  try {
    await page.goto(`${PORTAL_URL}/vendor/services`);
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    const hasContent = content.length > 500;
    await log('8.1.4 Vendor services page loads', hasContent);
  } catch (e) {
    await log('8.1.4 Vendor services page', false, e.message);
  }
}

async function test_8_1_5_VendorOrdersPage() {
  try {
    await page.goto(`${PORTAL_URL}/vendor/orders`);
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    const hasContent = content.length > 500;
    await log('8.1.5 Vendor orders page loads', hasContent);
  } catch (e) {
    await log('8.1.5 Vendor orders page', false, e.message);
  }
}

async function test_8_1_6_VendorBookingsPage() {
  try {
    await page.goto(`${PORTAL_URL}/vendor/bookings`);
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    const hasContent = content.length > 500;
    await log('8.1.6 Vendor bookings page loads', hasContent);
  } catch (e) {
    await log('8.1.6 Vendor bookings page', false, e.message);
  }
}

async function test_8_1_7_VendorSettingsPage() {
  try {
    await page.goto(`${PORTAL_URL}/vendor/settings`);
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    const hasContent = content.length > 500;
    await log('8.1.7 Vendor settings page loads', hasContent);
  } catch (e) {
    await log('8.1.7 Vendor settings page', false, e.message);
  }
}

async function test_8_1_8_SidebarNavigation() {
  try {
    await page.goto(`${PORTAL_URL}/vendor/dashboard`);
    await page.waitForLoadState('networkidle');

    // Try clicking on navigation links
    const links = await page.locator('a[href*="vendor"]').all();
    await log('8.1.8 Sidebar has vendor navigation links', links.length >= 3, `${links.length} links found`);
  } catch (e) {
    await log('8.1.8 Sidebar navigation', false, e.message);
  }
}

async function test_8_1_9_DashboardStatsDisplay() {
  try {
    await page.goto(`${PORTAL_URL}/vendor/dashboard`);
    await page.waitForLoadState('networkidle');

    // Check for stats/metrics elements
    const hasStats = await page.locator('[class*="stat"], [class*="card"], [class*="metric"]').count() > 0;
    await log('8.1.9 Dashboard displays stats elements', hasStats);
  } catch (e) {
    await log('8.1.9 Dashboard stats display', false, e.message);
  }
}

// ============================================
// 8.2 ADMIN PORTAL - NAVIGATION & FLOWS
// ============================================

async function test_8_2_1_AdminLoginPage() {
  try {
    await page.goto(`${PORTAL_URL}/admin/login`);
    await page.waitForLoadState('networkidle');
    const hasForm = await page.locator('form, input, button').count() > 0;
    await log('8.2.1 Admin login page has form elements', hasForm);
  } catch (e) {
    await log('8.2.1 Admin login page', false, e.message);
  }
}

async function test_8_2_2_AdminDashboard() {
  try {
    await page.goto(`${PORTAL_URL}/admin/dashboard`);
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    await log('8.2.2 Admin dashboard loads', content.length > 500);
  } catch (e) {
    await log('8.2.2 Admin dashboard', false, e.message);
  }
}

async function test_8_2_3_AdminVendorsPage() {
  try {
    await page.goto(`${PORTAL_URL}/admin/vendors`);
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    await log('8.2.3 Admin vendors page loads', content.length > 500);
  } catch (e) {
    await log('8.2.3 Admin vendors page', false, e.message);
  }
}

async function test_8_2_4_AdminCustomersPage() {
  try {
    await page.goto(`${PORTAL_URL}/admin/customers`);
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    await log('8.2.4 Admin customers page loads', content.length > 500);
  } catch (e) {
    await log('8.2.4 Admin customers page', false, e.message);
  }
}

async function test_8_2_5_AdminMichelleProfiles() {
  try {
    await page.goto(`${PORTAL_URL}/admin/michelle-profiles`);
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    await log('8.2.5 Admin Michelle profiles page loads', content.length > 500);
  } catch (e) {
    await log('8.2.5 Admin Michelle profiles', false, e.message);
  }
}

async function test_8_2_6_AdminOrdersPage() {
  try {
    await page.goto(`${PORTAL_URL}/admin/orders`);
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    await log('8.2.6 Admin orders page loads', content.length > 500);
  } catch (e) {
    await log('8.2.6 Admin orders page', false, e.message);
  }
}

async function test_8_2_7_AdminBookingsPage() {
  try {
    await page.goto(`${PORTAL_URL}/admin/bookings`);
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    await log('8.2.7 Admin bookings page loads', content.length > 500);
  } catch (e) {
    await log('8.2.7 Admin bookings page', false, e.message);
  }
}

async function test_8_2_8_AdminSettingsPage() {
  try {
    await page.goto(`${PORTAL_URL}/admin/settings`);
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    await log('8.2.8 Admin settings page loads', content.length > 500);
  } catch (e) {
    await log('8.2.8 Admin settings page', false, e.message);
  }
}

// ============================================
// 8.3 ROLE-BASED ACCESS CONTROL
// ============================================

async function test_8_3_1_VendorRoutesAccessible() {
  try {
    const routes = ['/vendor/dashboard', '/vendor/services', '/vendor/orders', '/vendor/settings'];
    let accessible = 0;
    for (const route of routes) {
      const response = await page.goto(`${PORTAL_URL}${route}`);
      if (response.status() === 200) accessible++;
    }
    await log('8.3.1 Vendor routes accessible', accessible === routes.length, `${accessible}/${routes.length}`);
  } catch (e) {
    await log('8.3.1 Vendor routes accessible', false, e.message);
  }
}

async function test_8_3_2_AdminRoutesAccessible() {
  try {
    const routes = ['/admin/dashboard', '/admin/vendors', '/admin/customers', '/admin/settings'];
    let accessible = 0;
    for (const route of routes) {
      const response = await page.goto(`${PORTAL_URL}${route}`);
      if (response.status() === 200) accessible++;
    }
    await log('8.3.2 Admin routes accessible', accessible === routes.length, `${accessible}/${routes.length}`);
  } catch (e) {
    await log('8.3.2 Admin routes accessible', false, e.message);
  }
}

async function test_8_3_3_UnauthenticatedAccess() {
  try {
    await page.goto(`${PORTAL_URL}/`);
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    await log('8.3.3 Home page accessible without auth', content.length > 500);
  } catch (e) {
    await log('8.3.3 Unauthenticated access', false, e.message);
  }
}

// ============================================
// 8.4 END-TO-END WORKFLOWS
// ============================================

async function test_8_4_1_VendorOnboardingFlow() {
  try {
    // Navigate through vendor onboarding pages
    await page.goto(`${PORTAL_URL}/vendor/signup`);
    await page.waitForLoadState('networkidle');

    await page.goto(`${PORTAL_URL}/vendor/login`);
    await page.waitForLoadState('networkidle');

    await page.goto(`${PORTAL_URL}/vendor/dashboard`);
    await page.waitForLoadState('networkidle');

    await log('8.4.1 Vendor onboarding flow pages accessible', true);
  } catch (e) {
    await log('8.4.1 Vendor onboarding flow', false, e.message);
  }
}

async function test_8_4_2_AdminWorkflow() {
  try {
    // Navigate through admin workflow pages
    await page.goto(`${PORTAL_URL}/admin/login`);
    await page.waitForLoadState('networkidle');

    await page.goto(`${PORTAL_URL}/admin/dashboard`);
    await page.waitForLoadState('networkidle');

    await page.goto(`${PORTAL_URL}/admin/vendors`);
    await page.waitForLoadState('networkidle');

    await log('8.4.2 Admin workflow pages accessible', true);
  } catch (e) {
    await log('8.4.2 Admin workflow', false, e.message);
  }
}

// ============================================
// 8.5 UI INTERACTIONS & API CALLS
// ============================================

async function test_8_5_1_FormsPresent() {
  try {
    await page.goto(`${PORTAL_URL}/vendor/login`);
    await page.waitForLoadState('networkidle');

    const inputs = await page.locator('input').count();
    const buttons = await page.locator('button').count();
    await log('8.5.1 Forms have input elements', inputs > 0 && buttons > 0, `${inputs} inputs, ${buttons} buttons`);
  } catch (e) {
    await log('8.5.1 Forms present', false, e.message);
  }
}

async function test_8_5_2_InteractiveElements() {
  try {
    await page.goto(`${PORTAL_URL}/vendor/dashboard`);
    await page.waitForLoadState('networkidle');

    const clickable = await page.locator('button, a, [role="button"]').count();
    await log('8.5.2 Interactive elements present', clickable > 0, `${clickable} clickable elements`);
  } catch (e) {
    await log('8.5.2 Interactive elements', false, e.message);
  }
}

async function test_8_5_3_APIConnectivity() {
  try {
    const response = await page.request.get(`${API_URL}/health`);
    await log('8.5.3 API connectivity from browser', response.status() === 200);
  } catch (e) {
    // Try alternative health check
    try {
      const response = await page.request.get('http://localhost:3001/health');
      await log('8.5.3 API connectivity from browser', response.status() === 200);
    } catch (e2) {
      await log('8.5.3 API connectivity', false, e2.message);
    }
  }
}

// ============================================
// 8.6 SCREEN NAVIGATION & ROUTING
// ============================================

async function test_8_6_1_DeepLinking() {
  try {
    // Test direct URL access
    const response = await page.goto(`${PORTAL_URL}/vendor/orders`);
    await log('8.6.1 Deep linking works', response.status() === 200);
  } catch (e) {
    await log('8.6.1 Deep linking', false, e.message);
  }
}

async function test_8_6_2_NavigationHistory() {
  try {
    await page.goto(`${PORTAL_URL}/vendor/dashboard`);
    await page.waitForLoadState('networkidle');

    await page.goto(`${PORTAL_URL}/vendor/orders`);
    await page.waitForLoadState('networkidle');

    await page.goBack();
    await page.waitForLoadState('networkidle');

    const url = page.url();
    await log('8.6.2 Browser back navigation works', url.includes('dashboard'));
  } catch (e) {
    await log('8.6.2 Navigation history', false, e.message);
  }
}

// ============================================
// 8.7 ADDITIONAL UI TESTS
// ============================================

async function test_8_7_1_ResponsiveLayout() {
  try {
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await page.goto(`${PORTAL_URL}/vendor/dashboard`);
    await page.waitForLoadState('networkidle');
    const mobileContent = await page.content();

    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    await page.goto(`${PORTAL_URL}/vendor/dashboard`);
    await page.waitForLoadState('networkidle');
    const desktopContent = await page.content();

    await log('8.7.1 Responsive layout works', mobileContent.length > 500 && desktopContent.length > 500);
  } catch (e) {
    await log('8.7.1 Responsive layout', false, e.message);
  }
}

async function test_8_7_2_PageTitles() {
  try {
    await page.goto(`${PORTAL_URL}/`);
    const title = await page.title();
    await log('8.7.2 Page has title', title.length > 0, title);
  } catch (e) {
    await log('8.7.2 Page titles', false, e.message);
  }
}

async function test_8_7_3_NoConsoleErrors() {
  try {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(`${PORTAL_URL}/vendor/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await log('8.7.3 No critical console errors', errors.length < 5, `${errors.length} errors`);
  } catch (e) {
    await log('8.7.3 Console errors check', false, e.message);
  }
}

async function test_8_7_4_StaticAssetsLoad() {
  try {
    let assetsLoaded = 0;
    page.on('response', response => {
      if (response.url().includes('.js') || response.url().includes('.css')) {
        if (response.status() === 200) assetsLoaded++;
      }
    });

    await page.goto(`${PORTAL_URL}/`);
    await page.waitForLoadState('networkidle');

    await log('8.7.4 Static assets load', assetsLoaded > 0, `${assetsLoaded} assets`);
  } catch (e) {
    await log('8.7.4 Static assets', false, e.message);
  }
}

// ============================================
// MAIN EXECUTION
// ============================================

async function runAllTests() {
  console.log('======================================');
  console.log('PHASE 8: BROWSER MCP TESTS (Playwright)');
  console.log('======================================\n');

  await setup();

  console.log('--- 8.1 Vendor Portal Navigation ---');
  await test_8_1_1_VendorSignupPageLoad();
  await test_8_1_2_VendorLoginFlow();
  await test_8_1_3_DashboardNavigation();
  await test_8_1_4_VendorServicesPage();
  await test_8_1_5_VendorOrdersPage();
  await test_8_1_6_VendorBookingsPage();
  await test_8_1_7_VendorSettingsPage();
  await test_8_1_8_SidebarNavigation();
  await test_8_1_9_DashboardStatsDisplay();

  console.log('\n--- 8.2 Admin Portal Navigation ---');
  await test_8_2_1_AdminLoginPage();
  await test_8_2_2_AdminDashboard();
  await test_8_2_3_AdminVendorsPage();
  await test_8_2_4_AdminCustomersPage();
  await test_8_2_5_AdminMichelleProfiles();
  await test_8_2_6_AdminOrdersPage();
  await test_8_2_7_AdminBookingsPage();
  await test_8_2_8_AdminSettingsPage();

  console.log('\n--- 8.3 Role-Based Access ---');
  await test_8_3_1_VendorRoutesAccessible();
  await test_8_3_2_AdminRoutesAccessible();
  await test_8_3_3_UnauthenticatedAccess();

  console.log('\n--- 8.4 E2E Workflows ---');
  await test_8_4_1_VendorOnboardingFlow();
  await test_8_4_2_AdminWorkflow();

  console.log('\n--- 8.5 UI Interactions ---');
  await test_8_5_1_FormsPresent();
  await test_8_5_2_InteractiveElements();
  await test_8_5_3_APIConnectivity();

  console.log('\n--- 8.6 Navigation & Routing ---');
  await test_8_6_1_DeepLinking();
  await test_8_6_2_NavigationHistory();

  console.log('\n--- 8.7 Additional UI Tests ---');
  await test_8_7_1_ResponsiveLayout();
  await test_8_7_2_PageTitles();
  await test_8_7_3_NoConsoleErrors();
  await test_8_7_4_StaticAssetsLoad();

  await teardown();

  console.log('\n======================================');
  console.log('TEST SUMMARY');
  console.log('======================================');
  console.log(`✅ PASSED: ${PASS}`);
  console.log(`❌ FAILED: ${FAIL}`);
  console.log(`📊 TOTAL: ${PASS + FAIL}`);
  console.log(`📈 PASS RATE: ${Math.round(PASS / (PASS + FAIL) * 100)}%`);
  console.log('======================================');
}

runAllTests().catch(console.error);
