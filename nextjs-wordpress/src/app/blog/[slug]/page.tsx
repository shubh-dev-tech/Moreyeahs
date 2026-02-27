import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogTemplatePage from '@/components/blog/BlogTemplatePage';
import ErrorBoundary from '@/components/ErrorBoundary';
import { generatePostMetadata } from '@/lib/seo';
import { sanitizeSlug, isValidSlug, isMalformedSlug } from '@/utils/slugUtils';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

interface BlogPostData {
  id: number;
  title: {
    rendered: string;
  };
  slug: string;
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  modified: string;
  featured_image?: string;
  author?: {
    name: string;
    avatar: string | null;
  };
  categories?: string[];
  tags?: string[];
  acf_fields?: any;
  _embedded?: any;
}

// Fetch blog post data from WordPress API
async function getBlogPost(slug: string): Promise<BlogPostData | null> {
  try {
    // Use environment-aware URL detection
    const { getWordPressApiUrl } = await import('@/lib/environment');
    const apiUrl = getWordPressApiUrl();
    
    // Validate and sanitize slug
    if (!slug || typeof slug !== 'string') {
      console.error('Invalid slug provided:', slug);
      return null;
    }
    
    // Check if slug is malformed and reject it early
    if (isMalformedSlug(slug)) {
      console.error('Malformed slug detected:', slug);
      return null;
    }
    
    // Sanitize slug - remove invalid characters and limit length
    const sanitizedSlug = sanitizeSlug(slug);
    
    // If slug is invalid after sanitization, return null
    if (!isValidSlug(sanitizedSlug)) {
      console.error('Slug invalid after sanitization:', sanitizedSlug);
      return null;
    }
    
    // Use standard WordPress REST API endpoint for posts
    const response = await fetch(`${apiUrl}/wp/v2/posts?slug=${encodeURIComponent(sanitizedSlug)}&_embed`, {
      next: { revalidate: 60 }, // Revalidate every minute
      signal: AbortSignal.timeout(10000), // 10 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-App/1.0'
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch blog post: ${response.status} ${response.statusText}`);
      return null;
    }

    const posts = await response.json();
    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      console.warn('No blog posts found for slug:', slug);
      return null;
    }

    const post = posts[0];
    
    // Validate required fields
    if (!post.id || !post.title) {
      console.error('Invalid blog post data structure:', post);
      return null;
    }
    
    // Extract author info
    const authorName = post._embedded?.author?.[0]?.name || 'Anonymous';
    const authorAvatar = post._embedded?.author?.[0]?.avatar_urls?.['96'] || null;
    
    // Extract categories
    const categories = post._embedded?.['wp:term']?.[0]?.map((cat: any) => cat.name) || [];
    
    // Extract tags
    const tags = post._embedded?.['wp:term']?.[1]?.map((tag: any) => tag.name) || [];
    
    // Fetch ACF fields separately if not included
    if (!post.acf_fields && !post.acf) {
      try {
        const acfResponse = await fetch(`${apiUrl}/wp/v2/posts/${post.id}?acf_format=standard`, {
          next: { revalidate: 60 },
          signal: AbortSignal.timeout(5000),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'NextJS-App/1.0'
          }
        });
        
        if (acfResponse.ok) {
          const acfData = await acfResponse.json();
          post.acf_fields = acfData.acf || acfData.acf_fields || {};
        } else {
          post.acf_fields = {};
        }
      } catch (error) {
        console.warn('Failed to fetch ACF fields:', error);
        post.acf_fields = {};
      }
    } else {
      post.acf_fields = post.acf_fields || post.acf || {};
    }

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      date: post.date,
      modified: post.modified,
      featured_image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
      author: {
        name: authorName,
        avatar: authorAvatar
      },
      categories: categories,
      tags: tags,
      acf_fields: post.acf_fields,
      _embedded: post._embedded
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  return generatePostMetadata(params.slug, 'posts');
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
  try {
    const { getWordPressApiUrl } = await import('@/lib/environment');
    const apiUrl = getWordPressApiUrl();
    
    const response = await fetch(`${apiUrl}/wp/v2/posts?per_page=100`, {
      signal: AbortSignal.timeout(10000),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch posts for static generation: ${response.status}`);
      return [];
    }

    const posts = await response.json();
    
    if (!Array.isArray(posts)) {
      console.warn('Invalid posts response format');
      return [];
    }
    
    return posts.map((post: any) => ({
      slug: post.slug
    }));
  } catch (error) {
    console.warn('Error generating static params (will use dynamic rendering):', error);
    return [];
  }
}

export default async function BlogPostPageRoute({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="blog-post-main">
      <ErrorBoundary>
        <BlogTemplatePage post={post} />
      </ErrorBoundary>
    </main>
  );
}
