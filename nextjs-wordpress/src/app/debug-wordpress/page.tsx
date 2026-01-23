import { WORDPRESS_API_URL } from '@/lib/env';
import { wpFetch, getPageWithBlocks, getPageBySlug } from '@/lib/wpFetch';

export default async function DebugWordPressPage() {
  // Test basic connectivity
  let apiConnectivity = 'Unknown';
  let apiError = '';
  
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/pages?per_page=1`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 0 }
    });
    
    if (response.ok) {
      apiConnectivity = 'Connected';
    } else {
      apiConnectivity = `Failed (${response.status})`;
      apiError = response.statusText;
    }
  } catch (error) {
    apiConnectivity = 'Failed';
    apiError = error instanceof Error ? error.message : 'Unknown error';
  }

  // Test specific page endpoints
  const testResults = {
    hierarchicalSlug: await getPageWithBlocks('web-and-app-development/wordpress'),
    simpleSlug: await getPageWithBlocks('wordpress'),
    fallbackSlug: await getPageBySlug('wordpress'),
    fallbackHierarchical: await getPageBySlug('web-and-app-development/wordpress'),
  };

  // Get all pages to see what's available
  let allPages: any[] = [];
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/pages?per_page=100`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 0 }
    });
    
    if (response.ok) {
      allPages = await response.json();
    }
  } catch (error) {
    // Ignore error
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">WordPress API Debug</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Environment Info</h2>
          <p><strong>WordPress API URL:</strong> {WORDPRESS_API_URL}</p>
          <p><strong>API Connectivity:</strong> <span className={apiConnectivity === 'Connected' ? 'text-green-600' : 'text-red-600'}>{apiConnectivity}</span></p>
          {apiError && <p><strong>Error:</strong> {apiError}</p>}
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Page Fetch Tests</h2>
          <div className="space-y-2">
            <p><strong>Hierarchical Slug (web-and-app-development/wordpress):</strong> {testResults.hierarchicalSlug ? '✅ Found' : '❌ Not Found'}</p>
            <p><strong>Simple Slug (wordpress):</strong> {testResults.simpleSlug ? '✅ Found' : '❌ Not Found'}</p>
            <p><strong>Fallback Slug (wordpress):</strong> {testResults.fallbackSlug ? '✅ Found' : '❌ Not Found'}</p>
            <p><strong>Fallback Hierarchical:</strong> {testResults.fallbackHierarchical ? '✅ Found' : '❌ Not Found'}</p>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Available Pages</h2>
          {allPages.length > 0 ? (
            <div className="max-h-64 overflow-y-auto">
              <ul className="space-y-1">
                {allPages.map((page: any) => (
                  <li key={page.id} className="text-sm">
                    <strong>{page.title?.rendered || 'No Title'}</strong> - 
                    Slug: <code className="bg-gray-200 px-1 rounded">{page.slug}</code>
                    {page.parent > 0 && ` (Parent: ${page.parent})`}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No pages found or API error</p>
          )}
        </div>

        {testResults.hierarchicalSlug && (
          <div className="bg-green-50 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Found Page Data</h2>
            <pre className="text-sm overflow-x-auto bg-white p-2 rounded">
              {JSON.stringify(testResults.hierarchicalSlug, null, 2)}
            </pre>
          </div>
        )}

        {testResults.simpleSlug && !testResults.hierarchicalSlug && (
          <div className="bg-yellow-50 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Fallback Page Data</h2>
            <pre className="text-sm overflow-x-auto bg-white p-2 rounded">
              {JSON.stringify(testResults.simpleSlug, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}