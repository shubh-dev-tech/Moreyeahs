/**
 * Test Parent Theme Endpoints
 */

const WORDPRESS_URL = 'https://dev.moreyeahs.com';

async function testParentTheme() {
  console.log('🔍 Testing Parent Theme Endpoints...\n');
  
  try {
    // Test the parent theme test endpoint
    console.log('Testing parent theme test endpoint...');
    const testResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/parent-theme-test`);
    
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('✅ Parent theme test endpoint working!');
      console.log('Response:', JSON.stringify(testData, null, 2));
    } else {
      console.log(`❌ Parent theme test endpoint failed: HTTP ${testResponse.status}`);
    }
    
    // Test the site settings endpoint
    console.log('\nTesting site settings endpoint...');
    const settingsResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/site-settings-direct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    if (settingsResponse.ok) {
      const settingsData = await settingsResponse.json();
      console.log('✅ Site settings endpoint working!');
      console.log('Response:', JSON.stringify(settingsData, null, 2));
    } else {
      console.log(`❌ Site settings endpoint failed: HTTP ${settingsResponse.status}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testParentTheme();