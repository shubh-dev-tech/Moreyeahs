import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import styles from './Blog.module.css';
import BlogPostsWithLoading from '@/components/blog/BlogPostsWithLoading';

// Interface for processed blog post data
interface ProcessedBlogData {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  featured_image: string | null;
  author: {
    name: string;
    avatar: string | null;
  };
  categories: string[];
  acf_fields: any;
}

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('blog');
}

// Fetch blog posts from WordPress API
async function getBlogPosts(): Promise<ProcessedBlogData[]> {
  try {
    // Use environment-aware URL detection
    const { getWordPressApiUrl } = await import('@/lib/environment');
    const apiUrl = getWordPressApiUrl();

    /**
     * IMPORTANT:
     * Next.js data cache has a ~2MB per-entry limit.
     * Your previous request (per_page=100&_embed) produced ~7MB and broke caching.
     *
     * Fix: fetch fewer posts per request.
     */
    const PER_PAGE = 12; // adjust (10/12/16/20) but keep it reasonable
    const PAGE = 1;

    const url =
      `${apiUrl}/wp/v2/posts` +
      `?per_page=${PER_PAGE}` +
      `&page=${PAGE}` +
      `&_embed=1` +
      `&orderby=date&order=desc`;

    const response = await fetch(url, {
      next: { revalidate: 60 }, // ISR: cache for 60s, then revalidate
      signal: AbortSignal.timeout(15000), // 15 second timeout
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-App/1.0',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch blog posts:', response.status, response.statusText);
      return [];
    }

    const posts = await response.json();

    if (!Array.isArray(posts)) {
      console.error('Invalid blog posts response format:', typeof posts);
      return [];
    }

    // Extract rendered content helper
    const extractRendered = (field: any): string => {
      if (!field) return '';
      if (typeof field === 'string') return field;
      if (field.rendered) return field.rendered;
      return '';
    };

    const processedData: ProcessedBlogData[] = posts.map((post: any) => {
      const rawTitle = extractRendered(post.title);
      const content = extractRendered(post.content);
      const excerpt = extractRendered(post.excerpt);

      // Extract author info
      const authorName = post._embedded?.author?.[0]?.name || 'Anonymous';
      const authorAvatar = post._embedded?.author?.[0]?.avatar_urls?.['96'] || null;

      // Extract categories
      const categories = post._embedded?.['wp:term']?.[0]?.map((cat: any) => cat.name) || [];

      return {
        id: post.id,
        title: rawTitle || 'Untitled Post',
        slug: post.slug,
        content,
        excerpt: excerpt || content.replace(/<[^>]+>/g, '').substring(0, 200),
        date: post.date,
        featured_image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null,
        author: {
          name: authorName,
          avatar: authorAvatar,
        },
        categories,
        acf_fields: post.acf_fields || post.acf || {},
      };
    });

    return processedData;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className={styles['blog-page']}>
      {/* Hero Section */}
      <section className={styles['blog-hero']}>
        <div className={styles.container}>
          <h1 className={styles['blog-hero__title']}>Our Blog</h1>
          {/* <p className={styles['blog-hero__subtitle']}>
            Insights, updates, and stories from our team
          </p> */}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className={styles['blog-grid-section']}>
        <div className={styles.container}>
          {posts.length === 0 ? (
            <div className={styles['no-posts']}>
              <p>No blog posts found. Check back soon!</p>
            </div>
          ) : (
            <BlogPostsWithLoading posts={posts} gridClassName={styles['blog-grid']} />
          )}
        </div>
      </section>
    </div>
  );
}