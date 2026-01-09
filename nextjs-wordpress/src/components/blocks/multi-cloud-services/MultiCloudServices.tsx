'use client';

import React from 'react';
import './styles.scss';

interface CloudPlatform {
  platform_name: string;
  platform_color: string;
}

interface ServiceItem {
  item_text: string;
}

interface ServiceSection {
  section_icon?: string;
  section_image?: any; // More flexible to handle different ACF formats
  section_title: string;
  section_items: ServiceItem[];
  section_bg_color?: string;
  section_text_color?: string;
  section_border_color?: string;
  arrow_color?: string;
}

interface CredentialItem {
  text: string;
}

interface CredentialsSection {
  title: string;
  items: CredentialItem[];
  bg_color: string;
  text_color?: string;
  border_color?: string;
  credential_image?: any; // More flexible to handle different ACF formats
  arrow_color?: string;
}

interface TechBadge {
  text: string;
  color: string;
  text_color?: string;
  border_color?: string;
  badge_style?: 'filled' | 'outlined';
}

interface ImplementationsSection {
  title: string;
  tech_badges: TechBadge[];
  section_bg_color?: string;
  section_text_color?: string;
  section_border_color?: string;
  show_section?: boolean;
  section_image?: any; // Image for the implementations section header
}

interface StylingOptions {
  background_type: 'color' | 'gradient' | 'image';
  bg_color?: string;
  gradient_start?: string;
  gradient_end?: string;
  bg_image?: {
    url: string;
    alt?: string;
  };
  text_color?: string;
  heading_color?: string;
  card_bg_color?: string;
}

interface MultiCloudServicesProps {
  main_heading?: string;
  description?: string;
  cloud_platforms?: CloudPlatform[];
  services_sections?: ServiceSection[];
  credentials_section?: CredentialsSection;
  implementations_section?: ImplementationsSection;
  styling_options?: StylingOptions;
}

