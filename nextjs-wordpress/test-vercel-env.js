/**
 * Test Vercel Environment and Data Fetching
 * This script tests the exact configuration that would be used on Vercel
 */

// Simulate Vercel environment
process.env.VERCEL = '1';
process.env.VERCEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Import our environment detection
const { getEnvironmentConfig } = require('./src/lib/environment.ts');

async function testVercelEnvironment() {
  console.log('🔍 Testing Vercel Environment Configuration...\n');
  
  // Test environment detection
  const config = getEnvironmentConfig();
  
  console.log('Environment Configuration:');
  console.log('- Environment:', config.environment);
  console.log('- WordPress URL:', config.wordpressUrl);
  console.log('- WordPress API URL:', config.wordpressApiUrl);
  console.log('- Next.js URL:', config.nextjsUrl);
  console.log('- Is Production:', config.isProduction);
  console.log('- Is Development:', config.isDevelopment);
  console.log('');
  
  // Test actual API connection
  console.log('🌐 Testing API Connection...');
  
  try {
    const response = await fetch(`${config.wordpressApiUrl}/wp/v2/pages`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NextJS-Vercel-Test/1.0',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ WordPress API connection successful!');
    console.log(`   Found ${data.length} pages`);
    
    // Test custom endpoints
    console.log('\n🔧 Testing Custom Endpoints...');
    
    const endpoints = [
      '/wp/v2/site-settings',
      '/wp/v2/menus',
      '/wp/v2/mega-menus',
      '/wp/v2/footer-widgets',
      '/wp/v2/pages-with-blocks/home'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const testResponse = await fetch(`${config.wordpressApiUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({}),
        });
        
        if (testResponse.ok) {
          console.log(`✅ ${endpoint} - Working`);
        } else {
          console.log(`⚠️  ${endpoint} - HTTP ${testResponse.status}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint} - Error: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ WordPress API connection failed:', error.message);
    
    console.log('\n🔍 Debugging Information:');
    console.log('- Target URL:', config.wordpressApiUrl);
    console.log('- Environment Variables:');
    console.log('  - VERCEL:', process.env.VERCEL);
    console.log('  - VERCEL_ENV:', process.env.VERCEL_ENV);
    console.log('  - NODE_ENV:', process.env.NODE_ENV);
    console.log('  - NEXT_PUBLIC_WORDPRESS_URL:', process.env.NEXT_PUBLIC_WORDPRESS_URL);
    console.log('  - WORDPRESS_API_URL:', process.env.WORDPRESS_API_URL);
  }
}

// Test media URL transformation
function testMediaTransformation() {
  console.log('\n🖼️  Testing Media URL Transformation...');
  
  const { transformMediaUrl } = require('./src/lib/environment.ts');
  
  const testUrls = [
    'http://localhost/moreyeahs-new/wp-content/uploads/2024/01/image.jpg',
    'https://dev.moreyeahs.com/wp-content/uploads/2024/01/image.jpg',
    'https://moreyeahs.com/wp-content/uploads/2024/01/image.jpg',
    '/wp-content/uploads/2024/01/image.jpg',
  ];
  
  testUrls.forEach(url => {
    const transformed = transformMediaUrl(url);
    console.log(`Original: ${url}`);
    console.log(`Transformed: ${transformed}`);
    console.log('');
  });
}

async function main() {
  await testVercelEnvironment();
  testMediaTransformation();
  
  console.log('\n📋 Summary:');
  console.log('This test simulates the exact environment that Vercel will use.');
  console.log('If you see connection errors above, that\'s likely the issue on Vercel.');
  console.log('\nNext steps:');
  console.log('1. Ensure dev.moreyeahs.com is accessible from Vercel servers');
  console.log('2. Check CORS settings on WordPress');
  console.log('3. Verify custom REST API endpoints are registered');
  console.log('4. Check Vercel environment variables');
}

main().catch(console.error);