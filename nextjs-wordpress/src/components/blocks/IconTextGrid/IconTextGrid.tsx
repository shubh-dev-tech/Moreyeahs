import React from 'react';
import Image from 'next/image';
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
  const rawItems = (data as any)?.items;

  let items: IconTextGridItem[] = [];

  if (Array.isArray(rawItems)) {
    items = rawItems;
  } else if (rawItems && typeof rawItems === 'object') {
    // Some REST responses may return an object keyed by index
    items = Object.values(rawItems) as IconTextGridItem[];
  } else if (typeof rawItems === 'string') {
    try {
      const parsed = JSON.parse(rawItems);
      if (Array.isArray(parsed)) items = parsed;
    } catch (e) {
      items = [];
    }
  }

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
                  <Image
                    src={item.icon.url}
                    alt={item.icon.alt || item.text}
                    className="icon-text-grid__icon"
                    width={64}
                    height={64}
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
