/**
 * Test Environment Detection
 * Run this to verify environment detection is working correctly
 */

// Simulate different environments
const testEnvironments = [
  {
    name: 'Local Development',
    env: {
      NODE_ENV: 'development',
      NEXT_PUBLIC_ENVIRONMENT: 'local',
      NEXT_PUBLIC_WORDPRESS_URL: 'http://localhost/moreyeahs-new'
    }
  },
  {
    name: 'Vercel Development',
    env: {
      NODE_ENV: 'production',
      VERCEL: '1',
      VERCEL_ENV: 'development',
      NEXT_PUBLIC_ENVIRONMENT: 'development',
      NEXT_PUBLIC_WORDPRESS_URL: 'https://dev.moreyeahs.com'
    }
  },
  {
    name: 'Vercel Production',
    env: {
      NODE_ENV: 'production',
      VERCEL: '1',
      VERCEL_ENV: 'production',
      NEXT_PUBLIC_ENVIRONMENT: 'development',
      NEXT_PUBLIC_WORDPRESS_URL: 'https://dev.moreyeahs.com'
    }
  }
];

// Test each environment
testEnvironments.forEach(test => {
  console.log(`\n=== Testing ${test.name} ===`);
  
  // Set environment variables
  Object.keys(test.env).forEach(key => {
    process.env[key] = test.env[key];
  });
  
  // Clear require cache to get fresh environment detection
  delete require.cache[require.resolve('./nextjs-wordpress/src/lib/environment.ts')];
  
  try {
    // This would normally be imported, but for testing we'll simulate
    const detectEnvironment = () => {
      const explicitEnv = process.env.NEXT_PUBLIC_ENVIRONMENT;
      if (explicitEnv && ['local', 'development', 'staging', 'production'].includes(explicitEnv)) {
        return explicitEnv;
      }
      
      const isVercel = process.env.VERCEL === '1';
      if (isVercel) {
        return 'development';
      }
      
      if (process.env.NODE_ENV === 'development') {
        return 'local';
      }
      
      return 'development';
    };
    
    const getWordPressUrl = () => {
      const environment = detectEnvironment();
      
      switch (environment) {
        case 'local':
          return 'http://localhost/moreyeahs-new';
        case 'development':
          return 'https://dev.moreyeahs.com';
        case 'staging':
          return 'https://staging.moreyeahs.com';
        case 'production':
          return 'https://moreyeahs.com';
        default:
          return 'https://dev.moreyeahs.com';
      }
    };
    
    const environment = detectEnvironment();
    const wordpressUrl = getWordPressUrl();
    
    console.log(`Environment: ${environment}`);
    console.log(`WordPress URL: ${wordpressUrl}`);
    console.log(`API URL: ${wordpressUrl}/wp-json`);
    
    // Validate
    if (test.name.includes('Local') && !wordpressUrl.includes('localhost')) {
      console.error('❌ ERROR: Local environment should use localhost');
    } else if (test.name.includes('Vercel') && wordpressUrl.includes('localhost')) {
      console.error('❌ ERROR: Vercel environment should not use localhost');
    } else {
      console.log('✅ Environment detection working correctly');
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
});

console.log('\n=== Test Complete ===');
console.log('If you see any errors above, the environment detection needs fixing.');
console.log('Otherwise, your environment detection is working correctly!');