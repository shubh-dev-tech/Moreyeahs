import { fetchWordPressAPI } from '@/lib/wordpress';
import { parseBlocks } from '@/lib/blocks';
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

async function getPageData(slug: string): Promise<PageData | null> {
  try {
    // Use the custom REST API endpoint for pages with ACF blocks
    const data = await fetchWordPressAPI<PageData>(`/wp/v2/pages-with-blocks/${slug}`);
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

// Revalidate every hour
export const revalidate = 3600;
