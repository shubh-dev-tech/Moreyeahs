/**
 * CTA (Call to Action) Block Component
 * ACF Block: acf/cta
 */

import React from 'react';

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

  return (
    <section 
      className="cta-block py-20 px-4"
      style={{ backgroundColor: background_color || '#1e40af' }}
    >
      <div className="max-w-4xl mx-auto text-center text-white">
        {heading && <h2 className="text-4xl font-bold mb-4">{heading}</h2>}
        {description && <p className="text-xl mb-8">{description}</p>}
        {button_text && button_link && (
          <a
            href={button_link}
            className="inline-block bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition"
          >
            {button_text}
          </a>
        )}
      </div>
    </section>
  );
}
