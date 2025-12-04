/**
 * Hero Block Component
 * ACF Block: acf/hero
 */

import React from 'react';
import Image from 'next/image';

interface HeroBlockProps {
  data: {
    title?: string;
    subtitle?: string;
    background_image?: {
      url: string;
      alt: string;
      width: number;
      height: number;
    };
    cta_text?: string;
    cta_link?: string;
  };
}

export function HeroBlock({ data }: HeroBlockProps) {
  const { title, subtitle, background_image, cta_text, cta_link } = data;

  return (
    <section className="hero-block relative h-[600px] flex items-center justify-center text-white">
      {background_image && (
        <Image
          src={background_image.url}
          alt={background_image.alt || 'Hero background'}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="relative z-10 text-center max-w-4xl px-4">
        {title && <h1 className="text-5xl font-bold mb-4">{title}</h1>}
        {subtitle && <p className="text-xl mb-8">{subtitle}</p>}
        {cta_text && cta_link && (
          <a
            href={cta_link}
            className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition"
          >
            {cta_text}
          </a>
        )}
      </div>
      <div className="absolute inset-0 bg-black/40 z-0" />
    </section>
  );
}
