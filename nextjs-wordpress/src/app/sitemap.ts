import { MetadataRoute } from 'next';
import { fetchGraphQL } from '@/lib/wordpress';
import { GET_ALL_POSTS_SLUGS } from '@/lib/queries';
import { PostsSlugsResponse } from '@/lib/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Fetch all post slugs
  const data = await fetchGraphQL<PostsSlugsResponse>(GET_ALL_POSTS_SLUGS);
  const posts = data.posts.nodes;

  // Static pages
  const staticPages = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // Dynamic post pages
  const postPages = posts.map((post) => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...postPages];
}
