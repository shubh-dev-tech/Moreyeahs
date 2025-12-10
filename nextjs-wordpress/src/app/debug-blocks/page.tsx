import { fetchGraphQL } from '@/lib/wordpress';

interface DebugPageData {
  page: {
    id: string;
    title: string;
    content: string;
    slug: string;
  } | null;
}

async function getDebugPageData(slug: string = 'home') {
  // Test REST API endpoint
  let restApiData = null;
  try {
    const response = await fetch(`${process.env.WORDPRESS_REST_API_URL}/wp/v2/pages-with-blocks/${slug}`);
    if (response.ok) {
      restApiData = await response.json();
    } else {
      console.log('REST API Response Status:', response.status);
    }
  } catch (error) {
    console.log('REST API Error:', error);
  }

  // Test GraphQL
  let graphqlData = null;
  const query = `
    query GetPage($slug: ID!) {
      page(id: $slug, idType: URI) {
        id
        title
        content
        slug
      }
    }
  `;

  try {
    const data = await fetchGraphQL<DebugPageData>(query, { slug });
    graphqlData = data.page;
  } catch (error) {
    console.log('GraphQL Error:', error);
  }

  return {
    restApiData,
    graphqlData,
    slug,
    apiUrl: process.env.WORDPRESS_REST_API_URL
  };
}

export default async function DebugBlocksPage() {
  const debugData = await getDebugPageData();

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Blocks Page</h1>
      
      <h2>Environment</h2>
      <pre>{JSON.stringify({
        WORDPRESS_REST_API_URL: process.env.WORDPRESS_REST_API_URL,
        WORDPRESS_API_URL: process.env.WORDPRESS_API_URL,
        NEXT_PUBLIC_WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL
      }, null, 2)}</pre>

      <h2>REST API Data</h2>
      <pre>{JSON.stringify(debugData.restApiData, null, 2)}</pre>

      <h2>GraphQL Data</h2>
      <pre>{JSON.stringify(debugData.graphqlData, null, 2)}</pre>

      <h2>Test URLs</h2>
      <ul>
        <li><a href={`${debugData.apiUrl}/wp/v2/pages-with-blocks/home`} target="_blank">REST API Test</a></li>
        <li><a href={`${debugData.apiUrl}/wp/v2/pages`} target="_blank">WordPress Pages API</a></li>
      </ul>
    </div>
  );
}