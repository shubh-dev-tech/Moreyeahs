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
  } | null;
}

async function getPageData(slug: string): Promise<PageData['page']> {
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
    console.error('Error fetching page:', error);
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

  const blocks = parseBlocks(page.content);

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
  // Skip static generation if WordPress URL is not configured
  if (!process.env.WORDPRESS_API_URL && !process.env.NEXT_PUBLIC_WORDPRESS_URL) {
    console.warn('Skipping static page generation: WordPress URL not configured');
    return [];
  }

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
    console.error('Error generating static params:', error);
    return [];
  }
}

// Revalidate every hour
export const revalidate = 3600;
