/**
 * Test Mobile Menu Fix
 * Verify that mobile menu now shows primary menu items
 */

async function testMobileMenuFix() {
  console.log('🔍 Testing Mobile Menu Fix...\n');
  
  // Use the fallback API URL from environment
  const WORDPRESS_API_URL = 'https://dev.moreyeahs.com/wp-json';
  
  try {
    // Test primary menu endpoint
    const primaryMenuUrl = `${WORDPRESS_API_URL}/wp/v2/menus/primary`;
    console.log(`📡 Fetching primary menu: ${primaryMenuUrl}`);
    
    const response = await fetch(primaryMenuUrl);
    
    if (!response.ok) {
      console.log(`❌ HTTP ${response.status}: ${response.statusText}`);
      
      if (response.status === 404) {
        console.log('\n💡 This likely means:');
        console.log('   • No menu is assigned to the "primary" location in WordPress');
        console.log('   • You need to create a menu and assign it to the "primary" location');
        console.log('   • Or the REST API endpoint is not available');
      }
      
      return;
    }
    
    const menuData = await response.json();
    
    if (menuData && menuData.items) {
      console.log(`✅ Primary menu found with ${menuData.items.length} items:`);
      
      menuData.items.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.title} → ${item.url}`);
        
        if (item.children && item.children.length > 0) {
          item.children.forEach((child, childIndex) => {
            console.log(`      ${index + 1}.${childIndex + 1}. ${child.title} → ${child.url}`);
          });
        }
      });
      
      console.log('\n🎉 Mobile menu should now display these items!');
      console.log('\n📱 To test:');
      console.log('   1. Open http://localhost:3001 in your browser');
      console.log('   2. Resize to mobile view or use dev tools mobile emulation');
      console.log('   3. Click the hamburger menu button');
      console.log('   4. You should see the menu items listed above');
      
    } else {
      console.log('⚠️  Primary menu exists but has no items');
      console.log('   You need to add menu items to the primary menu in WordPress admin');
    }
    
  } catch (error) {
    console.error('❌ Error testing mobile menu:', error.message);
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.log('\n💡 Connection issue:');
      console.log('   • Check if WordPress is running and accessible');
      console.log('   • Verify WORDPRESS_API_URL in environment configuration');
      console.log(`   • Current API URL: ${WORDPRESS_API_URL}`);
    }
  }
}

// Run the test
testMobileMenuFix();