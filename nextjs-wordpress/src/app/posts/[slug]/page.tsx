import React from 'react';
import { notFound } from 'next/navigation';
import { fetchWordPressAPI } from '@/lib/wordpress';
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
  try {
    const posts = await fetchWordPressAPI<Post[]>('/wp/v2/posts?per_page=100');
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const posts = await fetchWordPressAPI<Post[]>(`/wp/v2/posts?slug=${params.slug}&_embed`);
    
    if (!posts || posts.length === 0) {
      return {};
    }

    const post = posts[0];
    return {
      title: post.title.rendered,
      description: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
    };
  } catch (error) {
    return {};
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  let posts: Post[];
  
  try {
    posts = await fetchWordPressAPI<Post[]>(`/wp/v2/posts?slug=${params.slug}&_embed`);
  } catch (error) {
    notFound();
  }

  if (!posts || posts.length === 0) {
    notFound();
  }

  const post = posts[0];
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
            <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
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
              src={featuredImage.source_url}
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
            const blocks = parseBlocks(post.content.rendered);
            if (blocks.length > 0) {
              return <BlockRenderer blocks={blocks} />;
            }
            // Fallback to HTML rendering for non-block content
            return <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />;
          })()}
        </div>
      </div>
    </article>
  );
}
