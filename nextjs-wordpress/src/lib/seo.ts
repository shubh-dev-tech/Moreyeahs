import { Metadata } from 'next';
import { Post, SEO } from './types';
import { getSiteSettings } from './wordpress';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

// Helper to get site settings with fallback
async function getSiteInfo() {
  const settings = await getSiteSettings();
  return {
    siteName: settings?.title || process.env.NEXT_PUBLIC_SITE_NAME || 'My Site',
    siteDescription: settings?.description || process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '',
  };
}

export async function generatePostMetadata(post: Post): Promise<Metadata> {
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
