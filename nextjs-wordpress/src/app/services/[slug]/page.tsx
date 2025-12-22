import { fetchWordPressAPI } from '@/lib/wordpress';
import { parseBlocks, Block } from '@/lib/blocks';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WordPressContent } from '@/components/WordPressContent';
import { notFound } from 'next/navigation';

interface ServiceData {
  id: number;
  title: string;
  content: string;
  slug: string;
  blocks?: any[];
}

/**
 * Flatten blocks by extracting innerBlocks from core/group wrappers
 * This ensures ACF blocks inside groups are rendered directly
 */
function flattenGroupBlocks(blocks: Block[]): Block[] {
  const flattened: Block[] = [];
  
  blocks.forEach(block => {
    // If it's a core/group block, extract and add its inner blocks instead
    if (block.blockName === 'core/group' && block.innerBlocks && block.innerBlocks.length > 0) {
      // Recursively flatten inner blocks in case they also contain groups
      flattened.push(...flattenGroupBlocks(block.innerBlocks));
    } else {
      // For non-group blocks, add as-is and recursively flatten any inner blocks
      const processedBlock = { ...block };
      if (block.innerBlocks && block.innerBlocks.length > 0) {
        processedBlock.innerBlocks = flattenGroupBlocks(block.innerBlocks);
      }
      flattened.push(processedBlock);
    }
  });
  
  return flattened;
}

async function getServiceData(slug: string): Promise<ServiceData | null> {
  try {
    // First try to get service as a page with ACF blocks using full path
    const fullPath = `services/${slug}`;
    const pageData = await fetchWordPressAPI<ServiceData>(`/wp/v2/pages-with-blocks/${fullPath}`);
    if (pageData && pageData.blocks) {
      // Flatten core/group blocks to expose ACF blocks
      pageData.blocks = flattenGroupBlocks(pageData.blocks);
      return pageData;
    }

    // Fallback: try with just the slug
    try {
      const pageDataSlug = await fetchWordPressAPI<ServiceData>(`/wp/v2/pages-with-blocks/${slug}`);
      if (pageDataSlug && pageDataSlug.blocks) {
        pageDataSlug.blocks = flattenGroupBlocks(pageDataSlug.blocks);
        return pageDataSlug;
      }
    } catch (error) {
      // Ignore error and continue to next fallback
    }

    // Fallback: try to get as a regular page with full path
    const pages = await fetchWordPressAPI<ServiceData[]>(`/wp/v2/pages?slug=${slug}`);
    if (pages && pages.length > 0) {
      const page = pages[0];
      if (page.content) {
        page.blocks = parseBlocks(page.content) || [];
      }
      return page;
    }

    return null;
  } catch (error) {
    console.error('Error fetching service data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = await getServiceData(params.slug);
  
  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  return {
    title: service.title,
    description: `Learn more about our ${service.title} service`,
  };
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const service = await getServiceData(params.slug);

  if (!service) {
    notFound();
  }

  // Use blocks from API if available, otherwise parse from content
  const blocks = service.blocks && Array.isArray(service.blocks) && service.blocks.length > 0 
    ? service.blocks 
    : parseBlocks(service.content) || [];

  // If no blocks found, render raw HTML content
  if ((!blocks || blocks.length === 0) && service.content) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">{service.title}</h1>
          <WordPressContent content={service.content} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <BlockRenderer blocks={blocks} />
    </main>
  );
}

// Optional: Generate static params for known service pages
export async function generateStaticParams() {
  try {
    // Get all pages that might be services
    const pages = await fetchWordPressAPI<Array<{ slug: string }>>('/wp/v2/pages?per_page=100');
    
    // Filter for service-related pages or return all for now
    const servicePages = pages.filter(page => 
      page.slug.includes('service') || 
      page.slug.includes('devops') ||
      page.slug === 'devopspage'
    );
    
    return servicePages.map((page) => ({
      slug: page.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for services:', error);
    return [];
  }
}

// Revalidate every 60 seconds for dynamic content updates
export const revalidate = 60;