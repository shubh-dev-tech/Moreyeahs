/**
 * Test Vercel Deployment Issues
 * This script tests the exact configuration and data fetching that would happen on Vercel
 */

const WORDPRESS_URL = 'https://dev.moreyeahs.com';
const WORDPRESS_API_URL = `${WORDPRESS_URL}/wp-json`;

async function testWordPressConnection() {
  console.log('🔍 Testing WordPress Connection...\n');
  
  try {
    // Test basic WordPress API
    console.log('1. Testing basic WordPress REST API...');
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/pages`, {
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
    console.log('✅ Basic WordPress API working');
    console.log(`   Found ${data.length} pages`);
    
    // Test custom endpoints that the Next.js app uses
    console.log('\n2. Testing custom REST API endpoints...');
    
    const endpoints = [
      { path: '/wp/v2/site-settings', method: 'POST', description: 'Site Settings' },
      { path: '/wp/v2/menus', method: 'POST', description: 'Menus' },
      { path: '/wp/v2/mega-menus', method: 'POST', description: 'Mega Menus' },
      { path: '/wp/v2/footer-widgets', method: 'POST', description: 'Footer Widgets' },
      { path: '/wp/v2/pages-with-blocks/home', method: 'POST', description: 'Home Page with Blocks' },
      { path: '/wp/v2/posts-data', method: 'POST', description: 'Posts Data' },
      { path: '/wp/v2/categories-data', method: 'POST', description: 'Categories Data' },
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const testResponse = await fetch(`${WORDPRESS_API_URL}${endpoint.path}`, {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'NextJS-Vercel-Test/1.0',
          },
          body: JSON.stringify({}),
        });
        
        if (testResponse.ok) {
          const responseData = await testResponse.json();
          console.log(`✅ ${endpoint.description} - Working`);
          results.push({
            endpoint: endpoint.path,
            status: 'success',
            dataLength: Array.isArray(responseData) ? responseData.length : 'object'
          });
        } else {
          console.log(`⚠️  ${endpoint.description} - HTTP ${testResponse.status}`);
          results.push({
            endpoint: endpoint.path,
            status: 'error',
            error: `HTTP ${testResponse.status}`
          });
        }
      } catch (error) {
        console.log(`❌ ${endpoint.description} - Error: ${error.message}`);
        results.push({
          endpoint: endpoint.path,
          status: 'error',
          error: error.message
        });
      }
    }
    
    return { success: true, results };
    
  } catch (error) {
    console.error('❌ WordPress connection failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function testCORSHeaders() {
  console.log('\n🌐 Testing CORS Headers...\n');
  
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/site-settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://moreyeahsnew.vercel.app', // Simulate Vercel origin
      },
      body: JSON.stringify({}),
    });
    
    console.log('Response Headers:');
    console.log('- Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
    console.log('- Access-Control-Allow-Methods:', response.headers.get('Access-Control-Allow-Methods'));
    console.log('- Access-Control-Allow-Headers:', response.headers.get('Access-Control-Allow-Headers'));
    console.log('- Content-Type:', response.headers.get('Content-Type'));
    
    if (response.ok) {
      console.log('✅ CORS headers are properly configured');
      return true;
    } else {
      console.log(`⚠️  Response status: ${response.status}`);
      return false;
    }
    
  } catch (error) {
    console.error('❌ CORS test failed:', error.message);
    return false;
  }
}

async function testSpecificEndpoints() {
  console.log('\n🎯 Testing Specific Endpoints Used by Next.js...\n');
  
  const criticalEndpoints = [
    {
      name: 'Homepage Data',
      url: `${WORDPRESS_API_URL}/wp/v2/pages-with-blocks/home`,
      test: async (url) => {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        
        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            info: `Found ${data.blocks ? data.blocks.length : 0} blocks`
          };
        } else {
          return { success: false, error: `HTTP ${response.status}` };
        }
      }
    },
    {
      name: 'Site Settings (Logo/Favicon)',
      url: `${WORDPRESS_API_URL}/wp/v2/site-settings`,
      test: async (url) => {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        
        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            info: `Logo: ${data.logo ? 'Yes' : 'No'}, Favicon: ${data.favicon ? 'Yes' : 'No'}`
          };
        } else {
          return { success: false, error: `HTTP ${response.status}` };
        }
      }
    },
    {
      name: 'Navigation Menus',
      url: `${WORDPRESS_API_URL}/wp/v2/menus`,
      test: async (url) => {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        
        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            info: `Found ${Array.isArray(data) ? data.length : 0} menus`
          };
        } else {
          return { success: false, error: `HTTP ${response.status}` };
        }
      }
    }
  ];
  
  for (const endpoint of criticalEndpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`);
      const result = await endpoint.test(endpoint.url);
      
      if (result.success) {
        console.log(`✅ ${endpoint.name} - ${result.info}`);
      } else {
        console.log(`❌ ${endpoint.name} - ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name} - Error: ${error.message}`);
    }
  }
}

