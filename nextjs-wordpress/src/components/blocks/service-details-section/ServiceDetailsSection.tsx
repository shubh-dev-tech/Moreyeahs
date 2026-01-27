import React from 'react';
import './styles.scss';

interface ServiceItem {
  service_icon: {
    url: string;
    alt: string;
  };
  service_title: string;
  service_description: string;
  service_link?: string;
}

interface ServiceDetailsSectionProps {
  data: {
    background_color?: string;
    background_image?: {
      url: string;
      alt: string;
    };
    heading: string;
    sub_heading?: string;
    services?: ServiceItem[];
    grid_columns?: '2' | '3' | '4';
    // Allow for dynamic service fields (services_0_service_title, etc.)
    [key: string]: any;
  };
}

const ServiceDetailsSection: React.FC<ServiceDetailsSectionProps> = ({
  data
}) => {
  // Safety check for data
  if (!data) {
    console.warn('ServiceDetailsSection: No data provided');
    return null;
  }

  const {
    background_color = '#f8f9fa',
    background_image,
    heading,
    sub_heading,
    services: servicesFromData = [],
    grid_columns = '3'
  } = data;

  // Safety check for required fields
  if (!heading) {
    console.warn('ServiceDetailsSection: No heading provided');
    return null;
  }

  // Try to get services from the data, or reconstruct from individual fields
  let services = servicesFromData;
  
  if (!Array.isArray(services) || services.length === 0) {
    // Try to reconstruct services from individual fields
    const reconstructedServices = [];
    let serviceIndex = 0;
    
    while (data[`services_${serviceIndex}_service_title`]) {
      const service = {
        service_title: data[`services_${serviceIndex}_service_title`],
        service_description: data[`services_${serviceIndex}_service_description`],
        service_link: data[`services_${serviceIndex}_service_link`],
        service_icon: data[`services_${serviceIndex}_service_icon`]
      };
      reconstructedServices.push(service);
      serviceIndex++;
    }
    
    services = reconstructedServices;
  }

  // Final check for services
  if (!Array.isArray(services) || services.length === 0) {
    console.warn('ServiceDetailsSection: No services provided or services is not an array', services);
    return (
      <section className="service-details-section" style={{ backgroundColor: background_color }}>
        <div className="service-details-container">
          <div className="service-details-header">
            <h2 className="service-details-heading">{heading}</h2>
            {sub_heading && (
              <p className="service-details-subheading">{sub_heading}</p>
            )}
          </div>
          <div className="services-grid">
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              border: '2px dashed #ddd'
            }}>
              <h3 style={{ color: '#666', marginBottom: '10px' }}>No Services Configured</h3>
              <p style={{ color: '#888', margin: '0', fontSize: '0.9rem' }}>
                Please add services in the WordPress admin panel to display them here.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
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

  // Format description with bullet points
  const formatDescription = (description: string) => {
    if (!description) return null;
    
    // Split by newlines and filter out empty lines
    const lines = description.split('\n').filter(line => line.trim());
    
    // Check if it's a bullet list (starts with • or -)
    const isBulletList = lines.some(line => line.trim().startsWith('•') || line.trim().startsWith('-'));
    
    if (isBulletList) {
      return (
        <ul>
          {lines.map((line, index) => {
            const cleanLine = line.replace(/^[•\-]\s*/, '').trim();
            return cleanLine ? <li key={index}>{cleanLine}</li> : null;
          })}
        </ul>
      );
    }
    
    // Regular paragraph text
    return <p>{description}</p>;
  };

  return (
    <section className="service-details-section" style={sectionStyles}>
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

        {services && services.length > 0 && (
          <div className={gridClass}>
            {services.map((service, index) => {
              const ServiceWrapper = service.service_link ? 'a' : 'div';
              const wrapperProps = service.service_link 
                ? { href: service.service_link, className: 'service-link' }
                : {};

              return (
                <div key={index} className="service-item">
                  <ServiceWrapper {...wrapperProps}>
                    <div className="service-content">
                      {service.service_icon && (
                        <div className="service-icon">
                          <img 
                            src={service.service_icon.url} 
                            alt={service.service_icon.alt || service.service_title}
                            width={64}
                            height={64}
                          />
                        </div>
                      )}
                      
                      {service.service_title && (
                        <h3 className="service-title">
                          {service.service_title === 'test' ? 'Sample Service' : service.service_title}
                        </h3>
                      )}
                      
                      {service.service_description && (
                        <div className="service-description">
                          {service.service_description === 'test' || service.service_description === 'test test 1 test 2' 
                            ? (
                              <div>
                                <p style={{ fontStyle: 'italic', color: '#888', fontSize: '0.9rem' }}>
                                  This is sample content from WordPress. 
                                </p>
                                <ul>
                                  <li>Feature 1: Advanced capabilities</li>
                                  <li>Feature 2: Professional implementation</li>
                                  <li>Feature 3: Ongoing support</li>
                                  <li>Feature 4: Custom solutions</li>
                                </ul>
                              </div>
                            )
                            : formatDescription(service.service_description)
                          }
                        </div>
                      )}
                    </div>
                  </ServiceWrapper>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceDetailsSection;