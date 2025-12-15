/**
 * Hero Block Component
 * ACF Block: acf/hero
 */

import React from 'react';
import Image from 'next/image';
import { transformMediaUrl } from '@/lib/wordpress';
import './styles.scss';

interface HeroBlockProps {
  data: {
    title?: string;
    subtitle?: string;
    background_image?: {
      url: string;
      alt: string;
      width?: number;
      height?: number;
    };
    cta_text?: string;
    cta_link?: string;
  };
}

export function HeroBlock({ data }: HeroBlockProps) {
  const { title, subtitle, background_image, cta_text, cta_link } = data;

  return (
    <section className="hero-block">
      {background_image?.url && typeof background_image.url === 'string' && background_image.url.trim() !== '' && (
        (() => {
          const transformedUrl = transformMediaUrl(background_image.url);
          
          if (!transformedUrl || transformedUrl.trim() === '') {
            console.warn('HeroBlock: Failed to transform background image URL', background_image.url);
            return null;
          }
          
          return (
            <Image
              src={transformedUrl}
              alt={background_image.alt || 'Hero background'}
              fill
              className="hero-block__background"
              priority
              sizes="100vw"
              quality={85}
            />
          );
        })()
      )}
      <div className="hero-block__content">
        {title && <h1 className="hero-block__title">{title}</h1>}
        {subtitle && <p className="hero-block__subtitle">{subtitle}</p>}
        {cta_text && cta_link && (
          <a
            href={cta_link}
            className="hero-block__cta"
          >
            {cta_text}
          </a>
        )}
      </div>
      <div className="hero-block__overlay" />
    </section>
  );
}

