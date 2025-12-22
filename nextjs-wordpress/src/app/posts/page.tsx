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
  const posts = await getPosts({ per_page: 50 });

  return (
    <div className="container">
      <section className="page-header">
        <h1>All Posts</h1>
        <p>Browse our latest articles and updates</p>
      </section>

      <section className="posts-grid">
        <div className="posts-grid__items">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="post-card">
                <h3>
                  <a href={`/posts/${post.slug}`}>
                    <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                  </a>
                </h3>
                <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                <p className="post-date">{new Date(post.date).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No posts found. Please create some posts in WordPress.</p>
          )}
        </div>
      </section>
    </div>
  );
}
