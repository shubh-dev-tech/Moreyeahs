/**
 * Image Section Component for Full Width Left Text Section
 * Handles different image data formats including attachment IDs
 */

import React from 'react';
import Image from 'next/image';
import { transformMediaUrl } from '@/lib/wordpress';
import { getMediaById, normalizeImageData } from '@/lib/media';

interface ImageSectionProps {
  imageData: any;
  className?: string;
}

export async function ImageSection({ imageData, className = 'full-width-left-text-section__image' }: ImageSectionProps) {
  if (!imageData) {
    return null;
  }
  
  let normalizedImage = normalizeImageData(imageData);
  
  // Handle attachment ID case
  if (!normalizedImage && typeof imageData === 'number') {
    const mediaItem = await getMediaById(imageData);
    if (mediaItem) {
      normalizedImage = {
        url: mediaItem.url,
        alt: mediaItem.alt,
        width: mediaItem.width,
        height: mediaItem.height,
      };
    }
  }
  
  if (!normalizedImage || !normalizedImage.url) {
    console.warn('ImageSection: Could not resolve image data', { imageData });
    return null;
  }
  
  const transformedUrl = transformMediaUrl(normalizedImage.url);
  
  if (!transformedUrl || transformedUrl.trim() === '') {
    console.warn('ImageSection: No valid image URL after transformation', {
      original: normalizedImage.url,
      transformed: transformedUrl
    });
    return null;
  }
  
  return (
    <div className={className}>
      <Image
        src={transformedUrl}
        alt={normalizedImage.alt || 'Decorative image'}
        width={normalizedImage.width}
        height={normalizedImage.height}
        className="full-width-left-text-section__image-element"
        priority={false}
        quality={85}
      />
    </div>
  );
}