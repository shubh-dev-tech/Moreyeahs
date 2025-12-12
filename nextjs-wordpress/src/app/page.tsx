import { fetchWordPressAPI } from '@/lib/wordpress';
import { parseBlocks } from '@/lib/blocks';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import VerticalStepper from '@/components/VerticalStepper';

async function getHomePage() {
  try {
    // Try to get page with slug 'home' first, then fallback to 'homepage'
    let pageData = null;
    
    try {
      pageData = await fetchWordPressAPI<any>('/wp/v2/pages-with-blocks/home');
    } catch (error) {
      // If 'home' doesn't exist, try other common homepage slugs
      try {
        pageData = await fetchWordPressAPI<any>('/wp/v2/pages-with-blocks/homepage');
      } catch (error) {
        // If no specific homepage, get the first published page
        const pages = await fetchWordPressAPI<any[]>('/wp/v2/pages?per_page=1&status=publish');
        if (pages && pages.length > 0) {
          const firstPage = pages[0];
          pageData = await fetchWordPressAPI<any>(`/wp/v2/pages-with-blocks/${firstPage.slug}`);
        }
      }
    }
    
    return pageData;
  } catch (error) {
    console.error('Error fetching homepage:', error);
    return null;
  }
}

export default async function Home() {
  const page = await getHomePage();

  if (!page) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Welcome to Next.js + WordPress</h1>
          <p className="text-lg text-gray-600">
            Configure your WordPress backend and create a page with slug &quot;home&quot; to get started.
          </p>
        </div>
      </main>
    );
  }

  // Use the blocks from the API response if available, otherwise parse content
  let blocks = page.blocks || [];
  
  if (!blocks || blocks.length === 0) {
    // Fallback to parsing content if no blocks are provided
    blocks = parseBlocks(page.content || '');
  }
  
  if (!blocks || blocks.length === 0) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
          <div 
            className="prose max-w-none"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: page.content || '<p>No content available. Please create a page with slug "home" in WordPress.</p>' }}
          />
        </div>
      </main>
    );
  }

  // Define sections for the stepper - customize these based on your actual sections
  const stepperSections = [
    { id: 'hero', title: 'Home' },
    { id: 'purpose', title: 'Purpose' },
    { id: 'operating-models', title: 'Operating Models' },
    { id: 'counter', title: 'Stats' },
    { id: 'testimonials', title: 'Testimonials' },
    { id: 'news', title: 'News' },
    { id: 'investors', title: 'Investors' },
    { id: 'navigation-next', title: 'Navigate Your Next' },
  ];

  return (
    <>
      <VerticalStepper sections={stepperSections} />
      <main className="min-h-screen">
        <BlockRenderer blocks={blocks} />
      </main>
    </>
  );
}
