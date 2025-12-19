/**
 * Test localhost WordPress API accessibility
 */

async function testLocalhostWordPress() {
  console.log('🚀 Testing Localhost WordPress API\n');

  const localhostApiUrl = 'http://localhost/moreyeahs-new/wp-json';
  
  // Test basic WordPress API
  try {
    console.log('🧪 Testing basic WordPress API...');
    const response = await fetch(`${localhostApiUrl}/wp/v2`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ WordPress API is accessible');
      console.log(`   Namespace: ${data.namespace}`);
      console.log(`   Routes available: ${Object.keys(data.routes).length}`);
    } else {
      console.log(`❌ WordPress API - HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ WordPress API - Error: ${error.message}`);
  }

  // Test pages endpoint
  try {
    console.log('\n🧪 Testing pages endpoint...');
    const response = await fetch(`${localhostApiUrl}/wp/v2/pages`);
    
    if (response.ok) {
      const pages = await response.json();
      console.log(`✅ Pages endpoint - Found ${pages.length} pages`);
      
      // Check for services and devops pages
      const servicesPage = pages.find(page => page.slug === 'services');
      const devopsPage = pages.find(page => page.slug === 'devops');
      
      console.log(`   Services page: ${servicesPage ? 'EXISTS' : 'NOT FOUND'}`);
      console.log(`   DevOps page: ${devopsPage ? 'EXISTS' : 'NOT FOUND'}`);
      
    } else {
      console.log(`❌ Pages endpoint - HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ Pages endpoint - Error: ${error.message}`);
  }

  // Test specific page queries
  try {
    console.log('\n🧪 Testing devops page query...');
    const response = await fetch(`${localhostApiUrl}/wp/v2/pages?slug=devops`);
    
    if (response.ok) {
      const pages = await response.json();
      if (pages.length > 0) {
        console.log('✅ DevOps page query - Found page');
        console.log(`   Title: ${pages[0].title.rendered}`);
        console.log(`   Content length: ${pages[0].content.rendered.length} characters`);
      } else {
        console.log('⚠️  DevOps page query - No page found (will show default content)');
      }
    } else {
      console.log(`❌ DevOps page query - HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ DevOps page query - Error: ${error.message}`);
  }

  console.log('\n🎉 Localhost WordPress testing completed!');
}

testLocalhostWordPress().catch(console.error);