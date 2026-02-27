import React from 'react';
import Image from 'next/image';
import './styles.scss';

interface FeaturePoint {
  text: string;
}

interface ImageData {
  id: number;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface DomainEnablesSectionData {
  heading?: string;
  subheading?: string;
  background_type?: 'color' | 'gradient' | 'image';
  background_color?: string;
  gradient_start?: string;
  gradient_end?: string;
  gradient_direction?: string;
  background_image?: ImageData;
  section_height?: string;
  icon_image?: ImageData;
  feature_points?: FeaturePoint[];
  main_image?: ImageData;
  // Allow for flattened ACF repeater format
  [key: string]: any;
}

interface DomainEnablesSectionProps {
  data?: DomainEnablesSectionData;
}

const DomainEnablesSection: React.FC<DomainEnablesSectionProps> = ({ data }) => {
  // Helper function to transform flattened ACF repeater data to array format
  const transformRepeaterData = (data: any, fieldName: string) => {
    if (!data) return [];
    
    // If already in array format, return as-is
    if (Array.isArray(data[fieldName])) {
      return data[fieldName];
    }
    
    // Transform flattened format (feature_points_0_text, feature_points_1_text, etc.)
    const items: any[] = [];
    let index = 0;
    
    while (data[`${fieldName}_${index}_text`] !== undefined) {
      items.push({
        text: data[`${fieldName}_${index}_text`]
      });
      index++;
    }
    
    return items;
  };
  
  // Destructure data with defaults
  const {
    heading,
    subheading,
    background_type = 'color',
    background_color = '#E0F7FA',
    gradient_start = '#E0F7FA',
    gradient_end = '#B2EBF2',
    gradient_direction = 'to right',
    background_image,
    section_height = 'auto',
    icon_image,
    main_image,
  } = data || {};
  
  // Transform feature points data
  const feature_points = transformRepeaterData(data, 'feature_points');

  // Generate background style
  const getBackgroundStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      minHeight: section_height === 'auto' ? 'auto' : section_height,
      height: section_height === 'auto' ? 'auto' : section_height,
    };

    switch (background_type) {
      case 'color':
        return { ...baseStyle, backgroundColor: background_color };
      case 'gradient':
        return {
          ...baseStyle,
          background: `linear-gradient(${gradient_direction}, ${gradient_start}, ${gradient_end})`,
        };
      case 'image':
        return background_image
          ? {
              ...baseStyle,
              backgroundImage: `url(${background_image.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
          : baseStyle;
      default:
        return { ...baseStyle, backgroundColor: background_color };
    }
  };

  return (
    <div 
      className="domain-enables-section"
      style={getBackgroundStyle()}
    >
      <div className="container">
        <div className="domain-enables-content">
          <div className="content-wrapper">
            {heading ? (
              <div 
                className="heading"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            ) : (
              <div className="heading">
                <h2>What This <span className="highlight">Domain Enables</span></h2>
              </div>
            )}

            {subheading ? (
              <div 
                className="subheading"
                dangerouslySetInnerHTML={{ __html: subheading }}
              />
            ) : (
              <div className="subheading">
                <p>121</p>
              </div>
            )}

            <div className="feature-points">
              {feature_points && feature_points.length > 0 ? (
                feature_points.map((point, index) => (
                  <div key={index} className="feature-point">
                    {icon_image ? (
                      <div className="point-icon">
                        <Image 
                          src={icon_image.url} 
                          alt={icon_image.alt || 'Feature icon'}
                          width={icon_image.width || 24}
                          height={icon_image.height || 24}
                        />
                      </div>
                    ) : (
                      <div className="point-icon default-icon">
                        <div className="checkmark">✓</div>
                      </div>
                    )}
                    <span className="point-text">{point.text}</span>
                  </div>
                ))
              ) : (
                // Fallback content
                <>
                  <div className="feature-point">
                    <div className="point-icon default-icon">
                      <div className="checkmark">✓</div>
                    </div>
                    <span className="point-text">1s</span>
                  </div>
                  <div className="feature-point">
                    <div className="point-icon default-icon">
                      <div className="checkmark">✓</div>
                    </div>
                    <span className="point-text">2s</span>
                  </div>
                  <div className="feature-point">
                    <div className="point-icon default-icon">
                      <div className="checkmark">✓</div>
                    </div>
                    <span className="point-text">Improve cross team collaboration</span>
                  </div>
                  <div className="feature-point">
                    <div className="point-icon default-icon">
                      <div className="checkmark">✓</div>
                    </div>
                    <span className="point-text">Scale securely with Azure</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {main_image ? (
            <div className="image-wrapper">
              <Image 
                src={main_image.url} 
                alt={main_image.alt || 'Main illustration'} 
                className="main-image"
                width={main_image.width || 600}
                height={main_image.height || 400}
              />
            </div>
          ) : (
            <div className="image-wrapper">
              <div className="placeholder-image">
                <p>Main Image Placeholder</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DomainEnablesSection;