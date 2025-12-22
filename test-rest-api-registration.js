/**
 * Test REST API Registration
 * This script checks if our custom REST API endpoints are being registered
 */

const WORDPRESS_URL = 'https://dev.moreyeahs.com';

async function testRestApiRegistration() {
  console.log('🔍 Testing REST API Registration...\n');
  
  try {
    // First, get the REST API index to see all available endpoints
    console.log('1. Fetching REST API index...');
    const indexResponse = await fetch(`${WORDPRESS_URL}/wp-json/`);
    
    if (!indexResponse.ok) {
      throw new Error(`HTTP ${indexResponse.status}: ${indexResponse.statusText}`);
    }
    
    const indexData = await indexResponse.json();
    console.log('✅ REST API index loaded');
    
    // Check if wp/v2 namespace exists
    if (indexData.namespaces && indexData.namespaces.includes('wp/v2')) {
      console.log('✅ wp/v2 namespace is available');
    } else {
      console.log('❌ wp/v2 namespace is missing');
      console.log('Available namespaces:', indexData.namespaces);
    }
    
    // Get wp/v2 routes
    console.log('\n2. Fetching wp/v2 routes...');
    const routesResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/`);
    
    if (!routesResponse.ok) {
      throw new Error(`HTTP ${routesResponse.status}: ${routesResponse.statusText}`);
    }
    
    const routesData = await routesResponse.json();
    console.log('✅ wp/v2 routes loaded');
    
    // Check for our custom endpoints
    const customEndpoints = [
      'site-settings',
      'menus',
      'mega-menus',
      'footer-widgets',
      'pages-with-blocks',
      'posts-data',
      'categories-data'
    ];
    
    console.log('\n3. Checking for custom endpoints...');
    
    const foundEndpoints = [];
    const missingEndpoints = [];
    
    for (const endpoint of customEndpoints) {
      const routeKey = `/wp/v2/${endpoint}`;
      if (routesData.routes && routesData.routes[routeKey]) {
        foundEndpoints.push(endpoint);
        console.log(`✅ ${endpoint} - Registered`);
      } else {
        missingEndpoints.push(endpoint);
        console.log(`❌ ${endpoint} - Not registered`);
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`- Found: ${foundEndpoints.length}/${customEndpoints.length} endpoints`);
    console.log(`- Missing: ${missingEndpoints.length} endpoints`);
    
    if (missingEndpoints.length > 0) {
      console.log('\n❌ Issue Found: Custom REST API endpoints are not being registered');
      console.log('\nPossible causes:');
      console.log('1. WordPress theme is not loading the REST API endpoints file');
      console.log('2. PHP errors preventing the endpoints from being registered');
      console.log('3. WordPress caching preventing new endpoints from being loaded');
      console.log('4. Child theme is not active or not loading properly');
      
      console.log('\n🔧 Solutions to try:');
      console.log('1. Check WordPress error logs');
      console.log('2. Deactivate and reactivate the theme');
      console.log('3. Clear any WordPress caching');
      console.log('4. Check if the child theme is actually active');
      console.log('5. Verify the REST API endpoints file is being included');
    } else {
      console.log('\n✅ All custom endpoints are registered correctly');
      console.log('The issue might be with the endpoint implementation or request format');
    }
    
    // Test a simple WordPress endpoint to make sure the API is working
    console.log('\n4. Testing standard WordPress endpoint...');
    const pagesResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages`);
    
    if (pagesResponse.ok) {
      const pagesData = await pagesResponse.json();
      console.log(`✅ Standard pages endpoint working (${pagesData.length} pages found)`);
    } else {
      console.log(`❌ Standard pages endpoint failed: HTTP ${pagesResponse.status}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRestApiRegistration();