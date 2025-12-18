/**
 * Test script to verify Infinity Testimonial Both Side block registration
 */

const WORDPRESS_URL = process.env.WORDPRESS_URL || 'https://dev.moreyeahs.com';

async function testInfinityTestimonialBlock() {
  try {
    console.log('🧪 Testing Infinity Testimonial Both Side Block...\n');
    
    // Test 1: Check if WordPress is accessible
    console.log('1. Testing WordPress connection...');
    const wpResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/`);
    
    if (!wpResponse.ok) {
      throw new Error(`WordPress not accessible: ${wpResponse.status}`);
    }
    
    console.log('✅ WordPress connection successful\n');
    
    // Test 2: Check block types endpoint
    console.log('2. Checking available block types...');
    const blockTypesResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/block-types`);
    
    if (blockTypesResponse.ok) {
      const blockTypes = await blockTypesResponse.json();
      const infinityTestimonialBlock = blockTypes.find(block => 
        block.name === 'acf/infinity-testimonial-both-side'
      );
      
      if (infinityTestimonialBlock) {
        console.log('✅ Infinity Testimonial Both Side block is registered!');
        console.log(`   Title: ${infinityTestimonialBlock.title}`);
        console.log(`   Category: ${infinityTestimonialBlock.category}`);
        console.log(`   Description: ${infinityTestimonialBlock.description}`);
      } else {
        console.log('❌ Infinity Testimonial Both Side block not found in registered blocks');
        console.log('   Available ACF blocks:');
        blockTypes
          .filter(block => block.name.startsWith('acf/'))
          .forEach(block => console.log(`   - ${block.name}: ${block.title}`));
      }
    } else {
      console.log('⚠️  Block types endpoint not available');
    }
    
    console.log('\n3. Testing ACF field groups...');
    
    // Test 3: Check if ACF field group exists (if ACF REST API is enabled)
    try {
      const acfResponse = await fetch(`${WORDPRESS_URL}/wp-json/acf/v3/field-groups`);
      
      if (acfResponse.ok) {
        const fieldGroups = await acfResponse.json();
        const infinityTestimonialGroup = fieldGroups.find(group => 
          group.key === 'group_infinity_testimonial_both_side_block'
        );
        
        if (infinityTestimonialGroup) {
          console.log('✅ ACF field group found!');
          console.log(`   Title: ${infinityTestimonialGroup.title}`);
          console.log(`   Fields count: ${infinityTestimonialGroup.fields?.length || 'N/A'}`);
        } else {
          console.log('❌ ACF field group not found');
        }
      } else {
        console.log('⚠️  ACF REST API not available (this is normal if ACF REST API is not enabled)');
      }
    } catch (acfError) {
      console.log('⚠️  Could not check ACF field groups (this is normal)');
    }
    
    console.log('\n4. Testing Next.js component...');
    
    // Test 4: Check if the React component file exists
    const fs = require('fs');
    const path = require('path');
    
    const componentPath = path.join(__dirname, 'src/components/blocks/infinity-testimonial-both-side/InfinityTestimonialBothSideBlock.tsx');
    const stylesPath = path.join(__dirname, 'src/components/blocks/infinity-testimonial-both-side/styles.scss');
    
    if (fs.existsSync(componentPath)) {
      console.log('✅ React component file exists');
    } else {
      console.log('❌ React component file missing');
    }
    
    if (fs.existsSync(stylesPath)) {
      console.log('✅ Styles file exists');
    } else {
      console.log('❌ Styles file missing');
    }
    
    // Test 5: Check BlockRenderer registration
    const blockRendererPath = path.join(__dirname, 'src/components/blocks/BlockRenderer.tsx');
    if (fs.existsSync(blockRendererPath)) {
      const blockRendererContent = fs.readFileSync(blockRendererPath, 'utf8');
      if (blockRendererContent.includes('infinity-testimonial-both-side')) {
        console.log('✅ Block registered in BlockRenderer');
      } else {
        console.log('❌ Block not registered in BlockRenderer');
      }
    }
    
    console.log('\n📋 Summary:');
    console.log('- WordPress Block: Check admin dashboard for "Infinity Testimonial Both Side" block');
    console.log('- ACF Fields: Check ACF > Field Groups for "Infinity Testimonial Both Side Block"');
    console.log('- Next.js Test: Visit /test-infinity-testimonial to see the component in action');
    console.log('- WordPress Files: Check wp-content/themes/twentytwentyfive-child/blocks/infinity-testimonial-both-side/');
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Go to WordPress admin > Pages/Posts');
    console.log('2. Add a new block and search for "Infinity Testimonial Both Side"');
    console.log('3. Configure the block with your testimonials');
    console.log('4. Test both scroll directions and video uploads');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Ensure WordPress is running and accessible');
    console.log('2. Check if ACF plugin is active');
    console.log('3. Verify the child theme is active');
    console.log('4. Check WordPress error logs');
  }
}

// Run the test
testInfinityTestimonialBlock();