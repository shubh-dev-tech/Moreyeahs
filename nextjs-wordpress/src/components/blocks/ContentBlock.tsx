/**
 * Content Block Component
 * ACF Block: acf/content
 */

import React from 'react';

interface ContentBlockProps {
  data: {
    heading?: string;
    content?: string;
    background_color?: string;
  };
}

export function ContentBlock({ data }: ContentBlockProps) {
  const { heading, content, background_color } = data;

  return (
    <section 
      className="content-block py-16 px-4"
      style={{ backgroundColor: background_color || 'transparent' }}
    >
      <div className="max-w-4xl mx-auto">
        {heading && <h2 className="text-3xl font-bold mb-6">{heading}</h2>}
        {content && (
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </section>
  );
}
