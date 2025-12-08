/**
 * Image Text Block Component
 * ACF Block: acf/image-text
 */

import React from 'react';
import Image from 'next/image';
import './styles.scss';

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

  const blockClass = `image-text-block${image_position === 'right' ? ' image-text-block--reversed' : ''}`;

  return (
    <section className={blockClass}>
      <div className="image-text-block__container">
        <div className="image-text-block__grid">
          <div className="image-text-block__image-wrapper">
            {image && (
              <div className="image-text-block__image">
                <Image
                  src={image.url}
                  alt={image.alt || ''}
                  fill
                  className="image-text-block__img"
                />
              </div>
            )}
          </div>
          <div className="image-text-block__content">
            {heading && <h2 className="image-text-block__heading">{heading}</h2>}
            {text && (
              <div 
                className="image-text-block__text"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
