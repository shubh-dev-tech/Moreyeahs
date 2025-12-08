import React from 'react';
import './styles.scss';

interface PurposeBlockProps {
  data: {
    heading?: string;
    sub_heading?: string;
    button_text?: string;
    button_link?: string;
    border_color?: string;
  };
}

export default function PurposeBlock({ data }: PurposeBlockProps) {
  const {
    heading,
    sub_heading,
    button_text,
    button_link,
    border_color = '#00A3E0'
  } = data || {};

  if (!heading && !sub_heading) {
    return null;
  }

  const blockId = `purpose-block-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <section 
      id={blockId} 
      className="purpose-block"
      style={{ '--border-color': border_color } as React.CSSProperties}
    >
      <div className="purpose-block__container">
        <div className="purpose-block__content">
          {heading && (
            <h2 className="purpose-block__heading">{heading}</h2>
          )}
          
          {sub_heading && (
            <p className="purpose-block__sub-heading">{sub_heading}</p>
          )}
          
          {button_text && button_link && (
            <a 
              href={button_link} 
              className="purpose-block__button"
              aria-label={button_text}
            >
              {button_text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
