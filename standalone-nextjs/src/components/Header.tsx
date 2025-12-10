import React from 'react';
import Link from 'next/link';
import { siteData } from '@/data/staticData';
import './Header.scss';

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__logo">
            <Link href="/">
              {siteData.logo ? (
                <img src={siteData.logo} alt={siteData.siteName} />
              ) : (
                <span className="header__logo-text">{siteData.siteName}</span>
              )}
            </Link>
          </div>
          
          <nav className="header__nav">
            <ul className="header__menu">
              {siteData.primaryMenu.map((item, index) => (
                <li key={index} className="header__menu-item">
                  <Link href={item.url} className="header__menu-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}