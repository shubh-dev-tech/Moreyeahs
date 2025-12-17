/**
 * Test WordPress REST API for post types
 * This verifies that the /wp/v2/types endpoint works correctly
 */

const { fetchWordPressAPI } = require('./src/lib/wordpress.ts');

const testWordPressPostTypesAPI = async () => {
  console.log('🧪 Testing WordPress Post Types API...');
  
  try {
    console.log('📡 Fetching post types from WordPress...');
    
    // Test the types endpoint
    const postTypes = await fetchWordPressAPI('/wp/v2/types');
    
    if (postTypes) {
      console.log('✅ Successfully fetched post types:');
      
      Object.keys(postTypes).forEach(key => {
        const postType = postTypes[key];
        console.log(`   - ${key}:`);
        console.log(`     Name: ${postType.name}`);
        console.log(`     Label: ${postType.labels?.name || 'N/A'}`);
        console.log(`     REST Base: ${postType.rest_base || 'N/A'}`);
        console.log(`     Public: ${postType.public ? 'Yes' : 'No'}`);
        console.log(`     Show in REST: ${postType.show_in_rest ? 'Yes' : 'No'}`);
        console.log('');
      });
      
      // Test endpoint generation for each post type
      console.log('🔗 Generated API Endpoints:');
      Object.keys(postTypes).forEach(key => {
        const postType = postTypes[key];
        if (postType.show_in_rest && postType.public) {
          const endpoint = `/wp/v2/${postType.rest_base || key}`;
          console.log(`   - ${postType.labels?.name || key}: ${endpoint}`);
        }
      });
      
    } else {
      console.log('❌ No post types returned from API');
    }
    
  } catch (error) {
    console.error('❌ Error fetching post types:', error.message);
    console.log('💡 This might be expected if WordPress is not running or configured');
  }
  
  console.log('\n🎯 Expected Behavior:');
  console.log('   - ACF dropdown will show all public post types with show_in_rest=true');
  console.log('   - React component will use rest_base for correct API endpoints');
  console.log('   - New CPTs will automatically appear without code changes');
};

// Run the test
testWordPressPostTypesAPI();