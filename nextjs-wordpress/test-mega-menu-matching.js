/**
 * Test Mega Menu Matching
 * Debug the exact matching logic and provide solutions
 */

async function testMegaMenuMatching() {
  console.log('🔍 Testing Mega Menu Matching Logic...\n');
  
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
    
    console.log('📋 Current Matching Logic:');
    console.log('   Primary Menu Item → Mega Menu Title (lowercase, trimmed)');
    console.log('   ================================================');
    
    // Simulate the exact matching logic from HeaderWithMegaMenu
    const megaMenuMap = megaMenus.reduce((acc, menu) => {
      const key = menu.title.toLowerCase().trim();
      acc[key] = menu;
      return acc;
    }, {});
    
    console.log('\n🗂️  Mega Menu Map:');
    Object.keys(megaMenuMap).forEach(key => {
      console.log(`   "${key}" → ${megaMenuMap[key].title}`);
    });
    
    console.log('\n🔍 Matching Results:');
    primaryMenu.items.forEach((item) => {
      const itemTitleLower = item.title.toLowerCase().trim();
      const hasMegaMenu = megaMenuMap[itemTitleLower];
      
      console.log(`   "${item.title}" → "${itemTitleLower}" → ${hasMegaMenu ? '✅ MATCH' : '❌ NO MATCH'}`);
      
      if (!hasMegaMenu) {
        // Find close matches
        const closeMatches = Object.keys(megaMenuMap).filter(key => 
          key.includes(itemTitleLower) || itemTitleLower.includes(key)
        );
        
        if (closeMatches.length > 0) {
          console.log(`      💡 Close matches found: ${closeMatches.join(', ')}`);
        }
      }
    });
    
    console.log('\n🛠️  Solutions:');
    console.log('   1. Update mega menu titles in WordPress to match exactly:');
    
    primaryMenu.items.forEach((item) => {
      const itemTitleLower = item.title.toLowerCase().trim();
      const hasMegaMenu = megaMenuMap[itemTitleLower];
      
      if (!hasMegaMenu) {
        const closeMatches = Object.keys(megaMenuMap).filter(key => 
          key.includes(itemTitleLower) || itemTitleLower.includes(key)
        );
        
        if (closeMatches.length > 0) {
          console.log(`      • Change "${megaMenuMap[closeMatches[0]].title}" to "${item.title}"`);
        }
      }
    });
    
    console.log('\n   2. Or create a flexible matching system in the code');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testMegaMenuMatching();