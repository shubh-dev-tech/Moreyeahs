/**
 * Debug script for full-width-left-text-section image loading issue
 */

const WORDPRESS_URL = process.env.WORDPRESS_URL || 'http://localhost';

async function testFullWidthImageDebug() {
    console.log('🔍 Testing full-width-left-text-section image debug...\n');

    try {
        // Test 1: Get a specific page with full-width blocks
        console.log('1. Testing page with full-width blocks...');
        const pageResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages-with-blocks/home`);
        
        if (!pageResponse.ok) {
            console.error('❌ Failed to fetch page:', pageResponse.status, pageResponse.statusText);
            return;
        }

        const pageData = await pageResponse.json();
        console.log('✅ Page data received');
        console.log('📄 Page title:', pageData.title);
        console.log('🧱 Total blocks:', pageData.blocks?.length || 0);

        // Find full-width-left-text-section blocks
        const fullWidthBlocks = pageData.blocks?.filter(block => 
            block.blockName === 'acf/full-width-left-text-section'
        ) || [];

        console.log('🎯 Full-width blocks found:', fullWidthBlocks.length);

        fullWidthBlocks.forEach((block, index) => {
            console.log(`\n--- Block ${index + 1} ---`);
            console.log('Block name:', block.blockName);
            console.log('Has attrs:', !!block.attrs);
            console.log('Has data:', !!block.attrs?.data);
            
            if (block.attrs?.data) {
                const data = block.attrs.data;
                console.log('Data keys:', Object.keys(data));
                console.log('Right image data:', data.right_image);
                
                if (data.right_image) {
                    console.log('Image type:', typeof data.right_image);
                    if (typeof data.right_image === 'object') {
                        console.log('Image URL:', data.right_image.url);
                        console.log('Image alt:', data.right_image.alt);
                        console.log('Image width:', data.right_image.width);
                        console.log('Image height:', data.right_image.height);
                    } else {
                        console.log('Image is not an object, value:', data.right_image);
                    }
                }
            }
        });

        // Test 2: Use the debug endpoint if available
        console.log('\n2. Testing debug endpoint...');
        const debugResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/test-full-width-block/${pageData.id}`);
        
        if (debugResponse.ok) {
            const debugData = await debugResponse.json();
            console.log('✅ Debug data received');
            console.log('🔍 Full-width blocks found in debug:', debugData.full_width_blocks_found);
            
            if (debugData.blocks_data && debugData.blocks_data.length > 0) {
                debugData.blocks_data.forEach((blockData, index) => {
                    console.log(`\n--- Debug Block ${index + 1} ---`);
                    console.log('Processed data right_image:', blockData.processed_data?.right_image);
                    console.log('Raw right_image field:', blockData.right_image_raw);
                    console.log('Meta right_image:', blockData.right_image_meta);
                });
            }
        } else {
            console.log('⚠️ Debug endpoint not available or failed');
        }

        // Test 3: Check if there are any images in the media library
        console.log('\n3. Testing media library...');
        const mediaResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/media?per_page=5`);
        
        if (mediaResponse.ok) {
            const mediaData = await mediaResponse.json();
            console.log('✅ Media library accessible');
            console.log('📸 Media items found:', mediaData.length);
            
            if (mediaData.length > 0) {
                console.log('First media item:');
                console.log('- ID:', mediaData[0].id);
                console.log('- URL:', mediaData[0].source_url);
                console.log('- Title:', mediaData[0].title?.rendered);
                
                // Test image expansion with first media item
                console.log('\n4. Testing image expansion...');
                const imageTestResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/test-image/${mediaData[0].id}`);
                
                if (imageTestResponse.ok) {
                    const imageTestData = await imageTestResponse.json();
                    console.log('✅ Image expansion test successful');
                    console.log('🖼️ Expanded image:', imageTestData.expanded_image);
                } else {
                    console.log('❌ Image expansion test failed');
                }
            }
        } else {
            console.log('❌ Failed to access media library');
        }

    } catch (error) {
        console.error('❌ Error during debug:', error.message);
    }
}

// Run the test
testFullWidthImageDebug();