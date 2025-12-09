import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchGraphQL } from '@/lib/wordpress';
import { GET_POST_BY_SLUG, GET_ALL_POSTS_SLUGS } from '@/lib/queries';
import { PostResponse, PostsSlugsResponse } from '@/lib/types';
import { generatePostMetadata } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import { parseBlocks } from '@/lib/blocks';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';

export const revalidate = parseInt(process.env.REVALIDATE_TIME || '3600');

export async function generateStaticParams() {
  // Skip static generation if WordPress URL is not configured
  if (!process.env.WORDPRESS_API_URL && !process.env.NEXT_PUBLIC_WORDPRESS_URL) {
    console.warn('Skipping static post generation: WordPress URL not configured');
    return [];
  }

  try {
    const data = await fetchGraphQL<PostsSlugsResponse>(GET_ALL_POSTS_SLUGS);
    return data.posts.nodes.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for posts:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const data = await fetchGraphQL<PostResponse>(GET_POST_BY_SLUG, { slug: params.slug });
    
    if (!data.post) {
      return {};
    }

    return generatePostMetadata(data.post);
  } catch (error) {
    return {};
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  let data: PostResponse;
  
  try {
    data = await fetchGraphQL<PostResponse>(GET_POST_BY_SLUG, { slug: params.slug });
  } catch (error) {
    notFound();
  }

  if (!data.post) {
    notFound();
  }

  const post = data.post;
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <JsonLd post={post} type="article" />
      
      <article className="post-single">
        <div className="container container--narrow">
          <header className="post-single__header">
            {post.categories.nodes.length > 0 && (
              <div className="post-single__categories">
                {post.categories.nodes.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="post-single__category"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            <h1 className="post-single__title">{post.title}</h1>

            <div className="post-single__meta">
              <div className="post-single__author">
                {post.author.node.avatar && (
                  <Image
                    src={post.author.node.avatar.url}
                    alt={post.author.node.name}
                    width={40}
                    height={40}
                    className="post-single__author-avatar"
                  />
                )}
                <span>{post.author.node.name}</span>
              </div>
              <time dateTime={post.date}>{formattedDate}</time>
            </div>
          </header>

          {post.featuredImage && (
            <div className="post-single__featured-image">
              <Image
                src={post.featuredImage.node.sourceUrl}
                alt={post.featuredImage.node.altText || post.title}
                width={post.featuredImage.node.mediaDetails.width}
                height={post.featuredImage.node.mediaDetails.height}
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          )}

          <div className="post-single__content">
            {(() => {
              // Check if content has blocks
              const blocks = parseBlocks(post.content);
              if (blocks.length > 0) {
                return <BlockRenderer blocks={blocks} />;
              }
              // Fallback to HTML rendering for non-block content
              return <div dangerouslySetInnerHTML={{ __html: post.content }} />;
            })()}
          </div>

          {post.tags.nodes.length > 0 && (
            <footer className="post-single__footer">
              <div className="post-single__tags">
                <strong>Tags:</strong>
                {post.tags.nodes.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/tag/${tag.slug}`}
                    className="post-single__tag"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </footer>
          )}
        </div>
      </article>
    </>
  );
}
