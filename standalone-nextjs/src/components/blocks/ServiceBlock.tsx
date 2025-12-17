import React from 'react';
import './ServiceBlock.scss';

interface Service {
  serviceName: string;
  serviceUrl: string;
}

interface ServiceSection {
  serviceHeading: string;
  serviceHeadingUrl?: string;
  services: Service[];
}

interface ServiceBlockProps {
  data: {
    heading?: string;
    subheading?: string;
    serviceSections?: ServiceSection[];
  };
}

export default function ServiceBlock({ data }: ServiceBlockProps) {
  const { heading, subheading, serviceSections } = data;
  
  if (!serviceSections || serviceSections.length === 0) {
    return null;
  }

  return (
    <section className="service-block">
      <div className="container">
        {heading && (
          <h2 className="service-block__heading">{heading}</h2>
        )}
        
        {subheading && (
          <p className="service-block__subheading">{subheading}</p>
        )}
        
        <div className="service-block__sections">
          {serviceSections.map((section, index) => (
            <div
              key={index}
              className={`service-block__section ${
                index > 0 ? 'service-block__section--bordered' : ''
              }`}
            >
              {section.serviceHeading && (
                <div className="service-block__section-header">
                  {section.serviceHeadingUrl ? (
                    <h3 className="service-block__section-heading">
                      <a
                        href={section.serviceHeadingUrl}
                        className="service-block__section-link"
                      >
                        {section.serviceHeading}
                      </a>
                    </h3>
                  ) : (
                    <h3 className="service-block__section-heading">
                      {section.serviceHeading}
                    </h3>
                  )}
                </div>
              )}
              
              {section.services && section.services.length > 0 && (
                <div className="service-block__services">
                  {section.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="service-block__service-item">
                      {service.serviceUrl ? (
                        <a
                          href={service.serviceUrl}
                          className="service-block__service-link"
                        >
                          {service.serviceName}
                        </a>
                      ) : (
                        <span className="service-block__service-text">
                          {service.serviceName}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}