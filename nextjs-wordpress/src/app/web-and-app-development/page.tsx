import { getPageWithBlocks } from '@/lib/wpFetch';
import { parseBlocks } from '@/lib/blocks';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WordPressContent } from '@/components/WordPressContent';
import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo';

interface PageData {
  id: number;
  title: string;
  content: string;
  slug: string;
  blocks?: any[];
}

async function getPageData(): Promise<PageData | null> {
  let page = await getPageWithBlocks('web-and-app-development');
  
  // If not found, create a default page structure
  if (!page) {
    return {
      id: 0,
      title: 'Web & App Development Services',
      content: `
        <div class="container mx-auto px-4 py-8">
          <h1 class="text-4xl font-bold mb-6">Web & App Development Services</h1>
          <p class="text-lg mb-6">Comprehensive web and application development solutions for modern businesses.</p>
          
          <div class="grid md:grid-cols-3 gap-8 mt-8">
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-semibold mb-4">WordPress Development</h3>
              <p class="mb-4">Custom WordPress themes, plugins, and maintenance services.</p>
              <a href="/web-and-app-development/wordpress" class="text-blue-600 hover:text-blue-800">Learn More →</a>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-semibold mb-4">Custom Web Applications</h3>
              <p class="mb-4">Tailored web applications built with modern frameworks.</p>
              <a href="/web-and-app-development/custom-apps" class="text-blue-600 hover:text-blue-800">Learn More →</a>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-semibold mb-4">E-commerce Solutions</h3>
              <p class="mb-4">Complete e-commerce platforms and integrations.</p>
              <a href="/web-and-app-development/ecommerce" class="text-blue-600 hover:text-blue-800">Learn More →</a>
            </div>
          </div>
        </div>
      `,
      slug: 'web-and-app-development',
      blocks: []
    };
  }
  
  return page;
}

export async function generateMetadata() {
  return generatePageMetadata('web-and-app-development');
}

export default async function WebAndAppDevelopmentPage() {
  const page = await getPageData();

  if (!page) {
    notFound();
  }

  // Use blocks from API if available, otherwise parse from content
  const blocks = page.blocks && Array.isArray(page.blocks) && page.blocks.length > 0 
    ? page.blocks 
    : parseBlocks(page.content) || [];

  // If no blocks found, render raw HTML content
  if ((!blocks || blocks.length === 0) && page.content) {
    return (
      <main className="min-h-screen">
        <WordPressContent content={page.content} />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <BlockRenderer blocks={blocks} />
    </main>
  );
}