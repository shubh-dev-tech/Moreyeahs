// Using built-in fetch (Node.js 18+)

async function testNavigationNextBlock() {
    try {
        console.log('Testing Navigation Next Block API...\n');
        
        // Test the home page API endpoint
        const response = await fetch('http://localhost/moreyeahs-new/wp-json/wp/v2/pages-with-blocks/home');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('=== HOME PAGE INFO ===');
        console.log(`Page ID: ${data.id}`);
        console.log(`Page Title: ${data.title}`);
        console.log(`Total blocks: ${data.blocks.length}\n`);
        
        // Find navigation-next-block
        let navigationBlock = null;
        let blockIndex = -1;
        
        function findNavigationBlock(blocks, parentIndex = '') {
            blocks.forEach((block, index) => {
                const currentIndex = parentIndex ? `${parentIndex}.${index + 1}` : `${index + 1}`;
                
                if (block.blockName === 'acf/navigation-next-block') {
                    navigationBlock = block;
                    blockIndex = currentIndex;
                    return;
                }
                
                // Check inner blocks
                if (block.innerBlocks && block.innerBlocks.length > 0) {
                    findNavigationBlock(block.innerBlocks, currentIndex);
                }
            });
        }
        
        findNavigationBlock(data.blocks);
        
        if (navigationBlock) {
            console.log('=== NAVIGATION NEXT BLOCK FOUND ===');
            console.log(`Block position: ${blockIndex}`);
            console.log(`Block name: ${navigationBlock.blockName}`);
            
            if (navigationBlock.attrs && navigationBlock.attrs.data) {
                console.log('\n=== BLOCK DATA ===');
                console.log(JSON.stringify(navigationBlock.attrs.data, null, 2));
                
                // Check if regions are properly structured
                if (navigationBlock.attrs.data.regions) {
                    console.log('\n=== REGIONS DATA ===');
                    console.log(`Number of regions: ${navigationBlock.attrs.data.regions.length}`);
                    
                    navigationBlock.attrs.data.regions.forEach((region, index) => {
                        console.log(`Region ${index + 1}:`);
                        console.log(`  Name: ${region.name}`);
                        console.log(`  Link: ${region.link || 'No link'}`);
                    });
                } else {
                    console.log('\n❌ No regions data found');
                }
                
                // Check other fields
                console.log('\n=== OTHER FIELDS ===');
                console.log(`Heading: ${navigationBlock.attrs.data.heading || 'Not set'}`);
                console.log(`Button Text: ${navigationBlock.attrs.data.button_text || 'Not set'}`);
                console.log(`Button Link: ${navigationBlock.attrs.data.button_link || 'Not set'}`);
                
            } else {
                console.log('❌ No block data found');
            }
        } else {
            console.log('❌ Navigation Next Block not found on home page');
        }
        
    } catch (error) {
        console.error('Error testing Navigation Next Block:', error.message);
    }
}

testNavigationNextBlock();