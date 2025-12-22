import React from 'react';
import { Metadata } from 'next';
import { getPosts } from '@/lib/wpFetch';

export const metadata: Metadata = {
  title: 'All Posts',
  description: 'Browse all blog posts',
};

// Build-safe: ISR with 60s revalidation, never fails during build
export const revalidate = 60;

interface Post {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  date: string;
  featured_media: number;
  _links: any;
}

export default async function PostsPage() {
  // Build-safe: getPosts never throws, returns empty array on failure
  const posts = await getPosts({ per_page: 50, _embed: 1 }) as Post[];

  return (
    <div className="container">
      <section className="page-header">
        <h1>All Posts</h1>
        <p>Browse our latest articles and updates</p>
      </section>

      <section className="posts-grid">
        <div className="posts-grid__items">
          {posts.length > 0 ? (
            posts.map((post) => {
              // Safely extract title and excerpt
              const titleText = typeof post?.title === 'string' ? post.title : post?.title?.rendered || 'Untitled';
              const excerptText = typeof post?.excerpt === 'string' ? post.excerpt : post?.excerpt?.rendered || '';
              const slug = post?.slug || '';
              const date = post?.date || new Date().toISOString();
              
              return (
                <div key={post.id} className="post-card">
                  <h3>
                    <a href={`/posts/${slug}`}>
                      {titleText.replace(/<[^>]*>/g, '')}
                    </a>
                  </h3>
                  {excerptText && (
                    <div dangerouslySetInnerHTML={{ __html: excerptText }} />
                  )}
                  <p className="post-date">{new Date(date).toLocaleDateString()}</p>
                </div>
              );
            })
          ) : (
            <p>No posts found. Please create some posts in WordPress.</p>
          )}
        </div>
      </section>
    </div>
  );
}
