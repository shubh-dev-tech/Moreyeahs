import { fetchGraphQL } from '@/lib/wordpress';
import { parseBlocks } from '@/lib/blocks';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WordPressContent } from '@/components/WordPressContent';
import { notFound } from 'next/navigation';

interface PageData {
  page: {
    id: string;
    title: string;
    content: string;
    slug: string;
    blocks?: any[];
  } | null;
}

async function getPageData(slug: string): Promise<PageData['page']> {
  // Try the new REST API endpoint for pages with ACF blocks first
  try {
    const apiUrl = `${process.env.WORDPRESS_REST_API_URL}/wp/v2/pages-with-blocks/${slug}`;
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const data = await response.json();
      return {
        id: data.id.toString(),
        title: data.title,
        content: data.content,
        slug: data.slug,
        blocks: data.blocks
      };
    }
  } catch (error) {
    console.log('REST API failed, falling back to GraphQL');
  }

  // Fallback to GraphQL
  const query = `
    query GetPage($slug: ID!) {
      page(id: $slug, idType: URI) {
        id
        title
        content
        slug
      }
    }
  `;

  try {
    const data = await fetchGraphQL<PageData>(query, { slug });
    return data.page;
  } catch (error) {
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
  const blocks = page.blocks && page.blocks.length > 0 
    ? page.blocks 
    : parseBlocks(page.content);

  // If no blocks found, render raw HTML content
  if (blocks.length === 0 && page.content) {
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
  const query = `
    query GetAllPages {
      pages(first: 100) {
        nodes {
          slug
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL<{ pages: { nodes: { slug: string }[] } }>(query);
    return data.pages.nodes.map((page) => ({
      slug: page.slug,
    }));
  } catch (error) {
    return [];
  }
}

// Revalidate every hour
export const revalidate = 3600;
