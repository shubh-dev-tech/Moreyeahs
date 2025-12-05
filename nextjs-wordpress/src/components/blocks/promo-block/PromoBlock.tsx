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
  };
}

export default function PromoBlock({ data }: PromoBlockProps) {
  const {
    background_image,
    heading,
    sub_heading,
    button_text,
    button_link
  } = data || {};

  if (!heading && !sub_heading) {
    return null;
  }

  const blockId = `promo-block-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <>
      {background_image?.url && (
        <style dangerouslySetInnerHTML={{
          __html: `
            #${blockId}::before {
              background-image: url(${background_image.url});
            }
          `
        }} />
      )}
      <section id={blockId} className="promo-block container">
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
