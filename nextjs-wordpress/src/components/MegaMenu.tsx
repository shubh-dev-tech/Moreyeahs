'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { transformMediaUrl } from '@/lib/wpFetch';

export interface MegaMenuItem {
  title: string;
  url: string;
  items?: MegaMenuItem[]; // Support nested items
}

export interface MegaMenuCategory {
  icon?: string;
  title: string;
  items: MegaMenuItem[];
}

export interface MegaMenuFeaturedContent {
  enable: boolean;
  image?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  title?: string;
  description?: string;
}

export interface MegaMenuData {
  id: number;
  slug: string;
  title: string;
  menu_type: string;
  main_heading: string;
  categories: MegaMenuCategory[];
  featured_content?: MegaMenuFeaturedContent;
}

interface MegaMenuProps {
  trigger: string;
  menuData: MegaMenuData;
}

export default function MegaMenu({ trigger, menuData }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
    if (menuData.categories.length > 0) {
      setActiveCategory(0);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setActiveCategory(null);
    }, 200);
  };

  const handleCategoryHover = (index: number) => {
    setActiveCategory(index);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="mega-menu-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="mega-menu-trigger">{trigger}</span>
      
      {isOpen && (
        <div className="mega-menu-dropdown" ref={menuRef}>
          <div className="mega-menu-container">
            <div className="mega-menu-sidebar">
              <h3 className="mega-menu-heading">{menuData.main_heading}</h3>
              <ul className="mega-menu-categories">
                {menuData.categories.map((category, index) => (
                  <li
                    key={index}
                    className={`mega-menu-category ${activeCategory === index ? 'active' : ''}`}
                    onMouseEnter={() => handleCategoryHover(index)}
                  >
                    {category.icon && <span className="category-icon">{category.icon}</span>}
                    <span className="category-title">{category.title}</span>
                    <span className="category-arrow">▸</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mega-menu-content">
              {activeCategory !== null && menuData.categories[activeCategory] && (
                <div className="mega-menu-items-grid">
                  {menuData.categories[activeCategory].items.map((item, index) => (
                    <div key={index} className="mega-menu-item-wrapper">
                      <Link
                        href={item.url}
                        className="mega-menu-item"
                      >
                        {item.title}
                      </Link>
                      {item.items && item.items.length > 0 && (
                        <ul className="mega-menu-subitems">
                          {item.items.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link href={subItem.url} className="mega-menu-subitem">
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {menuData.featured_content?.enable && menuData.featured_content.image && (
                <div className="mega-menu-featured">
                  <Image
                    src={transformMediaUrl(menuData.featured_content.image.url)}
                    alt={menuData.featured_content.image.alt || 'Featured'}
                    width={menuData.featured_content.image.width}
                    height={menuData.featured_content.image.height}
                    className="featured-image"
                  />
                  {menuData.featured_content.title && (
                    <h4 className="featured-title">{menuData.featured_content.title}</h4>
                  )}
                  {menuData.featured_content.description && (
                    <p className="featured-description">{menuData.featured_content.description}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
