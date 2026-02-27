import React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { AuthProvider } from '@/contexts/AuthContext';
import DiceTestimonialWrapper from '@/components/DiceTestimonialWrapper';
import ClientBlockInitializer from '@/components/ClientBlockInitializer';
import WordPressErrorHandler from '@/components/WordPressErrorHandler';
import ScrollToTop from '@/components/ScrollToTop';
import AIChatbot from '@/components/AIChatbot';

import './globals.scss';
import '@/styles/chatbot.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME || 'MoreYeahs',
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || 'MoreYeahs'}`,
  },
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'A modern headless CMS powered by WordPress and Next.js',
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: 'https://dev.moreyeahs.com/wp-content/uploads/2026/02/cropped-Moreyeahs-Logo-7.png',
    apple:
      'https://dev.moreyeahs.com/wp-content/uploads/2026/02/cropped-Moreyeahs-Logo-7.png',
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
      <body suppressHydrationWarning>
        {/* Font Awesome CDN */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />

        <AuthProvider>
          <WordPressErrorHandler />

          <JsonLd type="organization" />

          <div className="site-wrapper">
            <Header />

            <main className="main-content">{children}</main>

            <DiceTestimonialWrapper />
            <Footer />
            <ScrollToTop />
            <AIChatbot />
          </div>

          <ClientBlockInitializer />
        </AuthProvider>
      </body>
    </html>
  );
}