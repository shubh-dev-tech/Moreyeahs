import React from 'react';
import './styles.scss';

interface PromoBlockProps {
  data: {
    background_image?: {
      url: string;
      alt: string;
    };
    heading?: string;
    sub_heading?: string;
    button_text?: string;
    button_link?: string;
    reverse_layout?: boolean;
    background_size?: 'contain' | 'cover' | 'auto';
    background_color?: string;
    min_height?: number;
    content_padding?: number;
  };
}

export default function PromoBlock({ data }: PromoBlockProps) {
  const {
    background_image,
    heading,
    sub_heading,
    button_text,
    button_link,
    reverse_layout,
    background_size = 'contain',
    background_color = '#131A4E',
    min_height = 400,
    content_padding = 60
  } = data || {};

  if (!heading && !sub_heading) {
    return null;
  }

  const blockId = `promo-block-${Math.random().toString(36).substr(2, 9)}`;
  const blockClasses = `promo-block container${reverse_layout ? ' promo-block--reversed' : ''}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          #${blockId} {
            min-height: ${min_height}px;
          }
          #${blockId}::before {
            background-color: ${background_color};
            background-size: ${background_size};
            ${background_image?.url ? `background-image: url(${background_image.url});` : ''}
          }
          #${blockId} .promo-block__container {
            padding: ${content_padding}px 40px;
          }
          @media (max-width: 768px) {
            #${blockId} .promo-block__container {
              padding: ${Math.max(content_padding * 0.7, 20)}px 20px;
            }
          }
          @media (max-width: 480px) {
            #${blockId} .promo-block__container {
              padding: ${Math.max(content_padding * 0.5, 15)}px 15px;
            }
          }
        `
      }} />
      <section id={blockId} className={blockClasses}>
        <div className="promo-block__overlay">
          <div className="promo-block__container">
            <div className="promo-block__content">
              {heading && (
                <h2 className="promo-block__heading">{heading}</h2>
              )}
              
              {sub_heading && (
                <p className="promo-block__sub-heading">{sub_heading}</p>
              )}
              
              {button_text && button_link && (
                <a 
                  href={button_link} 
                  className="promo-block__button"
                  aria-label={button_text}
                >
                  {button_text}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
