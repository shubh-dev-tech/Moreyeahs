/**
 * Test Simple Endpoint
 */

const WORDPRESS_URL = 'https://dev.moreyeahs.com';

async function testSimpleEndpoint() {
  console.log('🔍 Testing Simple Endpoint...\n');
  
  try {
    const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/simple-test`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Simple endpoint working!');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ Simple endpoint failed: HTTP ${response.status}`);
      const text = await response.text();
      console.log('Response:', text);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSimpleEndpoint();