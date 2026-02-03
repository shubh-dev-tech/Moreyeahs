'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MenuItem } from '@/types/menu';
import { wpUrlToPath } from '@/lib/url-utils';
import MegaMenu, { MegaMenuData } from './MegaMenu';
import MobileMenu from './MobileMenu';
import { transformMediaUrl } from '@/lib/wpFetch';
import { useBackgroundDetection } from '@/hooks/useBackgroundDetection';

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
        
        // Check if this is the Career menu item and use custom URL
        const isCareerItem = itemTitleLower === 'career' || itemTitleLower === 'careers';
        const finalUrl = isCareerItem ? 'https://app.emossy.com/#/job-module/jobs?companyId=IjE' : item.url;
        
        return (
          <li key={item.id} className={hasMegaMenu ? 'has-mega-menu' : (hasChildren ? 'has-children' : '')}>
            {hasMegaMenu ? (
              <MegaMenu trigger={item.title} menuData={hasMegaMenu} />
            ) : (
              <>
                {isCareerItem || wpUrlToPath(finalUrl).startsWith('#') ? (
                  <a 
                    href={isCareerItem ? finalUrl : wpUrlToPath(finalUrl)} 
                    target={isCareerItem ? '_blank' : item.target}
                    className={item.classes}
                    rel={isCareerItem ? 'noopener noreferrer' : undefined}
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
  // Get current pathname to trigger background check on route changes
  const pathname = usePathname();
  
  // Dynamic logo URLs
  const lightBgLogoUrl = 'https://dev.moreyeahs.com/wp-content/uploads/2026/01/Moreyeahs-Logo-7.png';
  const darkBgLogoUrl = 'https://dev.moreyeahs.com/wp-content/uploads/2026/01/Logo-1.png';
  
  // Detect background color (re-check when pathname changes)
  const isDarkBackground = useBackgroundDetection('.header', [pathname]);
  
  // Choose logo based on background
  const currentLogoUrl = isDarkBackground ? darkBgLogoUrl : lightBgLogoUrl;
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

  // State for menu visibility
  const [isMenuHidden, setIsMenuHidden] = useState(false);

  // Scroll detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastScrollY = window.scrollY || 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
          const scrollDifference = currentScrollY - lastScrollY;

          // Only show menu when at top (scrollY <= 50)
          // Hide menu when scrolled down, regardless of scroll direction
          if (currentScrollY <= 50) {
            // At top - show menu
            setIsMenuHidden(false);
          } else {
            // Scrolled down - hide menu (even when scrolling up)
            setIsMenuHidden(true);
          }

          lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="header">
      <div className="">
        <nav className="header__nav">
          <Link href="/" className="header__logo">
            <Image
              src={currentLogoUrl}
              alt={siteName}
              width={220}
              height={50}
              priority
              className="header__logo-image"
            />
          </Link>
          
          {/* Desktop Primary Menu */}
          {primaryMenuItems.length > 0 ? (
            <ul className={`header__menu ${isMenuHidden ? 'header__menu--hidden' : ''} ${isDarkBackground ? 'header__menu--dark-bg' : 'header__menu--light-bg'}`}>
              <MenuItems items={primaryMenuItems} megaMenuMap={megaMenuMap} disableMegaMenu={true} />
            </ul>
          ) : (
            <ul className={`header__menu ${isMenuHidden ? 'header__menu--hidden' : ''} ${isDarkBackground ? 'header__menu--dark-bg' : 'header__menu--light-bg'}`}>
              <li>
                <Link href="/">Home</Link>
              </li>
            </ul>
          )}

          {/* Desktop & Mobile Burger Menu */}
          <div className={`header__actions ${isDarkBackground ? 'header__actions--dark-bg' : 'header__actions--light-bg'}`}>
            {/* Search Icon (optional) */}
            <button className={`header__search-btn ${isDarkBackground ? 'header__search-btn--dark-bg' : 'header__search-btn--light-bg'}`} aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2"/>
                <path d="M12.5 12.5L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            {/* Burger Menu */}
            <MobileMenu 
              items={secondMenuItems.length > 0 ? secondMenuItems : primaryMenuItems}
              logo={{ url: currentLogoUrl, alt: siteName, width: 220, height: 50 }}
              siteName={siteName}
              megaMenus={megaMenus}
              isDarkBackground={isDarkBackground}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}