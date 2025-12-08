/**
 * Content Block Component
 * ACF Block: acf/content
 */

import React from 'react';
import './styles.scss';

interface ContentBlockProps {
  data: {
    heading?: string;
    content?: string;
    background_color?: string;
  };
}

export function ContentBlock({ data }: ContentBlockProps) {
  const { heading, content, background_color } = data;

  const sectionStyles = background_color ? {
    '--bg-color': background_color
  } as React.CSSProperties : undefined;

  return (
    <section 
      className="content-block"
      style={sectionStyles}
    >
      <div className="content-block__container">
        {heading && <h2 className="content-block__heading">{heading}</h2>}
        {content && (
          <div 
            className="content-block__content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </section>
  );
}
