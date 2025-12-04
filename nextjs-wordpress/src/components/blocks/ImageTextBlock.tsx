/**
 * Image Text Block Component
 * ACF Block: acf/image-text
 */

import React from 'react';
import Image from 'next/image';

interface ImageTextBlockProps {
  data: {
    image?: {
      url: string;
      alt: string;
      width: number;
      height: number;
    };
    heading?: string;
    text?: string;
    image_position?: 'left' | 'right';
  };
}

export function ImageTextBlock({ data }: ImageTextBlockProps) {
  const { image, heading, text, image_position = 'left' } = data;

  const imageFirst = image_position === 'left';

  return (
    <section className="image-text-block py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className={`grid md:grid-cols-2 gap-8 items-center ${imageFirst ? '' : 'md:grid-flow-dense'}`}>
          <div className={imageFirst ? '' : 'md:col-start-2'}>
            {image && (
              <div className="relative aspect-video">
                <Image
                  src={image.url}
                  alt={image.alt || ''}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          <div className={imageFirst ? '' : 'md:col-start-1 md:row-start-1'}>
            {heading && <h2 className="text-3xl font-bold mb-4">{heading}</h2>}
            {text && (
              <div 
                className="prose"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
