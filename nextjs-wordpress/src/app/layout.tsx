import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { AuthProvider } from '@/contexts/AuthContext';
import DiceTestimonialWrapper from '@/components/DiceTestimonialWrapper';
import ClientBlockInitializer from '@/components/ClientBlockInitializer';
import WordPressErrorHandler from '@/components/WordPressErrorHandler';
import ScrollToTop from '@/components/ScrollToTop';
import './globals.scss';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME || 'MoreYeahs',
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || 'MoreYeahs'}`,
  },
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A modern headless CMS powered by WordPress and Next.js',
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: 'https://dev.moreyeahs.com/wp-content/uploads/2026/02/cropped-Moreyeahs-Logo-7.png',
    apple: 'https://dev.moreyeahs.com/wp-content/uploads/2026/02/cropped-Moreyeahs-Logo-7.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd type="organization" />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <WordPressErrorHandler />
          <div className="site-wrapper">
            <Header />
            <main className="main-content">
              {children}
            </main>
            <DiceTestimonialWrapper />
            <Footer />
            <ScrollToTop />
          </div>
          <ClientBlockInitializer />
        </AuthProvider>
      </body>
    </html>
  );
}
