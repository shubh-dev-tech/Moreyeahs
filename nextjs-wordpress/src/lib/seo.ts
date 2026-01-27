import { Metadata } from 'next';
import { Post, SEO } from './types';
import { getSiteSettings, fetchGraphQL } from './wordpress';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

// GraphQL query to fetch page SEO data from Yoast
const GET_PAGE_SEO = `
  query GetPageSEO($slug: ID!) {
    page(id: $slug, idType: SLUG) {
      id
      title
      slug
      seo {
        title
        metaDesc
        canonical
        opengraphTitle
        opengraphDescription
        opengraphImage {
          sourceUrl
        }
        twitterTitle
        twitterDescription
        twitterImage {
          sourceUrl
        }
        metaRobotsNoindex
        metaRobotsNofollow
        schema {
          raw
        }
      }
    }
  }
`;

// Interface for page SEO data from WordPress
interface PageSEOData {
  page: {
    id: string;
    title: string;
    slug: string;
    seo: SEO;
  };
}

// Helper to get site settings with fallback
async function getSiteInfo() {
  const settings = await getSiteSettings();
  return {
    siteName: settings?.title || process.env.NEXT_PUBLIC_SITE_NAME || 'My Site',
    siteDescription: settings?.description || process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '',
  };
}

export async function generatePostMetadataFromObject(post: Post): Promise<Metadata> {
  const { siteName } = await getSiteInfo();
  const seo = post.seo;
  const url = `${siteUrl}/posts/${post.slug}`;
  const imageUrl = seo.opengraphImage?.sourceUrl || post.featuredImage?.node.sourceUrl || '';

  return {
    title: seo.title || post.title,
    description: seo.metaDesc || post.excerpt,
    alternates: {
      canonical: seo.canonical || url,
    },
    openGraph: {
      title: seo.opengraphTitle || seo.title || post.title,
      description: seo.opengraphDescription || seo.metaDesc || post.excerpt,
      url: url,
      siteName: siteName,
      images: imageUrl ? [
        {
          url: imageUrl,
          width: post.featuredImage?.node.mediaDetails.width || 1200,
          height: post.featuredImage?.node.mediaDetails.height || 630,
          alt: post.featuredImage?.node.altText || post.title,
        },
      ] : [],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.author.node.name],
      tags: post.tags.nodes.map(tag => tag.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.twitterTitle || seo.opengraphTitle || post.title,
      description: seo.twitterDescription || seo.opengraphDescription || post.excerpt,
      images: seo.twitterImage?.sourceUrl || imageUrl ? [seo.twitterImage?.sourceUrl || imageUrl] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export async function generateHomeMetadata(): Promise<Metadata> {
  const { siteName, siteDescription } = await getSiteInfo();
  
  return {
    title: siteName,
    description: siteDescription,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: siteName,
      description: siteDescription,
      url: siteUrl,
      siteName: siteName,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: siteDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

export function truncateText(text: string, maxLength: number = 160): string {
  const stripped = stripHtml(text);
  if (stripped.length <= maxLength) return stripped;
  return stripped.substring(0, maxLength).trim() + '...';
}

/**
 * Fetch Yoast SEO metadata for a page by slug from WordPress
 * @param slug - The page slug (e.g., 'salesforce-services', 'about', 'services')
 * @returns Metadata object with Yoast SEO data
 */
export async function generatePageMetadata(slug: string): Promise<Metadata> {
  try {
    // Try GraphQL first, but fallback to REST API if GraphQL fails
    let pageData: any = null;
    let seo: any = null;

    try {
      const data = await fetchGraphQL<PageSEOData>(GET_PAGE_SEO, { slug });
      if (data?.page) {
        pageData = data.page;
        seo = data.page.seo;
      }
    } catch (graphqlError) {
      // GraphQL failed, try REST API with Yoast SEO data
      console.log(`GraphQL failed for ${slug}, trying REST API...`);
      const restResponse = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost/moreyeahs-new'}/wp-json/wp/v2/pages?slug=${slug}&_embed`,
        { next: { revalidate: 3600 } }
      );
      
      if (restResponse.ok) {
        const pages = await restResponse.json();
        if (pages && pages.length > 0) {
          const page = pages[0];
          pageData = {
            title: page.title?.rendered || '',
            slug: page.slug
          };
          // Extract Yoast SEO data if available in the response
          seo = page.yoast_head_json || null;
        }
      }
    }

    if (!seo) {
      // Fallback to basic metadata if no SEO data found
      return generateFallbackMetadata(slug);
    }

    const { siteName } = await getSiteInfo();
    
    // Use Yoast SEO title or fallback to page title
    const metaTitle = seo.title || pageData?.title || formatSlugToTitle(slug);
    const metaDescription = seo.metaDesc || seo.og_description || seo.description || '';
    const canonicalUrl = seo.canonical || `${siteUrl}/${slug}`;
    const ogImage = seo.opengraphImage?.sourceUrl || seo.og_image?.[0]?.url || '';

    return {
      title: metaTitle,
      description: metaDescription,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: seo.opengraphTitle || seo.og_title || metaTitle,
        description: seo.opengraphDescription || seo.og_description || metaDescription,
        url: canonicalUrl,
        siteName: siteName,
        images: ogImage ? [
          {
            url: ogImage,
            width: 1200,
            height: 630,
          },
        ] : [],
        locale: seo.og_locale || 'en_US',
        type: seo.og_type || 'website',
      },
      twitter: {
        card: seo.twitter_card || 'summary_large_image',
        title: seo.twitterTitle || seo.twitter_title || seo.opengraphTitle || seo.og_title || metaTitle,
        description: seo.twitterDescription || seo.twitter_description || seo.opengraphDescription || seo.og_description || metaDescription,
        images: (seo.twitterImage?.sourceUrl || seo.twitter_image || ogImage) ? [seo.twitterImage?.sourceUrl || seo.twitter_image || ogImage] : [],
      },
      robots: {
        index: seo.metaRobotsNoindex !== 'index' && seo.robots?.index !== 'noindex' ? true : false,
        follow: seo.metaRobotsNofollow !== 'follow' && seo.robots?.follow !== 'nofollow' ? true : false,
        googleBot: {
          index: seo.metaRobotsNoindex !== 'index' && seo.robots?.index !== 'noindex' ? true : false,
          follow: seo.metaRobotsNofollow !== 'follow' && seo.robots?.follow !== 'nofollow' ? true : false,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error(`Error fetching SEO metadata for page: ${slug}`, error);
    // Return fallback metadata on error
    return generateFallbackMetadata(slug);
  }
}

/**
 * Fallback metadata when Yoast SEO data is not available
 */
async function generateFallbackMetadata(slug: string): Promise<Metadata> {
  const { siteName } = await getSiteInfo();
  const title = formatSlugToTitle(slug);
  
  return {
    title: `${title} | ${siteName}`,
    description: `Learn more about ${title.toLowerCase()} at ${siteName}`,
    alternates: {
      canonical: `${siteUrl}/${slug}`,
    },
  };
}

/**
 * Convert slug to readable title
 */
function formatSlugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Fetch Yoast SEO metadata for a post by slug from WordPress
 * @param slug - The post slug
 * @param postType - The post type ('post', 'case-study', etc.) - defaults to 'post'
 * @returns Metadata object with Yoast SEO data
 */
export async function generatePostMetadata(slug: string, postType: string = 'posts'): Promise<Metadata> {
  try {
    let postData: any = null;
    let seo: any = null;

    // Try REST API to fetch post with Yoast SEO data
    const endpoint = postType === 'posts' 
      ? `${process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost/moreyeahs-new'}/wp-json/wp/v2/posts?slug=${slug}&_embed`
      : `${process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost/moreyeahs-new'}/wp-json/wp/v2/${postType}?slug=${slug}&_embed`;

    const restResponse = await fetch(endpoint, { next: { revalidate: 3600 } });
    
    if (restResponse.ok) {
      const posts = await restResponse.json();
      if (posts && posts.length > 0) {
        const post = posts[0];
        postData = {
          title: post.title?.rendered || '',
          slug: post.slug,
          excerpt: post.excerpt?.rendered || '',
          featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
        };
        // Extract Yoast SEO data
        seo = post.yoast_head_json || null;
      }
    }

    if (!seo) {
      // Fallback to basic metadata if no SEO data found
      return generateFallbackMetadata(slug);
    }

    const { siteName } = await getSiteInfo();
    
    // Use Yoast SEO title or fallback to post title
    const metaTitle = seo.title || postData?.title || formatSlugToTitle(slug);
    const metaDescription = seo.description || stripHtml(postData?.excerpt || '') || '';
    const canonicalUrl = seo.canonical || `${siteUrl}/${postType === 'posts' ? 'posts' : postType}/${slug}`;
    const ogImage = seo.og_image?.[0]?.url || postData?.featuredImage || '';

    return {
      title: metaTitle,
      description: metaDescription,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: seo.og_title || metaTitle,
        description: seo.og_description || metaDescription,
        url: canonicalUrl,
        siteName: siteName,
        images: ogImage ? [
          {
            url: ogImage,
            width: seo.og_image?.[0]?.width || 1200,
            height: seo.og_image?.[0]?.height || 630,
          },
        ] : [],
        locale: seo.og_locale || 'en_US',
        type: seo.og_type || 'article',
        publishedTime: seo.article_published_time,
        modifiedTime: seo.article_modified_time,
        authors: seo.author ? [seo.author] : [],
      },
      twitter: {
        card: seo.twitter_card || 'summary_large_image',
        title: seo.twitter_title || seo.og_title || metaTitle,
        description: seo.twitter_description || seo.og_description || metaDescription,
        images: (seo.twitter_image || ogImage) ? [seo.twitter_image || ogImage] : [],
      },
      robots: {
        index: seo.robots?.index !== 'noindex',
        follow: seo.robots?.follow !== 'nofollow',
        googleBot: {
          index: seo.robots?.index !== 'noindex',
          follow: seo.robots?.follow !== 'nofollow',
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error(`Error fetching SEO metadata for ${postType}: ${slug}`, error);
    // Return fallback metadata on error
    return generateFallbackMetadata(slug);
  }
}

/**
 * Fetch Yoast SEO metadata for a category/taxonomy by slug
 * @param slug - The category slug
 * @param taxonomy - The taxonomy type ('category', 'tag', etc.) - defaults to 'categories'
 * @returns Metadata object with Yoast SEO data
 */
export async function generateCategoryMetadata(slug: string, taxonomy: string = 'categories'): Promise<Metadata> {
  try {
    let termData: any = null;
    let seo: any = null;

    // Fetch category/taxonomy with Yoast SEO data
    const endpoint = `${process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost/moreyeahs-new'}/wp-json/wp/v2/${taxonomy}?slug=${slug}`;
    const response = await fetch(endpoint, { next: { revalidate: 3600 } });
    
    if (response.ok) {
      const terms = await response.json();
      if (terms && terms.length > 0) {
        const term = terms[0];
        termData = {
          name: term.name || '',
          slug: term.slug,
          description: term.description || '',
          count: term.count || 0,
        };
        // Extract Yoast SEO data if available
        seo = term.yoast_head_json || null;
      }
    }

    if (!seo) {
      // Fallback to basic metadata
      const { siteName } = await getSiteInfo();
      const title = termData?.name || formatSlugToTitle(slug);
      return {
        title: `${title} | ${siteName}`,
        description: termData?.description || `Browse ${title.toLowerCase()} content`,
      };
    }

    const { siteName } = await getSiteInfo();
    const metaTitle = seo.title || termData?.name || formatSlugToTitle(slug);
    const metaDescription = seo.description || termData?.description || '';
    const canonicalUrl = seo.canonical || `${siteUrl}/category/${slug}`;
    const ogImage = seo.og_image?.[0]?.url || '';

    return {
      title: metaTitle,
      description: metaDescription,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: seo.og_title || metaTitle,
        description: seo.og_description || metaDescription,
        url: canonicalUrl,
        siteName: siteName,
        images: ogImage ? [
          {
            url: ogImage,
            width: 1200,
            height: 630,
          },
        ] : [],
        locale: seo.og_locale || 'en_US',
        type: 'website',
      },
      twitter: {
        card: seo.twitter_card || 'summary_large_image',
        title: seo.twitter_title || seo.og_title || metaTitle,
        description: seo.twitter_description || seo.og_description || metaDescription,
      },
      robots: {
        index: seo.robots?.index !== 'noindex',
        follow: seo.robots?.follow !== 'nofollow',
      },
    };
  } catch (error) {
    console.error(`Error fetching SEO metadata for ${taxonomy}: ${slug}`, error);
    return generateFallbackMetadata(slug);
  }
}
