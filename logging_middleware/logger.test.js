const assert = require('assert');
const { log } = require('./logger');

// Store original fetch
const originalFetch = globalThis.fetch;

async function runTests() {
  console.log('Starting Logging Middleware Unit Tests...\n');

  // Test Case 1: Input Validation - Invalid Stack
  {
    console.log('Test 1: Fails on invalid stack');
    const result = await log('invalid_stack', 'info', 'service', 'Test message');
    assert.strictEqual(result, false, 'Should fail with invalid stack');
    console.log('✔ Passed');
  }

  // Test Case 2: Input Validation - Invalid Level
  {
    console.log('Test 2: Fails on invalid level');
    const result = await log('backend', 'invalid_level', 'service', 'Test message');
    assert.strictEqual(result, false, 'Should fail with invalid level');
    console.log('✔ Passed');
  }

  // Test Case 3: Input Validation - Empty Package
  {
    console.log('Test 3: Fails on empty package');
    const result = await log('backend', 'info', '', 'Test message');
    assert.strictEqual(result, false, 'Should fail with empty package');
    console.log('✔ Passed');
  }

  // Test Case 4: Console Fallback (No Access Token)
  {
    console.log('Test 4: Falls back to console when token is missing');
    const originalToken = process.env.ACCESS_TOKEN;
    delete process.env.ACCESS_TOKEN;
    delete process.env.NEXT_PUBLIC_ACCESS_TOKEN;

    const result = await log('backend', 'info', 'service', 'Console fallback test');
    assert.strictEqual(result, false, 'Should return false when token is missing');
    
    // Restore
    process.env.ACCESS_TOKEN = originalToken;
    console.log('✔ Passed');
  }

  // Set mock access token and api url for api tests
  process.env.ACCESS_TOKEN = 'mock-test-token';
  process.env.LOGS_API_URL = 'http://mock-api/logs';

  // Test Case 5: Successful Log transmission
  {
    console.log('Test 5: Transmits log successfully to Mock API');
    let callCount = 0;
    globalThis.fetch = async (url, options) => {
      callCount++;
      assert.strictEqual(url, 'http://mock-api/logs');
      assert.strictEqual(options.method, 'POST');
      assert.strictEqual(options.headers['Authorization'], 'Bearer mock-test-token');
      
      const body = JSON.parse(options.body);
      assert.strictEqual(body.stack, 'backend');
      assert.strictEqual(body.level, 'info');
      assert.strictEqual(body.package, 'service');
      assert.strictEqual(body.message, 'Mock message');
      
      return { ok: true, status: 200 };
    };

    const result = await log('backend', 'info', 'service', 'Mock message');
    assert.strictEqual(result, true, 'Should succeed when API returns 200');
    assert.strictEqual(callCount, 1, 'Should call fetch exactly once');
    console.log('✔ Passed');
  }

  // Test Case 6: Retry once on failure then success
  {
    console.log('Test 6: Retries once on failure and then succeeds');
    let callCount = 0;
    globalThis.fetch = async (url, options) => {
      callCount++;
      if (callCount === 1) {
        throw new Error('Network failure');
      }
      return { ok: true, status: 200 };
    };

    const result = await log('backend', 'info', 'service', 'Retry success message');
    assert.strictEqual(result, true, 'Should succeed on retry');
    assert.strictEqual(callCount, 2, 'Should call fetch twice (first failed, second succeeded)');
    console.log('✔ Passed');
  }

  // Test Case 7: Fails after retry
  {
    console.log('Test 7: Fails gracefully if retry also fails');
    let callCount = 0;
    globalThis.fetch = async (url, options) => {
      callCount++;
      throw new Error('Persistent network failure');
    };

    const result = await log('backend', 'info', 'service', 'Persistent failure message');
    assert.strictEqual(result, false, 'Should return false when retry fails');
    assert.strictEqual(callCount, 2, 'Should attempt calling fetch exactly twice');
    console.log('✔ Passed');
  }

  // Clean up
  globalThis.fetch = originalFetch;
  console.log('\nAll tests completed successfully!');
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  globalThis.fetch = originalFetch;
  process.exit(1);
});
