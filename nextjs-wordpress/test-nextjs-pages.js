/**
 * Test Next.js pages data fetching simulation
 */

const { WORDPRESS_API_URL } = require('./src/lib/env.ts');

async function simulatePageDataFetching() {
  console.log('🚀 Simulating Next.js Page Data Fetching\n');
  console.log(`Using WordPress API: ${WORDPRESS_API_URL}`);

  // Simulate services page data fetching
  try {
    console.log('🧪 Simulating services page data fetching...');
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/pages?slug=services`);
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        console.log('✅ Services page - WordPress content will be used');
        console.log(`   Title: ${pages[0].title.rendered}`);
        console.log(`   Has content: ${pages[0].content.rendered.length > 0 ? 'YES' : 'NO'}`);
      } else {
        console.log('⚠️  Services page - Default content will be shown');
      }
    } else {
      console.log(`❌ Services page - HTTP ${response.status}, default content will be shown`);
    }
  } catch (error) {
    console.log(`❌ Services page - Error: ${error.message}, default content will be shown`);
  }

  // Simulate devops page data fetching
  try {
    console.log('\n🧪 Simulating devops page data fetching...');
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/pages?slug=devops`);
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        console.log('✅ DevOps page - WordPress content will be used');
        console.log(`   Title: ${pages[0].title.rendered}`);
        console.log(`   Has content: ${pages[0].content.rendered.length > 0 ? 'YES' : 'NO'}`);
      } else {
        console.log('⚠️  DevOps page - Default content will be shown');
      }
    } else {
      console.log(`❌ DevOps page - HTTP ${response.status}, default content will be shown`);
    }
  } catch (error) {
    console.log(`❌ DevOps page - Error: ${error.message}, default content will be shown`);
  }

  console.log('\n🎉 Page data fetching simulation completed!');
  console.log('\n📝 Both pages should now load properly on localhost:3000');
}

simulatePageDataFetching().catch(console.error);