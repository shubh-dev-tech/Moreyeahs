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
        const hasChildren = item.children && item.children.length > 0;
        
        // Check if this is the Career menu item and use custom URL
        const isCareerItem = itemTitleLower === 'career' || itemTitleLower === 'careers';
        const finalUrl = isCareerItem ? 'https://app.emossy.com/#/job-module/jobs?companyId=IjE' : item.url;
        
        return (
          <li key={item.id} className={hasMegaMenu ? 'has-mega-menu' : (hasChildren ? 'has-children' : '')}>
            {hasMegaMenu ? (
              <MegaMenu trigger={item.title} menuData={hasMegaMenu} />
            ) : (
              <>
                {isCareerItem ? (
                  <a 
                    href={finalUrl} 
                    target="_blank"
                    className={item.classes}
                    rel="noopener noreferrer"
                  >
                    {item.title}
                  </a>
                ) : (
                  <Link 
                    href={wpUrlToPath(finalUrl)} 
                    target={item.target}
                    className={item.classes}
                  >
                    {item.title}
                  </Link>
                )}
                
                {hasChildren && (
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
  return (
    <ul className="header__menu">
      <MenuItems items={items} megaMenuMap={megaMenuMap} />
    </ul>
  );
}
