import React from 'react';
import { Post } from '@/lib/types';

interface JsonLdProps {
  post?: Post;
  type?: 'website' | 'article' | 'organization';
}

export default function JsonLd({ post, type = 'website' }: JsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || '';

  const generateSchema = () => {
    if (post && type === 'article') {
      // Use Yoast schema if available
      if (post.seo?.schema?.raw) {
        try {
          return JSON.parse(post.seo.schema.raw);
        } catch (e) {
          // Silently handle parse error
        }
      }

      // Fallback article schema
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: post.featuredImage?.node.sourceUrl || '',
        datePublished: post.date,
        dateModified: post.modified,
        author: {
          '@type': 'Person',
          name: post.author.node.name,
        },
        publisher: {
          '@type': 'Organization',
          name: siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${siteUrl}/posts/${post.slug}`,
        },
      };
    }

    if (type === 'organization') {
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteName,
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        sameAs: [
          // Add your social media URLs here
        ],
      };
    }

    // Default website schema
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
  };

  const schema = generateSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
