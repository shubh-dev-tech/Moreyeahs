import React from 'react';

export default function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'My Site';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <p className="footer__copyright">
          © {currentYear} {siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
