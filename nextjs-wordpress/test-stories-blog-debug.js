const { fetchWordPressAPI } = require('./src/lib/wordpress');

async function testStoriesBlogAPI() {
  console.log('Testing Stories Blog Block API calls...\n');

  try {
    // Test 1: Basic posts endpoint
    console.log('1. Testing basic posts endpoint:');
    const basicPosts = await fetchWordPressAPI('/wp/v2/posts?per_page=4&_embed=true&orderby=date&order=desc');
    console.log(`   Found ${basicPosts?.length || 0} posts`);
    
    if (basicPosts && basicPosts.length > 0) {
      console.log(`   First post: ${basicPosts[0].title.rendered}`);
      console.log(`   Categories: ${basicPosts[0].categories}`);
    }

    // Test 2: Categories endpoint
    console.log('\n2. Testing categories endpoint:');
    const categories = await fetchWordPressAPI('/wp/v2/categories');
    console.log(`   Found ${categories?.length || 0} categories`);
    
    if (categories && categories.length > 0) {
      categories.forEach(cat => {
        console.log(`   - ${cat.name} (ID: ${cat.id}, Slug: ${cat.slug})`);
      });
    }

    // Test 3: Posts with category filter (by ID)
    if (categories && categories.length > 0) {
      const firstCategoryId = categories[0].id;
      console.log(`\n3. Testing posts with category filter (ID: ${firstCategoryId}):`);
      const categoryPosts = await fetchWordPressAPI(`/wp/v2/posts?per_page=4&_embed=true&categories=${firstCategoryId}&orderby=date&order=desc`);
      console.log(`   Found ${categoryPosts?.length || 0} posts for category ${categories[0].name}`);
    }

    // Test 4: Posts with category filter (by slug)
    if (categories && categories.length > 0) {
      const firstCategorySlug = categories[0].slug;
      console.log(`\n4. Testing category lookup by slug (${firstCategorySlug}):`);
      const categoryBySlug = await fetchWordPressAPI(`/wp/v2/categories?slug=${firstCategorySlug}`);
      console.log(`   Found ${categoryBySlug?.length || 0} categories with slug ${firstCategorySlug}`);
      
      if (categoryBySlug && categoryBySlug.length > 0) {
        const categoryId = categoryBySlug[0].id;
        console.log(`   Category ID: ${categoryId}`);
        
        const postsWithSlugCategory = await fetchWordPressAPI(`/wp/v2/posts?per_page=4&_embed=true&categories=${categoryId}&orderby=date&order=desc`);
        console.log(`   Found ${postsWithSlugCategory?.length || 0} posts for category slug ${firstCategorySlug}`);
      }
    }

    // Test 5: Check per_page parameter
    console.log('\n5. Testing per_page parameter:');
    const twoPostsTest = await fetchWordPressAPI('/wp/v2/posts?per_page=2&_embed=true&orderby=date&order=desc');
    console.log(`   Requested 2 posts, got ${twoPostsTest?.length || 0} posts`);
    
    const fourPostsTest = await fetchWordPressAPI('/wp/v2/posts?per_page=4&_embed=true&orderby=date&order=desc');
    console.log(`   Requested 4 posts, got ${fourPostsTest?.length || 0} posts`);

    // Test 6: Check WordPress settings
    console.log('\n6. Testing WordPress settings:');
    const settings = await fetchWordPressAPI('/wp/v2/settings');
    console.log(`   Posts per page setting: ${settings?.posts_per_page || 'unknown'}`);

  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testStoriesBlogAPI();