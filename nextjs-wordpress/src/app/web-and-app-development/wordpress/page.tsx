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
  // Try to get the hierarchical page first
  let page = await getPageWithBlocks('web-and-app-development/wordpress');
  
  // If not found, try just 'wordpress' as a fallback
  if (!page) {
    page = await getPageWithBlocks('wordpress');
  }
  
  // If still not found, create a default page structure
  if (!page) {
    return {
      id: 0,
      title: 'WordPress Development Services',
      content: `
        <div class="container mx-auto px-4 py-8">
          <h1 class="text-4xl font-bold mb-6">WordPress Development Services</h1>
          <p class="text-lg mb-4">Professional WordPress development and customization services.</p>
          <div class="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <h2 class="text-2xl font-semibold mb-4">Custom WordPress Development</h2>
              <ul class="list-disc list-inside space-y-2">
                <li>Custom theme development</li>
                <li>Plugin development and customization</li>
                <li>WordPress multisite setup</li>
                <li>Performance optimization</li>
              </ul>
            </div>
            <div>
              <h2 class="text-2xl font-semibold mb-4">WordPress Maintenance</h2>
              <ul class="list-disc list-inside space-y-2">
                <li>Security updates and monitoring</li>
                <li>Regular backups</li>
                <li>Content management</li>
                <li>Technical support</li>
              </ul>
            </div>
          </div>
        </div>
      `,
      slug: 'web-and-app-development/wordpress',
      blocks: []
    };
  }
  
  return page;
}

export async function generateMetadata() {
  return generatePageMetadata('web-and-app-development/wordpress');
}

export default async function WordPressPage() {
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