/**
 * Test IconTextGrid block data specifically
 */

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost/moreyeahs-new';

async function testIconTextGridData() {
    console.log('🔍 Testing IconTextGrid block data...\n');

    try {
        // Get homepage
        const homeResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages-with-blocks/home`);
        
        if (!homeResponse.ok) {
            console.error('❌ Failed to fetch homepage:', homeResponse.status, homeResponse.statusText);
            return;
        }

        const homePage = await homeResponse.json();
        
        // Find IconTextGrid block
        function findIconTextGridBlock(blocks, path = '') {
            if (!blocks) return null;
            
            for (let i = 0; i < blocks.length; i++) {
                const block = blocks[i];
                const currentPath = path ? `${path}.${i}` : `${i}`;
                
                if (block.blockName === 'acf/icon-text-grid') {
                    return { block, path: currentPath };
                }
                
                if (block.innerBlocks && block.innerBlocks.length > 0) {
                    const found = findIconTextGridBlock(block.innerBlocks, currentPath);
                    if (found) return found;
                }
            }
            
            return null;
        }
        
        const iconTextGridResult = findIconTextGridBlock(homePage.blocks);
        
        if (!iconTextGridResult) {
            console.log('❌ IconTextGrid block not found');
            return;
        }
        
        const { block, path } = iconTextGridResult;
        console.log('✅ IconTextGrid block found at path:', path);
        console.log('\n--- Block Structure ---');
        console.log('Block name:', block.blockName);
        console.log('Has attrs:', !!block.attrs);
        console.log('Has data:', !!block.attrs?.data);
        
        if (block.attrs?.data) {
            console.log('\n--- Block Data ---');
            console.log('Data keys:', Object.keys(block.attrs.data));
            console.log('Items:', block.attrs.data.items);
            console.log('Items type:', typeof block.attrs.data.items);
            
            if (block.attrs.data.items) {
                console.log('Items is array:', Array.isArray(block.attrs.data.items));
                
                if (Array.isArray(block.attrs.data.items)) {
                    console.log('Items length:', block.attrs.data.items.length);
                    
                    block.attrs.data.items.forEach((item, index) => {
                        console.log(`\n--- Item ${index + 1} ---`);
                        console.log('Text:', item.text);
                        console.log('Link:', item.link);
                        console.log('Icon:', item.icon);
                        console.log('Icon type:', typeof item.icon);
                        
                        if (item.icon && typeof item.icon === 'object') {
                            console.log('Icon keys:', Object.keys(item.icon));
                            console.log('Icon URL:', item.icon.url);
                            console.log('Icon alt:', item.icon.alt);
                        }
                    });
                } else if (typeof block.attrs.data.items === 'object') {
                    console.log('Items object keys:', Object.keys(block.attrs.data.items));
                    console.log('Items object values:', Object.values(block.attrs.data.items));
                }
            } else {
                console.log('❌ No items found in block data');
            }
        } else {
            console.log('❌ No data found in block attrs');
            console.log('Block attrs:', block.attrs);
        }
        
        console.log('\n--- Full Block JSON ---');
        console.log(JSON.stringify(block, null, 2));

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testIconTextGridData();