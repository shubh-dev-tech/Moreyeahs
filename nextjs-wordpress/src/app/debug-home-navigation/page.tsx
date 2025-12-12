import { fetchWordPressAPI } from '@/lib/wordpress';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import NavigationNextBlock from '@/components/blocks/navigation-next-block/NavigationNextBlock';

async function getHomePage() {
  try {
    const pageData = await fetchWordPressAPI<any>('/wp/v2/pages-with-blocks/home');
    return pageData;
  } catch (error) {
    console.error('Error fetching homepage:', error);
    return null;
  }
}

export default async function DebugHomeNavigation() {
  const page = await getHomePage();

  if (!page) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-4xl font-bold mb-4">Debug Home Navigation</h1>
        <p>No home page found</p>
      </div>
    );
  }

  // Find navigation-next-block
  let navigationBlock: any = null;
  let blockIndex: string | number = -1;
  
  function findNavigationBlock(blocks: any[], parentIndex = '') {
    blocks.forEach((block, index) => {
      const currentIndex = parentIndex ? `${parentIndex}.${index + 1}` : `${index + 1}`;
      
      if (block.blockName === 'acf/navigation-next-block') {
        navigationBlock = block;
        blockIndex = currentIndex;
        return;
      }
      
      // Check inner blocks
      if (block.innerBlocks && block.innerBlocks.length > 0) {
        findNavigationBlock(block.innerBlocks, currentIndex);
      }
    });
  }
  
  if (page.blocks && page.blocks.length > 0) {
    findNavigationBlock(page.blocks);
  }

  return (
    <div className="min-h-screen">
      {/* Debug Info */}
      <div className="bg-gray-100 p-4 mb-8">
        <h1 className="text-2xl font-bold mb-4">Debug Home Navigation</h1>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Page Info:</h2>
          <p>Page ID: {page.id}</p>
          <p>Page Title: {page.title}</p>
          <p>Total Blocks: {page.blocks ? page.blocks.length : 0}</p>
        </div>

        {navigationBlock ? (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-green-600">✅ Navigation Block Found!</h2>
            <p>Position: {blockIndex}</p>
            <p>Block Name: {navigationBlock.blockName}</p>
            <p>Has Data: {navigationBlock.attrs?.data ? 'Yes' : 'No'}</p>
            {navigationBlock.attrs?.data?.regions && (
              <p>Regions Count: {navigationBlock.attrs.data.regions.length}</p>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-red-600">❌ Navigation Block Not Found</h2>
          </div>
        )}
      </div>

      {/* Test Direct Component Rendering */}
      {navigationBlock && navigationBlock.attrs?.data && (
        <div className="mb-8">
          <div className="bg-blue-100 p-4 mb-4">
            <h2 className="text-lg font-semibold">Direct Component Test:</h2>
            <p>Rendering NavigationNextBlock directly with the data from API</p>
          </div>
          <NavigationNextBlock
            data={{
              regions: navigationBlock.attrs.data.regions,
              heading: navigationBlock.attrs.data.heading,
              button_text: navigationBlock.attrs.data.button_text,
              button_link: navigationBlock.attrs.data.button_link,
            }}
          />
        </div>
      )}

      {/* Render All Blocks via BlockRenderer */}
      <div className="mb-8">
        <div className="bg-yellow-100 p-4 mb-4">
          <h2 className="text-lg font-semibold">Full BlockRenderer Test:</h2>
          <p>Rendering all blocks via BlockRenderer (same as home page)</p>
        </div>
        {page.blocks && <BlockRenderer blocks={page.blocks} />}
      </div>

      {/* Show last few blocks for debugging */}
      <div className="bg-gray-100 p-4">
        <h2 className="text-lg font-semibold mb-2">Last 3 Blocks Structure:</h2>
        <pre className="text-xs overflow-auto max-h-96">
          {page.blocks ? JSON.stringify(page.blocks.slice(-3), null, 2) : 'No blocks'}
        </pre>
      </div>
    </div>
  );
}