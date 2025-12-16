/**
 * Test environment detection
 */

// Simulate different environments
function testEnvironmentDetection() {
  console.log('Testing environment detection...\n');
  
  // Test 1: Local environment
  console.log('=== Test 1: Local Environment ===');
  process.env.NODE_ENV = 'development';
  delete process.env.VERCEL;
  
  // Import after setting env vars
  delete require.cache[require.resolve('./src/lib/env.ts')];
  
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('VERCEL:', process.env.VERCEL);
  console.log('Expected: Should use localhost URLs\n');
  
  // Test 2: Vercel environment
  console.log('=== Test 2: Vercel Environment ===');
  process.env.NODE_ENV = 'production';
  process.env.VERCEL = '1';
  
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('VERCEL:', process.env.VERCEL);
  console.log('Expected: Should use dev.moreyeahs.com URLs\n');
  
  // Test 3: Check current actual environment
  console.log('=== Current Environment ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('VERCEL:', process.env.VERCEL);
  console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
  console.log('NEXT_PUBLIC_WORDPRESS_URL:', process.env.NEXT_PUBLIC_WORDPRESS_URL);
  
  // Test URL selection logic
  const isVercel = process.env.VERCEL === '1';
  const isLocal = !isVercel && process.env.NODE_ENV === 'development';
  
  let expectedUrl;
  if (isLocal) {
    expectedUrl = 'http://localhost/moreyeahs-new/wp-json';
  } else {
    expectedUrl = 'https://dev.moreyeahs.com/wp-json';
  }
  
  console.log('\nEnvironment Detection:');
  console.log('Is Local:', isLocal);
  console.log('Is Vercel:', isVercel);
  console.log('Expected WordPress API URL:', expectedUrl);
}

testEnvironmentDetection();