/**
 * Test localhost environment detection
 */

// Simulate different environments
function testEnvironmentDetection() {
  console.log('🚀 Testing Environment Detection\n');

  // Test server-side environment detection
  console.log('=== Server-side Environment ===');
  
  // Simulate different NODE_ENV values
  const originalNodeEnv = process.env.NODE_ENV;
  
  process.env.NODE_ENV = 'development';
  delete require.cache[require.resolve('./src/lib/env.ts')];
  const devEnv = require('./src/lib/env.ts');
  console.log('Development mode:');
  console.log(`  WORDPRESS_API_URL: ${devEnv.WORDPRESS_API_URL}`);
  console.log(`  IS_LOCAL: ${devEnv.IS_LOCAL}`);
  console.log(`  IS_DEVELOPMENT: ${devEnv.IS_DEVELOPMENT}`);

  // Test production environment
  process.env.NODE_ENV = 'production';
  delete require.cache[require.resolve('./src/lib/env.ts')];
  const prodEnv = require('./src/lib/env.ts');
  console.log('\nProduction mode:');
  console.log(`  WORDPRESS_API_URL: ${prodEnv.WORDPRESS_API_URL}`);
  console.log(`  IS_LOCAL: ${prodEnv.IS_LOCAL}`);
  console.log(`  IS_DEVELOPMENT: ${prodEnv.IS_DEVELOPMENT}`);

  // Restore original NODE_ENV
  process.env.NODE_ENV = originalNodeEnv;

  console.log('\n=== Expected Behavior ===');
  console.log('When running on localhost:3000:');
  console.log('  - Should use: http://localhost/moreyeahs-new/wp-json');
  console.log('  - IS_LOCAL should be true');
  console.log('\nWhen running on Vercel:');
  console.log('  - Should use: https://dev.moreyeahs.com/wp-json');
  console.log('  - IS_LOCAL should be false');

  console.log('\n🎉 Environment detection test completed!');
}

testEnvironmentDetection();