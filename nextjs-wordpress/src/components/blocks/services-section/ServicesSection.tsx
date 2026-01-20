'use client';

import React from 'react';
import './styles.scss';

interface ServiceItem {
  image?: {
    id: number;
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  heading: string;
  heading_color?: string;
  description?: string;
  description_color?: string;
  url?: string;
  circle_color?: string;
}

interface ImageData {
  id: number;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface ServicesSectionData {
  main_heading?: string;
  main_heading_color?: string;
  span_text?: string;
  span_color?: string;
  description?: string;
  description_color?: string;
  service_items?: ServiceItem[] | number;
  background_type?: 'color' | 'gradient' | 'image';
  background_color?: string;
  gradient_start?: string;
  gradient_end?: string;
  gradient_direction?: string;
  background_image?: ImageData;
  section_height?: string;
  // Index signature for dynamic property access
  [key: string]: any;
}

interface ServicesSectionProps {
  data?: ServicesSectionData;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ data }) => {
  // Extract data with defaults
  const {
    main_heading = 'Our Services',
    main_heading_color = '#333333',
    span_text = 'Services',
    span_color = '#007acc',
    description = '',
    description_color = '#666666',
    service_items: rawServiceItems = [],
    background_type = 'gradient',
    background_color = '#E0F7FA',
    gradient_start = '#E0F7FA',
    gradient_end = '#B2EBF2',
    gradient_direction = 'to bottom',
    background_image,
    section_height = 'auto'
  } = data || {};
  
  // Handle service_items using the same pattern as Full One by Two Section
  let processedServiceItems: ServiceItem[] = [];
  
  // If service_items is a number, it's the count - get individual items from data keys
  if (typeof rawServiceItems === 'number' && rawServiceItems > 0) {
    for (let i = 0; i < rawServiceItems; i++) {
      const keysToTry = [
        `service_items_${i}_heading`,
        `service_items_${i}`,
        `service_item_${i}_heading`,
        `heading_${i}`
      ];
      
      let heading: string | undefined = undefined;
      let description: string | undefined = undefined;
      let headingColor: string | undefined = undefined;
      let descriptionColor: string | undefined = undefined;
      let image: ImageData | undefined = undefined;
      let url: string | undefined = undefined;
      
      // Try to find the heading
      for (const key of keysToTry) {
        if (data && data[key as keyof ServicesSectionData]) {
          heading = data[key as keyof ServicesSectionData] as string;
          break;
        }
      }
      
      // Get other fields for this item
      if (data) {
        description = (data[`service_items_${i}_description`] as string) || undefined;
        headingColor = (data[`service_items_${i}_heading_color`] as string) || '#333333';
        descriptionColor = (data[`service_items_${i}_description_color`] as string) || '#666666';
        image = (data[`service_items_${i}_image`] as ImageData) || undefined;
        url = (data[`service_items_${i}_url`] as string) || undefined;
      }
      
      if (heading) {
        processedServiceItems.push({
          heading,
          description,
          heading_color: headingColor,
          description_color: descriptionColor,
          image,
          url,
          circle_color: (data && data[`service_items_${i}_circle_color`] as string) || '#007acc'
        });
      }
    }
  } 
  // If service_items is already an array, use it directly
  else if (rawServiceItems && Array.isArray(rawServiceItems)) {
    processedServiceItems = rawServiceItems;
  }
  // Generate background styles
  const getBackgroundStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      minHeight: section_height === 'auto' ? 'auto' : section_height,
      height: section_height === 'auto' ? 'auto' : section_height,
    };

    switch (background_type) {
      case 'color':
        return {
          ...baseStyle,
          backgroundColor: background_color
        };
      case 'gradient':
        return {
          ...baseStyle,
          background: `linear-gradient(${gradient_direction}, ${gradient_start}, ${gradient_end})`
        };
      case 'image':
        return background_image?.url ? {
          ...baseStyle,
          backgroundImage: `url(${background_image.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : baseStyle;
      default:
        return {
          ...baseStyle,
          background: `linear-gradient(${gradient_direction}, ${gradient_start}, ${gradient_end})`
        };
    }
  };

  // Helper function to render heading with span highlighting
  const renderHeading = () => {
    if (span_text && main_heading.includes(span_text)) {
      const parts = main_heading.split(span_text);
      return (
        <>
          {parts[0]}
          <span style={{ color: span_color }}>{span_text}</span>
          {parts[1]}
        </>
      );
    }
    // If span_text doesn't exist in main_heading, append it
    else if (span_text) {
      return (
        <>
          {main_heading} <span style={{ color: span_color }}>{span_text}</span>
        </>
      );
    }
    return main_heading;
  };

  return (
    <section 
      className="services-section"
      style={getBackgroundStyle()}
    >
      <div className="services-section__container">
        <div className="services-section__header">
          <h2 
            className="services-section__heading"
            style={{ color: main_heading_color }}
          >
            {renderHeading()}
          </h2>
          {description && (
            <p 
              className="services-section__description"
              style={{ color: description_color }}
            >
              {description}
            </p>
          )}
        </div>

        {processedServiceItems && processedServiceItems.length > 0 && (
          <div className="services-section__grid">
            {processedServiceItems.map((item, index) => {
              const ItemWrapper = item.url ? 'a' : 'div';
              const wrapperProps = item.url ? { 
                href: item.url, 
                className: 'services-section__item-link',
                target: item.url.startsWith('http') ? '_blank' : '_self',
                rel: item.url.startsWith('http') ? 'noopener noreferrer' : undefined
              } : {};
              
              return (
                <ItemWrapper key={index} {...wrapperProps}>
                  <div 
                    className={`services-section__item${item.url ? ' clickable' : ''}`}
                    style={{ '--circle-color': item.circle_color || '#007acc' } as React.CSSProperties}
                  >
                    {item.image && (
                      <div className="services-section__item-icon">
                        <img 
                          src={item.image.url} 
                          alt={item.image.alt || item.heading}
                          width={item.image.width || 48}
                          height={item.image.height || 48}
                        />
                      </div>
                    )}
                    
                    <h3 
                      className="services-section__item-heading"
                      style={{ color: item.heading_color || '#333333' }}
                    >
                      {item.heading}
                    </h3>
                    
                    {item.description && (
                      <p 
                        className="services-section__item-description"
                        style={{ color: item.description_color || '#666666' }}
                      >
                        {item.description}
                      </p>
                    )}
                    
                    {item.url && (
                      <div className="services-section__item-arrow">
                        <span>→</span>
                      </div>
                    )}
                  </div>
                </ItemWrapper>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;