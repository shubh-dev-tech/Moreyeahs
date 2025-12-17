/**
 * Test URL detection in the running Next.js app
 */

async function testUrlDetection() {
  try {
    console.log('Testing URL detection in Next.js app...\n');
    
    // Test the homepage to see what URLs it's using
    const response = await fetch('http://localhost:3002', {
      headers: {
        'Accept': 'text/html',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    console.log('✅ Next.js site is accessible');
    
    // Check for WordPress API calls in the page source
    if (html.includes('localhost/moreyeahs-new')) {
      console.log('✅ Found localhost WordPress URLs in page source');
    } else if (html.includes('dev.moreyeahs.com')) {
      console.log('⚠️  Found dev.moreyeahs.com URLs in page source');
    } else {
      console.log('ℹ️  No obvious WordPress URLs found in initial page source');
    }
    
    // Test a specific API endpoint if available
    try {
      const apiResponse = await fetch('http://localhost:3002/api/test-wp-connection');
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        console.log('✅ API endpoint test successful:', apiData);
      }
    } catch (apiError) {
      console.log('ℹ️  No test API endpoint available (this is expected)');
    }
    
    console.log('\n=== Environment Check ===');
    console.log('Running locally on localhost:3002');
    console.log('Should be using: http://localhost/moreyeahs-new for WordPress');
    console.log('When deployed to Vercel: Will use https://dev.moreyeahs.com');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testUrlDetection();