/**
 * Debug page to check what data is being passed to components
 */

import { fetchWordPressAPI } from '@/lib/wordpress';

async function getPageData() {
  try {
    const pageData = await fetchWordPressAPI<any>('/wp/v2/pages-with-blocks/home');
    return pageData;
  } catch (error) {
    console.error('Error fetching page data:', error);
    return null;
  }
}

export default async function DebugData() {
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
  const fullWidthBlocks = page.blocks?.filter((block: any) => {
    if (block.blockName === 'acf/full-width-left-text-section') {
      return true;
    }
    // Also check inner blocks
    if (block.innerBlocks) {
      return block.innerBlocks.some((inner: any) => inner.blockName === 'acf/full-width-left-text-section');
    }
    return false;
  }) || [];

  // Extract the actual full-width blocks (including from inner blocks)
  const actualBlocks: any[] = [];
  fullWidthBlocks.forEach((block: any) => {
    if (block.blockName === 'acf/full-width-left-text-section') {
      actualBlocks.push(block);
    } else if (block.innerBlocks) {
      block.innerBlocks.forEach((inner: any) => {
        if (inner.blockName === 'acf/full-width-left-text-section') {
          actualBlocks.push(inner);
        }
      });
    }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Debug: Full Width Block Data</h1>
      
      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Page Info</h2>
        <p><strong>Title:</strong> {page.title}</p>
        <p><strong>Total Blocks:</strong> {page.blocks?.length || 0}</p>
        <p><strong>Full Width Blocks Found:</strong> {actualBlocks.length}</p>
      </div>

      {actualBlocks.length === 0 ? (
        <div className="p-4 bg-yellow-100 rounded">
          <p>No Full Width Left Text Section blocks found.</p>
        </div>
      ) : (
        actualBlocks.map((block: any, index: number) => {
          const data = block.attrs?.data;
          
          return (
            <div key={index} className="mb-8 p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Block {index + 1}: {data?.heading || 'No heading'}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Basic Info</h4>
                  <div className="bg-gray-100 p-3 rounded text-sm">
                    <p><strong>Heading:</strong> {data?.heading || 'Not set'}</p>
                    <p><strong>Sub Heading:</strong> {data?.sub_heading || 'Not set'}</p>
                    <p><strong>Reverse Layout:</strong> {data?.reverse_layout ? 'Yes' : 'No'}</p>
                    <p><strong>Background Color:</strong> {data?.background_color || 'Not set'}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Image Data Analysis</h4>
                  <div className="bg-gray-100 p-3 rounded text-sm">
                    <p><strong>Has right_image:</strong> {data?.right_image ? 'Yes' : 'No'}</p>
                    <p><strong>right_image type:</strong> {typeof data?.right_image}</p>
                    {data?.right_image && (
                      <>
                        <p><strong>right_image.url:</strong> {data.right_image.url || 'Not set'}</p>
                        <p><strong>right_image.alt:</strong> {data.right_image.alt || 'Not set'}</p>
                        <p><strong>right_image.width:</strong> {data.right_image.width || 'Not set'}</p>
                        <p><strong>right_image.height:</strong> {data.right_image.height || 'Not set'}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Raw right_image Data</h4>
                <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(data?.right_image, null, 2)}
                </pre>
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold mb-2">All Data Keys</h4>
                <div className="bg-gray-50 p-3 rounded text-xs">
                  {data ? Object.keys(data).map(key => (
                    <span key={key} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 mb-1">
                      {key}
                    </span>
                  )) : 'No data'}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}