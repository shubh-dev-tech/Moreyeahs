import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL 
  ? `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql` 
  : '';

if (!endpoint) {
  console.warn('Warning: WORDPRESS_API_URL is not configured. GraphQL requests will fail.');
}

export const graphqlClient = endpoint ? new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
}) : null;

export async function fetchGraphQL<T>(query: string, variables?: Record<string, any>): Promise<T> {
  if (!graphqlClient) {
    throw new Error('GraphQL client is not configured. Please set WORDPRESS_API_URL or NEXT_PUBLIC_WORDPRESS_URL environment variable.');
  }
  
  try {
    const data = await graphqlClient.request<T>(query, variables);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchRestAPI(endpoint: string) {
  // Get base URL from environment
  let baseUrl = process.env.WORDPRESS_REST_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || '';
  
  // If baseUrl doesn't end with /wp-json, add it
  if (!baseUrl.includes('/wp-json')) {
    baseUrl = `${baseUrl}/wp-json`;
  }
  
  // Ensure endpoint starts with /
  if (!endpoint.startsWith('/')) {
    endpoint = `/${endpoint}`;
  }
  
  const url = `${baseUrl}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
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
  links?: Array<{
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
