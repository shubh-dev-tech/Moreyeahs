/**
 * Test script to check Full Width Left Text Section API data
 */

const API_BASE_URL = process.env.WORDPRESS_API_URL || 'http://localhost/moreyeahs-new';

async function testFullWidthAPI() {
  try {
    console.log('Testing Full Width Left Text Section API...');
    console.log('API Base URL:', API_BASE_URL);
    
    // Test the homepage endpoint
    const response = await fetch(`${API_BASE_URL}/wp-json/wp/v2/pages-with-blocks/home`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('\n=== PAGE INFO ===');
    console.log('Page Title:', data.title);
    console.log('Page Slug:', data.slug);
    console.log('Total Blocks:', data.blocks?.length || 0);
    
    // Find full-width-left-text-section blocks
    const fullWidthBlocks = data.blocks?.filter(block => 
      block.blockName === 'acf/full-width-left-text-section'
    ) || [];
    
    console.log('\n=== FULL WIDTH BLOCKS ===');
    console.log('Full Width Blocks Found:', fullWidthBlocks.length);
    
    if (fullWidthBlocks.length > 0) {
      fullWidthBlocks.forEach((block, index) => {
        console.log(`\n--- Block #${index + 1} ---`);
        console.log('Block Name:', block.blockName);
        console.log('Has Data:', !!block.attrs?.data);
        
        if (block.attrs?.data) {
          const data = block.attrs.data;
          console.log('Data Keys:', Object.keys(data));
          console.log('Heading:', data.heading || 'Not set');
          console.log('Sub Heading:', data.sub_heading || 'Not set');
          console.log('Reverse Layout:', data.reverse_layout);
          console.log('Reverse Layout Type:', typeof data.reverse_layout);
          console.log('Right Image:', data.right_image ? 'Present' : 'Not set');
          
          if (data.right_image) {
            console.log('Right Image URL:', data.right_image.url || 'No URL');
          }
          
          console.log('\nFull Data Object:');
          console.log(JSON.stringify(data, null, 2));
        } else {
          console.log('No data found in block attributes');
        }
      });
    } else {
      console.log('No full-width-left-text-section blocks found');
      
      // Show all block types for debugging
      console.log('\n=== ALL BLOCKS ===');
      data.blocks?.forEach((block, index) => {
        console.log(`${index + 1}. ${block.blockName} - Has Data: ${!!block.attrs?.data}`);
      });
    }
    
  } catch (error) {
    console.error('Error testing API:', error.message);
    
    // Try alternative endpoints
    console.log('\nTrying alternative endpoints...');
    
    try {
      const pagesResponse = await fetch(`${API_BASE_URL}/wp-json/wp/v2/pages?per_page=5`);
      if (pagesResponse.ok) {
        const pages = await pagesResponse.json();
        console.log('Available pages:');
        pages.forEach(page => {
          console.log(`- ${page.slug} (${page.title.rendered})`);
        });
      }
    } catch (altError) {
      console.error('Error fetching pages:', altError.message);
    }
  }
}

// Run the test
testFullWidthAPI();