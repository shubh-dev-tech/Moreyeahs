import { WORDPRESS_API_URL } from '@/lib/env';

export default async function TestWPAPIPage() {
  let testResults = {
    basicConnectivity: false,
    pagesEndpoint: false,
    customEndpoint: false,
    error: ''
  };

  try {
    // Test basic WordPress REST API
    const basicResponse = await fetch(`${WORDPRESS_API_URL}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 0 }
    });
    testResults.basicConnectivity = basicResponse.ok;

    // Test pages endpoint
    const pagesResponse = await fetch(`${WORDPRESS_API_URL}/wp/v2/pages?per_page=1`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 0 }
    });
    testResults.pagesEndpoint = pagesResponse.ok;

    // Test custom endpoint
    const customResponse = await fetch(`${WORDPRESS_API_URL}/wp/v2/pages-with-blocks/wordpress`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 0 }
    });
    testResults.customEndpoint = customResponse.ok;

  } catch (error) {
    testResults.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">WordPress API Test</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p><strong>API URL:</strong> {WORDPRESS_API_URL}</p>
      </div>

      <div className="space-y-4">
        <div className={`p-4 rounded ${testResults.basicConnectivity ? 'bg-green-100' : 'bg-red-100'}`}>
          <h3 className="font-semibold">Basic API Connectivity</h3>
          <p>{testResults.basicConnectivity ? '✅ Connected' : '❌ Failed'}</p>
        </div>

        <div className={`p-4 rounded ${testResults.pagesEndpoint ? 'bg-green-100' : 'bg-red-100'}`}>
          <h3 className="font-semibold">Pages Endpoint</h3>
          <p>{testResults.pagesEndpoint ? '✅ Working' : '❌ Failed'}</p>
        </div>

        <div className={`p-4 rounded ${testResults.customEndpoint ? 'bg-green-100' : 'bg-red-100'}`}>
          <h3 className="font-semibold">Custom Pages-with-Blocks Endpoint</h3>
          <p>{testResults.customEndpoint ? '✅ Working' : '❌ Failed'}</p>
        </div>

        {testResults.error && (
          <div className="bg-red-100 p-4 rounded">
            <h3 className="font-semibold">Error</h3>
            <p>{testResults.error}</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <a href="/web-and-app-development/wordpress" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Test WordPress Page
        </a>
      </div>
    </div>
  );
}