/**
 * Core Image Block
 */

import React from 'react';
import Image from 'next/image';
import { transformMediaUrl } from '@/lib/wordpress';

interface CoreImageProps {
  innerHTML: string;
  data?: {
    url?: string;
    alt?: string;
    caption?: string;
    width?: number;
    height?: number;
  };
}

export function CoreImage({ innerHTML, data }: CoreImageProps) {
  // If we have structured data with URL, use Next.js Image
  if (data?.url && typeof data.url === 'string' && data.url.trim() !== '') {
    const width = data.width || 600;
    const height = data.height || 400;
    const aspectRatio = width / height;
    
    // Ensure URL is properly formatted (handle both relative and absolute URLs)
    let imageUrl = data.url.trim();
    if (!imageUrl.startsWith('http')) {
      // If it's a relative URL, ensure it starts with /
      if (!imageUrl.startsWith('/')) {
        imageUrl = '/' + imageUrl;
      }
    }
    
    // Transform the URL to ensure correct environment path
    imageUrl = transformMediaUrl(imageUrl);
    
    // Verify transformation didn't fail
    if (!imageUrl || imageUrl.trim() === '') {
      console.warn('CoreImage: URL transformation resulted in empty URL', {
        original: data.url,
        transformed: imageUrl
      });
      // Fallback to innerHTML
      return (
        <div 
          className="my-8"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: innerHTML }}
        />
      );
    }
    
    return (
      <figure className="my-8">
        <div className="relative w-full" style={{ aspectRatio: `${aspectRatio}` }}>
          <Image
            src={imageUrl}
            alt={data.alt || ''}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            loading="lazy"
            priority={false}
          />
        </div>
        {data.caption && (
          <figcaption className="text-center text-sm text-gray-600 mt-2">
            {data.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  // Fallback to raw HTML
  return (
    <div 
      className="my-8"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: innerHTML }}
    />
  );
}

