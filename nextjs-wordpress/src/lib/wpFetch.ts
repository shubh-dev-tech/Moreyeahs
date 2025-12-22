import { fetchWordPressAPI } from './wordpress';
import { transformMediaUrl } from './environment';

export interface Post {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  modified: string;
  featured_media: number;
  author: number;
  categories: number[];
  tags: number[];
  status: string;
  acf?: any;
  _links?: any;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
      media_details: {
        width: number;
        height: number;
      };
    }>;
    author?: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
  };
}

export interface PostsResponse {
  posts: Post[];
  totalPages: number;
  totalPosts: number;
}

/**
 * Get all posts with pagination support
 */
export async function getPosts(params: {
  per_page?: number;
  page?: number;
  search?: string;
  categories?: string;
  tags?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
} = {}): Promise<Post[]> {
  const {
    per_page = 10,
    page = 1,
    search,
    categories,
    tags,
    orderby = 'date',
    order = 'desc'
  } = params;

  const queryParams = new URLSearchParams({
    per_page: per_page.toString(),
    page: page.toString(),
    orderby,
    order,
    _embed: 'true'
  });

  if (search) queryParams.append('search', search);
  if (categories) queryParams.append('categories', categories);
  if (tags) queryParams.append('tags', tags);

  try {
    const posts = await fetchWordPressAPI<Post[]>(`/wp/v2/posts?${queryParams.toString()}`);
    return posts || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const posts = await fetchWordPressAPI<Post[]>(`/wp/v2/posts?slug=${slug}&_embed=true`);
    return posts && posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get a single post by ID
 */
export async function getPostById(id: number): Promise<Post | null> {
  try {
    const post = await fetchWordPressAPI<Post>(`/wp/v2/posts/${id}?_embed=true`);
    return post;
  } catch (error) {
    console.error(`Error fetching post with ID ${id}:`, error);
    return null;
  }
}

/**
 * Get recent posts
 */
export async function getRecentPosts(limit: number = 5): Promise<Post[]> {
  return getPosts({
    per_page: limit,
    orderby: 'date',
    order: 'desc'
  });
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(categorySlug: string, limit: number = 10): Promise<Post[]> {
  try {
    // First get the category ID by slug
    const categories = await fetchWordPressAPI<any[]>(`/wp/v2/categories?slug=${categorySlug}`);
    if (!categories || categories.length === 0) {
      return [];
    }

    const categoryId = categories[0].id;
    return getPosts({
      per_page: limit,
      categories: categoryId.toString()
    });
  } catch (error) {
    console.error(`Error fetching posts for category ${categorySlug}:`, error);
    return [];
  }
}

/**
 * Search posts
 */
export async function searchPosts(query: string, limit: number = 10): Promise<Post[]> {
  return getPosts({
    per_page: limit,
    search: query
  });
}

// Re-export transformMediaUrl for convenience
export { transformMediaUrl } from './environment';