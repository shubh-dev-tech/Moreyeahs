/**
 * Moreyeahs Heading Test Block Component
 * ACF Block: acf/moreyeahs-heading-test
 */

import React from 'react';

interface MoreyeahsHeadingTestBlockProps {
  data: {
    heading?: string;
    subheading?: string;
    text_color?: string;
    background_color?: string;
    alignment?: 'left' | 'center' | 'right';
  };
}

export function MoreyeahsHeadingTestBlock({ data }: MoreyeahsHeadingTestBlockProps) {
  const {
    heading,
    subheading,
    text_color = '#000000',
    background_color = 'transparent',
    alignment = 'center',
  } = data;

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <section
      className="moreyeahs-heading-test-block py-12 px-4"
      style={{ backgroundColor: background_color }}
    >
      <div className={`max-w-4xl mx-auto ${alignmentClasses[alignment]}`}>
        {heading && (
          <h2
            className="text-4xl font-bold mb-4"
            style={{ color: text_color }}
          >
            {heading}
          </h2>
        )}
        {subheading && (
          <p
            className="text-xl"
            style={{ color: text_color }}
          >
            {subheading}
          </p>
        )}
      </div>
    </section>
  );
}
