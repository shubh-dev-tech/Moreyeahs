/**
 * Core Image Block
 */

import React from 'react';
import Image from 'next/image';

interface CoreImageProps {
  innerHTML: string;
  data?: {
    url?: string;
    alt?: string;
    caption?: string;
  };
}

export function CoreImage({ innerHTML, data }: CoreImageProps) {
  // If we have structured data, use Next.js Image
  if (data?.url) {
    return (
      <figure className="my-8">
        <div className="relative w-full h-96">
          <Image
            src={data.url}
            alt={data.alt || ''}
            fill
            className="object-contain"
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
      dangerouslySetInnerHTML={{ __html: innerHTML }}
    />
  );
}
