/**
 * Test Minimal Endpoint
 */

const WORDPRESS_URL = 'https://dev.moreyeahs.com';

async function testMinimal() {
  console.log('🔍 Testing Minimal Endpoint...\n');
  
  try {
    const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/minimal-test`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Minimal child theme functions loaded!');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ Minimal endpoint failed: HTTP ${response.status}`);
      const text = await response.text();
      console.log('Response:', text);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMinimal();