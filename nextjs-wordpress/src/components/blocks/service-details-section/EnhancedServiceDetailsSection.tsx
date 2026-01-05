import React, { useState, useMemo } from 'react';
import './styles.scss';

interface ServiceFeature {
  feature_icon?: {
    url: string;
    alt: string;
  };
  feature_text: string;
}

interface ServiceItem {
  service_category?: string;
  service_icon: {
    url: string;
    alt: string;
  };
  service_icon_color?: string;
  service_title: string;
  service_subtitle?: string;
  service_description_type: 'bullet_list' | 'paragraph' | 'features';
  service_description?: string;
  service_features?: ServiceFeature[];
  service_link?: string;
  service_link_text?: string;
  service_priority?: string;
  service_status?: 'active' | 'coming_soon' | 'featured' | 'legacy';
}

interface EnhancedServiceDetailsSectionProps {
  data: {
    background_color?: string;
    background_image?: {
      url: string;
      alt: string;
    };
    heading: string;
    sub_heading?: string;
    service_template?: string;
    services: ServiceItem[];
    grid_columns?: '2' | '3' | '4';
    show_categories?: boolean;
    sort_by?: 'order' | 'priority' | 'title' | 'category';
  };
}

const EnhancedServiceDetailsSection: React.FC<EnhancedServiceDetailsSectionProps> = ({
  data
}) => {
  const {
    background_color = '#f8f9fa',
    background_image,
    heading,
    sub_heading,
    services = [],
    grid_columns = '3',
    show_categories = false,
    sort_by = 'order'
  } = data || {};

  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Get unique categories from services
  const categories = useMemo(() => {
    const cats = new Set<string>();
    services.forEach(service => {
      if (service.service_category) {
        cats.add(service.service_category);
      }
    });
    return Array.from(cats);
  }, [services]);

  // Sort and filter services
  const processedServices = useMemo(() => {
    let filtered = services;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = services.filter(service => service.service_category === activeCategory);
    }

    // Sort services
    switch (sort_by) {
      case 'priority':
        filtered.sort((a, b) => {
          const priorityA = parseInt(a.service_priority || '2');
          const priorityB = parseInt(b.service_priority || '2');
          return priorityB - priorityA; // High to low
        });
        break;
      case 'title':
        filtered.sort((a, b) => a.service_title.localeCompare(b.service_title));
        break;
      case 'category':
        filtered.sort((a, b) => {
          const catA = a.service_category || '';
          const catB = b.service_category || '';
          return catA.localeCompare(catB);
        });
        break;
      // 'order' - keep original order
    }

    return filtered;
  }, [services, activeCategory, sort_by]);

  // Build inline styles
  const sectionStyles: React.CSSProperties = {
    backgroundColor: background_color,
    ...(background_image && {
      backgroundImage: `url(${background_image.url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    })
  };

  // Grid class based on columns
  const gridClass = `services-grid services-grid-${grid_columns}`;

  // Format description based on type
  const formatServiceContent = (service: ServiceItem) => {
    switch (service.service_description_type) {
      case 'features':
        if (service.service_features && service.service_features.length > 0) {
          return (
            <div className="service-features">
              {service.service_features.map((feature, index) => (
                <div key={index} className="service-feature">
                  {feature.feature_icon && (
                    <img 
                      src={feature.feature_icon.url} 
                      alt={feature.feature_icon.alt}
                      className="feature-icon"
                      width={16}
                      height={16}
                    />
                  )}
                  <span>{feature.feature_text}</span>
                </div>
              ))}
            </div>
          );
        }
        break;
      
      case 'bullet_list':
        if (service.service_description) {
          const lines = service.service_description.split('\n').filter(line => line.trim());
          const isBulletList = lines.some(line => line.trim().startsWith('•') || line.trim().startsWith('-'));
          
          if (isBulletList) {
            return (
              <ul className="service-bullet-list">
                {lines.map((line, index) => {
                  const cleanLine = line.replace(/^[•\-]\s*/, '').trim();
                  return cleanLine ? <li key={index}>{cleanLine}</li> : null;
                })}
              </ul>
            );
          }
        }
        break;
      
      case 'paragraph':
      default:
        if (service.service_description) {
          return <p className="service-paragraph">{service.service_description}</p>;
        }
    }
    
    return null;
  };

  // Get service status badge
  const getStatusBadge = (status?: string) => {
    if (!status || status === 'active') return null;
    
    const statusConfig = {
      coming_soon: { text: 'Coming Soon', class: 'status-coming-soon' },
      featured: { text: 'Featured', class: 'status-featured' },
      legacy: { text: 'Legacy', class: 'status-legacy' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;
    
    return <span className={`service-status ${config.class}`}>{config.text}</span>;
  };

  return (
    <section className="service-details-section enhanced" style={sectionStyles}>
      <div className="service-details-container">
        {(heading || sub_heading) && (
          <div className="service-details-header">
            {heading && (
              <h2 className="service-details-heading">{heading}</h2>
            )}
            
            {sub_heading && (
              <p className="service-details-subheading">{sub_heading}</p>
            )}
          </div>
        )}

        {/* Category Filters */}
        {show_categories && categories.length > 0 && (
          <div className="service-categories">
            <button
              className={`category-filter ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Services
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`category-filter ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>
        )}

        {/* Services Grid */}
        {processedServices && processedServices.length > 0 && (
          <div className={gridClass}>
            {processedServices.map((service, index) => {
              const ServiceWrapper = service.service_link ? 'a' : 'div';
              const wrapperProps = service.service_link 
                ? { href: service.service_link, className: 'service-link' }
                : {};

              return (
                <div key={index} className={`service-item ${service.service_status || 'active'}`}>
                  <ServiceWrapper {...wrapperProps}>
                    <div className="service-content">
                      {/* Service Icon */}
                      {service.service_icon && (
                        <div className="service-icon">
                          <img 
                            src={service.service_icon.url} 
                            alt={service.service_icon.alt || service.service_title}
                            width={64}
                            height={64}
                            style={service.service_icon_color ? { filter: `hue-rotate(${service.service_icon_color})` } : {}}
                          />
                        </div>
                      )}
                      
                      {/* Service Title & Subtitle */}
                      <div className="service-header">
                        {service.service_title && (
                          <h3 className="service-title">
                            {service.service_title}
                            {getStatusBadge(service.service_status)}
                          </h3>
                        )}
                        
                        {service.service_subtitle && (
                          <p className="service-subtitle">{service.service_subtitle}</p>
                        )}
                      </div>
                      
                      {/* Service Content */}
                      <div className="service-description">
                        {formatServiceContent(service)}
                      </div>
                      
                      {/* Service Link */}
                      {service.service_link && service.service_link_text && (
                        <div className="service-link-text">
                          {service.service_link_text} →
                        </div>
                      )}
                    </div>
                  </ServiceWrapper>
                </div>
              );
            })}
          </div>
        )}

        {/* No Services Message */}
        {(!processedServices || processedServices.length === 0) && (
          <div className="no-services">
            <p>No services found for the selected category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EnhancedServiceDetailsSection;