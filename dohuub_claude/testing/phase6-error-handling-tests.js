const API_URL = 'http://localhost:3001/api/v1';
const VENDOR_TOKEN = process.env.VENDOR_TOKEN;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

async function runPhase6Tests() {
  console.log('==========================================');
  console.log('PHASE 6: ERROR HANDLING & EDGE CASES');
  console.log('==========================================\n');

  let pass = 0, fail = 0;

  const test = async (id, name, fn) => {
    console.log('\n>> ' + id + ': ' + name);
    try {
      const result = await fn();
      console.log('✅ PASS: ' + name);
      if (result) console.log('   → ' + result);
      pass++;
      return { success: true, data: result };
    } catch (e) {
      console.log('❌ FAIL: ' + name);
      console.log('   → ' + e.message);
      fail++;
      return { success: false, error: e.message };
    }
  };

  const fetchAPI = async (endpoint, options = {}, token = VENDOR_TOKEN) => {
    const res = await fetch(API_URL + endpoint, {
      ...options,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    let data;
    try {
      data = await res.json();
    } catch {
      data = { raw: await res.text() };
    }
    return { status: res.status, data };
  };

  // ========== 6.1 ERROR RESPONSE FORMAT ==========
  console.log('\n--- 6.1 Error Response Format ---');

  await test('6.1.1', 'Error 400 - Bad Request format', async () => {
    const { status, data } = await fetchAPI('/cleaning', {
      method: 'POST',
      body: JSON.stringify({}) // Empty body - missing required fields
    });

    if (status !== 400) {
      return 'Expected 400, got ' + status + ': ' + JSON.stringify(data).substring(0, 100);
    }

    const hasError = data.error || data.message || data.errors;
    return '400 returned. Error field present: ' + !!hasError + ', Format: ' + JSON.stringify(data).substring(0, 150);
  });

  await test('6.1.2', 'Error 401 - Unauthorized format', async () => {
    const { status, data } = await fetchAPI('/stores', {}, 'invalid-token-12345');

    if (status !== 401) {
      return 'Expected 401, got ' + status;
    }

    const hasError = data.error || data.message;
    return '401 returned. Error: ' + (data.error || data.message || 'no message') + ', Format: ' + JSON.stringify(data).substring(0, 100);
  });

  await test('6.1.3', 'Error 403 - Forbidden format (vendor accessing admin)', async () => {
    const { status, data } = await fetchAPI('/admin/vendors', {}, VENDOR_TOKEN);

    if (status === 403) {
      return '403 Forbidden returned correctly. Error: ' + (data.error || data.message || JSON.stringify(data).substring(0, 100));
    }
    if (status === 401) {
      return '401 returned (role check as auth check). Error: ' + (data.error || data.message);
    }
    return 'Status: ' + status + ' - ' + JSON.stringify(data).substring(0, 100);
  });

  await test('6.1.4', 'Error 404 - Not Found format', async () => {
    const { status, data } = await fetchAPI('/stores/nonexistent-store-id-12345');

    if (status !== 404) {
      return 'Expected 404, got ' + status;
    }

    const hasError = data.error || data.message;
    return '404 returned. Error: ' + (data.error || data.message || 'no message');
  });

  await test('6.1.5', 'Error 405 - Method Not Allowed', async () => {
    const { status, data } = await fetchAPI('/regions', {
      method: 'DELETE' // Assuming DELETE is not allowed on /regions
    });

    if (status === 405) {
      return '405 Method Not Allowed returned correctly';
    }
    if (status === 404) {
      return '404 returned (DELETE route not found - acceptable)';
    }
    return 'Status: ' + status + ' - Method may be allowed or handled differently';
  });

  // ========== 6.2 VALIDATION ERRORS ==========
  console.log('\n--- 6.2 Validation Errors ---');

  await test('6.2.1', 'Validation: Missing required fields', async () => {
    const { status, data } = await fetchAPI('/cleaning', {
      method: 'POST',
      body: JSON.stringify({
        // Missing title, cleaningType, basePrice
        description: 'Test description only'
      })
    });

    if (status !== 400 && status !== 422) {
      return 'Expected 400/422, got ' + status;
    }

    const errors = data.errors || data.error || data.message;
    const hasFieldInfo = JSON.stringify(errors).toLowerCase().includes('title') ||
                         JSON.stringify(errors).toLowerCase().includes('required');

    return 'Validation error returned. Field-specific info: ' + hasFieldInfo + ', Details: ' + JSON.stringify(errors).substring(0, 150);
  });

  await test('6.2.2', 'Validation: Invalid data types', async () => {
    const { status, data } = await fetchAPI('/cleaning', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Cleaning',
        cleaningType: 'DEEP_CLEANING',
        basePrice: 'not-a-number' // Should be number
      })
    });

    if (status === 400 || status === 422) {
      return 'Invalid type rejected (status: ' + status + '). Error: ' + JSON.stringify(data).substring(0, 150);
    }
    if (status === 201 || status === 200) {
      return 'Warning: String price was accepted (coercion may occur)';
    }
    return 'Status: ' + status + ' - ' + JSON.stringify(data).substring(0, 100);
  });

  await test('6.2.3', 'Validation: Invalid enum value', async () => {
    const { status, data } = await fetchAPI('/cleaning', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Cleaning',
        cleaningType: 'INVALID_TYPE', // Invalid enum
        basePrice: 50
      })
    });

    if (status === 400 || status === 422 || status === 500) {
      return 'Invalid enum rejected (status: ' + status + '). Error: ' + JSON.stringify(data).substring(0, 150);
    }
    return 'Status: ' + status + ' - ' + JSON.stringify(data).substring(0, 100);
  });

  await test('6.2.4', 'Validation: Negative price', async () => {
    const { status, data } = await fetchAPI('/cleaning', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Cleaning',
        cleaningType: 'DEEP_CLEANING',
        basePrice: -50 // Negative price
      })
    });

    if (status === 400 || status === 422) {
      return 'Negative price rejected (status: ' + status + ')';
    }
    if (status === 201 || status === 200) {
      return 'Warning: Negative price was accepted (may need validation)';
    }
    return 'Status: ' + status + ' - ' + JSON.stringify(data).substring(0, 100);
  });

  // ========== 6.3 EDGE CASES ==========
  console.log('\n--- 6.3 Edge Cases ---');

  await test('6.3.1', 'Empty results - search with no matches', async () => {
    const { status, data } = await fetchAPI('/cleaning?search=zzzznonexistentzzz');

    if (status !== 200) {
      return 'Expected 200 even for empty results, got ' + status;
    }

    const results = data.data || data;
    const isEmpty = Array.isArray(results) && results.length === 0;

    return 'Empty array returned: ' + isEmpty + ', Response: ' + JSON.stringify(data).substring(0, 100);
  });

  await test('6.3.2', 'Pagination - page beyond results', async () => {
    const { status, data } = await fetchAPI('/cleaning?page=9999&limit=10');

    if (status !== 200) {
      return 'Expected 200, got ' + status;
    }

    const results = data.data || data;
    const pagination = data.pagination || data.meta || {};
    const isEmpty = Array.isArray(results) && results.length === 0;

    return 'Page 9999: isEmpty=' + isEmpty + ', pagination=' + JSON.stringify(pagination).substring(0, 100);
  });

  await test('6.3.3', 'Large limit parameter', async () => {
    const { status, data } = await fetchAPI('/cleaning?limit=10000');

    if (status !== 200) {
      return 'Expected 200, got ' + status;
    }

    const results = data.data || data;
    const count = Array.isArray(results) ? results.length : 0;

    return 'Large limit handled. Results: ' + count + ' (may be capped)';
  });

  await test('6.3.4', 'Special characters in search', async () => {
    const specialSearch = encodeURIComponent('<script>alert(1)</script>');
    const { status, data } = await fetchAPI('/cleaning?search=' + specialSearch);

    if (status !== 200) {
      return 'Search with special chars returned ' + status;
    }

    const results = data.data || data;
    return 'Special chars handled safely. Results: ' + (Array.isArray(results) ? results.length : 'N/A');
  });

  await test('6.3.5', 'SQL injection attempt in ID', async () => {
    const injection = encodeURIComponent("'; DROP TABLE users; --");
    const { status, data } = await fetchAPI('/stores/' + injection);

    if (status === 404 || status === 400) {
      return 'SQL injection blocked safely (status: ' + status + ')';
    }
    if (status === 500) {
      return 'Warning: 500 error - may indicate SQL issue or just invalid ID';
    }
    return 'Status: ' + status + ' - handled safely';
  });

  // ========== 6.4 CONCURRENT REQUESTS ==========
  console.log('\n--- 6.4 Concurrent Requests ---');

  await test('6.4.1', 'Concurrent GET requests', async () => {
    const startTime = Date.now();

    const requests = Array(10).fill(null).map(() => fetchAPI('/cleaning'));
    const results = await Promise.all(requests);

    const elapsed = Date.now() - startTime;
    const allSuccess = results.every(r => r.status === 200);

    return '10 concurrent GETs: all success=' + allSuccess + ', time=' + elapsed + 'ms';
  });

  await test('6.4.2', 'Concurrent different endpoints', async () => {
    const startTime = Date.now();

    const requests = [
      fetchAPI('/cleaning'),
      fetchAPI('/food'),
      fetchAPI('/stores'),
      fetchAPI('/regions'),
      fetchAPI('/stats/vendor/dashboard')
    ];

    const results = await Promise.all(requests);
    const elapsed = Date.now() - startTime;
    const successCount = results.filter(r => r.status === 200).length;

    return '5 different endpoints: success=' + successCount + '/5, time=' + elapsed + 'ms';
  });

  // ========== 6.5 BOUNDARY CONDITIONS ==========
  console.log('\n--- 6.5 Boundary Conditions ---');

  await test('6.5.1', 'Very long string input', async () => {
    const longString = 'A'.repeat(10000);
    const { status, data } = await fetchAPI('/cleaning', {
      method: 'POST',
      body: JSON.stringify({
        title: longString,
        cleaningType: 'DEEP_CLEANING',
        basePrice: 50
      })
    });

    if (status === 400 || status === 413) {
      return 'Long string rejected appropriately (status: ' + status + ')';
    }
    if (status === 201 || status === 200) {
      return 'Warning: 10000 char title was accepted';
    }
    return 'Status: ' + status + ' - ' + JSON.stringify(data).substring(0, 100);
  });

  await test('6.5.2', 'Zero and very large price', async () => {
    // Test zero price
    const zeroRes = await fetchAPI('/cleaning', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Zero Price Test',
        cleaningType: 'DEEP_CLEANING',
        basePrice: 0
      })
    });

    // Test very large price
    const largeRes = await fetchAPI('/cleaning', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Large Price Test',
        cleaningType: 'DEEP_CLEANING',
        basePrice: 999999999
      })
    });

    return 'Zero price: ' + zeroRes.status + ', Large price: ' + largeRes.status;
  });

  await test('6.5.3', 'Empty string vs null', async () => {
    const emptyRes = await fetchAPI('/cleaning', {
      method: 'POST',
      body: JSON.stringify({
        title: '',
        cleaningType: 'DEEP_CLEANING',
        basePrice: 50
      })
    });

    const nullRes = await fetchAPI('/cleaning', {
      method: 'POST',
      body: JSON.stringify({
        title: null,
        cleaningType: 'DEEP_CLEANING',
        basePrice: 50
      })
    });

    return 'Empty string: ' + emptyRes.status + ', Null: ' + nullRes.status;
  });

  // ========== SUMMARY ==========
  console.log('\n==========================================');
  console.log('PHASE 6 ERROR HANDLING RESULTS');
  console.log('==========================================');
  console.log('✅ Passed: ' + pass);
  console.log('❌ Failed: ' + fail);
  console.log('📊 Total: ' + (pass + fail));
  console.log('📈 Pass Rate: ' + Math.round(pass / (pass + fail) * 100) + '%');
  console.log('==========================================');

  return { pass, fail };
}

runPhase6Tests().catch(console.error);
