'use client';

import React from 'react';
import './styles.scss';

interface Region {
  name: string;
  link: string;
}

interface NavigationNextBlockProps {
  heading?: string;
  button_text?: string;
  button_link?: string;
  regions?: Region[];
}

const NavigationNextBlock: React.FC<NavigationNextBlockProps> = ({
  heading,
  button_text,
  button_link,
  regions = [],
}) => {
  if (!regions || regions.length === 0) {
    return null;
  }

  return (
    <section className="navigation-next-block">
      <div className="navigation-next-block__container">
        <div className="navigation-next-block__grid">
          {regions.map((region, index) => (
            <a
              key={index}
              href={region.link || '#'}
              className="navigation-next-block__region"
            >
              <span className="navigation-next-block__region-name">
                {region.name}
              </span>
            </a>
          ))}
        </div>

        {(heading || button_text) && (
          <div className="navigation-next-block__cta">
            {heading && (
              <h2 className="navigation-next-block__heading">{heading}</h2>
            )}
            {button_text && button_link && (
              <a href={button_link} className="navigation-next-block__button">
                {button_text}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NavigationNextBlock;
