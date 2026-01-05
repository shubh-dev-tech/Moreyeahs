import { getWordPressUrl, getWordPressApiUrl, transformMediaUrl } from './environment';

// WordPress REST API configuration
function getBaseUrl() {
  return getWordPressUrl();
}

export async function fetchWordPressAPI<T>(endpoint: string, data?: any): Promise<T> {
  const apiUrl = getWordPressApiUrl();

  if (!endpoint.startsWith('/')) {
    endpoint = `/${endpoint}`;
  }

  const url = `${apiUrl}${endpoint}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: data ? JSON.stringify(data) : JSON.stringify({}),
      next: { revalidate: 3600 },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn(`WordPress API timeout for ${url}`);
      } else {
        console.warn(`WordPress API Error for ${url}:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }
    throw error;
  }
}

export async function fetchGraphQL<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
  const baseUrl = getWordPressUrl();
  const graphqlUrl = `${baseUrl}/graphql`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: variables || {},
      }),
      next: { revalidate: 3600 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(`GraphQL error: ${result.errors[0]?.message || 'Unknown error'}`);
    }

    return result.data as T;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('GraphQL request failed:', error instanceof Error ? error.message : 'Unknown error');
    }
    throw error;
  }
}

export async function fetchRestAPI(endpoint: string, data?: any) {
  const apiUrl = getWordPressApiUrl();

  // Ensure endpoint starts with /
  if (!endpoint.startsWith('/')) {
    endpoint = `/${endpoint}`;
  }

  const url = `${apiUrl}${endpoint}`;
  
  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: data ? JSON.stringify(data) : JSON.stringify({}),
      next: { revalidate: 3600 },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    // Only log in development to avoid console spam
    if (process.env.NODE_ENV === 'development') {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn(`WordPress API timeout for ${url}`);
      } else {
        console.warn(`WordPress API Error for ${url}:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }
    throw error;
  }
}

// Menu API functions
import { Menu } from '@/types/menu';

export async function getMenuByLocation(location: string): Promise<Menu | null> {
  try {
    const menu = await fetchRestAPI(`/wp/v2/menus/${location}`);
    return menu;
  } catch (error) {
    return null;
  }
}

export async function getAllMenus(): Promise<Menu[]> {
  try {
    const menus = await fetchRestAPI('/wp/v2/menus');
    return menus;
  } catch (error) {
    return [];
  }
}

// Site Settings API functions
export interface SiteSettings {
  title: string;
  description: string;
  url: string;
  logo: {
    url: string;
    width: number;
    height: number;
    alt: string;
  } | null;
  favicon: {
    url: string;
    width: number;
    height: number;
    sizes: {
      '32': string;
      '180': string;
      '192': string;
      '512': string;
    };
  } | null;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const settings = await fetchRestAPI('/wp/v2/site-settings');
    return settings;
  } catch (error) {
    return null;
  }
}

// Footer Widget API functions
export interface FooterWidget {
  id: string;
  title: string;
  content: string;
  links: Array<{
    label: string;
    url: string;
  }>;
}

export interface FooterData {
  column1?: FooterWidget;
  column2?: FooterWidget;
  column3?: FooterWidget;
  column4?: FooterWidget;
  column5?: FooterWidget;
  copyrightLeft?: string;
  copyrightRight?: string;
}

export async function getFooterWidgets(): Promise<FooterData | null> {
  try {
    const widgets = await fetchRestAPI('/wp/v2/footer-widgets');
    return widgets;
  } catch (error) {
    return null;
  }
}

// Mega Menu API functions
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

export async function getMegaMenus(): Promise<MegaMenuData[]> {
  try {
    const menus = await fetchRestAPI('/wp/v2/mega-menus');
    return menus;
  } catch (error) {
    return [];
  }
}

// Export environment utilities for use in components
export { transformMediaUrl, transformWordPressUrl, getWordPressUrl, getWordPressApiUrl } from './environment';

// Posts with ACF blocks API functions
export interface PostWithACFBlocks {
  id: number;
  title: string;
  slug: string;
  content: string;
  blocks: any[];
  acf_fields: Record<string, any> | null;
}

export async function getPostWithACFBlocks(postId: number): Promise<PostWithACFBlocks | null> {
  try {
    const apiUrl = getWordPressApiUrl();
    const url = `${apiUrl}/wp/v2/posts-with-acf-blocks/${postId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const post = await response.json();
    return post;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Failed to fetch post with ACF blocks (ID: ${postId}):`, error instanceof Error ? error.message : 'Unknown error');
    }
    return null;
  }
}

export async function getPageWithACFBlocks(slug: string): Promise<PostWithACFBlocks | null> {
  try {
    const apiUrl = getWordPressApiUrl();
    const url = `${apiUrl}/wp/v2/pages-with-blocks/${slug}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({}),
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const page = await response.json();
    return page;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Failed to fetch page with ACF blocks (slug: ${slug}):`, error instanceof Error ? error.message : 'Unknown error');
    }
    return null;
  }
}