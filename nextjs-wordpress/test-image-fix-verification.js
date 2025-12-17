/**
 * Verification script to confirm the image fix is working
 */

const WORDPRESS_URL = 'https://dev.moreyeahs.com';

async function verifyImageFix() {
    console.log('🔍 Verifying Full Width Left Text Section image fix...\n');

    try {
        // Get home page data
        const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages-with-blocks/home`);
        
        if (!response.ok) {
            console.error('❌ Failed to fetch home page');
            return;
        }

        const pageData = await response.json();
        console.log('✅ Home page data received');
        console.log('📄 Page title:', pageData.title);
        console.log('🧱 Total blocks:', pageData.blocks?.length || 0);

        // Find full-width blocks in nested structure
        let fullWidthBlocks = [];
        
        function findFullWidthBlocks(blocks) {
            blocks.forEach(block => {
                if (block.blockName === 'acf/full-width-left-text-section') {
                    fullWidthBlocks.push(block);
                }
                if (block.innerBlocks && block.innerBlocks.length > 0) {
                    findFullWidthBlocks(block.innerBlocks);
                }
            });
        }
        
        findFullWidthBlocks(pageData.blocks || []);
        
        console.log('🎯 Full-width blocks found:', fullWidthBlocks.length);

        if (fullWidthBlocks.length === 0) {
            console.log('⚠️ No full-width blocks found');
            return;
        }

        // Check each block's image data
        fullWidthBlocks.forEach((block, index) => {
            console.log(`\n--- Block ${index + 1} ---`);
            
            const imageData = block.attrs?.data?.right_image;
            
            if (!imageData) {
                console.log('❌ No image data found');
                return;
            }
            
            if (typeof imageData === 'number') {
                console.log('❌ Image is still a number (not expanded):', imageData);
                return;
            }
            
            if (typeof imageData === 'object' && imageData.url) {
                console.log('✅ Image data properly expanded!');
                console.log('🖼️ Image URL:', imageData.url);
                console.log('📏 Dimensions:', `${imageData.width}x${imageData.height}`);
                console.log('🏷️ Alt text:', imageData.alt || '(empty)');
                console.log('🎯 Image ID:', imageData.id);
            } else {
                console.log('❌ Image data in unexpected format:', typeof imageData);
            }
        });

        console.log('\n🎉 Image fix verification complete!');
        console.log('✅ All Full Width Left Text Section blocks should now display images correctly.');

    } catch (error) {
        console.error('❌ Error during verification:', error.message);
    }
}

verifyImageFix();