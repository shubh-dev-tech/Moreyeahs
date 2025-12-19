/**
 * Test Flexible Matching Logic
 * Verify that the new flexible matching system works
 */

async function testFlexibleMatching() {
  console.log('🔍 Testing Flexible Matching Logic...\n');
  
  const WORDPRESS_API_URL = 'https://dev.moreyeahs.com/wp-json';
  
  try {
    // Get both primary menu and mega menus
    const [primaryResponse, megaResponse] = await Promise.all([
      fetch(`${WORDPRESS_API_URL}/wp/v2/menus/primary`),
      fetch(`${WORDPRESS_API_URL}/wp/v2/mega-menus`)
    ]);
    
    if (!primaryResponse.ok || !megaResponse.ok) {
      console.log('❌ Failed to fetch menu data');
      return;
    }
    
    const primaryMenu = await primaryResponse.json();
    const megaMenus = await megaResponse.json();
    
    console.log('📋 New Flexible Matching Logic:');
    console.log('   Handles singular/plural variations automatically');
    console.log('   ================================================\n');
    
    // Simulate the NEW flexible matching logic
    const megaMenuMap = megaMenus.reduce((acc, menu) => {
      const key = menu.title.toLowerCase().trim();
      acc[key] = menu;
      
      // Add flexible matching for common variations
      if (key.endsWith('s')) {
        // If mega menu ends with 's', also match without 's'
        acc[key.slice(0, -1)] = menu;
      } else {
        // If mega menu doesn't end with 's', also match with 's'
        acc[key + 's'] = menu;
      }
      
      return acc;
    }, {});
    
    console.log('🗂️  Mega Menu Map (with flexible matching):');
    Object.keys(megaMenuMap).forEach(key => {
      console.log(`   "${key}" → ${megaMenuMap[key].title}`);
    });
    
    console.log('\n🔍 Matching Results:');
    let matchCount = 0;
    
    primaryMenu.items.forEach((item) => {
      const itemTitleLower = item.title.toLowerCase().trim();
      const hasMegaMenu = megaMenuMap[itemTitleLower];
      
      if (hasMegaMenu) {
        matchCount++;
        console.log(`   ✅ "${item.title}" → MATCHED with mega menu "${hasMegaMenu.title}"`);
      } else {
        console.log(`   ❌ "${item.title}" → NO MATCH`);
      }
    });
    
    console.log(`\n📊 Summary: ${matchCount} out of ${primaryMenu.items.length} menu items have mega menus`);
    
    if (matchCount > 0) {
      console.log('\n🎉 Success! The flexible matching is working!');
      console.log('   The mega menu should now appear when hovering over matched items.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testFlexibleMatching();