import { MegaMenuData } from '@/components/MegaMenu';

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost/wp-json';

export async function getMegaMenus(): Promise<MegaMenuData[]> {
  try {
    const response = await fetch(`${WP_API_URL}/wp/v2/mega-menus`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      console.error(`Failed to fetch mega menus: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch mega menus: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('getMegaMenus - Fetched data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching mega menus:', error);
    return [];
  }
}

export async function getMegaMenuBySlug(slug: string): Promise<MegaMenuData | null> {
  const menus = await getMegaMenus();
  return menus.find(menu => menu.slug === slug) || null;
}
