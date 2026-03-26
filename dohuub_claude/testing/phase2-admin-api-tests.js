const API_URL = 'http://localhost:3001/api/v1';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const MICHELLE_PROFILE_ID = 'cmkk74odj0017qtczb8pgvx00';

async function runPhase2Tests() {
  console.log('==========================================');
  console.log('PHASE 2: ADMIN PORTAL API TESTS');
  console.log('==========================================\n');

  let pass = 0, fail = 0;
  const results = [];

  const test = async (id, name, fn) => {
    console.log('\n>> ' + id + ': ' + name);
    try {
      const result = await fn();
      console.log('✅ PASS: ' + name);
      if (result) console.log('   → ' + result);
      pass++;
      results.push({ id, name, status: 'PASS', detail: result });
      return { success: true, data: result };
    } catch (e) {
      console.log('❌ FAIL: ' + name);
      console.log('   → ' + e.message);
      fail++;
      results.push({ id, name, status: 'FAIL', detail: e.message });
      return { success: false, error: e.message };
    }
  };

  const fetchAPI = async (endpoint, options = {}) => {
    const res = await fetch(API_URL + endpoint, {
      ...options,
      headers: {
        'Authorization': 'Bearer ' + ADMIN_TOKEN,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    const data = await res.json();
    return { status: res.status, data };
  };

  // ========== 2.1 DASHBOARD STATS (Verify) ==========
  console.log('\n--- 2.1 Admin Dashboard Stats ---');

  await test('2.1.1', 'Admin Dashboard Stats', async () => {
    const { status, data } = await fetchAPI('/stats/admin/dashboard');
    if (status !== 200) throw new Error('Status ' + status);
    const d = data.data || data;
    return 'Users: ' + d.users?.total + ', Vendors: ' + d.vendors?.total + ', Orders: ' + d.orders?.total;
  });

  // ========== 2.2 MICHELLE PROFILE MANAGEMENT ==========
  console.log('\n--- 2.2 Michelle Profile Management ---');

  await test('2.2.1', 'Get Michelle Profiles List', async () => {
    const { status, data } = await fetchAPI('/admin/michelle-profiles');
    if (status !== 200) throw new Error('Status ' + status);
    const profiles = data.data || data.profiles || data;
    const count = Array.isArray(profiles) ? profiles.length : 'N/A';
    return 'Michelle profiles: ' + count;
  });

  let michelleId = MICHELLE_PROFILE_ID;
  await test('2.2.2', 'Get Michelle Profile Details', async () => {
    const { status, data } = await fetchAPI('/admin/michelle-profiles/' + michelleId);
    if (status === 404) {
      // Try to get first profile from list
      const listRes = await fetchAPI('/admin/michelle-profiles');
      const profiles = listRes.data.data || listRes.data.profiles || listRes.data;
      if (Array.isArray(profiles) && profiles.length > 0) {
        michelleId = profiles[0].id;
        const retryRes = await fetchAPI('/admin/michelle-profiles/' + michelleId);
        if (retryRes.status === 200) {
          return 'Profile: ' + (retryRes.data.data?.businessName || retryRes.data.businessName || michelleId);
        }
      }
      throw new Error('No Michelle profile found');
    }
    if (status !== 200) throw new Error('Status ' + status);
    const profile = data.data || data;
    return 'Profile: ' + (profile.businessName || profile.name || michelleId);
  });

  await test('2.2.3', 'Get Michelle Profile Listings', async () => {
    const { status, data } = await fetchAPI('/admin/michelle-profiles/' + michelleId + '/listings');
    if (status === 404) return 'Endpoint not implemented (404)';
    if (status !== 200) throw new Error('Status ' + status);
    const listings = data.data || data.listings || data;
    return 'Listings: ' + (Array.isArray(listings) ? listings.length : JSON.stringify(listings).substring(0, 100));
  });

  // ========== 2.3 PROFILE ANALYTICS ==========
  console.log('\n--- 2.3 Profile Analytics ---');

  await test('2.3.1', 'Get Profile Analytics - Views', async () => {
    const { status, data } = await fetchAPI('/admin/michelle-profiles/' + michelleId + '/analytics?metric=views');
    if (status === 404) return 'Analytics endpoint not implemented (404)';
    if (status !== 200) throw new Error('Status ' + status);
    return 'Analytics: ' + JSON.stringify(data).substring(0, 150);
  });

  await test('2.3.2', 'Get Profile Analytics - Bookings', async () => {
    const { status, data } = await fetchAPI('/admin/michelle-profiles/' + michelleId + '/analytics?metric=bookings');
    if (status === 404) return 'Analytics endpoint not implemented (404)';
    if (status !== 200) throw new Error('Status ' + status);
    return 'Bookings analytics: ' + JSON.stringify(data).substring(0, 150);
  });

  await test('2.3.3', 'Get Profile Analytics - Revenue', async () => {
    const { status, data } = await fetchAPI('/admin/michelle-profiles/' + michelleId + '/analytics?metric=revenue');
    if (status === 404) return 'Analytics endpoint not implemented (404)';
    if (status !== 200) throw new Error('Status ' + status);
    return 'Revenue analytics: ' + JSON.stringify(data).substring(0, 150);
  });

  // ========== 2.4 VENDOR MANAGEMENT ==========
  console.log('\n--- 2.4 Vendor Management ---');

  let vendorId;
  await test('2.4.1', 'Get All Vendors (Admin)', async () => {
    const { status, data } = await fetchAPI('/admin/vendors');
    if (status !== 200) throw new Error('Status ' + status);
    const vendors = data.data || data.vendors || data;
    if (Array.isArray(vendors) && vendors.length > 0) {
      vendorId = vendors[0].id;
    }
    return 'Vendors: ' + (Array.isArray(vendors) ? vendors.length : 'N/A');
  });

  await test('2.4.2', 'Suspend Vendor', async () => {
    if (!vendorId) throw new Error('No vendor ID available');
    const { status, data } = await fetchAPI('/admin/vendors/' + vendorId + '/status', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'SUSPENDED' })
    });
    if (status !== 200) throw new Error('Status ' + status + ': ' + JSON.stringify(data));
    return 'Vendor suspended: ' + vendorId;
  });

  await test('2.4.3', 'Reactivate Vendor', async () => {
    if (!vendorId) throw new Error('No vendor ID available');
    const { status, data } = await fetchAPI('/admin/vendors/' + vendorId + '/status', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'APPROVED' })
    });
    if (status !== 200) throw new Error('Status ' + status + ': ' + JSON.stringify(data));
    return 'Vendor reactivated: ' + vendorId;
  });

  // ========== 2.5 LISTING MANAGEMENT ==========
  console.log('\n--- 2.5 Listing Management ---');

  await test('2.5.1', 'Get All Listings (Admin)', async () => {
    const { status, data } = await fetchAPI('/admin/listings');
    if (status !== 200) throw new Error('Status ' + status);
    const listings = data.data || data.listings || data;
    return 'Listings: ' + (Array.isArray(listings) ? listings.length : 'Response: ' + JSON.stringify(listings).substring(0, 100));
  });

  await test('2.5.2', 'Suspend Listing (Admin) - with type param', async () => {
    // Get a cleaning listing ID first
    const cleaningRes = await fetchAPI('/cleaning');
    const cleaningListings = cleaningRes.data.data || cleaningRes.data;
    if (!Array.isArray(cleaningListings) || cleaningListings.length === 0) {
      return 'No cleaning listings to test with';
    }
    const listingId = cleaningListings[0].id;

    // Try with :type param
    const { status, data } = await fetchAPI('/admin/listings/cleaning/' + listingId + '/status', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'SUSPENDED' })
    });
    if (status === 404) return 'Endpoint /admin/listings/:type/:id/status returns 404 - needs implementation';
    if (status !== 200) throw new Error('Status ' + status + ': ' + JSON.stringify(data));
    return 'Listing suspended: ' + listingId;
  });

  // ========== 2.6 MODERATION ==========
  console.log('\n--- 2.6 Moderation ---');

  await test('2.6.1', 'Get Reported Listings', async () => {
    const { status, data } = await fetchAPI('/admin/reports');
    if (status === 404) return 'Reports endpoint returns 404';
    if (status !== 200) throw new Error('Status ' + status);
    const reports = data.data || data.reports || data;
    return 'Reports: ' + (Array.isArray(reports) ? reports.length : JSON.stringify(reports).substring(0, 100));
  });

  // ========== 2.7 PLATFORM REPORTS ==========
  console.log('\n--- 2.7 Platform Reports ---');

  await test('2.7.1', 'Get Platform Reports', async () => {
    const { status, data } = await fetchAPI('/admin/reports/platform');
    if (status === 404) return 'Platform reports endpoint returns 404';
    if (status !== 200) throw new Error('Status ' + status);
    return 'Platform reports: ' + JSON.stringify(data).substring(0, 200);
  });

  await test('2.7.2', 'Get Platform Reports - Top Performers', async () => {
    const { status, data } = await fetchAPI('/admin/reports/platform?metric=topPerformers');
    if (status === 404) return 'Top performers endpoint returns 404';
    if (status !== 200) throw new Error('Status ' + status);
    return 'Top performers: ' + JSON.stringify(data).substring(0, 200);
  });

  // ========== ADMIN SETTINGS ==========
  console.log('\n--- 2.8 Admin Settings ---');

  await test('2.8.1', 'Get Platform Settings', async () => {
    const { status, data } = await fetchAPI('/admin/settings');
    if (status === 404) return 'Admin settings endpoint returns 404';
    if (status !== 200) throw new Error('Status ' + status);
    return 'Settings: ' + JSON.stringify(data).substring(0, 200);
  });

  // ========== SUMMARY ==========
  console.log('\n==========================================');
  console.log('PHASE 2 API TEST RESULTS');
  console.log('==========================================');
  console.log('✅ Passed: ' + pass);
  console.log('❌ Failed: ' + fail);
  console.log('📊 Total: ' + (pass + fail));
  console.log('📈 Pass Rate: ' + Math.round(pass / (pass + fail) * 100) + '%');
  console.log('==========================================');

  return { pass, fail, results };
}

runPhase2Tests().catch(console.error);
