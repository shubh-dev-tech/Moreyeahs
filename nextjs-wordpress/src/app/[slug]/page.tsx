import { fetchWordPressAPI } from '@/lib/wordpress';
import { parseBlocks, Block } from '@/lib/blocks';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WordPressContent } from '@/components/WordPressContent';
import { notFound } from 'next/navigation';

interface PageData {
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

async function getPageData(slug: string): Promise<PageData | null> {
  try {
    // Use the custom REST API endpoint for pages with ACF blocks
    const data = await fetchWordPressAPI<PageData>(`/wp/v2/pages-with-blocks/${slug}`);
    if (data && data.blocks) {
      // Flatten core/group blocks to expose ACF blocks
      data.blocks = flattenGroupBlocks(data.blocks);
    }
    return data;
  } catch (error) {
    console.error('Error fetching page data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await getPageData(params.slug);
  
  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.title,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPageData(params.slug);

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

// Optional: Generate static params for known pages
export async function generateStaticParams() {
  try {
    const pages = await fetchWordPressAPI<Array<{ slug: string }>>('/wp/v2/pages?per_page=100');
    return pages.map((page) => ({
      slug: page.slug,
    }));
  } catch (error) {
    return [];
  }
}

// Revalidate every 60 seconds for dynamic content updates
export const revalidate = 60;
