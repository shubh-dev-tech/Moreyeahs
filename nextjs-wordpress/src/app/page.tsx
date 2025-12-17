import { getHomepageData } from '@/lib/wpFetch';
import { parseBlocks } from '@/lib/blocks';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import VerticalStepper from '@/components/VerticalStepper';

// Build-safe: this page uses ISR with 60s revalidation
// If WordPress is offline during build, it will show fallback content
export const revalidate = 60;

export default async function Home() {
  // Build-safe: getHomepageData never throws, returns safe fallbacks
  const { page, blocks } = await getHomepageData();

  // Build-safe fallback: always renders, even if WordPress is offline
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

  // Build-safe: use blocks from API or parse content, with empty array fallback
  let renderBlocks = blocks;
  
  if (!renderBlocks || renderBlocks.length === 0) {
    // Fallback to parsing content if no blocks are provided
    renderBlocks = parseBlocks(page.content || '');
  }
  
  // Build-safe: always render something, even with no blocks
  if (!renderBlocks || renderBlocks.length === 0) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{page.title?.rendered || page.title || 'Home'}</h1>
          <div 
            className="prose max-w-none"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ 
              __html: page.content?.rendered || page.content || '<p>Welcome! Content will appear here when WordPress is connected.</p>' 
            }}
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
        <BlockRenderer blocks={renderBlocks} />
      </main>
    </>
  );
}
