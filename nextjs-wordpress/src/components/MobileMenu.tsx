'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MenuItem } from '@/types/menu';
import { wpUrlToPath } from '@/lib/url-utils';

interface MobileMenuProps {
  items: MenuItem[];
  logo?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  siteName?: string;
}

function MobileMenuItems({ items, onLinkClick }: { items: MenuItem[]; onLinkClick: () => void }) {
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
      {items.map((item) => (
        <li key={item.id} className="mobile-menu__item">
          {item.children.length > 0 ? (
            <>
              <div className="mobile-menu__item-wrapper">
                <Link 
                  href={wpUrlToPath(item.url)} 
                  target={item.target}
                  className={`mobile-menu__link ${item.classes}`}
                  onClick={onLinkClick}
                >
                  {item.title}
                </Link>
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
                <MobileMenuItems items={item.children} onLinkClick={onLinkClick} />
              </ul>
            </>
          ) : (
            <div className="mobile-menu__item-wrapper">
              <Link 
                href={wpUrlToPath(item.url)} 
                target={item.target}
                className={`mobile-menu__link ${item.classes}`}
                onClick={onLinkClick}
              >
                {item.title}
              </Link>
            </div>
          )}
        </li>
      ))}
    </>
  );
}

export default function MobileMenu({ items, logo, siteName }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

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

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        className="mobile-menu__hamburger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
      </button>

      <div className={`mobile-menu__overlay ${isOpen ? 'open' : ''}`}>
        <nav className={`mobile-menu__nav ${isOpen ? 'open' : ''}`}>
          {/* Header with Logo and Close Button */}
          <div className="mobile-menu__header">
            <Link href="/" className="mobile-menu__logo" onClick={closeMenu}>
              {logo ? (
                <Image
                  src={logo.url}
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
              <MobileMenuItems items={items} onLinkClick={closeMenu} />
            </ul>
          </div>

          {/* Footer with Social Icons */}
          <div className="mobile-menu__footer">
            <div className="mobile-menu__social">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mobile-menu__social-link"
                aria-label="LinkedIn"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4.5 3C3.67 3 3 3.67 3 4.5S3.67 6 4.5 6 6 5.33 6 4.5 5.33 3 4.5 3zM3 7v10h3V7H3zm5.5 0A5.5 5.5 0 0 0 3 12.5V17h3v-4.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5V17h3v-4.5A5.5 5.5 0 0 0 8.5 7z"/>
                </svg>
              </a>
              
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mobile-menu__social-link"
                aria-label="Twitter"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.29 18.25c7.55 0 11.67-6.25 11.67-11.67v-.53c.8-.59 1.49-1.3 2.04-2.13-.75.33-1.54.55-2.36.65a4.12 4.12 0 0 0 1.8-2.27c-.8.48-1.68.81-2.6 1a4.1 4.1 0 0 0-7 3.74 11.65 11.65 0 0 1-8.45-4.3 4.1 4.1 0 0 0 1.27 5.49C2.01 8.2 1.37 8.03.8 7.7v.05a4.1 4.1 0 0 0 3.3 4.03 4.1 4.1 0 0 1-1.86.07 4.1 4.1 0 0 0 3.83 2.85A8.23 8.23 0 0 1 0 16.4a11.62 11.62 0 0 0 6.29 1.84"/>
                </svg>
              </a>
              
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mobile-menu__social-link"
                aria-label="Facebook"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 0C4.48 0 0 4.48 0 10c0 4.99 3.66 9.12 8.44 9.88v-6.99H5.9V10h2.54V7.8c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.19 2.24.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56V10h2.78l-.45 2.89h-2.33v6.99C16.34 19.12 20 14.99 20 10c0-5.52-4.48-10-10-10z"/>
                </svg>
              </a>
              
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mobile-menu__social-link"
                aria-label="YouTube"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M19.6 5.2s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C14 2 10 2 10 2s-4 0-6.8.3c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S0 6.9 0 8.6v1.6c0 1.7.4 3.4.4 3.4s.2 1.4.8 2c.8.8 1.8.8 2.2.9 1.6.1 6.6.2 6.6.2s4 0 6.8-.3c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.4-1.7.4-3.4V8.6c0-1.7-.4-3.4-.4-3.4zM8 12.5V6.5l5.2 3-5.2 3z"/>
                </svg>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
