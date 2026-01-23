import React from 'react';
import { Metadata } from 'next';
import { getPosts } from '@/lib/wpFetch';
import PostCard from '@/components/PostCard';
import { generateCategoryMetadata } from '@/lib/seo';

interface CategoryPageProps {
  params: { slug: string };
}

// Build-safe: force dynamic for category pages
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  return generateCategoryMetadata(params.slug);
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Build-safe: get posts by category using REST API
  const posts = await getPosts({ categories: params.slug, per_page: 50, _embed: 1 });

  return (
    <div className="container">
      <section className="page-header">
        <h1>{params.slug.charAt(0).toUpperCase() + params.slug.slice(1)}</h1>
        <p>Posts in {params.slug} category</p>
      </section>

      <section className="posts-grid">
        <div className="posts-grid__items">
          {posts.length > 0 ? (
            posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <p>No posts found in this category.</p>
          )}
        </div>
      </section>
    </div>
  );
}
