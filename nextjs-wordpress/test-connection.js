/**
 * Test connection to the new WordPress URL
 */

const WORDPRESS_URL = 'https://dev.moreyeahs.com';

async function testConnection() {
  try {
    console.log('Testing connection to:', WORDPRESS_URL);
    
    // Test basic WordPress API
    const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ WordPress API connection successful!');
    console.log(`Found ${data.length} pages`);
    
    // Test custom endpoint
    const customResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages-with-blocks/home`);
    
    if (customResponse.ok) {
      const customData = await customResponse.json();
      console.log('✅ Custom API endpoint working!');
      console.log('Home page data available');
    } else {
      console.log('⚠️  Custom API endpoint not available (this might be expected)');
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\nPlease check:');
    console.log('1. Is https://dev.moreyeahs.com accessible?');
    console.log('2. Is WordPress running on that URL?');
    console.log('3. Are the REST API endpoints enabled?');
  }
}

testConnection();