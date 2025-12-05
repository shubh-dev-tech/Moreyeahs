import React from 'react';
import './styles.scss';

interface IconTextGridItem {
  text: string;
  icon: {
    url: string;
    alt: string;
  };
  link: string;
}

interface IconTextGridProps {
  data: {
    items?: IconTextGridItem[];
  };
}

export default function IconTextGrid({ data }: IconTextGridProps) {
  const items = data?.items || [];
  
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="icon-text-grid">
      <div className="icon-text-grid__container">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.link}
            className="icon-text-grid__item"
            aria-label={item.text}
          >
            <div className="icon-text-grid__content">
              <h3 className="icon-text-grid__text">{item.text}</h3>
              
              {item.icon && (
                <div className="icon-text-grid__icon-wrapper">
                  <img
                    src={item.icon.url}
                    alt={item.icon.alt || item.text}
                    className="icon-text-grid__icon"
                  />
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
