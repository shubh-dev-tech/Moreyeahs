import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DiceTestimonial from '@/components/blocks/dice-testimonial/DiceTestimonial';
import JsonLd from '@/components/JsonLd';
import ClientBlockInitializer from '@/components/ClientBlockInitializer';
import WordPressErrorHandler from '@/components/WordPressErrorHandler';
import PageLoaderWrapper from '@/components/PageLoaderWrapper';
import RouteLoader from '@/components/RouteLoader';
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
  // Sample testimonial data for the dice testimonial block
  const testimonialData = {
    heading: "Client",
    heading_color: "rgb(0 0 0)",
    heading_span_text: "Testimonials",
    heading_span_color: "rgb(72 72 72)",
    // sub_heading: "Don't just take our word for it - hear from our satisfied clients",
    testimonial_items: [
      {
        quote: "Working with this team has been an absolute game-changer for our business. Their expertise and dedication exceeded all our expectations.",
        client_name: "Sarah Johnson",
        client_position: "CEO",
        client_company: "TechStart Inc.",
        rating: 5
      },
      {
        quote: "The level of professionalism and quality of work delivered was outstanding. I would highly recommend their services to anyone.",
        client_name: "Michael Chen",
        client_position: "CTO",
        client_company: "Innovation Labs",
        rating: 5
      },
      {
        quote: "From start to finish, the project was handled with care and attention to detail. The results speak for themselves.",
        client_name: "Emily Rodriguez",
        client_position: "Marketing Director",
        client_company: "Growth Solutions",
        rating: 5
      }
    ],
    autoplay_slider: true,
    slider_speed: 5,
    show_navigation: true,
    show_dots: true,
    background_type: 'gradient' as const,
    gradient_color_1: '#0a0f1c',
    gradient_color_2: '#1a1f3c',
    gradient_direction: 'to bottom right',
    background_height: 'medium',
    text_color: 'rgb(40 40 40);',
    accent_color: '#00a2ffff'
  };

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
          <PageLoaderWrapper>
            <div className="site-wrapper">
              <Header />
              <main className="main-content">
                {children}
              </main>
              <DiceTestimonial data={testimonialData} />
              <Footer />
            </div>
          </PageLoaderWrapper>
          <RouteLoader />
          <ClientBlockInitializer />
        </AuthProvider>
      </body>
    </html>
  );
}
