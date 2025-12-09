// Quick diagnostic script to check if services page exists in WordPress
const fetch = require('node-fetch');

const WORDPRESS_API_URL = 'http://localhost/moreyeahs-new/graphql';

async function checkServicesPage() {
  const query = `
    query GetAllPages {
      pages(first: 100) {
        nodes {
          id
          title
          slug
          uri
          status
          date
        }
      }
    }
  `;

  try {
    console.log('🔍 Checking WordPress for pages...\n');
    
    const response = await fetch(WORDPRESS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('❌ GraphQL Errors:', result.errors);
      return;
    }

    const pages = result.data?.pages?.nodes || [];
    
    console.log(`✅ Found ${pages.length} pages in WordPress:\n`);
    
    pages.forEach((page, index) => {
      console.log(`${index + 1}. ${page.title}`);
      console.log(`   Slug: ${page.slug}`);
      console.log(`   URI: ${page.uri}`);
      console.log(`   Status: ${page.status}`);
      console.log(`   Date: ${page.date}`);
      console.log('');
    });

    // Check specifically for services page
    const servicesPage = pages.find(p => 
      p.slug === 'services' || 
      p.title.toLowerCase().includes('service')
    );

    if (servicesPage) {
      console.log('✅ Services page found!');
      console.log('   Title:', servicesPage.title);
      console.log('   Slug:', servicesPage.slug);
      console.log('   Status:', servicesPage.status);
      console.log('   URL should be: http://localhost:3000/' + servicesPage.slug);
    } else {
      console.log('❌ No services page found in WordPress');
      console.log('   Make sure the page is:');
      console.log('   1. Published (not draft)');
      console.log('   2. Has slug "services"');
      console.log('   3. Visible in WordPress admin');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkServicesPage();
