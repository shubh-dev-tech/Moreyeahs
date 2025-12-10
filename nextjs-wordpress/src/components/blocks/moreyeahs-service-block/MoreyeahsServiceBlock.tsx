import React from 'react';
import './styles.scss';

interface Service {
  serviceName: string;
  serviceUrl: string;
}

interface ServiceSection {
  serviceHeading: string;
  serviceHeadingUrl?: string;
  services: Service[];
}

interface MoreyeahsServiceBlockProps {
  data: {
    heading?: string;
    subheading?: string;
    serviceSections?: ServiceSection[];
  };
}

export default function MoreyeahsServiceBlock({ data }: MoreyeahsServiceBlockProps) {
  // Parse the flattened ACF data structure
  const parseACFData = (rawData: any) => {
    if (!rawData) return null;
    
    // Check if data is already in the correct nested format
    if (rawData.serviceSections && Array.isArray(rawData.serviceSections)) {
      return {
        heading: rawData.heading,
        subheading: rawData.subheading,
        serviceSections: rawData.serviceSections
      };
    }
    
    const heading = rawData.heading;
    const subheading = rawData.subheading;
    
    // Parse service sections from flattened structure
    const serviceSections: any[] = [];
    
    // Get all keys that contain service_sections
    const allKeys = Object.keys(rawData);
    const sectionKeys = allKeys.filter(key => key.includes('service_sections_') && key.includes('_service_heading'));
    
    // Extract section indices
    const sectionIndices = [...new Set(sectionKeys.map(key => {
      const match = key.match(/service_sections_(\d+)_/);
      return match ? parseInt(match[1]) : -1;
    }))].filter(index => index >= 0).sort((a, b) => a - b);
    
    for (const sectionIndex of sectionIndices) {
      const section = {
        serviceHeading: rawData[`service_sections_${sectionIndex}_service_heading`] || '',
        serviceHeadingUrl: rawData[`service_sections_${sectionIndex}_service_heading_url`] || '',
        services: [] as any[]
      };
      
      // Get service keys for this section
      const serviceKeys = allKeys.filter(key => 
        key.includes(`service_sections_${sectionIndex}_services_`) && 
        key.includes('_service_name')
      );
      
      // Extract service indices
      const serviceIndices = [...new Set(serviceKeys.map(key => {
        const match = key.match(/services_(\d+)_service_name/);
        return match ? parseInt(match[1]) : -1;
      }))].filter(index => index >= 0).sort((a, b) => a - b);
      
      for (const serviceIndex of serviceIndices) {
        const serviceName = rawData[`service_sections_${sectionIndex}_services_${serviceIndex}_service_name`];
        const serviceUrl = rawData[`service_sections_${sectionIndex}_services_${serviceIndex}_service_url`] || '';
        
        if (serviceName) {
          section.services.push({
            serviceName,
            serviceUrl
          });
        }
      }
      
      if (section.serviceHeading && section.services.length > 0) {
        serviceSections.push(section);
      }
    }
    
    return { heading, subheading, serviceSections };
  };
  
  const parsedData = parseACFData(data);
  let { heading, subheading, serviceSections } = parsedData || {};
  

  

  
  // Return null if no valid sections found
  if (!serviceSections || serviceSections.length === 0) {
    return null;
  }

  return (
    <section className="moreyeahs-service">
      <div className="moreyeahs-service__container">
        
        {heading && (
          <h2 className="moreyeahs-service__heading">{heading}</h2>
        )}
        
        {subheading && (
          <p className="moreyeahs-service__subheading">{subheading}</p>
        )}
        
        <div className="moreyeahs-service__sections">
          {serviceSections.map((section: any, index: number) => (
            <div
              key={index}
              className={`moreyeahs-service__section ${
                index > 0 ? 'moreyeahs-service__section--bordered' : ''
              }`}
            >
              
              {section.serviceHeading && (
                <div className="moreyeahs-service__section-header">
                  {section.serviceHeadingUrl ? (
                    <h3 className="moreyeahs-service__section-heading">
                      <a
                        href={section.serviceHeadingUrl}
                        className="moreyeahs-service__section-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {section.serviceHeading}
                      </a>
                    </h3>
                  ) : (
                    <h3 className="moreyeahs-service__section-heading">
                      {section.serviceHeading}
                    </h3>
                  )}
                </div>
              )}
              
              {section.services && section.services.length > 0 && (
                <div className="moreyeahs-service__services">
                  {section.services.map((service: any, serviceIndex: number) => (
                    <div key={serviceIndex} className="moreyeahs-service__service-item">
                      {service.serviceUrl ? (
                        <a
                          href={service.serviceUrl}
                          className="moreyeahs-service__service-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {service.serviceName}
                        </a>
                      ) : (
                        <span className="moreyeahs-service__service-text">
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