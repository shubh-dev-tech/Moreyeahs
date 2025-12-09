import React from 'react';
import { getMenuByLocation, getSiteSettings, getMegaMenus, type MegaMenuData } from '@/lib/wordpress';
import HeaderWithMegaMenu from './HeaderWithMegaMenu';

export default async function Header() {
  let siteSettings = null;
  let primaryMenu = null;
  let secondMenu = null;
  let megaMenus: MegaMenuData[] = [];
  
  try {
    siteSettings = await getSiteSettings();
  } catch (error) {
    console.error('Error loading site settings:', error);
  }
  
  try {
    primaryMenu = await getMenuByLocation('primary');
  } catch (error) {
    console.error('Error loading primary menu:', error);
  }
  
  try {
    secondMenu = await getMenuByLocation('second-menu');
  } catch (error) {
    console.error('Error loading second menu:', error);
  }
  
  try {
    megaMenus = await getMegaMenus();
  } catch (error) {
    console.error('Error loading mega menus:', error);
  }
  
  const siteName = siteSettings?.title || process.env.NEXT_PUBLIC_SITE_NAME || 'My Site';
  const logo = siteSettings?.logo || undefined;
  const primaryMenuItems = primaryMenu?.items || [];
  const secondMenuItems = secondMenu?.items || [];

  return (
    <HeaderWithMegaMenu
      siteName={siteName}
      logo={logo}
      primaryMenuItems={primaryMenuItems}
      secondMenuItems={secondMenuItems}
      megaMenus={megaMenus}
    />
  );
}
