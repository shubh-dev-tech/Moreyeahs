import React from 'react';
import Link from 'next/link';
import { siteData } from '@/data/staticData';
import './Footer.scss';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            {siteData.footer.columns.map((column, index) => (
              <div key={index} className="footer__column">
                <div className="footer__heading">{column.title}</div>
                <ul className="footer__links">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link href={link.url}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <div className="footer__copyright-wrapper">
            <div className="footer__copyright-left">
              <p>{siteData.footer.copyrightLeft}</p>
            </div>
            <div className="footer__copyright-right">
              <p>{siteData.footer.copyrightRight}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}