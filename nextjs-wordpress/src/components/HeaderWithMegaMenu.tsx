'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MenuItem } from '@/types/menu';
import { wpUrlToPath } from '@/lib/url-utils';
import MegaMenu, { MegaMenuData } from './MegaMenu';
import MobileMenu from './MobileMenu';
import { transformMediaUrl } from '@/lib/wpFetch';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

interface HeaderWithMegaMenuProps {
  siteName: string;
  logo?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  primaryMenuItems: MenuItem[];
  secondMenuItems: MenuItem[];
  megaMenus: MegaMenuData[];
}

function MenuItems({ items, megaMenuMap, disableMegaMenu = false }: { items: MenuItem[], megaMenuMap: Record<string, MegaMenuData>, disableMegaMenu?: boolean }) {
  return (
    <>
      {items.map((item) => {
        const itemTitleLower = item.title.toLowerCase().trim();
        const hasMegaMenu = !disableMegaMenu && megaMenuMap[itemTitleLower];
        const hasChildren = item.children && item.children.length > 0;
        
        return (
          <li key={item.id} className={hasMegaMenu ? 'has-mega-menu' : (hasChildren ? 'has-children' : '')}>
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
                
                {hasChildren && (
                  <ul className="header__submenu">
                    <MenuItems items={item.children} megaMenuMap={megaMenuMap} disableMegaMenu={disableMegaMenu} />
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

export default function HeaderWithMegaMenu({ siteName, logo, primaryMenuItems, secondMenuItems, megaMenus }: HeaderWithMegaMenuProps) {
  // Initialize header scroll behavior
  useHeaderScroll();
  
  // Create a flexible mega menu mapping that handles variations
  const megaMenuMap: Record<string, MegaMenuData> = megaMenus.reduce((acc, menu) => {
    const key = menu.title.toLowerCase().trim();
    acc[key] = menu;
    
    // Add flexible matching for common variations
    if (key.endsWith('s')) {
      // If mega menu ends with 's', also match without 's'
      acc[key.slice(0, -1)] = menu;
    } else {
      // If mega menu doesn't end with 's', also match with 's'
      acc[key + 's'] = menu;
    }
    
    return acc;
  }, {} as Record<string, MegaMenuData>);

  return (
    <header className="header">
      <div className="">
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
              <MenuItems items={primaryMenuItems} megaMenuMap={megaMenuMap} disableMegaMenu={true} />
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
            
            {/* Burger Menu */}
            <MobileMenu 
              items={secondMenuItems.length > 0 ? secondMenuItems : primaryMenuItems}
              logo={logo}
              siteName={siteName}
              megaMenus={megaMenus}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
