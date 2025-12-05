/**
 * CTA (Call to Action) Block Component
 * ACF Block: acf/cta
 */

import React from 'react';
import './styles.scss';

interface CTABlockProps {
  data: {
    heading?: string;
    description?: string;
    button_text?: string;
    button_link?: string;
    background_color?: string;
  };
}

export function CTABlock({ data }: CTABlockProps) {
  const { heading, description, button_text, button_link, background_color } = data;

  const sectionStyles = background_color ? {
    '--bg-color': background_color
  } as React.CSSProperties : undefined;

  return (
    <section 
      className="cta-block"
      style={sectionStyles}
    >
      <div className="cta-block__container">
        {heading && <h2 className="cta-block__heading">{heading}</h2>}
        {description && <p className="cta-block__description">{description}</p>}
        {button_text && button_link && (
          <a
            href={button_link}
            className="cta-block__button"
          >
            {button_text}
          </a>
        )}
      </div>
    </section>
  );
}
