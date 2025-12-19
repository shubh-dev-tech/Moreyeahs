/**
 * Test the simple test endpoint
 */

const { WORDPRESS_API_URL } = require('./src/lib/env.ts');

async function testSimpleEndpoint() {
  try {
    console.log('🧪 Testing simple test endpoint...');
    
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/test-endpoint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Test endpoint - Success');
    console.log('Response:', result);
    
    return result;
  } catch (error) {
    console.log(`❌ Test endpoint - Error: ${error.message}`);
    return null;
  }
}

testSimpleEndpoint().catch(console.error);