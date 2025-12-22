import React from 'react';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPosts, transformMediaUrl } from '@/lib/wpFetch';
import { parseBlocks } from '@/lib/blocks';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';

export const revalidate = parseInt(process.env.REVALIDATE_TIME || '3600');

interface Post {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  date: string;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      media_details: {
        width: number;
        height: number;
      };
    }>;
    author?: Array<{
      name: string;
      avatar_urls: { [key: string]: string };
    }>;
  };
}

export async function generateStaticParams() {
  // Build-safe: use wpFetch instead of fetchWordPressAPI
  const posts = await getPosts({ per_page: 100 });
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Build-safe: use wpFetch instead of fetchWordPressAPI
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title?.rendered || (typeof post.title === 'string' ? post.title : '') || 'Post',
    description: (post.excerpt?.rendered || (typeof post.excerpt === 'string' ? post.excerpt : '') || '').replace(/<[^>]*>/g, '').substring(0, 160),
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  // Build-safe: use wpFetch instead of fetchWordPressAPI
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
  const author = post._embedded?.author?.[0];

  return (
    <article className="post-single">
      <div className="container container--narrow">
        <header className="post-single__header">
          <h1 className="post-single__title">
            <span dangerouslySetInnerHTML={{ __html: post.title?.rendered || post.title || 'Untitled' }} />
          </h1>

          <div className="post-single__meta">
            {author && (
              <div className="post-single__author">
                <span>{author.name}</span>
              </div>
            )}
            <time dateTime={post.date}>{formattedDate}</time>
          </div>
        </header>

        {featuredImage && (
          <div className="post-single__featured-image">
            <img
              src={transformMediaUrl(featuredImage.source_url)}
              alt={featuredImage.alt_text || post.title.rendered}
              width={featuredImage.media_details.width}
              height={featuredImage.media_details.height}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        )}

        <div className="post-single__content">
          {(() => {
            // Check if content has blocks
            const content = post.content?.rendered || (typeof post.content === 'string' ? post.content : '') || '';
            const blocks = parseBlocks(content);
            if (blocks.length > 0) {
              return <BlockRenderer blocks={blocks} />;
            }
            // Fallback to HTML rendering for non-block content
            return <div dangerouslySetInnerHTML={{ __html: content }} />;
          })()}
        </div>
      </div>
    </article>
  );
}
