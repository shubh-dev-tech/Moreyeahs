'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IoChevronDown } from 'react-icons/io5';
import { MenuItem } from '@/types/menu';
import { wpUrlToPath } from '@/lib/url-utils';
import MegaMenu, { MegaMenuData } from './MegaMenu';
import MobileMenu from './MobileMenu';
import { transformMediaUrl } from '@/lib/wpFetch';
import { useBackgroundDetection } from '@/hooks/useBackgroundDetection';
import { usePathname } from 'next/navigation';

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
        const finalUrl = isCareerItem ? '/careers' : item.url;
        
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
                    {hasChildren && <IoChevronDown className="menu-chevron" />}
                  </a>
                ) : (
                  <Link 
                    href={wpUrlToPath(finalUrl)} 
                    target={item.target}
                    className={item.classes}
                  >
                    {item.title}
                    {hasChildren && <IoChevronDown className="menu-chevron" />}
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [hideDefaultHeader, setHideDefaultHeader] = useState(false);
  const pathname = usePathname();
  
  // Check if current page should have black menu (careers, case-study, blog)
  const shouldUseBlackMenu = pathname === '/careers' || 
                             pathname.startsWith('/careers/') ||
                             pathname.startsWith('/case-study') || 
                             pathname.startsWith('/blog');
  
  // For all other pages, use white menu (dark background style)
  const isDarkBackground = !shouldUseBlackMenu;
  
  // Logo URLs - using working WordPress paths
  const lightBgLogoUrl = 'https://dev.moreyeahs.com/wp-content/uploads/2026/01/Moreyeahs-Logo-7.png'; // Black logo for light backgrounds
  const darkBgLogoUrl = 'https://dev.moreyeahs.com/wp-content/uploads/2026/01/Logo-1.png'; // White logo for dark backgrounds
  
  // Choose logo based on menu color
  // White menu = white logo (dark background), Black menu = black logo (light background)
  const defaultHeaderLogoUrl = isDarkBackground ? darkBgLogoUrl : lightBgLogoUrl;
  // Sticky header always uses black logo
  const stickyHeaderLogoUrl = lightBgLogoUrl;
  
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

  // Detect scroll to show/hide headers
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const firstSectionHeight = window.innerHeight * 0.8; // 80vh as example
      
      // Hide default header when scrolling down
      if (currentScrollY > 100) {
        setHideDefaultHeader(true);
      } else {
        setHideDefaultHeader(false);
      }
      
      // Show sticky header after first section
      setIsScrolled(currentScrollY > firstSectionHeight);
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Default Transparent Header - Hides on scroll */}
      <header className={`header header--transparent ${hideDefaultHeader ? 'header--hidden' : ''} ${isDarkBackground ? 'header--dark-bg' : 'header--light-bg'}`}>
        <div className="contai-new">
          <nav className="header__nav">
            <Link href="/" className="header__logo">
              <Image
                src={defaultHeaderLogoUrl}
                alt={siteName}
                width={220}
                height={50}
                priority
                className="header__logo-image"
              />
            </Link>
            
            {/* Desktop Primary Menu */}
            {primaryMenuItems.length > 0 ? (
              <ul className={`header__menu ${isDarkBackground ? 'header__menu--dark-bg' : 'header__menu--light-bg'}`}>
                <MenuItems items={primaryMenuItems} megaMenuMap={megaMenuMap} disableMegaMenu={true} />
              </ul>
            ) : (
              <ul className={`header__menu ${isDarkBackground ? 'header__menu--dark-bg' : 'header__menu--light-bg'}`}>
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
                logo={{ url: defaultHeaderLogoUrl, alt: siteName, width: 220, height: 50 }}
                siteName={siteName}
                megaMenus={megaMenus}
                isDarkBackground={isDarkBackground}
              />
            </div>
          </nav>
        </div>
      </header>

      {/* Sticky Header - Fades in on scroll */}
      <header className={`header header--sticky ${isScrolled ? 'header--visible' : ''}`}>
        <div className="contai-new">
          <nav className="header__nav">
            <Link href="/" className="header__logo">
              <Image
                src={stickyHeaderLogoUrl}
                alt={siteName}
                width={220}
                height={50}
                priority
                className="header__logo-image"
              />
            </Link>
            
            {/* Desktop Primary Menu */}
            {primaryMenuItems.length > 0 ? (
              <ul className="header__menu header__menu--light-bg">
                <MenuItems items={primaryMenuItems} megaMenuMap={megaMenuMap} disableMegaMenu={true} />
              </ul>
            ) : (
              <ul className="header__menu header__menu--light-bg">
                <li>
                  <Link href="/">Home</Link>
                </li>
              </ul>
            )}

            {/* Desktop & Mobile Burger Menu */}
            <div className="header__actions header__actions--light-bg">
              {/* Search Icon (optional) */}
              <button className="header__search-btn header__search-btn--light-bg" aria-label="Search">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12.5 12.5L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              
              {/* Burger Menu */}
              <MobileMenu 
                items={secondMenuItems.length > 0 ? secondMenuItems : primaryMenuItems}
                logo={{ url: stickyHeaderLogoUrl, alt: siteName, width: 220, height: 50 }}
                siteName={siteName}
                megaMenus={megaMenus}
                isDarkBackground={false}
              />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}