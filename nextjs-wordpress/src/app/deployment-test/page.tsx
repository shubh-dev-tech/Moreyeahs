import { WORDPRESS_API_URL } from '@/lib/env';
import { getPageWithBlocks } from '@/lib/wpFetch';

export default async function DeploymentTestPage() {
  const testTime = new Date().toISOString();
  
  // Test the WordPress page fetch
  const wordpressPage = await getPageWithBlocks('wordpress');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Deployment Test</h1>
      
      <div className="space-y-4">
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="font-semibold">Test Time</h3>
          <p>{testTime}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold">WordPress API URL</h3>
          <p>{WORDPRESS_API_URL}</p>
        </div>
        
        <div className={`p-4 rounded ${wordpressPage ? 'bg-green-100' : 'bg-red-100'}`}>
          <h3 className="font-semibold">WordPress Page Test</h3>
          <p>{wordpressPage ? '✅ WordPress page found' : '❌ WordPress page not found'}</p>
          {wordpressPage && (
            <div className="mt-2">
              <p><strong>Title:</strong> {wordpressPage.title}</p>
              <p><strong>Slug:</strong> {wordpressPage.slug}</p>
              <p><strong>Has Blocks:</strong> {wordpressPage.blocks?.length > 0 ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>
        
        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="font-semibold">Links to Test</h3>
          <div className="space-y-2">
            <div>
              <a href="/web-and-app-development/wordpress" className="text-blue-600 hover:underline">
                /web-and-app-development/wordpress
              </a>
            </div>
            <div>
              <a href="/test-wp-api" className="text-blue-600 hover:underline">
                /test-wp-api (API Test)
              </a>
            </div>
            <div>
              <a href="/debug-wordpress" className="text-blue-600 hover:underline">
                /debug-wordpress (Debug Info)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}