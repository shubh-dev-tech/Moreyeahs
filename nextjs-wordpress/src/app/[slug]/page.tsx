import { getPageWithBlocks, getPages } from '@/lib/wpFetch';
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

async function getPageData(slug: string): Promise<PageData | null> {
  // Build-safe: use wpFetch instead of fetchWordPressAPI
  return await getPageWithBlocks(slug);
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return generatePageMetadata(params.slug);
}

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPageData(params.slug);

  // Build-safe: render 404 instead of throwing
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

// Build-safe: Generate static params for known pages
export async function generateStaticParams() {
  // Build-safe: use wpFetch, return empty array on failure
  const pages = await getPages({ per_page: 100 });
  return pages.map((page) => ({
    slug: page.slug,
  }));
}

// Build-safe: ISR with 60s revalidation
export const revalidate = 60;
