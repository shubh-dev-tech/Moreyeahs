'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MenuItem } from '@/types/menu';
import MobileMenu from './MobileMenu';
import MegaMenu, { MegaMenuData } from './MegaMenu';
import { wpUrlToPath } from '@/lib/url-utils';
import { transformMediaUrl } from '@/lib/wpFetch';

interface SiteSettings {
  title: string;
  logo: {
    url: string;
    width: number;
    height: number;
    alt: string;
  } | null;
}

interface Menu {
  items: MenuItem[];
}

function MenuItems({ items, megaMenuMap }: { items: MenuItem[], megaMenuMap: Record<string, MegaMenuData> }) {
  return (
    <>
      {items.map((item) => {
        const itemTitleLower = item.title.toLowerCase().trim();
        const hasMegaMenu = megaMenuMap[itemTitleLower];
        
        return (
          <li key={item.id} className={hasMegaMenu ? 'has-mega-menu' : (item.children && item.children.length > 0 ? 'has-children' : '')}>
            {hasMegaMenu ? (
              <MegaMenu trigger={item.title} menuData={hasMegaMenu} />
            ) : (
              <>
                <Link 
                  href={wpUrlToPath(item.url)} 
                  target={item.target}
                  className={item.classes}
                >
                  {item.title}
                </Link>
                
                {item.children && item.children.length > 0 && (
                  <ul className="header__submenu">
                    <MenuItems items={item.children} megaMenuMap={megaMenuMap} />
                  </ul>
                )}
              </>
            )}
          </li>
        );
      })}
    </>
  );
}

export default function HeaderClient() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [primaryMenu, setPrimaryMenu] = useState<Menu | null>(null);
  const [secondMenu, setSecondMenu] = useState<Menu | null>(null);
  const [megaMenus, setMegaMenus] = useState<MegaMenuData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost/moreyeahs-new' : 'https://dev.moreyeahs.com');
        
        // Fetch site settings
        const settingsRes = await fetch(`${baseUrl}/wp-json/wp/v2/site-settings`);
        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          setSiteSettings(settings);
        }

        // Fetch primary menu
        const primaryRes = await fetch(`${baseUrl}/wp-json/wp/v2/menus/primary`);
        if (primaryRes.ok) {
          const menu = await primaryRes.json();
          setPrimaryMenu(menu);
        }

        // Fetch second menu
        const secondRes = await fetch(`${baseUrl}/wp-json/wp/v2/menus/second-menu`);
        if (secondRes.ok) {
          const menu = await secondRes.json();
          setSecondMenu(menu);
        }

        // Fetch mega menus
        const megaMenuRes = await fetch('/api/mega-menus');
        if (megaMenuRes.ok) {
          const menus = await megaMenuRes.json();
          setMegaMenus(menus);
        }
      } catch (error) {
        // Silently handle error
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const megaMenuMap: Record<string, MegaMenuData> = megaMenus.reduce((acc, menu) => {
    const key = menu.title.toLowerCase().trim();
    acc[key] = menu;
    return acc;
  }, {} as Record<string, MegaMenuData>);

  const siteName = siteSettings?.title || process.env.NEXT_PUBLIC_SITE_NAME || 'My Site';
  const logo = siteSettings?.logo;
  const primaryMenuItems = primaryMenu?.items || [];
  const secondMenuItems = secondMenu?.items || [];

  if (loading) {
    return (
      <header className="header">
        <div className="contai-new">
          <nav className="header__nav">
            <Link href="/" className="header__logo">
              <span className="header__logo-text">Loading...</span>
            </Link>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="contai-new">
        <nav className="header__nav">
          <Link href="/" className="header__logo">
            {logo ? (
              <Image
                src={transformMediaUrl(logo.url)}
                alt={logo.alt || siteName}
                width={logo.width}
                height={logo.height}
                priority
                className="header__logo-image"
              />
            ) : (
              <span className="header__logo-text">{siteName}</span>
            )}
          </Link>
          
          {/* Desktop Primary Menu */}
          {primaryMenuItems.length > 0 ? (
            <ul className="header__menu">
              <MenuItems items={primaryMenuItems} megaMenuMap={{}} />
            </ul>
          ) : (
            <ul className="header__menu">
              <li>
                <Link href="/">Home</Link>
              </li>
            </ul>
          )}

          {/* Desktop & Mobile Burger Menu */}
          <div className="header__actions">
            {/* Search Icon (optional) */}
            <button className="header__search-btn" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2"/>
                <path d="M12.5 12.5L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            {/* Burger Menu - uses second-menu if available, falls back to primary */}
            <MobileMenu 
              items={secondMenuItems.length > 0 ? secondMenuItems : primaryMenuItems}
              logo={logo || undefined}
              siteName={siteName}
              megaMenus={megaMenus}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