async function testNetworkLatency() {
  console.log('\n⏱️  Testing Network Latency (Vercel to WordPress)...\n');
  
  const testUrl = `${WORDPRESS_API_URL}/wp/v2/site-settings`;
  const tests = [];
  
  for (let i = 0; i < 5; i++) {
    const startTime = Date.now();
    
    try {
      const response = await fetch(testUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      const endTime = Date.now();
      const latency = endTime - startTime;
      
      tests.push({
        test: i + 1,
        latency,
        status: response.status,
        success: response.ok
      });
      
      console.log(`Test ${i + 1}: ${latency}ms (${response.status})`);
      
    } catch (error) {
      tests.push({
        test: i + 1,
        latency: null,
        status: 'error',
        success: false,
        error: error.message
      });
      
      console.log(`Test ${i + 1}: Error - ${error.message}`);
    }
  }
  
  const successfulTests = tests.filter(t => t.success);
  if (successfulTests.length > 0) {
    const avgLatency = successfulTests.reduce((sum, t) => sum + t.latency, 0) / successfulTests.length;
    console.log(`\nAverage latency: ${Math.round(avgLatency)}ms`);
    
    if (avgLatency > 5000) {
      console.log('⚠️  High latency detected - this could cause timeouts on Vercel');
    } else {
      console.log('✅ Latency is acceptable');
    }
  }
}

async function main() {
  console.log('🚀 Vercel Deployment Test for dev.moreyeahs.com\n');
  console.log('This test simulates the exact requests that Next.js makes on Vercel.\n');
  
  // Test basic connection
  const connectionResult = await testWordPressConnection();
  
  if (!connectionResult.success) {
    console.log('\n❌ Basic connection failed. This is likely the root cause of the Vercel issue.');
    console.log('\nPossible solutions:');
    console.log('1. Check if dev.moreyeahs.com is accessible from external servers');
    console.log('2. Verify WordPress is running and REST API is enabled');
    console.log('3. Check server firewall settings');
    console.log('4. Ensure SSL certificate is valid');
    return;
  }
  
  // Test CORS
  await testCORSHeaders();
  
  // Test specific endpoints
  await testSpecificEndpoints();
  
  // Test network performance
  await testNetworkLatency();
  
  console.log('\n📋 Summary and Recommendations:');
  console.log('1. If all tests pass, the issue might be with Vercel environment variables');
  console.log('2. Check Vercel deployment logs for specific error messages');
  console.log('3. Ensure NEXT_PUBLIC_WORDPRESS_URL is set correctly in Vercel');
  console.log('4. Verify that Vercel can reach dev.moreyeahs.com from their servers');
  console.log('5. Consider adding request logging to WordPress to see if requests are reaching the server');
  
  console.log('\n🔧 Next Steps:');
  console.log('1. Run this test from your local machine');
  console.log('2. Run this test from a different server/location');
  console.log('3. Check Vercel function logs');
  console.log('4. Add debug logging to your Next.js application');
}

main().catch(console.error);