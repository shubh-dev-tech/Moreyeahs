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
    'web-and-app-development/react-native',
    'react-native',
    'reactnative',
    'react-native-development',
    'web-and-app-development-react-native'
  ];
  
  // Try each slug variation with the blocks endpoint
  for (const slug of slugVariations) {
    try {
      const page = await getPageWithBlocks(slug);
      if (page) {
        console.log(`[React Native Page] Found page with slug: ${slug}`);
        return page;
      }
    } catch (error) {
      console.warn(`[React Native Page] Failed to fetch with slug ${slug}:`, error);
    }
  }
  
  // Try fallback with regular page endpoint
  for (const slug of slugVariations) {
    try {
      const page = await getPageBySlug(slug);
      if (page) {
        console.log(`[React Native Page] Found page via fallback with slug: ${slug}`);
        return {
          id: page.id,
          title: page.title?.rendered || 'React Native Development Services',
          content: page.content?.rendered || '',
          slug: page.slug,
          blocks: []
        };
      }
    } catch (error) {
      console.warn(`[React Native Page] Fallback failed for slug ${slug}:`, error);
    }
  }
  
  // If no page found, return default content
  console.warn('[React Native Page] No WordPress page found, using default content');
  return {
    id: 0,
    title: 'React Native Development Services',
    content: '<p>React Native development services coming soon...</p>',
    slug: 'react-native',
    blocks: []
  };
}

export async function generateMetadata() {
  return generatePageMetadata('web-and-app-development/react-native');
}

export default async function ReactNativePage() {
  const page = await getPageData();
  
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
