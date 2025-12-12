/**
 * Test IconTextGrid block specifically
 */

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost/moreyeahs-new';

async function testIconTextGrid() {
    console.log('🔍 Testing IconTextGrid block...\n');

    try {
        // Test 1: Get homepage
        console.log('1. Testing homepage endpoint...');
        const homeResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages-with-blocks/home`);
        
        if (!homeResponse.ok) {
            console.error('❌ Failed to fetch homepage:', homeResponse.status, homeResponse.statusText);
            return;
        }

        const homePage = await homeResponse.json();
        console.log('✅ Homepage found');
        console.log('🧱 Total blocks:', homePage.blocks?.length || 0);
        
        // Find IconTextGrid blocks
        const iconTextGridBlocks = homePage.blocks?.filter(block => 
            block.blockName === 'acf/icon-text-grid'
        ) || [];
        
        console.log('🎯 IconTextGrid blocks found:', iconTextGridBlocks.length);
        
        if (iconTextGridBlocks.length === 0) {
            console.log('\n📋 All blocks on homepage:');
            homePage.blocks?.forEach((block, index) => {
                console.log(`  ${index + 1}. ${block.blockName}`);
            });
        } else {
            iconTextGridBlocks.forEach((block, index) => {
                console.log(`\n--- IconTextGrid Block ${index + 1} ---`);
                console.log('Block name:', block.blockName);
                console.log('Has data:', !!block.attrs?.data);
                if (block.attrs?.data) {
                    console.log('Data keys:', Object.keys(block.attrs.data));
                    console.log('Items:', block.attrs.data.items);
                    console.log('Items type:', typeof block.attrs.data.items);
                    console.log('Items length:', Array.isArray(block.attrs.data.items) ? block.attrs.data.items.length : 'Not array');
                }
            });
        }

        // Test 2: Check all pages for IconTextGrid
        console.log('\n2. Checking all pages for IconTextGrid blocks...');
        const pagesResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages`);
        
        if (pagesResponse.ok) {
            const pages = await pagesResponse.json();
            console.log('📄 Total pages:', pages.length);
            
            for (const page of pages) {
                const pageWithBlocksResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages-with-blocks/${page.slug}`);
                
                if (pageWithBlocksResponse.ok) {
                    const pageWithBlocks = await pageWithBlocksResponse.json();
                    const iconGridBlocks = pageWithBlocks.blocks?.filter(block => 
                        block.blockName === 'acf/icon-text-grid'
                    ) || [];
                    
                    if (iconGridBlocks.length > 0) {
                        console.log(`  ✅ Found ${iconGridBlocks.length} IconTextGrid block(s) on page: ${page.title.rendered} (${page.slug})`);
                    }
                }
            }
        }

        // Test 3: Check ACF field groups
        console.log('\n3. Checking ACF field groups...');
        const fieldGroupsResponse = await fetch(`${WORDPRESS_URL}/wp-json/acf/v3/field-groups`);
        
        if (fieldGroupsResponse.ok) {
            const fieldGroups = await fieldGroupsResponse.json();
            const iconTextGridGroup = fieldGroups.find(group => 
                group.key === 'group_icon_text_grid' || group.title === 'Icon Text Grid'
            );
            
            if (iconTextGridGroup) {
                console.log('✅ IconTextGrid field group found:', iconTextGridGroup.title);
            } else {
                console.log('❌ IconTextGrid field group not found');
                console.log('Available field groups:');
                fieldGroups.forEach(group => {
                    console.log(`  - ${group.title} (${group.key})`);
                });
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testIconTextGrid();