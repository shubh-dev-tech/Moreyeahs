/**
 * Test Mega Menu Debug
 * Check if mega menus are being fetched and configured correctly
 */

async function testMegaMenuDebug() {
  console.log('🔍 Testing Mega Menu Debug...\n');
  
  // Use the fallback API URL from environment
  const WORDPRESS_API_URL = 'https://dev.moreyeahs.com/wp-json';
  
  try {
    // Test mega menu endpoint
    const megaMenuUrl = `${WORDPRESS_API_URL}/wp/v2/mega-menus`;
    console.log(`📡 Fetching mega menus: ${megaMenuUrl}`);
    
    const response = await fetch(megaMenuUrl);
    
    if (!response.ok) {
      console.log(`❌ HTTP ${response.status}: ${response.statusText}`);
      
      if (response.status === 404) {
        console.log('\n💡 This likely means:');
        console.log('   • The mega-menus REST API endpoint is not registered');
        console.log('   • The custom post type or endpoint is not available');
        console.log('   • Check wp-content/themes/*/inc/rest-api-endpoints.php');
      }
      
      return;
    }
    
    const megaMenus = await response.json();
    
    if (Array.isArray(megaMenus) && megaMenus.length > 0) {
      console.log(`✅ Found ${megaMenus.length} mega menu(s):`);
      
      megaMenus.forEach((menu, index) => {
        console.log(`\n   ${index + 1}. ${menu.title} (${menu.slug})`);
        console.log(`      Main Heading: ${menu.main_heading}`);
        console.log(`      Menu Type: ${menu.menu_type}`);
        
        if (menu.categories && menu.categories.length > 0) {
          console.log(`      Categories (${menu.categories.length}):`);
          menu.categories.forEach((category, catIndex) => {
            console.log(`         ${catIndex + 1}. ${category.title} (${category.items ? category.items.length : 0} items)`);
            if (category.items && category.items.length > 0) {
              category.items.forEach((item, itemIndex) => {
                console.log(`            ${itemIndex + 1}. ${item.title} → ${item.url}`);
              });
            }
          });
        } else {
          console.log('      ⚠️  No categories found');
        }
      });
      
      console.log('\n🔍 Checking menu title matching...');
      
      // Test primary menu to see which items should have mega menus
      const primaryMenuUrl = `${WORDPRESS_API_URL}/wp/v2/menus/primary`;
      const primaryResponse = await fetch(primaryMenuUrl);
      
      if (primaryResponse.ok) {
        const primaryMenu = await primaryResponse.json();
        
        if (primaryMenu && primaryMenu.items) {
          console.log('\n📋 Primary menu items vs Mega menus:');
          
          primaryMenu.items.forEach((item) => {
            const itemTitleLower = item.title.toLowerCase().trim();
            const hasMegaMenu = megaMenus.find(menu => menu.title.toLowerCase().trim() === itemTitleLower);
            
            console.log(`   • ${item.title} → ${hasMegaMenu ? '✅ Has mega menu' : '❌ No mega menu'}`);
          });
        }
      }
      
    } else if (Array.isArray(megaMenus) && megaMenus.length === 0) {
      console.log('⚠️  No mega menus found');
      console.log('   You need to create mega menus in WordPress admin');
    } else {
      console.log('❌ Unexpected response format');
      console.log('Response:', megaMenus);
    }
    
  } catch (error) {
    console.error('❌ Error testing mega menu:', error.message);
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.log('\n💡 Connection issue:');
      console.log('   • Check if WordPress is running and accessible');
      console.log('   • Verify WORDPRESS_API_URL in environment configuration');
      console.log(`   • Current API URL: ${WORDPRESS_API_URL}`);
    }
  }
}

// Run the test
testMegaMenuDebug();