/**
 * Core Image Block
 */

import React from 'react';
import Image from 'next/image';
import { transformMediaUrl } from '@/lib/wpFetch';

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
  if (data?.url) {
    const width = data.width || 600;
    const height = data.height || 400;
    const aspectRatio = width / height;
    
    return (
      <figure className="my-8">
        <div className="relative w-full" style={{ aspectRatio: `${aspectRatio}` }}>
          <Image
            src={transformMediaUrl(data.url)}
            alt={data.alt || ''}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            loading="lazy"
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

