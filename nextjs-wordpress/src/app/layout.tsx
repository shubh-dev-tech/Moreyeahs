import React from 'react';
import type { Metadata } from 'next';
import HeaderClient from '@/components/HeaderClient';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.scss';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME || 'MoreYeahs',
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || 'MoreYeahs'}`,
  },
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A modern headless CMS powered by WordPress and Next.js',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

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
        <AuthProvider>
          <div className="site-wrapper">
            <HeaderClient />
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
