import { getPageWithBlocks, getPageBySlug } from '@/lib/wpFetch';
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

async function getPageData(): Promise<PageData> {
  // Try multiple approaches to find the WordPress page
  const slugVariations = [
    'web-and-app-development/wordpress',
    'wordpress',
    'wordpress-development',
    'web-and-app-development-wordpress'
  ];
  
  // Try each slug variation with the blocks endpoint
  for (const slug of slugVariations) {
    try {
      const page = await getPageWithBlocks(slug);
      if (page) {
        console.log(`[WordPress Page] Found page with slug: ${slug}`);
        return page;
      }
    } catch (error) {
      console.warn(`[WordPress Page] Failed to fetch with slug ${slug}:`, error);
    }
  }
  
  // Try fallback with regular page endpoint
  for (const slug of slugVariations) {
    try {
      const page = await getPageBySlug(slug);
      if (page) {
        console.log(`[WordPress Page] Found page via fallback with slug: ${slug}`);
        return {
          id: page.id,
          title: page.title?.rendered || 'WordPress Development Services',
          content: page.content?.rendered || '',
          slug: page.slug,
          blocks: []
        };
      }
    } catch (error) {
      console.warn(`[WordPress Page] Fallback failed for slug ${slug}:`, error);
    }
  }
  
  // Ultimate fallback - return default content
  console.log('[WordPress Page] Using default content - no page found in WordPress');
  return {
    id: 0,
    title: 'WordPress Development Services',
    content: `
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold mb-6">WordPress Development Services</h1>
        <p class="text-lg mb-4">Professional WordPress development and customization services.</p>
        
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p class="text-yellow-800">
            <strong>Note:</strong> This page is displaying default content. 
            The WordPress page may not be published or accessible.
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-8 mt-8">
          <div>
            <h2 class="text-2xl font-semibold mb-4">Custom WordPress Development</h2>
            <ul class="list-disc list-inside space-y-2">
              <li>Custom theme development</li>
              <li>Plugin development and customization</li>
              <li>WordPress multisite setup</li>
              <li>Performance optimization</li>
              <li>E-commerce integration</li>
              <li>API development</li>
            </ul>
          </div>
          <div>
            <h2 class="text-2xl font-semibold mb-4">WordPress Maintenance</h2>
            <ul class="list-disc list-inside space-y-2">
              <li>Security updates and monitoring</li>
              <li>Regular backups</li>
              <li>Content management</li>
              <li>Technical support</li>
              <li>Performance monitoring</li>
              <li>SEO optimization</li>
            </ul>
          </div>
        </div>
        
        <div class="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 class="text-xl font-semibold mb-4">Get Started with WordPress Development</h3>
          <p class="mb-4">Ready to build or improve your WordPress website? Contact us for a consultation.</p>
          <a href="/contact" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Contact Us
          </a>
        </div>
      </div>
    `,
    slug: 'web-and-app-development/wordpress',
    blocks: []
  };
}

export async function generateMetadata() {
  return generatePageMetadata('web-and-app-development/wordpress');
}

export default async function WordPressPage() {
  const page = await getPageData();

  // Page will always exist due to fallback, so no need for notFound()
  
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