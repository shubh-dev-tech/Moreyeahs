import React from 'react';
import Image from 'next/image';
import { transformMediaUrl } from '@/lib/wordpress';
import './styles.scss';

interface InvestorItem {
  label?: string;
  title?: string;
  link?: string;
}

interface InvestorBlockProps {
  data: {
    decorative_line?: string;
    main_title?: string;
    subtitle?: string;
    featured_image?: {
      url: string;
      alt: string;
    };
    featured_title?: string;
    featured_link?: string;
    sidebar_title?: string;
    results_items?: InvestorItem[];
    archived_items?: InvestorItem[];
    event_items?: InvestorItem[];
    view_all_text?: string;
    view_all_link?: string;
  };
}

export default function InvestorBlock({ data }: InvestorBlockProps) {
  const {
    decorative_line,
    main_title,
    subtitle,
    featured_image,
    featured_title,
    featured_link,
    sidebar_title,
    results_items,
    archived_items,
    event_items,
    view_all_text,
    view_all_link
  } = data || {};

  if (!main_title) {
    return null;
  }

  const blockId = `investor-block-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <section id={blockId} className="investor-block">
      <div className="investor-block__container">
        {/* Header Section */}
        <div className="investor-block__header">
          {decorative_line && (
            <div className="investor-block__decorative-line">{decorative_line}</div>
          )}
          <h1 className="investor-block__main-title">{main_title}</h1>
          {subtitle && (
            <p className="investor-block__subtitle">{subtitle}</p>
          )}
        </div>

        {/* Content Grid */}
        <div className="investor-block__grid">
          {/* Left Column - Featured Image */}
          <div className="investor-block__featured">
            {featured_image?.url && (
              <div className="investor-block__featured-image">
                <Image 
                  src={transformMediaUrl(featured_image.url)} 
                  alt={featured_image.alt || featured_title || 'Featured image'}
                  fill
                  className="investor-block__featured-img"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                />
                <div className="investor-block__featured-overlay"></div>
                {featured_title && (
                  <div className="investor-block__featured-content">
                    {featured_link ? (
                      <a href={featured_link} className="investor-block__featured-title">
                        {featured_title}
                      </a>
                    ) : (
                      <h2 className="investor-block__featured-title">{featured_title}</h2>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Investor Central */}
          <div className="investor-block__sidebar">
            {sidebar_title && (
              <h2 className="investor-block__sidebar-title">{sidebar_title}</h2>
            )}

            <div className="investor-block__sections">
              {/* Results Section */}
              {results_items && results_items.length > 0 && (
                <div className="investor-block__section">
                  <div className="investor-block__section-label">
                    {results_items[0].label || 'RESULTS'}
                  </div>
                  {results_items.map((item, index) => (
                    <div key={index} className="investor-block__item">
                      {item.link ? (
                        <a href={item.link} className="investor-block__item-link">
                          {item.title}
                        </a>
                      ) : (
                        <span className="investor-block__item-text">{item.title}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Archived Webcast Section */}
              {archived_items && archived_items.length > 0 && (
                <div className="investor-block__section">
                  <div className="investor-block__section-label">
                    {archived_items[0].label || 'ARCHIVED WEBCAST'}
                  </div>
                  {archived_items.map((item, index) => (
                    <div key={index} className="investor-block__item">
                      {item.link ? (
                        <a href={item.link} className="investor-block__item-link">
                          {item.title}
                        </a>
                      ) : (
                        <span className="investor-block__item-text">{item.title}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Event Section */}
              {event_items && event_items.length > 0 && (
                <div className="investor-block__section">
                  <div className="investor-block__section-label">
                    {event_items[0].label || 'EVENT'}
                  </div>
                  {event_items.map((item, index) => (
                    <div key={index} className="investor-block__item">
                      {item.link ? (
                        <a href={item.link} className="investor-block__item-link">
                          {item.title}
                        </a>
                      ) : (
                        <span className="investor-block__item-text">{item.title}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* View All Link */}
              {view_all_text && view_all_link && (
                <div className="investor-block__view-all">
                  <a href={view_all_link} className="investor-block__view-all-link">
                    {view_all_text}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
