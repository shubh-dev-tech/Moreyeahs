/**
 * Server-side debug to see exact data structure
 */

import { fetchWordPressAPI } from '@/lib/wordpress';

export default async function DebugServer() {
  try {
    const pageData = await fetchWordPressAPI<any>('/wp/v2/pages-with-blocks/home');
    
    // Find the full-width blocks
    const allBlocks: any[] = [];
    
    function extractBlocks(blocks: any[]) {
      blocks.forEach(block => {
        if (block.blockName === 'acf/full-width-left-text-section') {
          allBlocks.push(block);
        }
        if (block.innerBlocks && block.innerBlocks.length > 0) {
          extractBlocks(block.innerBlocks);
        }
      });
    }
    
    if (pageData.blocks) {
      extractBlocks(pageData.blocks);
    }
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Server-Side Debug</h1>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Found {allBlocks.length} full-width blocks</h2>
        </div>
        
        {allBlocks.map((block, index) => {
          const data = block.attrs?.data;
          const rightImage = data?.right_image;
          
          return (
            <div key={index} className="mb-8 p-4 border rounded">
              <h3 className="font-bold mb-2">Block {index + 1}: {data?.heading}</h3>
              
              <div className="mb-4">
                <h4 className="font-semibold">Image Data:</h4>
                <div className="bg-gray-100 p-2 rounded">
                  <p>right_image exists: {rightImage ? 'YES' : 'NO'}</p>
                  <p>right_image type: {typeof rightImage}</p>
                  
                  {rightImage && (
                    <div className="mt-2">
                      <p>right_image structure:</p>
                      <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(rightImage, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold">All Data Keys:</h4>
                <div className="bg-gray-100 p-2 rounded">
                  {data ? Object.keys(data).join(', ') : 'No data'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-600">{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}