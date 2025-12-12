/**
 * Debug script to check homepage testimonial rendering
 */

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost/moreyeahs-new';

async function debugHomepageTestimonials() {
    console.log('🏠 Debugging Homepage Testimonials...\n');
    
    try {
        // Test the pages-with-blocks endpoint for home
        const response = await fetch(`${API_URL}/wp-json/wp/v2/pages-with-blocks/home`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        console.log('📄 Homepage Data:');
        console.log(`- Title: ${data.title}`);
        console.log(`- ID: ${data.id}`);
        console.log(`- Total Blocks: ${data.blocks?.length || 0}\n`);
        
        // Find testimonial blocks recursively
        function findTestimonialBlocksRecursive(blocks, path = '') {
            let found = [];
            
            blocks?.forEach((block, index) => {
                const currentPath = path ? `${path}.innerBlocks[${index}]` : `blocks[${index}]`;
                
                if (block.blockName === 'acf/testimonial-block') {
                    found.push({ block, path: currentPath });
                }
                
                if (block.innerBlocks && block.innerBlocks.length > 0) {
                    found = found.concat(findTestimonialBlocksRecursive(block.innerBlocks, currentPath));
                }
            });
            
            return found;
        }
        
        const testimonialBlocks = findTestimonialBlocksRecursive(data.blocks);
        
        console.log(`🗣️ Testimonial Blocks Found: ${testimonialBlocks.length}\n`);
        
        testimonialBlocks.forEach(({ block, path }, index) => {
            console.log(`--- Testimonial Block ${index + 1} (${path}) ---`);
            console.log('Block Name:', block.blockName);
            console.log('Has attrs:', !!block.attrs);
            console.log('Has attrs.data:', !!block.attrs?.data);
            
            if (block.attrs?.data) {
                const blockData = block.attrs.data;
                
                console.log('\n📊 Block Data Structure:');
                console.log('- Keys:', Object.keys(blockData));
                console.log('- Heading:', blockData.heading);
                console.log('- Background Image URL:', blockData.background_image?.url);
                console.log('- Testimonials Count:', blockData.testimonials?.length || 0);
                
                if (blockData.testimonials && blockData.testimonials.length > 0) {
                    console.log('\n👥 Testimonials Preview:');
                    blockData.testimonials.forEach((testimonial, tIndex) => {
                        console.log(`  ${tIndex + 1}. "${testimonial.quote?.substring(0, 30)}..." - ${testimonial.author_name}`);
                        console.log(`     Image: ${testimonial.author_image?.url ? '✅' : '❌'}`);
                    });
                }
                
                console.log('\n🔧 Component Props (what BlockRenderer will pass):');
                console.log('- data prop will contain:', JSON.stringify(blockData, null, 2));
            } else {
                console.log('❌ No block data found');
            }
            
            console.log('\n' + '='.repeat(60) + '\n');
        });
        
        if (testimonialBlocks.length === 0) {
            console.log('❌ No testimonial blocks found');
            console.log('\n📋 All blocks on homepage:');
            data.blocks?.forEach((block, index) => {
                console.log(`${index + 1}. ${block.blockName}`);
                if (block.innerBlocks && block.innerBlocks.length > 0) {
                    block.innerBlocks.forEach((innerBlock, innerIndex) => {
                        console.log(`   ${index + 1}.${innerIndex + 1}. ${innerBlock.blockName}`);
                    });
                }
            });
        }
        
    } catch (error) {
        console.error('❌ Error debugging homepage testimonials:', error.message);
    }
}

// Run the debug
debugHomepageTestimonials();