const MultiCloudServices: React.FC<MultiCloudServicesProps> = ({
  main_heading = 'Delivering Seamless Services Across Multi-Cloud Platforms',
  description = 'We enable enterprises to design, deploy, and manage secure, scalable, and high-performance solutions across leading cloud providers.',
  cloud_platforms = [],
  services_sections = [],
  credentials_section,
  implementations_section,
  styling_options = {
    background_type: 'gradient',
    gradient_start: '#c4b5fd',
    gradient_end: '#a78bfa',
    text_color: '#374151',
    heading_color: '#1f2937',
    card_bg_color: '#ffffff'
  }
}) => {
  // Generate background styles
  const getBackgroundStyle = (): React.CSSProperties => {
    if (!styling_options) return {};

    switch (styling_options.background_type) {
      case 'color':
        return {
          backgroundColor: styling_options.bg_color || '#c4b5fd'
        };
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${styling_options.gradient_start || '#c4b5fd'} 0%, ${styling_options.gradient_end || '#a78bfa'} 100%)`
        };
      case 'image':
        return styling_options.bg_image?.url ? {
          backgroundImage: `url(${styling_options.bg_image.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {};
      default:
        return {
          background: `linear-gradient(135deg, ${styling_options.gradient_start || '#c4b5fd'} 0%, ${styling_options.gradient_end || '#a78bfa'} 100%)`
        };
    }
  };

  // Generate CSS custom properties
  const getCSSVariables = (): React.CSSProperties => ({
    '--text-color': styling_options?.text_color || '#374151',
    '--heading-color': styling_options?.heading_color || '#1f2937',
    '--card-bg-color': styling_options?.card_bg_color || '#ffffff'
  } as React.CSSProperties);

  // Generate arrow color CSS variable for a specific section
  const getArrowColorVariable = (arrowColor?: string): React.CSSProperties => ({
    '--arrow-color': arrowColor || '#6366f1'
  } as React.CSSProperties);

  // Helper function to get image URL from different ACF formats
  const getImageUrl = (image?: { url: string; alt?: string } | string | any): string | null => {
    if (!image) return null;
    
    // Handle string URL
    if (typeof image === 'string') return image;
    
    // Handle ACF array format
    if (typeof image === 'object') {
      // Check for direct url property
      if (image.url) return image.url;
      
      // Check for sizes object (ACF array format)
      if (image.sizes && image.sizes.thumbnail) return image.sizes.thumbnail;
      if (image.sizes && image.sizes.medium) return image.sizes.medium;
      if (image.sizes && image.sizes.full) return image.sizes.full;
      
      // Fallback to direct image URL
      if (typeof image === 'string') return image;
    }
    
    return null;
  };

  // Helper function to get image alt text
  const getImageAlt = (image?: { url: string; alt?: string } | string | any, fallback?: string): string => {
    if (!image) return fallback || '';
    if (typeof image === 'string') return fallback || '';
    if (typeof image === 'object' && image.alt) return image.alt;
    return fallback || '';
  };

  return (
    <div 
      className="multi-cloud-services-block"
      style={{
        ...getBackgroundStyle(),
        ...getCSSVariables()
      }}
    >
      <div className="container">
        {/* Header Section */}
        <div className="mcs-header">
          <h2 className="mcs-main-heading">{main_heading}</h2>
          <p className="mcs-description">{description}</p>
          
          {/* Cloud Platforms */}
          {cloud_platforms && cloud_platforms.length > 0 && (
            <div className="mcs-platforms">
              {cloud_platforms.map((platform, index) => (
                <span 
                  key={index}
                  className="platform-badge" 
                  style={{ backgroundColor: platform.platform_color || '#6366f1' }}
                >
                  {platform.platform_name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Services Grid */}
        <div className="mcs-services-grid">
          {/* Left Column - Services Sections */}
          <div className="mcs-services-column">
            {services_sections && services_sections.map((section, index) => (
              <div 
                key={index} 
                className="mcs-service-card"
                style={{
                  backgroundColor: section.section_bg_color || styling_options?.card_bg_color || '#ffffff',
                  borderColor: section.section_border_color || '#e5e7eb',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  color: section.section_text_color || styling_options?.text_color || '#374151',
                  ...getArrowColorVariable(section.arrow_color)
                }}
              >
                <div className="service-header">
                  {getImageUrl(section.section_image) ? (
                    <img 
                      src={getImageUrl(section.section_image)!} 
                      alt={getImageAlt(section.section_image, section.section_title)}
                      className="section-image"
                    />
                  ) : section.section_icon && (
                    <i className={section.section_icon}></i>
                  )}
                  <h3 style={{ color: section.section_text_color || styling_options?.heading_color || '#1f2937' }}>
                    {section.section_title}
                  </h3>
                </div>
                {section.section_items && section.section_items.length > 0 && (
                  <ul className="service-items">
                    {section.section_items.map((item, itemIndex) => (
                      <li 
                        key={itemIndex}
                        // style={{ color: section.section_text_color || styling_options?.text_color || '#374151' }}
                        style={{ color: '#374151' }}
                      >
                        {item.item_text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Implementations & Tech Section */}
            {implementations_section && implementations_section.show_section !== false && (
              <div 
                className="mcs-service-card"
                style={{
                  backgroundColor: implementations_section.section_bg_color || styling_options?.card_bg_color || '#ffffff',
                  borderColor: implementations_section.section_border_color || '#e5e7eb',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  color: implementations_section.section_text_color || styling_options?.text_color || '#374151'
                }}
              >
                <div className="service-header">
                  {(() => {
                    const imageUrl = getImageUrl(implementations_section.section_image);
                    console.log('Implementations section image debug:', {
                      section_image: implementations_section.section_image,
                      imageUrl: imageUrl,
                      hasImage: !!imageUrl
                    });
                    return imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={getImageAlt(implementations_section.section_image, implementations_section.title)}
                        className="section-image"
                      />
                    ) : null;
                  })()}
                  <h3 style={{ color: implementations_section.section_text_color || styling_options?.heading_color || '#1f2937' }}>
                    {implementations_section.title}
                  </h3>
                </div>
                {implementations_section.tech_badges && implementations_section.tech_badges.length > 0 && (
                  <div className="tech-badges">
                    {implementations_section.tech_badges.map((badge, index) => {
                      const isOutlined = badge.badge_style === 'outlined';
                      return (
                        <span 
                          key={index}
                          className="tech-badge" 
                          style={{ 
                            backgroundColor: isOutlined ? 'transparent' : (badge.color || '#ef4444'),
                            color: badge.text_color || (isOutlined ? (badge.color || '#ef4444') : '#ffffff'),
                            borderColor: badge.border_color || badge.color || '#ef4444',
                            borderWidth: '2px',
                            borderStyle: 'solid'
                          }}
                        >
                          {badge.text}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Credentials */}
          {credentials_section && (
            <div className="mcs-credentials-column">
              <div 
                className="mcs-credentials-card" 
                style={{ 
                  backgroundColor: credentials_section.bg_color || '#6366f1',
                  borderColor: credentials_section.border_color || '#4f46e5',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  color: credentials_section.text_color || '#ffffff',
                  ...getArrowColorVariable(credentials_section.arrow_color)
                }}
              >
                <div className="credentials-header">
                  {getImageUrl(credentials_section.credential_image) && (
                    <img 
                      src={getImageUrl(credentials_section.credential_image)!} 
                      alt={getImageAlt(credentials_section.credential_image, credentials_section.title)}
                      className="credentials-image"
                    />
                  )}
                  <h3 
                    className="credentials-title"
                    style={{ color: credentials_section.text_color || '#ffffff' }}
                  >
                    {credentials_section.title}
                  </h3>
                </div>
                {credentials_section.items && credentials_section.items.length > 0 && (
                  <ul className="credentials-list">
                    {credentials_section.items.map((item, index) => (
                      <li 
                        key={index}
                       style={{ color: '#374151' }}
                      >
                        {item.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiCloudServices;