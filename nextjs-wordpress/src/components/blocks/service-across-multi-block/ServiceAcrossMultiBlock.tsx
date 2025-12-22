import React from 'react';
import './styles.scss';

interface CloudPlatform {
  platformIcon?: {
    url: string;
    alt: string;
  };
  platformName: string;
}

interface Service {
  serviceName: string;
}

interface ServiceCategory {
  categoryTitle: string;
  services: Service[];
}

interface TechnologyBadge {
  techName: string;
  techColor?: string;
}

interface ServiceAcrossMultiBlockProps {
  mainHeading?: string;
  mainDescription?: string;
  cloudPlatforms?: CloudPlatform[];
  serviceCategories?: ServiceCategory[];
  implementationsTitle?: string;
  technologyBadges?: TechnologyBadge[];
  testimonialQuote?: string;
  backgroundColor?: string;
  textColor?: string;
}

const ServiceAcrossMultiBlock: React.FC<ServiceAcrossMultiBlockProps> = ({
  mainHeading = 'Delivering Seamless Services Across Multi-Cloud Platforms',
  mainDescription = 'We enable enterprises to design, deploy, and manage secure, scalable, and high-performance solutions across leading cloud providers.',
  cloudPlatforms = [],
  serviceCategories = [],
  implementationsTitle = 'Implementations & Technologies',
  technologyBadges = [],
  testimonialQuote = 'The best service is delivered when customer success becomes your own.',
  backgroundColor = '#0f172a',
  textColor = '#ffffff'
}) => {
  const blockStyle = {
    backgroundColor,
    color: textColor
  };

  return (
    <div className="service-across-multi-block" style={blockStyle}>
      <div className="sam-container">
        
        {/* Header Section */}
        <div className="sam-header">
          <h2 className="sam-main-heading">{mainHeading}</h2>
          <p className="sam-main-description">{mainDescription}</p>
        </div>

        {/* Cloud Platforms Section */}
        {cloudPlatforms && cloudPlatforms.length > 0 && (
          <div className="sam-cloud-platforms">
            {cloudPlatforms.map((platform, index) => (
              <div key={index} className="sam-platform-badge">
                {platform.platformIcon && (
                  <img 
                    src={platform.platformIcon.url} 
                    alt={platform.platformIcon.alt || platform.platformName}
                    className="sam-platform-icon"
                  />
                )}
                <span className="sam-platform-name">{platform.platformName}</span>
              </div>
            ))}
          </div>
        )}

        {/* Service Categories Section */}
        {serviceCategories && serviceCategories.length > 0 && (
          <div className="sam-service-categories">
            {serviceCategories.map((category, index) => (
              <div key={index} className="sam-service-category">
                <h3 className="sam-category-title">{category.categoryTitle}</h3>
                {category.services && category.services.length > 0 && (
                  <ul className="sam-services-list">
                    {category.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="sam-service-item">
                        <span className="sam-checkmark">✓</span>
                        {service.serviceName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Implementations & Technologies Section */}
        {technologyBadges && technologyBadges.length > 0 && (
          <div className="sam-implementations">
            <h3 className="sam-implementations-title">{implementationsTitle}</h3>
            <div className="sam-technology-badges">
              {technologyBadges.map((tech, index) => (
                <span 
                  key={index} 
                  className="sam-tech-badge"
                  style={{ backgroundColor: tech.techColor || '#1e3a8a' }}
                >
                  {tech.techName}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Testimonial Quote Section */}
        {testimonialQuote && (
          <div className="sam-testimonial">
            <blockquote className="sam-quote">
              "{testimonialQuote}"
            </blockquote>
          </div>
        )}

        {/* Decorative Elements */}
        <div className="sam-decorative-elements">
          <div className="sam-circle sam-circle-1"></div>
          <div className="sam-circle sam-circle-2"></div>
          <div className="sam-circle sam-circle-3"></div>
          <div className="sam-line sam-line-1"></div>
          <div className="sam-line sam-line-2"></div>
          <div className="sam-dots sam-dots-1"></div>
          <div className="sam-dots sam-dots-2"></div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAcrossMultiBlock;