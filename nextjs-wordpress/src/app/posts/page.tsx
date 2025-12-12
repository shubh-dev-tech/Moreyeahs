import React from 'react';
import { Metadata } from 'next';
import { fetchWordPressAPI } from '@/lib/wordpress';

export const metadata: Metadata = {
  title: 'All Posts',
  description: 'Browse all blog posts',
};

export const revalidate = parseInt(process.env.REVALIDATE_TIME || '3600');

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
  let posts: Post[] = [];
  
  try {
    posts = await fetchWordPressAPI<Post[]>('/wp/v2/posts?per_page=50&_embed');
  } catch (error) {
    console.error('Error fetching posts:', error);
  }

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
