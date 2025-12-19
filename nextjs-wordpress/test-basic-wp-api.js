/**
 * Test basic WordPress REST API to see if it's working at all
 */

const { WORDPRESS_API_URL } = require('./src/lib/env.ts');

async function testBasicEndpoints() {
  console.log('🚀 Testing basic WordPress REST API\n');
  console.log(`API Base URL: ${WORDPRESS_API_URL}`);

  // Test basic WordPress endpoints
  const endpoints = [
    '/wp/v2',
    '/wp/v2/posts',
    '/wp/v2/pages',
    '/wp/v2/categories'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n🧪 Testing GET ${endpoint}...`);
      
      const response = await fetch(`${WORDPRESS_API_URL}${endpoint}`);
      
      if (!response.ok) {
        console.log(`❌ ${endpoint} - HTTP ${response.status}: ${response.statusText}`);
        continue;
      }

      const result = await response.json();
      console.log(`✅ ${endpoint} - Success`);
      
      if (Array.isArray(result)) {
        console.log(`   Found ${result.length} items`);
      } else if (typeof result === 'object') {
        console.log(`   Response keys: ${Object.keys(result).join(', ')}`);
      }
      
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
  }

  console.log('\n🎉 Basic API testing completed!');
}

testBasicEndpoints().catch(console.error);