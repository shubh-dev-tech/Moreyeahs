/**
 * Test script to verify testimonial data is properly loaded and transformed
 */

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://dev.moreyeahs.com';

async function testTestimonialData() {
    console.log('🧪 Testing Testimonial Data Transformation...\n');
    
    try {
        // Test the pages-with-blocks endpoint for home
        const response = await fetch(`${API_URL}/wp-json/wp/v2/pages-with-blocks/home`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Find testimonial blocks recursively
        function findTestimonialBlocks(blocks) {
            let found = [];
            
            blocks?.forEach((block) => {
                if (block.blockName === 'acf/testimonial-block') {
                    found.push(block);
                }
                
                if (block.innerBlocks && block.innerBlocks.length > 0) {
                    found = found.concat(findTestimonialBlocks(block.innerBlocks));
                }
            });
            
            return found;
        }
        
        const testimonialBlocks = findTestimonialBlocks(data.blocks);
        
        if (testimonialBlocks.length === 0) {
            console.log('❌ No testimonial blocks found');
            return;
        }
        
        const testimonialBlock = testimonialBlocks[0];
        const blockData = testimonialBlock.attrs?.data;
        
        if (!blockData) {
            console.log('❌ No block data found');
            return;
        }
        
        console.log('✅ Testimonial Block Found');
        console.log(`📊 Block has ${blockData.testimonials?.length || 0} testimonials`);
        
        // Test data structure
        const tests = [
            {
                name: 'Has testimonials array',
                test: () => Array.isArray(blockData.testimonials),
                expected: true
            },
            {
                name: 'Testimonials count matches',
                test: () => blockData.testimonials?.length > 0,
                expected: true
            },
            {
                name: 'First testimonial has quote',
                test: () => blockData.testimonials?.[0]?.quote?.length > 0,
                expected: true
            },
            {
                name: 'First testimonial has author_name',
                test: () => blockData.testimonials?.[0]?.author_name?.length > 0,
                expected: true
            },
            {
                name: 'First testimonial has author_image',
                test: () => blockData.testimonials?.[0]?.author_image?.url?.length > 0,
                expected: true
            },
            {
                name: 'Background image is properly expanded',
                test: () => blockData.background_image?.url?.length > 0,
                expected: true
            },
            {
                name: 'No flattened keys remain',
                test: () => !Object.keys(blockData).some(key => key.includes('testimonials_0_')),
                expected: true
            }
        ];
        
        console.log('\n🧪 Running Tests:');
        let passed = 0;
        let failed = 0;
        
        tests.forEach(({ name, test, expected }) => {
            try {
                const result = test();
                if (result === expected) {
                    console.log(`✅ ${name}`);
                    passed++;
                } else {
                    console.log(`❌ ${name} (got: ${result}, expected: ${expected})`);
                    failed++;
                }
            } catch (error) {
                console.log(`❌ ${name} (error: ${error.message})`);
                failed++;
            }
        });
        
        console.log(`\n📈 Results: ${passed} passed, ${failed} failed`);
        
        if (failed === 0) {
            console.log('🎉 All tests passed! Testimonial data is properly transformed.');
        } else {
            console.log('⚠️ Some tests failed. Check the data transformation.');
        }
        
        // Show sample testimonial data
        if (blockData.testimonials && blockData.testimonials.length > 0) {
            console.log('\n📝 Sample Testimonial Data:');
            const sample = blockData.testimonials[0];
            console.log(`Quote: "${sample.quote}"`);
            console.log(`Author: ${sample.author_name} - ${sample.author_title}`);
            console.log(`Image URL: ${sample.author_image?.url || 'No image'}`);
        }
        
    } catch (error) {
        console.error('❌ Error testing testimonial data:', error.message);
    }
}

// Run the test
testTestimonialData();