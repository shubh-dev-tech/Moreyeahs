import React from 'react';
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
  icon_image?: ImageData;
  feature_points?: FeaturePoint[];
  main_image?: ImageData;
}

interface DomainEnablesSectionProps {
  data?: DomainEnablesSectionData;
}

const DomainEnablesSection: React.FC<DomainEnablesSectionProps> = ({ data }) => {
  // Debug logging
  console.log('DomainEnablesSection received data:', data);

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
    icon_image,
    feature_points = [],
    main_image,
  } = data || {};

  // Generate background style
  const getBackgroundStyle = (): React.CSSProperties => {
    switch (background_type) {
      case 'color':
        return { backgroundColor: background_color };
      case 'gradient':
        return {
          background: `linear-gradient(${gradient_direction}, ${gradient_start}, ${gradient_end})`,
        };
      case 'image':
        return background_image
          ? {
              backgroundImage: `url(${background_image.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
          : {};
      default:
        return { backgroundColor: background_color };
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
                <p>We help organizations unlock the full value of the Microsoft ecosystem by transforming individual tools into a unified business platform.</p>
              </div>
            )}

            <div className="feature-points">
              {feature_points && feature_points.length > 0 ? (
                feature_points.map((point, index) => (
                  <div key={index} className="feature-point">
                    {icon_image ? (
                      <div className="point-icon">
                        <img 
                          src={icon_image.url} 
                          alt={icon_image.alt || 'Feature icon'} 
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
                    <span className="point-text">Centralize business operations</span>
                  </div>
                  <div className="feature-point">
                    <div className="point-icon default-icon">
                      <div className="checkmark">✓</div>
                    </div>
                    <span className="point-text">Automate repetitive processes</span>
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
              <img 
                src={main_image.url} 
                alt={main_image.alt || 'Main illustration'} 
                className="main-image" 
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