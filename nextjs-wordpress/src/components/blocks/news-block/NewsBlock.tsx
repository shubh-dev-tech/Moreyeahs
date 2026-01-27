import React from 'react';
import './styles.scss';

interface SubHeading {
  text?: string;
  link?: string;
}

interface AdditionalItem {
  title?: string;
  link?: string;
  date?: string;
  image?: {
    url: string;
    alt: string;
  };
}

interface NewsBlockProps {
  data: {
    section_title?: string;
    sub_headings?: SubHeading[];
    featured_paragraph?: string;
    featured_link?: string;
    background_image?: {
      url: string;
      alt: string;
    };
    additional_items?: AdditionalItem[];
  };
}

export default function NewsBlock({ data }: NewsBlockProps) {
  const {
    section_title,
    sub_headings,
    featured_paragraph,
    featured_link,
    background_image,
    additional_items
  } = data || {};

  // Helper to coerce possible non-array REST values into arrays
  const coerceToArray = <T,>(value: any): T[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value as T[];
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed as T[];
      } catch (e) {
        return [];
      }
    }
    if (typeof value === 'object') {
      return Object.values(value) as T[];
    }
    return [];
  };

  const subHeadingsArr = coerceToArray<SubHeading>(sub_headings);
  const additionalItemsArr = coerceToArray<AdditionalItem>(additional_items);

  if (!section_title) {
    return null;
  }

  const blockId = `news-block-${Math.random().toString(36).substring(2, 9)}`;
  const bgImage = background_image?.url;

  return (
    <section id={blockId} className="news-block">
      <div className="news-block__container">
        <div className="news-block__grid">
          {/* First Column - 40% with title, sub-headings, and featured paragraph */}
          <article 
            className="news-block__item news-block__item--featured"
            style={{
              '--bg-image': bgImage ? `url(${bgImage})` : 'none',
              '--bg-color': bgImage ? 'transparent' : '#b8860b'
            } as React.CSSProperties}
          >
            <div className="news-block__overlay"></div>
            <div className="news-block__content">
              <div className="news-block__header">
                <h2 className="news-block__title">{section_title}</h2>
                
                {/* Sub-headings list */}
                {subHeadingsArr && subHeadingsArr.length > 0 && (
                  <ul className="news-block__news-list">
                    {subHeadingsArr.map((item, index) => (
                      <li key={index} className="news-block__news-item">
                        {item.link ? (
                          <a href={item.link}>
                            {item.text}
                            <span className="news-block__arrow">→</span>
                          </a>
                        ) : (
                          <span>{item.text}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Featured paragraph box at bottom */}
              {featured_paragraph && (
                <div className="news-block__featured-box">
                  {featured_link ? (
                    <a href={featured_link} className="news-block__link">
                      <p className="news-block__featured-text">{featured_paragraph}</p>
                    </a>
                  ) : (
                    <p className="news-block__featured-text">{featured_paragraph}</p>
                  )}
                </div>
              )}
            </div>
          </article>

          {/* Additional items - 30% each */}
          {additionalItemsArr && additionalItemsArr.map((item, index) => (
            <article 
              key={index}
              className="news-block__item news-block__item--additional"
              style={{
                '--bg-image': item.image?.url ? `url(${item.image.url})` : 'none',
                '--bg-color': item.image?.url ? 'transparent' : (index % 2 === 0 ? '#9932cc' : '#2c3e50')
              } as React.CSSProperties}
            >
              <div className="news-block__overlay"></div>
              <div className="news-block__content">
                <div>
                  {item.title && (
                    <h3 className="news-block__item-title">
                      {item.link ? (
                        <a href={item.link} className="news-block__link">
                          {item.title}
                          <span className="news-block__arrow">→</span>
                        </a>
                      ) : (
                        item.title
                      )}
                    </h3>
                  )}
                  
                  {item.date && (
                    <time className="news-block__date">{item.date}</time>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
