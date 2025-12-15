/**
 * Check home page blocks
 */

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost/moreyeahs-new';

async function checkHomePage() {
    try {
        console.log('🏠 Checking Home Page...\n');
        
        // Get home page with blocks
        const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/pages-with-blocks/home`);
        
        if (!response.ok) {
            console.error('❌ Failed to fetch home page:', response.status);
            return;
        }
        
        const pageData = await response.json();
        
        console.log('📄 Page Info:');
        console.log('  ID:', pageData.id);
        console.log('  Title:', pageData.title);
        console.log('  Slug:', pageData.slug);
        console.log('  Total Blocks:', pageData.blocks?.length || 0);
        console.log('  Content length:', pageData.content?.length || 0);
        
        if (pageData.blocks && pageData.blocks.length > 0) {
            console.log('\n🧱 Blocks:');
            pageData.blocks.forEach((block, index) => {
                console.log(`  ${index + 1}. ${block.blockName}`);
                if (block.attrs?.data) {
                    const dataKeys = Object.keys(block.attrs.data);
                    console.log(`     Data keys (${dataKeys.length}): ${dataKeys.slice(0, 3).join(', ')}${dataKeys.length > 3 ? '...' : ''}`);
                }
            });
        } else {
            console.log('\n⚠️ No blocks found in home page!');
            console.log('Content preview:', pageData.content?.substring(0, 200) + '...');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkHomePage();
