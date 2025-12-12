/**
 * Test detailed block structure
 */

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost/moreyeahs-new';

async function testDetailedBlocks() {
    console.log('🔍 Testing detailed block structure...\n');

    try {
        // Get homepage with detailed block info
        console.log('1. Getting homepage blocks...');
        const homeResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages-with-blocks/home`);
        
        if (!homeResponse.ok) {
            console.error('❌ Failed to fetch homepage:', homeResponse.status, homeResponse.statusText);
            return;
        }

        const homePage = await homeResponse.json();
        console.log('✅ Homepage found');
        console.log('🧱 Total blocks:', homePage.blocks?.length || 0);
        
        // Examine first few blocks in detail
        if (homePage.blocks && homePage.blocks.length > 0) {
            console.log('\n📋 First 3 blocks detailed:');
            homePage.blocks.slice(0, 3).forEach((block, index) => {
                console.log(`\n--- Block ${index + 1} ---`);
                console.log('Block name:', block.blockName);
                console.log('Has attrs:', !!block.attrs);
                console.log('Has innerHTML:', !!block.innerHTML);
                console.log('Has innerBlocks:', !!block.innerBlocks);
                
                if (block.attrs) {
                    console.log('Attrs keys:', Object.keys(block.attrs));
                }
                
                if (block.innerBlocks && block.innerBlocks.length > 0) {
                    console.log('Inner blocks count:', block.innerBlocks.length);
                    console.log('Inner block types:', block.innerBlocks.map(inner => inner.blockName));
                }
                
                if (block.innerHTML && block.innerHTML.length < 200) {
                    console.log('innerHTML preview:', block.innerHTML.substring(0, 100) + '...');
                }
            });
        }

        // Check if there are any ACF blocks anywhere
        console.log('\n2. Searching for ACF blocks in all blocks...');
        function findACFBlocks(blocks, path = '') {
            const acfBlocks = [];
            
            if (!blocks) return acfBlocks;
            
            blocks.forEach((block, index) => {
                const currentPath = path ? `${path}.${index}` : `${index}`;
                
                if (block.blockName && block.blockName.startsWith('acf/')) {
                    acfBlocks.push({
                        path: currentPath,
                        blockName: block.blockName,
                        hasData: !!block.attrs?.data
                    });
                }
                
                if (block.innerBlocks && block.innerBlocks.length > 0) {
                    acfBlocks.push(...findACFBlocks(block.innerBlocks, currentPath));
                }
            });
            
            return acfBlocks;
        }
        
        const acfBlocks = findACFBlocks(homePage.blocks);
        console.log('🎯 ACF blocks found:', acfBlocks.length);
        
        if (acfBlocks.length > 0) {
            acfBlocks.forEach(acfBlock => {
                console.log(`  - ${acfBlock.blockName} at path ${acfBlock.path} (has data: ${acfBlock.hasData})`);
            });
        }

        // Test ACF REST API directly
        console.log('\n3. Testing ACF REST API...');
        try {
            const acfResponse = await fetch(`${WORDPRESS_URL}/wp-json/acf/v3/field-groups`);
            
            if (acfResponse.ok) {
                const fieldGroups = await acfResponse.json();
                console.log('✅ ACF REST API accessible');
                console.log('📋 Field groups found:', fieldGroups.length);
                
                fieldGroups.forEach(group => {
                    console.log(`  - ${group.title} (${group.key})`);
                });
            } else {
                console.log('❌ ACF REST API failed:', acfResponse.status);
            }
        } catch (error) {
            console.log('❌ ACF REST API error:', error.message);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testDetailedBlocks();