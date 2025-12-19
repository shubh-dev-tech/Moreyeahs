/**
 * Test script to verify POST method conversion
 * Run with: node test-post-methods.js
 */

const { WORDPRESS_API_URL } = require('./src/lib/env.ts');

async function testPostEndpoint(endpoint, data = {}) {
  try {
    console.log(`\n🧪 Testing POST ${endpoint}...`);
    
    const response = await fetch(`${WORDPRESS_API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`✅ ${endpoint} - Success`);
    console.log(`   Response type: ${Array.isArray(result) ? 'Array' : 'Object'}`);
    console.log(`   Data length: ${Array.isArray(result) ? result.length : Object.keys(result).length}`);
    
    return result;
  } catch (error) {
    console.log(`❌ ${endpoint} - Failed: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Testing POST method conversion for WordPress API endpoints\n');
  console.log(`API Base URL: ${WORDPRESS_API_URL}`);

  // Test custom endpoints
  await testPostEndpoint('/wp/v2/site-settings');
  await testPostEndpoint('/wp/v2/menus');
  await testPostEndpoint('/wp/v2/footer-widgets');
  await testPostEndpoint('/wp/v2/mega-menus');
  
  // Test new POST endpoints for standard data
  await testPostEndpoint('/wp/v2/posts-data', { per_page: 5 });
  await testPostEndpoint('/wp/v2/pages-data', { per_page: 3 });
  
  // Test single item endpoints
  await testPostEndpoint('/wp/v2/post-by-slug', { slug: 'hello-world' });
  await testPostEndpoint('/wp/v2/page-by-slug', { slug: 'sample-page' });
  
  // Test pages with blocks
  await testPostEndpoint('/wp/v2/pages-with-blocks/home');

  console.log('\n🎉 POST method testing completed!');
}

// Run the tests
runTests().catch(console.error);