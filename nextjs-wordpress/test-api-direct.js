/**
 * Direct API test for debugging image issues
 */

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost/moreyeahs-new';

async function testAPI() {
    console.log('🔍 Testing WordPress API directly...\n');

    try {
        // Test 1: Get pages
        console.log('1. Testing pages endpoint...');
        const pagesResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages`);
        
        if (!pagesResponse.ok) {
            console.error('❌ Failed to fetch pages:', pagesResponse.status, pagesResponse.statusText);
            return;
        }

        const pages = await pagesResponse.json();
        console.log('✅ Pages found:', pages.length);
        
        if (pages.length > 0) {
            const firstPage = pages[0];
            console.log('📄 First page:', {
                id: firstPage.id,
                title: firstPage.title.rendered,
                slug: firstPage.slug
            });

            // Test 2: Get page with blocks
            console.log('\n2. Testing page with blocks...');
            const pageWithBlocksResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages-with-blocks/${firstPage.slug}`);
            
            if (pageWithBlocksResponse.ok) {
                const pageWithBlocks = await pageWithBlocksResponse.json();
                console.log('✅ Page with blocks received');
                console.log('🧱 Blocks found:', pageWithBlocks.blocks?.length || 0);
                
                // Find full-width blocks
                const fullWidthBlocks = pageWithBlocks.blocks?.filter(block => 
                    block.blockName === 'acf/full-width-left-text-section'
                ) || [];
                
                console.log('🎯 Full-width blocks:', fullWidthBlocks.length);
                
                fullWidthBlocks.forEach((block, index) => {
                    console.log(`\n--- Full-width Block ${index + 1} ---`);
                    console.log('Has data:', !!block.attrs?.data);
                    if (block.attrs?.data) {
                        console.log('Data keys:', Object.keys(block.attrs.data));
                        console.log('Right image:', block.attrs.data.right_image);
                        console.log('Right image type:', typeof block.attrs.data.right_image);
                    }
                });
            } else {
                console.log('⚠️ Page with blocks endpoint failed:', pageWithBlocksResponse.status);
            }

            // Test 3: Test debug endpoint
            console.log('\n3. Testing debug endpoint...');
            const debugResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/test-full-width-block/${firstPage.id}`);
            
            if (debugResponse.ok) {
                const debugData = await debugResponse.json();
                console.log('✅ Debug endpoint works');
                console.log('🔍 Debug results:', {
                    blocks_found: debugData.full_width_blocks_found,
                    has_blocks_data: !!debugData.blocks_data,
                    field_groups: debugData.field_groups?.length || 0
                });
                
                if (debugData.blocks_data && debugData.blocks_data.length > 0) {
                    debugData.blocks_data.forEach((blockData, index) => {
                        console.log(`\n--- Debug Block ${index + 1} ---`);
                        console.log('Processed right_image:', blockData.processed_data?.right_image);
                        console.log('Raw right_image:', blockData.right_image_raw);
                        console.log('Meta right_image:', blockData.right_image_meta);
                    });
                }
            } else {
                console.log('⚠️ Debug endpoint failed:', debugResponse.status);
            }
        }

        // Test 4: Check media library
        console.log('\n4. Testing media library...');
        const mediaResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/media?per_page=3`);
        
        if (mediaResponse.ok) {
            const media = await mediaResponse.json();
            console.log('✅ Media library accessible');
            console.log('📸 Media items:', media.length);
            
            media.forEach((item, index) => {
                console.log(`Media ${index + 1}:`, {
                    id: item.id,
                    title: item.title.rendered,
                    url: item.source_url,
                    mime_type: item.mime_type
                });
            });
        } else {
            console.log('❌ Media library failed:', mediaResponse.status);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testAPI();