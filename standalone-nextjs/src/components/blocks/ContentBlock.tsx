import React from 'react';
import Image from 'next/image';
import './ContentBlock.scss';

interface ContentBlockProps {
  data: {
    heading?: string;
    description?: string;
    image?: {
      url: string;
      alt?: string;
      width?: number;
      height?: number;
    };
    buttonText?: string;
    buttonUrl?: string;
  };
}

export default function ContentBlock({ data }: ContentBlockProps) {
  const { heading, description, image, buttonText, buttonUrl } = data;

  if (!heading && !description && !image) {
    return null;
  }

  return (
    <section className="content-block">
      <div className="container">
        <div className="content-block__wrapper">
          <div className="content-block__text-content">
            {heading && (
              <h2 className="content-block__heading">{heading}</h2>
            )}
            
            {description && (
              <div 
                className="content-block__description"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
            
            {buttonText && buttonUrl && (
              <div className="content-block__cta">
                <a 
                  href={buttonUrl} 
                  className="content-block__button"
                >
                  {buttonText}
                </a>
              </div>
            )}
          </div>
          
          {image && image.url && (
            <div className="content-block__image-wrapper">
              <div className="content-block__image">
                <Image 
                  src={image.url} 
                  alt={image.alt || heading || 'Content image'}
                  width={image.width || 600}
                  height={image.height || 400}
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}