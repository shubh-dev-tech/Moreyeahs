/**
 * Check if images are being expanded in API response
 */

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost/moreyeahs-new';

async function checkImageData() {
    try {
        console.log('🖼️ Checking Image Data in API Response...\n');
        
        // Get home page with blocks
        const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages-with-blocks/home`);
        
        if (!response.ok) {
            console.error('❌ Failed to fetch home page:', response.status);
            return;
        }
        
        const pageData = await response.json();
        
        // Find a block with image data
        let imageBlock = null;
        let blockPath = '';
        
        function findImageBlock(blocks, path = '') {
            for (let i = 0; i < (blocks?.length || 0); i++) {
                const block = blocks[i];
                const currentPath = path + `[${i}]`;
                
                // Check if block has image data
                if (block.attrs?.data?.background_image) {
                    return {
                        block,
                        path: currentPath,
                        imageField: 'background_image',
                        imageData: block.attrs.data.background_image
                    };
                }
                
                if (block.attrs?.data?.right_image) {
                    return {
                        block,
                        path: currentPath,
                        imageField: 'right_image',
                        imageData: block.attrs.data.right_image
                    };
                }
                
                // Check inner blocks
                if (block.innerBlocks && block.innerBlocks.length > 0) {
                    const found = findImageBlock(block.innerBlocks, currentPath + '.innerBlocks');
                    if (found) return found;
                }
            }
            return null;
        }
        
        imageBlock = findImageBlock(pageData.blocks);
        
        if (!imageBlock) {
            console.log('⚠️ No image fields found in any blocks');
            return;
        }
        
        console.log('📍 Found Image Block:');
        console.log('  Block Type:', imageBlock.block.blockName);
        console.log('  Path:', imageBlock.path);
        console.log('  Image Field:', imageBlock.imageField);
        console.log('  Image Data Type:', typeof imageBlock.imageData);
        
        if (typeof imageBlock.imageData === 'object' && imageBlock.imageData) {
            console.log('\n  Image is EXPANDED object:');
            console.log('    Keys:', Object.keys(imageBlock.imageData).join(', '));
            console.log('    URL:', imageBlock.imageData.url);
            console.log('    Width:', imageBlock.imageData.width);
            console.log('    Height:', imageBlock.imageData.height);
            console.log('    Alt:', imageBlock.imageData.alt);
        } else if (typeof imageBlock.imageData === 'number') {
            console.log('\n  ⚠️ Image is NOT expanded - it\'s just an ID:', imageBlock.imageData);
        } else if (typeof imageBlock.imageData === 'string') {
            console.log('\n  ⚠️ Image is a string (not expanded):', imageBlock.imageData);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkImageData();
