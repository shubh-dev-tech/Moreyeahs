/**
 * Moreyeahs Heading Test Block Component
 * ACF Block: acf/moreyeahs-heading-test
 */

import React from 'react';
import './styles.scss';

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

  const blockClass = `moreyeahs-heading-test-block moreyeahs-heading-test-block--${alignment}`;

  const sectionStyles = {
    '--text-color': text_color,
    '--bg-color': background_color
  } as React.CSSProperties;

  return (
    <section
      className={blockClass}
      style={sectionStyles}
    >
      <div className="moreyeahs-heading-test-block__container">
        {heading && (
          <h2 className="moreyeahs-heading-test-block__heading">
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="moreyeahs-heading-test-block__subheading">
            {subheading}
          </p>
        )}
      </div>
    </section>
  );
}
