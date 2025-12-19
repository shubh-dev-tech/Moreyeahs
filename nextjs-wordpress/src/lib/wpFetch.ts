/**
 * WordPress Fetch Layer - Build-Safe
 * 
 * This layer NEVER throws errors and safely handles all failure cases.
 * Returns null or empty data instead of breaking the build.
 */

import { WORDPRESS_API_URL, IS_DEVELOPMENT } from './env';

// Safe fetch options with timeout and error handling
const FETCH_OPTIONS = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  next: { revalidate: 60 } as const,
};

// Timeout wrapper for fetch requests
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 10000): Promise<Response | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    // Log only in development, never throw
    if (IS_DEVELOPMENT) {
      console.warn(`[wpFetch] Request failed for ${url}:`, error instanceof Error ? error.message : 'Unknown error');
    }
    return null;
  }
}

// Safe JSON parsing that never throws
function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/**
 * Main WordPress fetch function - NEVER throws errors
 * Returns null on any failure (network, 404, 500, timeout, etc.)
 */
export async function wpFetch<T = any>(endpoint: string, data?: any): Promise<T | null> {
  // Ensure endpoint starts with /
  if (!endpoint.startsWith('/')) {
    endpoint = `/${endpoint}`;
  }
  
  const url = `${WORDPRESS_API_URL}${endpoint}`;
  
  const options = {
    ...FETCH_OPTIONS,
    body: JSON.stringify(data || {}),
  };
  
  const response = await fetchWithTimeout(url, options);
  
  if (!response) {
    return null;
  }
  
  // Handle non-200 responses gracefully
  if (!response.ok) {
    if (IS_DEVELOPMENT) {
      console.warn(`[wpFetch] HTTP ${response.status} for ${url}`);
    }
    return null;
  }
  
  try {
    const text = await response.text();
    return safeJsonParse<T>(text);
  } catch {
    return null;
  }
}

/**
 * Fetch multiple WordPress endpoints safely
 * Returns array with null for failed requests
 */
export async function wpFetchMultiple<T = any>(endpoints: string[], data?: any): Promise<(T | null)[]> {
  const promises = endpoints.map(endpoint => wpFetch<T>(endpoint, data));
  return Promise.all(promises);
}

/**
 * WordPress REST API helpers that never throw
 */

// Get posts with safe fallback
export async function getPosts(params: Record<string, string | number> = {}): Promise<any[]> {
  const posts = await wpFetch<any[]>('/wp/v2/posts-data', params);
  return posts || [];
}

// Get single post by slug with safe fallback
export async function getPostBySlug(slug: string): Promise<any | null> {
  return await wpFetch<any>('/wp/v2/post-by-slug', { slug });
}

// Get pages with safe fallback
export async function getPages(params: Record<string, string | number> = {}): Promise<any[]> {
  const pages = await wpFetch<any[]>('/wp/v2/pages-data', params);
  return pages || [];
}

// Get single page by slug with safe fallback
export async function getPageBySlug(slug: string): Promise<any | null> {
  return await wpFetch<any>('/wp/v2/page-by-slug', { slug });
}

// Get page with blocks (custom endpoint) with safe fallback
export async function getPageWithBlocks(slug: string): Promise<any | null> {
  return await wpFetch<any>(`/wp/v2/pages-with-blocks/${slug}`, {});
}

// Get menus with safe fallback
export async function getMenus(): Promise<any[]> {
  const menus = await wpFetch<any[]>('/wp/v2/menus', {});
  return menus || [];
}

// Get menu by location with safe fallback
export async function getMenuByLocation(location: string): Promise<any | null> {
  return await wpFetch<any>(`/wp/v2/menus/${location}`, {});
}

// Get site settings with safe fallback
export async function getSiteSettings(): Promise<any | null> {
  return await wpFetch<any>('/wp/v2/site-settings', {});
}

// Get footer widgets with safe fallback
export async function getFooterWidgets(): Promise<any | null> {
  return await wpFetch<any>('/wp/v2/footer-widgets', {});
}

// Get mega menus with safe fallback
export async function getMegaMenus(): Promise<any[]> {
  const menus = await wpFetch<any[]>('/wp/v2/mega-menus', {});
  return menus || [];
}

// Get categories with safe fallback
export async function getCategories(params: Record<string, string | number> = {}): Promise<any[]> {
  const categories = await wpFetch<any[]>('/wp/v2/categories-data', params);
  return categories || [];
}

/**
 * Media URL transformation - safe for build time
 */
export function transformMediaUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  
  // If it's already a full URL, return as-is
  if (url.startsWith('http')) return url;
  
  // If it's a relative path, prepend WordPress base URL
  const baseUrl = WORDPRESS_API_URL.replace('/wp-json', '');
  return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
}

/**
 * TypeScript interfaces for WordPress data
 */
export interface MegaMenuItem {
  title: string;
  url: string;
}

export interface MegaMenuCategory {
  icon?: string;
  title: string;
  items: MegaMenuItem[];
}

export interface MegaMenuFeaturedContent {
  enable: boolean;
  image?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  title?: string;
  description?: string;
}

export interface MegaMenuData {
  id: number;
  slug: string;
  title: string;
  menu_type: string;
  main_heading: string;
  categories: MegaMenuCategory[];
  featured_content?: MegaMenuFeaturedContent;
}

/**
 * Build-safe data fetching with fallbacks
 */
export async function getHomepageData(): Promise<{
  page: any | null;
  blocks: any[];
}> {
  // Try multiple homepage slug variations
  const slugs = ['home', 'homepage', 'front-page'];
  
  for (const slug of slugs) {
    const page = await getPageWithBlocks(slug);
    if (page) {
      return {
        page,
        blocks: page.blocks || [],
      };
    }
  }
  
  // Fallback: get first published page
  const pages = await getPages({ per_page: 1, status: 'publish' });
  if (pages.length > 0) {
    const page = await getPageWithBlocks(pages[0].slug);
    return {
      page,
      blocks: page?.blocks || [],
    };
  }
  
  // Ultimate fallback: return empty data
  return {
    page: null,
    blocks: [],
  };
}