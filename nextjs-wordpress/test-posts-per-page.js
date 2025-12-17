// Simple test to check posts per page issue
const https = require('https');
const http = require('http');

async function testPostsAPI() {
  console.log('Testing WordPress Posts API...\n');

  // Determine the WordPress URL based on environment
  const wpUrl = 'http://localhost/moreyeahs-new'; // Local development URL
  const apiBase = `${wpUrl}/wp-json/wp/v2`;

  function makeRequest(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      
      protocol.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse JSON: ${e.message}`));
          }
        });
      }).on('error', reject);
    });
  }

  try {
    // Test 1: Check WordPress settings
    console.log('1. Checking WordPress settings...');
    try {
      const settings = await makeRequest(`${apiBase}/settings`);
      console.log(`   Posts per page setting: ${settings.posts_per_page || 'unknown'}`);
    } catch (e) {
      console.log(`   Could not fetch settings: ${e.message}`);
    }

    // Test 2: Test different per_page values
    console.log('\n2. Testing different per_page values...');
    
    const tests = [2, 4, 6, 10];
    for (const perPage of tests) {
      try {
        const posts = await makeRequest(`${apiBase}/posts?per_page=${perPage}&_embed=true`);
        console.log(`   per_page=${perPage}: Got ${posts.length} posts`);
        
        if (posts.length > 0) {
          console.log(`     First post: "${posts[0].title.rendered}"`);
          console.log(`     Categories: [${posts[0].categories.join(', ')}]`);
        }
      } catch (e) {
        console.log(`   per_page=${perPage}: Error - ${e.message}`);
      }
    }

    // Test 3: Check total posts count
    console.log('\n3. Checking total posts...');
    try {
      const allPosts = await makeRequest(`${apiBase}/posts?per_page=100`);
      console.log(`   Total posts available: ${allPosts.length}`);
    } catch (e) {
      console.log(`   Could not fetch all posts: ${e.message}`);
    }

    // Test 4: Check categories
    console.log('\n4. Checking categories...');
    try {
      const categories = await makeRequest(`${apiBase}/categories`);
      console.log(`   Total categories: ${categories.length}`);
      if (categories.length > 0) {
        categories.slice(0, 3).forEach(cat => {
          console.log(`     - ${cat.name} (ID: ${cat.id}, Slug: ${cat.slug}, Count: ${cat.count})`);
        });
      }
    } catch (e) {
      console.log(`   Could not fetch categories: ${e.message}`);
    }

    // Test 5: Test category filtering
    console.log('\n5. Testing category filtering...');
    try {
      const categories = await makeRequest(`${apiBase}/categories`);
      if (categories.length > 0) {
        const firstCat = categories[0];
        const categoryPosts = await makeRequest(`${apiBase}/posts?per_page=4&categories=${firstCat.id}`);
        console.log(`   Posts in category "${firstCat.name}": ${categoryPosts.length}`);
      }
    } catch (e) {
      console.log(`   Category filtering test failed: ${e.message}`);
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testPostsAPI();