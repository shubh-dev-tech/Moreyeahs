/**
 * Test localhost Next.js site
 */

async function testLocalhost() {
  try {
    console.log('Testing Next.js site on localhost:3002...');
    
    const response = await fetch('http://localhost:3002', {
      headers: {
        'Accept': 'text/html',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    console.log('✅ Next.js site is running successfully!');
    console.log(`Response status: ${response.status}`);
    console.log(`Content length: ${html.length} characters`);
    
    // Check if it contains expected content
    if (html.includes('MoreYeahs') || html.includes('Next.js')) {
      console.log('✅ Site content looks good!');
    } else {
      console.log('⚠️  Site loaded but content might be different than expected');
    }
    
    // Test API route
    try {
      const apiResponse = await fetch('http://localhost:3002/api/health');
      if (apiResponse.ok) {
        console.log('✅ API routes are working!');
      }
    } catch (apiError) {
      console.log('ℹ️  API health check not available (this might be expected)');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLocalhost();