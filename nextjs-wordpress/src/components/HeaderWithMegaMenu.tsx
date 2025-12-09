'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MenuItem } from '@/types/menu';
import { wpUrlToPath } from '@/lib/url-utils';
import MegaMenu, { MegaMenuData } from './MegaMenu';
import MobileMenu from './MobileMenu';

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

function MenuItems({ items, megaMenuMap }: { items: MenuItem[], megaMenuMap: Record<string, MegaMenuData> }) {
  return (
    <>
      {items.map((item) => {
        const itemTitleLower = item.title.toLowerCase().trim();
        const hasMegaMenu = megaMenuMap[itemTitleLower];
        
        console.log('🔍 Menu item:', item.title, '| Lower:', itemTitleLower, '| Has mega menu:', !!hasMegaMenu);
        console.log('🗺️ Available mega menu keys:', Object.keys(megaMenuMap));
        
        return (
          <li key={item.id} className={hasMegaMenu ? 'has-mega-menu' : (item.children.length > 0 ? 'has-children' : '')}>
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
                
                {item.children.length > 0 && (
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

export default function HeaderWithMegaMenu({ siteName, logo, primaryMenuItems, secondMenuItems, megaMenus }: HeaderWithMegaMenuProps) {
  const megaMenuMap: Record<string, MegaMenuData> = megaMenus.reduce((acc, menu) => {
    const key = menu.title.toLowerCase().trim();
    console.log('🔑 Adding mega menu to map:', key, '→', menu.title);
    acc[key] = menu;
    return acc;
  }, {} as Record<string, MegaMenuData>);

  useEffect(() => {
    console.log('🗺️ Mega menu map keys:', Object.keys(megaMenuMap));
    console.log('📝 Primary menu items:', primaryMenuItems.map(i => i.title));
    console.log('🔢 Mega menus count:', megaMenus.length);
  }, [megaMenus, megaMenuMap, primaryMenuItems]);

  return (
    <header className="header">
      <div className="">
        <nav className="header__nav">
          <Link href="/" className="header__logo">
            {logo ? (
              <Image
                src={logo.url}
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
              <MenuItems items={primaryMenuItems} megaMenuMap={megaMenuMap} />
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
              items={secondMenuItems}
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
