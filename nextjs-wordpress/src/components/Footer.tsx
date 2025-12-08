import React from 'react';
import Link from 'next/link';
import { getFooterWidgets, FooterWidget } from '@/lib/wordpress';

interface FooterColumnProps {
  widget?: FooterWidget;
}

function FooterColumn({ widget }: FooterColumnProps) {
  if (!widget) return null;

  // Check if widget has links (menu widget) or content (text/HTML widget)
  const hasLinks = widget.links && widget.links.length > 0;
  const hasContent = widget.content && widget.content.trim() !== '';

  return (
    <div className="footer__column">
      {widget.title && <div className="footer__heading">{widget.title}</div>}
      
      {/* Show content only if it exists and there are no links */}
      {hasContent && !hasLinks && (
        <div 
          className="footer__content" 
          dangerouslySetInnerHTML={{ __html: widget.content }}
        />
      )}
      
      {/* Show links for menu widgets */}
      {hasLinks && (
        <ul className="footer__links">
          {widget.links.map((link, index) => (
            <li key={index}>
              <Link href={link.url}>{link.label}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function Footer() {
  let footerData = null;
  
  try {
    footerData = await getFooterWidgets();
    console.log('Footer Data:', JSON.stringify(footerData, null, 2));
  } catch (error) {
    console.error('Error loading footer:', error);
  }
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            <FooterColumn widget={footerData?.column1} />
            <FooterColumn widget={footerData?.column2} />
            <FooterColumn widget={footerData?.column3} />
            <FooterColumn widget={footerData?.column4} />
            <FooterColumn widget={footerData?.column5} />
          </div>
        </div>
      </div>

      {/* Copyright Bar - 50/50 Split */}
      <div className="footer__bottom">
        <div className="container">
          <div className="footer__copyright-wrapper">
            <div className="footer__copyright-left">
              {footerData?.copyrightLeft ? (
                <div dangerouslySetInnerHTML={{ __html: footerData.copyrightLeft }} />
              ) : (
                <p>© {currentYear} All rights reserved.</p>
              )}
            </div>
            <div className="footer__copyright-right">
              {footerData?.copyrightRight ? (
                <div dangerouslySetInnerHTML={{ __html: footerData.copyrightRight }} />
              ) : (
                <p>Powered by Next.js & WordPress</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
