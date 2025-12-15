/**
 * Debug page for Full Width Left Text Section blocks
 */

import { fetchWordPressAPI, transformMediaUrl } from '@/lib/wordpress';

async function getPageData() {
  try {
    // Try to get the home page data
    let pageData = null;
    
    try {
      pageData = await fetchWordPressAPI<any>('/wp/v2/pages-with-blocks/home');
    } catch (error) {
      try {
        pageData = await fetchWordPressAPI<any>('/wp/v2/pages-with-blocks/homepage');
      } catch (error) {
        const pages = await fetchWordPressAPI<any[]>('/wp/v2/pages?per_page=1&status=publish');
        if (pages && pages.length > 0) {
          const firstPage = pages[0];
          pageData = await fetchWordPressAPI<any>(`/wp/v2/pages-with-blocks/${firstPage.slug}`);
        }
      }
    }
    
    return pageData;
  } catch (error) {
    console.error('Error fetching page data:', error);
    return null;
  }
}

export default async function DebugFullWidth() {
  const page = await getPageData();

  if (!page) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Debug: No Page Data</h1>
        <p>Could not fetch page data from WordPress.</p>
      </div>
    );
  }

  // Find all full-width-left-text-section blocks
  const fullWidthBlocks = page.blocks?.filter((block: any) => 
    block.blockName === 'acf/full-width-left-text-section'
  ) || [];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Debug: Full Width Left Text Section</h1>
      
      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Page Info</h2>
        <p><strong>Title:</strong> {page.title}</p>
        <p><strong>ID:</strong> {page.id}</p>
        <p><strong>Total Blocks:</strong> {page.blocks?.length || 0}</p>
        <p><strong>Full Width Blocks Found:</strong> {fullWidthBlocks.length}</p>
      </div>

      {fullWidthBlocks.length === 0 ? (
        <div className="p-4 bg-yellow-100 rounded">
          <p>No Full Width Left Text Section blocks found on this page.</p>
        </div>
      ) : (
        fullWidthBlocks.map((block: any, index: number) => (
          <div key={index} className="mb-8 p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Block {index + 1}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Block Structure</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify({
                    blockName: block.blockName,
                    hasAttrs: !!block.attrs,
                    hasData: !!block.attrs?.data,
                    dataKeys: block.attrs?.data ? Object.keys(block.attrs.data) : []
                  }, null, 2)}
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Image Data</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify({
                    right_image: block.attrs?.data?.right_image,
                    right_image_type: typeof block.attrs?.data?.right_image,
                    has_url: !!(block.attrs?.data?.right_image?.url)
                  }, null, 2)}
                </pre>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Full Block Data</h4>
              <details className="bg-gray-50 p-3 rounded">
                <summary className="cursor-pointer font-medium">Click to expand full data</summary>
                <pre className="mt-2 text-xs overflow-auto max-h-96">
                  {JSON.stringify(block.attrs?.data, null, 2)}
                </pre>
              </details>
            </div>
            
            {/* Test rendering the image if data exists */}
            {block.attrs?.data?.right_image && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Image Test</h4>
                {typeof block.attrs.data.right_image === 'object' && block.attrs.data.right_image.url ? (
                  <div className="p-4 bg-green-50 rounded">
                    <p className="text-green-700 mb-2">✅ Image data looks good!</p>
                    <img 
                      src={transformMediaUrl(block.attrs.data.right_image.url)}
                      alt={block.attrs.data.right_image.alt || 'Test image'}
                      className="max-w-xs border rounded"
                      onError={(e) => {
                        console.error('Image failed to load:', block.attrs.data.right_image.url);
                        (e.target as HTMLImageElement).style.border = '2px solid red';
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', block.attrs.data.right_image.url);
                      }}
                    />
                    <p className="text-sm mt-2">
                      <strong>URL:</strong> {block.attrs.data.right_image.url}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 rounded">
                    <p className="text-red-700">❌ Image data is not in expected format</p>
                    <p className="text-sm">Expected object with url property, got: {typeof block.attrs.data.right_image}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}