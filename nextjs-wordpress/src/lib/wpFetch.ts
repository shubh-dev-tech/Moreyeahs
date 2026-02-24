/**
 * WordPress Fetch Layer - Build-Safe
 * 
 * This layer NEVER throws errors and safely handles all failure cases.
 * Returns null or empty data instead of breaking the build.
 */

import { WORDPRESS_API_URL, IS_DEVELOPMENT } from './env';

// Cache for failed endpoints to prevent repeated 404 requests
const failedEndpointsCache = new Map<string, number>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
export async function wpFetch<T = any>(endpoint: string, data?: any, method: 'GET' | 'POST' = 'POST'): Promise<T | null> {
  // Ensure endpoint starts with /
  if (!endpoint.startsWith('/')) {
    endpoint = `/${endpoint}`;
  }
  
  const url = `${WORDPRESS_API_URL}${endpoint}`;
  
  // Check if this endpoint recently failed (404) - skip to avoid repeated requests
  const cachedFailure = failedEndpointsCache.get(url);
  if (cachedFailure && Date.now() - cachedFailure < CACHE_DURATION) {
    return null;
  }
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    next: { revalidate: 60 } as const,
  };
  
  // Only add body for POST requests
  if (method === 'POST' && data) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetchWithTimeout(url, options);
  
  if (!response) {
    return null;
  }
  
  // Handle non-200 responses gracefully
  if (!response.ok) {
    // Cache 404 errors to prevent repeated requests
    if (response.status === 404) {
      failedEndpointsCache.set(url, Date.now());
      // Silently ignore 404s - they're expected for missing content
      return null;
    }
    
    // Only log non-404 errors in development
    if (IS_DEVELOPMENT && response.status >= 500) {
      console.warn(`[wpFetch] HTTP ${response.status} for ${url}`);
    }
    return null;
  }
  
  // Clear from failed cache if it succeeds
  failedEndpointsCache.delete(url);
  
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
  return await wpFetch<any>(`/wp/v2/pages?slug=${slug}`, undefined, 'GET').then(pages => {
    return pages && Array.isArray(pages) && pages.length > 0 ? pages[0] : null;
  });
}

// Get page with blocks (custom endpoint) with safe fallback
export async function getPageWithBlocks(slug: string): Promise<any | null> {
  // Try the custom endpoint first
  const result = await wpFetch<any>(`/wp/v2/pages-with-blocks/${slug}`, {});
  
  if (result) {
    return result;
  }
  
  // If custom endpoint fails, try standard endpoint and transform
  const standardPage = await getPageBySlug(slug);
  if (standardPage) {
    return {
      id: standardPage.id,
      title: standardPage.title?.rendered || '',
      content: standardPage.content?.rendered || '',
      slug: standardPage.slug,
      blocks: [] // No blocks from standard endpoint
    };
  }
  
  return null;
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

// Get footer settings with safe fallback (new approach)
export async function getFooterSettings(): Promise<any | null> {
  return await wpFetch<any>('/wp/v2/footer-settings', {});
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

// Get testimonials with safe fallback
export async function getTestimonials(params: Record<string, string | number> = {}): Promise<any[]> {
  const testimonials = await wpFetch<any[]>('/wp/v2/testimonials', params);
  return testimonials || [];
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