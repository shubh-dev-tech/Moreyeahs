import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { getSiteSettings } from '@/lib/wordpress';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const siteName = siteSettings?.title || process.env.NEXT_PUBLIC_SITE_NAME || 'My Site';
  const siteDescription = siteSettings?.description || process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '';
  const favicon = siteSettings?.favicon;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000/moreyeahs-new'),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    robots: {
      index: true,
      follow: true,
    },
    icons: favicon ? {
      icon: [
        { url: favicon.sizes['32'], sizes: '32x32', type: 'image/png' },
        { url: favicon.sizes['192'], sizes: '192x192', type: 'image/png' },
      ],
      apple: [
        { url: favicon.sizes['180'], sizes: '180x180', type: 'image/png' },
      ],
    } : {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <JsonLd type="organization" />
      </head>
      <body>
        <div className="site-wrapper">
          <Header />
          <main className="main-content">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
