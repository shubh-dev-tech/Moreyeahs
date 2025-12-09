// Check what content the services page has
const fetch = require('node-fetch');

const WORDPRESS_API_URL = 'http://localhost/moreyeahs-new/graphql';

async function checkServicesContent() {
  const query = `
    query GetPage($slug: ID!) {
      page(id: $slug, idType: URI) {
        id
        title
        content
        slug
        status
        date
      }
    }
  `;

  try {
    console.log('🔍 Fetching services page content...\n');
    
    const response = await fetch(WORDPRESS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query,
        variables: { slug: 'services' }
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('❌ GraphQL Errors:', result.errors);
      return;
    }

    const page = result.data?.page;
    
    if (!page) {
      console.log('❌ Page not found!');
      return;
    }

    console.log('✅ Services Page Data:\n');
    console.log('Title:', page.title);
    console.log('Slug:', page.slug);
    console.log('Status:', page.status);
    console.log('Date:', page.date);
    console.log('\n📄 Content Length:', page.content?.length || 0, 'characters');
    console.log('\n📝 Content Preview:');
    console.log('─'.repeat(80));
    console.log(page.content || '(empty)');
    console.log('─'.repeat(80));

    if (!page.content || page.content.trim() === '') {
      console.log('\n⚠️  WARNING: The page has no content!');
      console.log('   Please add content to the Services page in WordPress dashboard.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkServicesContent();
