import React from 'react';
import { Metadata } from 'next';
import { fetchGraphQL } from '@/lib/wordpress';
import { GET_RECENT_POSTS } from '@/lib/queries';
import { PostsResponse } from '@/lib/types';
import PostCard from '@/components/PostCard';

export const metadata: Metadata = {
  title: 'All Posts',
  description: 'Browse all blog posts',
};

export const revalidate = parseInt(process.env.REVALIDATE_TIME || '3600');

export default async function PostsPage() {
  const data = await fetchGraphQL<PostsResponse>(GET_RECENT_POSTS, { first: 50 });
  const posts = data.posts.nodes;

  return (
    <div className="container">
      <section className="page-header">
        <h1>All Posts</h1>
        <p>Browse our latest articles and updates</p>
      </section>

      <section className="posts-grid">
        <div className="posts-grid__items">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
