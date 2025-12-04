import React from 'react';
import { Metadata } from 'next';
import { fetchGraphQL } from '@/lib/wordpress';
import { GET_POSTS_BY_CATEGORY } from '@/lib/queries';
import PostCard from '@/components/PostCard';

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    const data: any = await fetchGraphQL(GET_POSTS_BY_CATEGORY, { slug: params.slug, first: 1 });
    const category = data.category;

    return {
      title: `${category.name} - Category`,
      description: category.description || `Posts in ${category.name} category`,
    };
  } catch (error) {
    return {
      title: 'Category',
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const data: any = await fetchGraphQL(GET_POSTS_BY_CATEGORY, { slug: params.slug, first: 50 });
  const category = data.category;

  if (!category) {
    return (
      <div className="container">
        <h1>Category not found</h1>
      </div>
    );
  }

  return (
    <div className="container">
      <section className="page-header">
        <h1>{category.name}</h1>
        {category.description && <p>{category.description}</p>}
      </section>

      <section className="posts-grid">
        <div className="posts-grid__items">
          {category.posts.nodes.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
