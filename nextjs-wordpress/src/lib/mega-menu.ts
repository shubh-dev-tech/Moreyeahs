import { MegaMenuData } from '@/components/MegaMenu';

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost/wp-json';

export async function getMegaMenus(): Promise<MegaMenuData[]> {
  try {
    const response = await fetch(`${WP_API_URL}/wp/v2/mega-menus`, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch mega menus: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}

export async function getMegaMenuBySlug(slug: string): Promise<MegaMenuData | null> {
  const menus = await getMegaMenus();
  return menus.find(menu => menu.slug === slug) || null;
}
