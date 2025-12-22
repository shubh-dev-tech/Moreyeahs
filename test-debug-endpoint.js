/**
 * Test Debug Endpoint
 */

const WORDPRESS_URL = 'https://dev.moreyeahs.com';

async function testDebugEndpoint() {
  console.log('🔍 Testing Debug Endpoint...\n');
  
  try {
    // Test the debug endpoint
    console.log('Testing debug endpoint...');
    const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/debug-test`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Debug endpoint working!');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ Debug endpoint failed: HTTP ${response.status}`);
      const text = await response.text();
      console.log('Response:', text);
    }
    
    // Test the debug site settings endpoint
    console.log('\nTesting debug site settings endpoint...');
    const siteResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/site-settings-debug`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    if (siteResponse.ok) {
      const siteData = await siteResponse.json();
      console.log('✅ Debug site settings endpoint working!');
      console.log('Response:', JSON.stringify(siteData, null, 2));
    } else {
      console.log(`❌ Debug site settings endpoint failed: HTTP ${siteResponse.status}`);
      const text = await siteResponse.text();
      console.log('Response:', text);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDebugEndpoint();