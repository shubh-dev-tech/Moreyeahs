import { fetchGraphQL } from '@/lib/wordpress';
import { parseBlocks } from '@/lib/blocks';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import VerticalStepper from '@/components/VerticalStepper';

async function getHomePage() {
  const query = `
    query GetHomePage {
      page(id: "cG9zdDoxMg==", idType: ID) {
        id
        title
        content
      }
    }
  `;

  try {
    const data = await fetchGraphQL<any>(query);
    console.log('Homepage data:', data);
    return data.page;
  } catch (error) {
    console.error('Error fetching home page:', error);
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

  // Debug: show raw content if blocks are empty
  const blocks = parseBlocks(page.content);
  
  if (!blocks || blocks.length === 0) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          {/* <h1 className="text-4xl font-bold mb-4">{page.title}</h1> */}
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
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
