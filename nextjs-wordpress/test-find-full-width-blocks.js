/**
 * Test script to find pages with Full Width Left Text Section blocks
 */

const API_BASE_URL = process.env.WORDPRESS_API_URL || 'http://localhost/moreyeahs-new';

async function findFullWidthBlocks() {
  try {
    console.log('Searching for Full Width Left Text Section blocks...');
    
    // Get all pages
    const pagesResponse = await fetch(`${API_BASE_URL}/wp-json/wp/v2/pages?per_page=100`);
    
    if (!pagesResponse.ok) {
      throw new Error(`HTTP error! status: ${pagesResponse.status}`);
    }
    
    const pages = await pagesResponse.json();
    console.log(`Found ${pages.length} pages to check`);
    
    let foundBlocks = false;
    
    for (const page of pages) {
      try {
        console.log(`\nChecking page: ${page.slug} (${page.title.rendered})`);
        
        // Get page with blocks
        const pageResponse = await fetch(`${API_BASE_URL}/wp-json/wp/v2/pages-with-blocks/${page.slug}`);
        
        if (pageResponse.ok) {
          const pageData = await pageResponse.json();
          
          // Find full-width-left-text-section blocks
          const fullWidthBlocks = pageData.blocks?.filter(block => 
            block.blockName === 'acf/full-width-left-text-section'
          ) || [];
          
          if (fullWidthBlocks.length > 0) {
            foundBlocks = true;
            console.log(`  ✓ Found ${fullWidthBlocks.length} full-width-left-text-section block(s)!`);
            
            fullWidthBlocks.forEach((block, index) => {
              console.log(`    Block #${index + 1}:`);
              if (block.attrs?.data) {
                const data = block.attrs.data;
                console.log(`      Heading: ${data.heading || 'Not set'}`);
                console.log(`      Reverse Layout: ${data.reverse_layout} (${typeof data.reverse_layout})`);
                console.log(`      Right Image: ${data.right_image ? 'Present' : 'Not set'}`);
              } else {
                console.log('      No data found');
              }
            });
          } else {
            console.log(`  - No full-width-left-text-section blocks found`);
          }
        } else {
          console.log(`  - Error fetching page data: ${pageResponse.status}`);
        }
      } catch (error) {
        console.log(`  - Error checking page: ${error.message}`);
      }
    }
    
    if (!foundBlocks) {
      console.log('\n❌ No full-width-left-text-section blocks found on any page');
      console.log('\nTo test the reverse layout feature:');
      console.log('1. Go to WordPress admin');
      console.log('2. Edit a page (or create a new one)');
      console.log('3. Add a "Full Width Left Text Section" block');
      console.log('4. Configure the content and enable "Reverse Layout"');
      console.log('5. Save the page');
    } else {
      console.log('\n✓ Found full-width-left-text-section blocks!');
    }
    
  } catch (error) {
    console.error('Error searching for blocks:', error.message);
  }
}

// Run the search
findFullWidthBlocks();