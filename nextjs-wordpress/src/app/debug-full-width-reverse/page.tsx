import { getPageWithBlocks } from '@/lib/wpFetch';

// Build-safe: all debug pages are force-dynamic
export const dynamic = 'force-dynamic';

async function getHomePage() {
  // Build-safe: use wpFetch instead of fetchWordPressAPI
  return await getPageWithBlocks('home');
}

export default async function DebugFullWidthReverse() {
  const page = await getHomePage();

  if (!page) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-4xl font-bold mb-4">Debug Full Width Reverse Layout</h1>
        <p>No home page found</p>
      </div>
    );
  }

  // Find all full-width-left-text-section blocks
  const fullWidthBlocks = page.blocks?.filter((block: any) => 
    block.blockName === 'acf/full-width-left-text-section'
  ) || [];

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Debug Full Width Reverse Layout</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Page Info</h2>
        <p><strong>Page Title:</strong> {page.title}</p>
        <p><strong>Page Slug:</strong> {page.slug}</p>
        <p><strong>Total Blocks:</strong> {page.blocks?.length || 0}</p>
        <p><strong>Full Width Blocks Found:</strong> {fullWidthBlocks.length}</p>
      </div>

      {fullWidthBlocks.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Full Width Left Text Section Blocks</h2>
          {fullWidthBlocks.map((block: any, index: number) => (
            <div key={index} className="mb-8 p-6 border border-gray-300 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Block #{index + 1}</h3>
              
              <div className="mb-4">
                <h4 className="text-lg font-medium mb-2">Block Data:</h4>
                <div className="bg-gray-100 p-4 rounded overflow-auto">
                  <pre className="text-sm">
                    {JSON.stringify(block.attrs?.data || {}, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-lg font-medium mb-2">Reverse Layout Status:</h4>
                <p className="text-lg">
                  <strong>reverse_layout:</strong> {' '}
                  <span className={`px-2 py-1 rounded ${
                    block.attrs?.data?.reverse_layout 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-red-200 text-red-800'
                  }`}>
                    {block.attrs?.data?.reverse_layout ? 'TRUE (Reversed)' : 'FALSE (Normal)'}
                  </span>
                </p>
              </div>

              <div className="mb-4">
                <h4 className="text-lg font-medium mb-2">Key Fields:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Heading:</strong> {block.attrs?.data?.heading || 'Not set'}</li>
                  <li><strong>Sub Heading:</strong> {block.attrs?.data?.sub_heading || 'Not set'}</li>
                  <li><strong>Button Text:</strong> {block.attrs?.data?.button_text || 'Not set'}</li>
                  <li><strong>Right Image:</strong> {block.attrs?.data?.right_image ? 'Present' : 'Not set'}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">No Full Width Left Text Section Blocks Found</h2>
          <p>The home page doesn&apos;t contain any full-width-left-text-section blocks.</p>
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">All Blocks on Page:</h3>
            <div className="bg-gray-100 p-4 rounded overflow-auto">
              <pre className="text-sm">
                {JSON.stringify(page.blocks?.map((b: any) => ({
                  blockName: b.blockName,
                  hasData: !!b.attrs?.data,
                  dataKeys: b.attrs?.data ? Object.keys(b.attrs.data) : []
                })) || [], null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}