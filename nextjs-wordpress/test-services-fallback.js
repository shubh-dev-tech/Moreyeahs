/**
 * Test services pages with fallback to standard WordPress API
 */

async function testServicesPagesWithFallback() {
  console.log('🚀 Testing Services pages with fallback to standard WordPress API\n');

  const baseUrl = 'https://dev.moreyeahs.com/wp-json';

  // Test services page
  try {
    console.log('🧪 Testing services page...');
    const response = await fetch(`${baseUrl}/wp/v2/pages?slug=services`);
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        console.log('✅ Services page - Found WordPress page');
        console.log(`   Title: ${pages[0].title.rendered}`);
      } else {
        console.log('⚠️  Services page - No WordPress page found (will show default content)');
      }
    } else {
      console.log(`❌ Services page - HTTP ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Services page - Error: ${error.message}`);
  }

  // Test devops page
  try {
    console.log('\n🧪 Testing devops page...');
    const response = await fetch(`${baseUrl}/wp/v2/pages?slug=devops`);
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        console.log('✅ DevOps page - Found WordPress page');
        console.log(`   Title: ${pages[0].title.rendered}`);
      } else {
        console.log('⚠️  DevOps page - No WordPress page found (will show default content)');
      }
    } else {
      console.log(`❌ DevOps page - HTTP ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ DevOps page - Error: ${error.message}`);
  }

  // Test categories for StoriesBlogBlock
  try {
    console.log('\n🧪 Testing categories for StoriesBlogBlock...');
    const response = await fetch(`${baseUrl}/wp/v2/categories`);
    
    if (response.ok) {
      const categories = await response.json();
      console.log(`✅ Categories - Found ${categories.length} categories`);
      if (categories.length > 0) {
        console.log(`   Sample category: ${categories[0].name} (ID: ${categories[0].id})`);
      }
    } else {
      console.log(`❌ Categories - HTTP ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Categories - Error: ${error.message}`);
  }

  console.log('\n🎉 Fallback testing completed!');
  console.log('\n📝 The pages should now work with default content if no WordPress pages exist.');
}

testServicesPagesWithFallback().catch(console.error);