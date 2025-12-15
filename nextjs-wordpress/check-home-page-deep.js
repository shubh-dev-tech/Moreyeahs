/**
 * Check home page blocks deeply
 */

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost/moreyeahs-new';

async function checkHomePage() {
    try {
        console.log('🏠 Checking Home Page Blocks (Deep)...\n');
        
        // Get home page with blocks
        const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages-with-blocks/home`);
        
        if (!response.ok) {
            console.error('❌ Failed to fetch home page:', response.status);
            return;
        }
        
        const pageData = await response.json();
        
        console.log('📄 Page Info:');
        console.log('  Total Top-level Blocks:', pageData.blocks?.length || 0);
        
        // Check first group block's inner blocks
        if (pageData.blocks && pageData.blocks.length > 0) {
            const firstBlock = pageData.blocks[0];
            console.log('\n🔍 First Block Analysis:');
            console.log('  Block Name:', firstBlock.blockName);
            console.log('  Has innerBlocks:', !!firstBlock.innerBlocks);
            console.log('  Inner Blocks count:', firstBlock.innerBlocks?.length || 0);
            
            if (firstBlock.innerBlocks && firstBlock.innerBlocks.length > 0) {
                console.log('\n  Inner Block Types:');
                firstBlock.innerBlocks.forEach((inner, index) => {
                    console.log(`    ${index + 1}. ${inner.blockName}`);
                });
                
                // Check first inner block
                const firstInner = firstBlock.innerBlocks[0];
                console.log('\n  First Inner Block Details:');
                console.log('    Name:', firstInner.blockName);
                console.log('    Has attrs.data:', !!firstInner.attrs?.data);
                if (firstInner.attrs?.data) {
                    console.log('    Data keys:', Object.keys(firstInner.attrs.data).slice(0, 5).join(', '));
                }
            }
        }
        
        // Summary of all inner blocks across all groups
        console.log('\n📊 Summary of All Inner Blocks:');
        const allInnerBlocks = {};
        pageData.blocks?.forEach(block => {
            block.innerBlocks?.forEach(inner => {
                allInnerBlocks[inner.blockName] = (allInnerBlocks[inner.blockName] || 0) + 1;
            });
        });
        
        Object.entries(allInnerBlocks).sort((a, b) => b[1] - a[1]).forEach(([name, count]) => {
            console.log(`  ${name}: ${count}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkHomePage();
