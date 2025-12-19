/**
 * Test Theme Active
 */

const WORDPRESS_URL = 'https://dev.moreyeahs.com';

async function testThemeActive() {
  console.log('🔍 Testing if Child Theme is Active...\n');
  
  try {
    const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/theme-test`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Child theme is active and loading!');
      console.log('Theme info:', JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ Theme test endpoint failed: HTTP ${response.status}`);
      const text = await response.text();
      console.log('Response:', text);
    }
    
    // Also check the homepage for the HTML comment
    console.log('\nChecking homepage for child theme comment...');
    const homeResponse = await fetch(WORDPRESS_URL);
    
    if (homeResponse.ok) {
      const html = await homeResponse.text();
      if (html.includes('<!-- Child theme is active and loading -->')) {
        console.log('✅ Found child theme comment in HTML');
      } else {
        console.log('❌ Child theme comment not found in HTML');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testThemeActive();