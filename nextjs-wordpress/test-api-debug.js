/**
 * Debug script to test WordPress API endpoints
 * Tests if the API is working and what data is available
 */

const testWordPressAPI = async () => {
  console.log('🔍 Testing WordPress API Endpoints...');
  
  try {
    // Test basic connection
    console.log('\n1. Testing basic WordPress connection...');
    const response = await fetch('http://localhost/moreyeahs-new/wp-json/wp/v2/posts?per_page=1');
    
    if (response.ok) {
      const posts = await response.json();
      console.log('✅ WordPress API is accessible');
      console.log(`   Found ${posts.length} post(s)`);
      
      if (posts.length > 0) {
        console.log(`   Sample post: "${posts[0].title.rendered}"`);
      }
    } else {
      console.log('❌ WordPress API not accessible');
      console.log(`   Status: ${response.status} ${response.statusText}`);
    }
    
    // Test post types endpoint
    console.log('\n2. Testing post types endpoint...');
    const typesResponse = await fetch('http://localhost/moreyeahs-new/wp-json/wp/v2/types');
    
    if (typesResponse.ok) {
      const types = await typesResponse.json();
      console.log('✅ Post types endpoint working');
      console.log('   Available post types:');
      
      Object.keys(types).forEach(key => {
        const type = types[key];
        console.log(`   - ${key}: ${type.name} (REST: ${type.rest_base})`);
      });
    } else {
      console.log('❌ Post types endpoint not working');
      console.log(`   Status: ${typesResponse.status} ${typesResponse.statusText}`);
    }
    
    // Test categories endpoint
    console.log('\n3. Testing categories endpoint...');
    const categoriesResponse = await fetch('http://localhost/moreyeahs-new/wp-json/wp/v2/categories?per_page=5');
    
    if (categoriesResponse.ok) {
      const categories = await categoriesResponse.json();
      console.log('✅ Categories endpoint working');
      console.log(`   Found ${categories.length} categories:`);
      
      categories.forEach(cat => {
        console.log(`   - ID: ${cat.id}, Name: ${cat.name}, Slug: ${cat.slug}`);
      });
    } else {
      console.log('❌ Categories endpoint not working');
      console.log(`   Status: ${categoriesResponse.status} ${categoriesResponse.statusText}`);
    }
    
    // Test posts with categories
    console.log('\n4. Testing posts with category filter...');
    const postsWithCatResponse = await fetch('http://localhost/moreyeahs-new/wp-json/wp/v2/posts?per_page=2&_embed=true');
    
    if (postsWithCatResponse.ok) {
      const postsWithCat = await postsWithCatResponse.json();
      console.log('✅ Posts with embed working');
      console.log(`   Found ${postsWithCat.length} posts with embedded data`);
      
      postsWithCat.forEach(post => {
        const hasImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
        console.log(`   - "${post.title.rendered}" (Image: ${hasImage ? 'Yes' : 'No'})`);
      });
    } else {
      console.log('❌ Posts with embed not working');
      console.log(`   Status: ${postsWithCatResponse.status} ${postsWithCatResponse.statusText}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing WordPress API:', error.message);
    console.log('\n💡 Possible issues:');
    console.log('   - WordPress is not running');
    console.log('   - Incorrect URL (check if localhost/moreyeahs-new is correct)');
    console.log('   - CORS issues');
    console.log('   - Network connectivity problems');
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('   1. Ensure WordPress is running on localhost');
  console.log('   2. Check if the URL http://localhost/moreyeahs-new is correct');
  console.log('   3. Verify REST API is enabled in WordPress');
  console.log('   4. Check browser console for CORS errors');
};

// Run the test
testWordPressAPI();