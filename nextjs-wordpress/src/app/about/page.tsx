import React from 'react';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('about');
}

export default function AboutPage() {
  return (
    <div className="container container--narrow">
      <article className="page-content">
        <h1>About Us</h1>
        <p>
          Welcome to our site! This is a Next.js application powered by WordPress as a headless CMS.
        </p>
        <p>
          We use WPGraphQL to fetch content from WordPress and display it with modern web technologies
          including React, TypeScript, and Next.js 14 with the App Router.
        </p>
        <h2>Features</h2>
        <ul>
          <li>Static Site Generation (SSG) with Incremental Static Regeneration (ISR)</li>
          <li>Full SEO optimization with meta tags, Open Graph, and Twitter Cards</li>
          <li>JSON-LD structured data for better search engine understanding</li>
          <li>Optimized images with Next.js Image component</li>
          <li>Automatic sitemap and robots.txt generation</li>
          <li>Performance and accessibility best practices</li>
        </ul>
      </article>
    </div>
  );
}
