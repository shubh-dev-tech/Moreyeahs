/**
 * Test script to verify services and devops pages are working with POST methods
 * Run with: node test-services-pages.js
 */

const { WORDPRESS_API_URL } = require('./src/lib/env.ts');

async function testPageBySlug(slug) {
  try {
    console.log(`\n🧪 Testing page: ${slug}...`);
    
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/page-by-slug`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ slug }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`⚠️  ${slug} - Page not found in WordPress (will show default content)`);
        return null;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`✅ ${slug} - Found WordPress page`);
    console.log(`   Title: ${result.title}`);
    console.log(`   Content length: ${result.content?.length || 0} characters`);
    
    return result;
  } catch (error) {
    console.log(`❌ ${slug} - Error: ${error.message}`);
    return null;
  }
}

async function testCategoriesEndpoint() {
  try {
    console.log(`\n🧪 Testing categories endpoint...`);
    
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/categories-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ per_page: 5 }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`✅ Categories - Success`);
    console.log(`   Found ${result.length} categories`);
    
    return result;
  } catch (error) {
    console.log(`❌ Categories - Error: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Testing Services and DevOps pages with POST methods\n');
  console.log(`API Base URL: ${WORDPRESS_API_URL}`);

  // Test page endpoints
  await testPageBySlug('services');
  await testPageBySlug('devops');
  
  // Test categories endpoint (used by StoriesBlogBlock)
  await testCategoriesEndpoint();

  console.log('\n🎉 Services pages testing completed!');
  console.log('\n📝 Note: If pages show "not found", they will display default content.');
  console.log('   Create "services" and "devops" pages in WordPress to use custom content.');
}

// Run the tests
runTests().catch(console.error);