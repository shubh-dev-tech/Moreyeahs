import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/types';
import { truncateText } from '@/lib/seo';
import { transformMediaUrl } from '@/lib/wordpress';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const excerpt = truncateText(post.excerpt, 150);
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="post-card">
      {post.featuredImage && (
        <Link href={`/posts/${post.slug}`} className="post-card__image-link">
          <div className="post-card__image">
            <Image
              src={transformMediaUrl(post.featuredImage.node.sourceUrl)}
              alt={post.featuredImage.node.altText || post.title}
              width={post.featuredImage.node.mediaDetails.width}
              height={post.featuredImage.node.mediaDetails.height}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              priority={false}
            />
          </div>
        </Link>
      )}
      
      <div className="post-card__content">
        {post.categories.nodes.length > 0 && (
          <div className="post-card__categories">
            {post.categories.nodes.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="post-card__category"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        <h2 className="post-card__title">
          <Link href={`/posts/${post.slug}`}>
            {post.title}
          </Link>
        </h2>

        <div className="post-card__meta">
          <time dateTime={post.date}>{formattedDate}</time>
          <span className="post-card__author">by {post.author.node.name}</span>
        </div>

        <p className="post-card__excerpt">{excerpt}</p>

        <Link href={`/posts/${post.slug}`} className="post-card__read-more">
          Read More →
        </Link>
      </div>
    </article>
  );
}
