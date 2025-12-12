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
  } else if (typeof rawItems === 'number' && rawItems > 0) {
    // Handle flattened ACF repeater data from WordPress REST API
    items = [];
    for (let i = 0; i < rawItems; i++) {
      const text = (data as any)[`items_${i}_text`];
      const iconData = (data as any)[`items_${i}_icon`];
      const link = (data as any)[`items_${i}_link`];
      
      if (text) {
        let iconUrl = '/placeholder-icon.png';
        let iconAlt = text;
        
        // Handle expanded image data from WordPress API
        if (iconData && typeof iconData === 'object' && iconData.url) {
          iconUrl = iconData.url;
          iconAlt = iconData.alt || iconData.title || text;
        } else if (typeof iconData === 'number') {
          // Fallback for numeric ID (shouldn't happen with updated API)
          iconUrl = `/wp-content/uploads/icon-${iconData}.png`;
        }
        
        const item: IconTextGridItem = {
          text,
          link: link || '#',
          icon: {
            url: iconUrl,
            alt: iconAlt
          }
        };
        items.push(item);
      }
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
                  <img
                    decoding="async"
                    src={item.icon.url}
                    alt={item.icon.alt || item.text}
                    className="icon-text-grid__icon"
                    style={{}}
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
