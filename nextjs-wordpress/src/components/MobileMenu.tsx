'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MenuItem } from '@/types/menu';
import { MegaMenuData } from './MegaMenu';
import { wpUrlToPath } from '@/lib/url-utils';
import { transformMediaUrl } from '@/lib/wpFetch';

interface MobileMenuProps {
  items: MenuItem[];
  logo?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  siteName?: string;
  megaMenus?: MegaMenuData[];
  isDarkBackground?: boolean;
}

function MobileMenuItems({ 
  items, 
  onLinkClick, 
  megaMenuMap,
  onMegaMenuHover,
  onMegaMenuLeave
}: { 
  items: MenuItem[]; 
  onLinkClick: () => void;
  megaMenuMap: Record<string, MegaMenuData>;
  onMegaMenuHover: (menuKey: string, menuData: MegaMenuData) => void;
  onMegaMenuLeave: () => void;
}) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  return (
    <>
      {items.map((item) => {
        const itemTitleLower = item.title.toLowerCase().trim();
        const hasMegaMenu = megaMenuMap[itemTitleLower];
        
        // Check if this is the Career menu item and use custom URL
        const isCareerItem = itemTitleLower === 'career' || itemTitleLower === 'careers';
        const finalUrl = isCareerItem ? '/careers' : item.url;

        if (hasMegaMenu) {
          return (
            <li 
              key={item.id} 
              className="mobile-menu__item mobile-menu__item--mega"
              onMouseEnter={() => onMegaMenuHover(itemTitleLower, hasMegaMenu)}
            >
              <div className="mobile-menu__item-wrapper">
                <span className="mobile-menu__link mobile-menu__link--mega">
                  {item.title}
                </span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
                  className="mobile-menu__arrow"
                >
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </li>
          );
        }

        return (
          <li 
            key={item.id} 
            className="mobile-menu__item"
            onMouseEnter={onMegaMenuLeave}
          >
            {item.children.length > 0 ? (
              <>
                <div className="mobile-menu__item-wrapper">
                  {isCareerItem || wpUrlToPath(finalUrl).startsWith('#') ? (
                    <a 
                      href={isCareerItem ? finalUrl : wpUrlToPath(finalUrl)} 
                      target={isCareerItem ? '_blank' : item.target}
                      className={`mobile-menu__link ${item.classes}`}
                      onClick={onLinkClick}
                      rel={isCareerItem ? 'noopener noreferrer' : undefined}
                    >
                      {item.title}
                    </a>
                  ) : (
                    <Link 
                      href={wpUrlToPath(finalUrl)} 
                      target={item.target}
                      className={`mobile-menu__link ${item.classes}`}
                      onClick={onLinkClick}
                    >
                      {item.title}
                    </Link>
                  )}
                  <button
                    className="mobile-menu__toggle"
                    onClick={() => toggleItem(item.id)}
                    aria-label={`Toggle ${item.title} submenu`}
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="none"
                      style={{ transform: openItems.includes(item.id) ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
                    >
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                
                <ul className={`mobile-menu__submenu ${openItems.includes(item.id) ? 'open' : ''}`}>
                  <MobileMenuItems items={item.children} onLinkClick={onLinkClick} megaMenuMap={megaMenuMap} onMegaMenuHover={onMegaMenuHover} onMegaMenuLeave={onMegaMenuLeave} />
                </ul>
              </>
            ) : (
              <div className="mobile-menu__item-wrapper">
                {isCareerItem || wpUrlToPath(finalUrl).startsWith('#') ? (
                  <a 
                    href={isCareerItem ? finalUrl : wpUrlToPath(finalUrl)} 
                    target={isCareerItem ? '_blank' : item.target}
                    className={`mobile-menu__link ${item.classes}`}
                    onClick={onLinkClick}
                    rel={isCareerItem ? 'noopener noreferrer' : undefined}
                  >
                    {item.title}
                  </a>
                ) : (
                  <Link 
                    href={wpUrlToPath(finalUrl)} 
                    target={item.target}
                    className={`mobile-menu__link ${item.classes}`}
                    onClick={onLinkClick}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            )}
          </li>
        );
      })}
    </>
  );
}

export default function MobileMenu({ items, logo, siteName, megaMenus = [], isDarkBackground = false }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<MegaMenuData | null>(null);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const megaMenuMap: Record<string, MegaMenuData> = useMemo(() => {
    return megaMenus.reduce((acc, menu) => {
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
  }, [megaMenus]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setActiveMegaMenu(null);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    setActiveMegaMenu(null);
  };

  const handleMegaMenuHover = (menuKey: string, menuData: MegaMenuData) => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    setActiveMegaMenu(menuData);
  };

  const handleMegaMenuLeave = () => {
    setActiveMegaMenu(null);
  };

  return (
    <>
      <button
        className={`mobile-menu__hamburger ${isDarkBackground ? 'mobile-menu__hamburger--dark-bg' : 'mobile-menu__hamburger--light-bg'}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className={`hamburger-line ${isOpen ? 'open' : ''} ${isDarkBackground ? 'hamburger-line--dark-bg' : 'hamburger-line--light-bg'}`}></span>
        <span className={`hamburger-line ${isOpen ? 'open' : ''} ${isDarkBackground ? 'hamburger-line--dark-bg' : 'hamburger-line--light-bg'}`}></span>
        <span className={`hamburger-line ${isOpen ? 'open' : ''} ${isDarkBackground ? 'hamburger-line--dark-bg' : 'hamburger-line--light-bg'}`}></span>
      </button>

      <div className={`mobile-menu__overlay ${isOpen ? 'open' : ''}`}>
        <nav className={`mobile-menu__nav ${isOpen ? 'open' : ''}`}>
          {/* Header with Logo and Close Button */}
          <div className="mobile-menu__header">
            <Link href="/" className="mobile-menu__logo" onClick={closeMenu}>
              {logo ? (
                <Image
                  src={transformMediaUrl(logo.url)}
                  alt={logo.alt || siteName || 'Logo'}
                  width={logo.width}
                  height={logo.height}
                  className="mobile-menu__logo-image"
                />
              ) : (
                <span className="mobile-menu__logo-text">{siteName || 'My Site'}</span>
              )}
            </Link>
            
            <button 
              className="mobile-menu__close"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Menu Content */}
          <div className="mobile-menu__content">
            <ul className="mobile-menu__list">
              <MobileMenuItems 
                items={items} 
                onLinkClick={closeMenu} 
                megaMenuMap={megaMenuMap}
                onMegaMenuHover={handleMegaMenuHover}
                onMegaMenuLeave={handleMegaMenuLeave}
              />
            </ul>
          </div>

          {/* Footer with Social Icons */}
          <div className="mobile-menu__footer" onMouseEnter={handleMegaMenuLeave}>
            <div className="social-links">
              <a 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link" 
                aria-label="Follow us on linkedin" 
                href="https://www.linkedin.com/company/moreyeahs"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              
              <a 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link" 
                aria-label="Follow us on facebook" 
                href="https://www.facebook.com/moreyeahs"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              <a 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link" 
                aria-label="Follow us on instagram" 
                href="https://www.instagram.com/moreyeahs"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </nav>

        {/* Mega Menu Panel - Full width with 5 items per row */}
        <div 
          className={`mobile-menu__mega-panel ${activeMegaMenu ? 'visible' : ''}`}
        >
          <button 
            className="mobile-menu__mega-close"
            onClick={handleMegaMenuLeave}
            aria-label="Close mega menu"
          >
            ×
          </button>
          {activeMegaMenu && (
            <>
              {/* Main Heading */}
              <div className="mobile-menu__mega-heading">{activeMegaMenu.main_heading}</div>
              
              {/* Full Width Content - 5 Items per Row */}
              <div className="mobile-menu__mega-content">
                <div className="mobile-menu__mega-all-items">
                  {activeMegaMenu.categories.map((category, catIndex) => (
                    category.items && category.items.length > 0 && (
                      <div key={catIndex} className="mobile-menu__mega-category-section">
                        {/* Category Header Row */}
                        <div className="mobile-menu__mega-category-header-row">
                          <h4 className="mobile-menu__mega-category-title">{category.title}</h4>
                          <div className="mobile-menu__mega-category-divider"></div>
                        </div>
                        
                        {/* Items in 5-column grid */}
                        <div className="mobile-menu__mega-items-grid">
                          {category.items.map((megaItem, itemIndex) => (
                            <Link
                              key={itemIndex}
                              href={megaItem.url}
                              className="mobile-menu__mega-link"
                              onClick={closeMenu}
                            >
                              {megaItem.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
