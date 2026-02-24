'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
  quality?: number;
  [key: string]: any;
}

const FALLBACK_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect fill='%23f0f0f0' width='800' height='400'/%3E%3Ctext fill='%23999' font-family='Arial' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EImage Unavailable%3C/text%3E%3C/svg%3E`;

export default function SafeImage({ src, alt, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // If src is invalid or empty, use fallback immediately
  if (!src || src.trim() === '' || hasError) {
    return (
      <Image
        {...props}
        src={FALLBACK_SVG}
        alt={alt || 'Image unavailable'}
        onError={() => {
          // Already using fallback, do nothing
        }}
      />
    );
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        console.warn(`Failed to load image: ${src}`);
        setHasError(true);
        setImgSrc(FALLBACK_SVG);
      }}
    />
  );
}
