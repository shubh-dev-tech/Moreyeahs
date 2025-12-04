import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getMenuByLocation, getSiteSettings } from '@/lib/wordpress';
import { MenuItem } from '@/types/menu';
import MobileMenu from './MobileMenu';
import { wpUrlToPath } from '@/lib/url-utils';

function MenuItems({ items }: { items: MenuItem[] }) {
  return (
    <>
      {items.map((item) => (
        <li key={item.id} className={item.children.length > 0 ? 'has-children' : ''}>
          <Link 
            href={wpUrlToPath(item.url)} 
            target={item.target}
            className={item.classes}
          >
            {item.title}
          </Link>
          
          {item.children.length > 0 && (
            <ul className="header__submenu">
              <MenuItems items={item.children} />
            </ul>
          )}
        </li>
      ))}
    </>
  );
}

export default async function Header() {
  const siteSettings = await getSiteSettings();
  const siteName = siteSettings?.title || process.env.NEXT_PUBLIC_SITE_NAME || 'My Site';
  const logo = siteSettings?.logo;
  
  const primaryMenu = await getMenuByLocation('primary');
  const primaryMenuItems = primaryMenu?.items || [];
  
  // Fetch Second Menu for burger/side menu
  const secondMenu = await getMenuByLocation('second-menu');
  const secondMenuItems = secondMenu?.items || [];

  return (
    <header className="header">
      <div className="container">
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
              <MenuItems items={primaryMenuItems} />
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
            
            {/* Burger Menu - uses ONLY second-menu location */}
            <MobileMenu 
              items={secondMenuItems}
              logo={logo || undefined}
              siteName={siteName}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
