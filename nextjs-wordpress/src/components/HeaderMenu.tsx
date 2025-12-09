'use client';

import React from 'react';
import Link from 'next/link';
import { MenuItem } from '@/types/menu';
import { wpUrlToPath } from '@/lib/url-utils';
import MegaMenu, { MegaMenuData } from './MegaMenu';

interface HeaderMenuProps {
  items: MenuItem[];
  megaMenuMap: Record<string, MegaMenuData>;
}

function MenuItems({ items, megaMenuMap }: HeaderMenuProps) {
  return (
    <>
      {items.map((item) => {
        const itemTitleLower = item.title.toLowerCase();
        const hasMegaMenu = megaMenuMap[itemTitleLower];
        
        // Debug logging
        if (typeof window !== 'undefined') {
          console.log('Menu item:', item.title, 'Lower:', itemTitleLower, 'Has mega menu:', !!hasMegaMenu);
        }
        
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

export default function HeaderMenu({ items, megaMenuMap }: HeaderMenuProps) {
  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('HeaderMenu - Mega menu map keys:', Object.keys(megaMenuMap));
    console.log('HeaderMenu - Menu items:', items.map(i => i.title));
  }

  return (
    <ul className="header__menu">
      <MenuItems items={items} megaMenuMap={megaMenuMap} />
    </ul>
  );
}
