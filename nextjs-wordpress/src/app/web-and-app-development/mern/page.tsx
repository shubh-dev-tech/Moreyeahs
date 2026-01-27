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
  // Try multiple approaches to find the MERN page
  const slugVariations = [
    'web-and-app-development/mern',
    'mern',
    'mern-development',
    'web-and-app-development-mern',
    'mern-stack'
  ];
  
  // Try each slug variation with the blocks endpoint
  for (const slug of slugVariations) {
    try {
      const page = await getPageWithBlocks(slug);
      if (page) {
        console.log(`[MERN Page] Found page with slug: ${slug}`);
        return page;
      }
    } catch (error) {
      console.warn(`[MERN Page] Failed to fetch with slug ${slug}:`, error);
    }
  }
  
  // Try fallback with regular page endpoint
  for (const slug of slugVariations) {
    try {
      const page = await getPageBySlug(slug);
      if (page) {
        console.log(`[MERN Page] Found page via fallback with slug: ${slug}`);
        return {
          id: page.id,
          title: page.title?.rendered || 'MERN Stack Development Services',
          content: page.content?.rendered || '',
          slug: page.slug,
          blocks: []
        };
      }
    } catch (error) {
      console.warn(`[MERN Page] Fallback failed for slug ${slug}:`, error);
    }
  }
  
  // Ultimate fallback - return default content
  console.log('[MERN Page] Using default content - no page found in WordPress');
  return {
    id: 0,
    title: 'MERN Stack Development Services',
    content: `
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold mb-6">MERN Stack Development Services</h1>
        <p class="text-lg mb-4">Full-stack web application development using MongoDB, Express.js, React, and Node.js.</p>
        
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p class="text-yellow-800">
            <strong>Note:</strong> This page is displaying default content. 
            The WordPress page may not be published or accessible.
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-8 mt-8">
          <div>
            <h2 class="text-2xl font-semibold mb-4">MERN Stack Technologies</h2>
            <ul class="list-disc list-inside space-y-2">
              <li><strong>MongoDB:</strong> NoSQL database for flexible data storage</li>
              <li><strong>Express.js:</strong> Fast, minimalist web framework for Node.js</li>
              <li><strong>React:</strong> Component-based frontend library</li>
              <li><strong>Node.js:</strong> JavaScript runtime for server-side development</li>
            </ul>
          </div>
          <div>
            <h2 class="text-2xl font-semibold mb-4">Our MERN Services</h2>
            <ul class="list-disc list-inside space-y-2">
              <li>Full-stack web application development</li>
              <li>RESTful API development</li>
              <li>Real-time applications with Socket.io</li>
              <li>Database design and optimization</li>
              <li>Authentication and authorization systems</li>
              <li>Deployment and DevOps setup</li>
            </ul>
          </div>
        </div>
        
        <div class="mt-12">
          <h2 class="text-3xl font-semibold mb-6">Why Choose MERN Stack?</h2>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 class="text-xl font-semibold mb-3">JavaScript Everywhere</h3>
              <p>Use JavaScript for both frontend and backend development, reducing context switching and improving development efficiency.</p>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 class="text-xl font-semibold mb-3">Rapid Development</h3>
              <p>Pre-built components and extensive libraries enable faster development cycles and quicker time-to-market.</p>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 class="text-xl font-semibold mb-3">Scalable Architecture</h3>
              <p>Built for scalability with microservices architecture and cloud-native deployment options.</p>
            </div>
          </div>
        </div>
        
        <div class="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 class="text-xl font-semibold mb-4">Ready to Build Your MERN Application?</h3>
          <p class="mb-4">Let's discuss your project requirements and create a powerful, scalable web application using the MERN stack.</p>
          <a href="/contact" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Get Started
          </a>
        </div>
      </div>
    `,
    slug: 'web-and-app-development/mern',
    blocks: []
  };
}

export async function generateMetadata() {
  return generatePageMetadata('web-and-app-development/mern');
}

export default async function MERNPage() {
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