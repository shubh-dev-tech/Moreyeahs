import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.WORDPRESS_API_URL || '';

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchGraphQL<T>(query: string, variables?: Record<string, any>): Promise<T> {
  try {
    const data = await graphqlClient.request<T>(query, variables);
    return data;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
}

export async function fetchRestAPI(endpoint: string) {
  const baseUrl = process.env.WORDPRESS_REST_API_URL || '';
  const url = `${baseUrl}${endpoint}`;
  
  console.log('Fetching from URL:', url); // Debug log
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Disable cache for now to always get fresh data
    });
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}, URL: ${url}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data); // Debug log
    return data;
  } catch (error) {
    console.error('REST API Error:', error);
    throw error;
  }
}

// Menu API functions
import { Menu } from '@/types/menu';

export async function getMenuByLocation(location: string): Promise<Menu | null> {
  try {
    const menu = await fetchRestAPI(`/menus/${location}`);
    return menu;
  } catch (error) {
    console.error(`Error fetching menu for location: ${location}`, error);
    return null;
  }
}

export async function getAllMenus(): Promise<Menu[]> {
  try {
    const menus = await fetchRestAPI('/menus');
    return menus;
  } catch (error) {
    console.error('Error fetching menus:', error);
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
    const settings = await fetchRestAPI('/site-settings');
    return settings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}
