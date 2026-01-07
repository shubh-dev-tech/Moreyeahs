'use client';

import React from 'react';
import Image from 'next/image';
import './styles.scss';

interface ServiceBlock {
  title: string;
  description: string;
  backgroundColor?: string;
}

interface BulletPoint {
  heading: string;
  subheading?: string;
  description: string;
  bullet_color?: string;
  heading_color?: string;
  subheading_color?: string;
  description_color?: string;
}

interface Hero2ServiceProps {
  title?: string;
  subtitle?: string;
  description?: string;
  leftImage?: {
    url: string;
    alt: string;
  };
  imageFullWidth?: boolean;
  contentType?: 'service_blocks' | 'bullet_points';
  serviceBlocks?: ServiceBlock[];
  bulletPoints?: BulletPoint[];
  backgroundType?: 'color' | 'gradient' | 'image';
  backgroundColor?: string;
  gradientColor1?: string;
  gradientColor2?: string;
  gradientDirection?: string;
  backgroundImage?: {
    url: string;
    alt: string;
  };
  backgroundOverlay?: string;
  titleColor?: string;
  subtitleColor?: string;
  descriptionColor?: string;
  serviceLayout?: string;
  reverseLayout?: boolean;
  data?: any; // For WordPress data
  [key: string]: any; // For additional props
}

const Hero2Service: React.FC<Hero2ServiceProps> = ({
  title,
  subtitle,
  description,
  leftImage = {
    url: "/images/data-engineering-illustration.png",
    alt: "Data Engineering Illustration"
  },
  imageFullWidth = false,
  contentType = 'service_blocks',
  serviceBlocks = [
    {
      title: "Assess and Analyze",
      description: "Evaluate current DevOps maturity using industry frameworks, identify capabilities gaps and establish baseline metrics for improvement tracking",
      backgroundColor: "#ffffff"
    },
    {
      title: "Implement Automation", 
      description: "Deploy CI/CD pipelines with clear milestones, automate testing and deployment processes and establish measurable success criteria.",
      backgroundColor: "#ffffff"
    },
    {
      title: "Build Culture",
      description: "Foster transparency through open communication channels, establish shared responsibility models, and create psychological safety for innovation",
      backgroundColor: "#ffffff"
    }
  ],
  bulletPoints = [
    {
      heading: "Assess and Analyze",
      subheading: "",
      description: "Evaluate current DevOps maturity using industry frameworks, identify capabilities gaps and establish baseline metrics for improvement tracking",
      bullet_color: "#7ED4AD",
      heading_color: "#333333",
      subheading_color: "#666666",
      description_color: "#333333"
    },
    {
      heading: "Implement Automation",
      subheading: "",
      description: "Deploy CI/CD pipelines with clear milestones, automate testing and deployment processes and establish measurable success criteria.",
      bullet_color: "#7ED4AD",
      heading_color: "#333333",
      subheading_color: "#666666",
      description_color: "#333333"
    },
    {
      heading: "Build Culture",
      subheading: "",
      description: "Foster transparency through open communication channels, establish shared responsibility models, and create psychological safety for innovation",
      bullet_color: "#7ED4AD",
      heading_color: "#333333",
      subheading_color: "#666666",
      description_color: "#333333"
    },
    {
      heading: "Refine and Optimize",
      subheading: "",
      description: "Continuously enhance processes based on real-time feedback, performance metrics, and lessons learned from each interaction",
      bullet_color: "#7ED4AD",
      heading_color: "#333333",
      subheading_color: "#666666",
      description_color: "#333333"
    }
  ],
  backgroundType = 'color',
  backgroundColor = "#7ED4AD",
  gradientColor1 = "#7ED4AD",
  gradientColor2 = "#4ECDC4",
  gradientDirection = "to right",
  backgroundImage,
  backgroundOverlay,
  titleColor = "#333333",
  subtitleColor = "#666666",
  descriptionColor = "#333333",
  serviceLayout = "1x3",
  reverseLayout = false,
  ...props
}) => {
  // Handle data prop from WordPress (when coming from BlockRenderer)
  const data = (props as any)?.data || {};
  
  // Use data from props if available, otherwise use direct props
  const finalProps = {
    title: data.title || title,
    subtitle: data.subtitle || subtitle,
    description: data.description || description,
    leftImage: data.left_image || leftImage,
    imageFullWidth: data.image_full_width || imageFullWidth,
    contentType: data.content_type || contentType,
    serviceBlocks: data.service_blocks || serviceBlocks,
    bulletPoints: data.bullet_points || bulletPoints,
    backgroundType: data.background_type || backgroundType,
    backgroundColor: data.background_color || backgroundColor,
    gradientColor1: data.gradient_color1 || gradientColor1,
    gradientColor2: data.gradient_color2 || gradientColor2,
    gradientDirection: data.gradient_direction || gradientDirection,
    backgroundImage: data.background_image || backgroundImage,
    backgroundOverlay: data.background_overlay || backgroundOverlay,
    titleColor: data.title_color || titleColor,
    subtitleColor: data.subtitle_color || subtitleColor,
    descriptionColor: data.description_color || descriptionColor,
    serviceLayout: data.service_layout || serviceLayout,
    reverseLayout: data.reverse_layout || reverseLayout,
  };

  // Generate background style based on type
  const getBackgroundStyle = () => {
    const baseStyle: React.CSSProperties = {};
    
    switch (finalProps.backgroundType) {
      case 'gradient':
        baseStyle.background = `linear-gradient(${finalProps.gradientDirection}, ${finalProps.gradientColor1}, ${finalProps.gradientColor2})`;
        break;
      case 'image':
        if (finalProps.backgroundImage?.url) {
          baseStyle.backgroundImage = `url(${finalProps.backgroundImage.url})`;
          baseStyle.backgroundSize = 'cover';
          baseStyle.backgroundPosition = 'center';
          baseStyle.backgroundRepeat = 'no-repeat';
          
          if (finalProps.backgroundOverlay) {
            baseStyle.position = 'relative';
          }
        } else {
          baseStyle.backgroundColor = finalProps.backgroundColor;
        }
        break;
      default:
        baseStyle.backgroundColor = finalProps.backgroundColor;
        break;
    }
    
    return baseStyle;
  };

  // Get layout class for service blocks
  const getLayoutClass = () => {
    return `hero-2-service__blocks--${finalProps.serviceLayout}`;
  };

  // Get section classes
  const getSectionClasses = () => {
    let classes = 'hero-2-service';
    if (finalProps.reverseLayout) {
      classes += ' hero-2-service--reverse';
    }
    if (finalProps.imageFullWidth) {
      classes += ' hero-2-service--full-width-image';
    }
    return classes;
  };

  return (
    <section 
      className={getSectionClasses()}
      style={getBackgroundStyle()}
    >
      {/* Background overlay for image background */}
      {finalProps.backgroundType === 'image' && finalProps.backgroundOverlay && (
        <div 
          className="hero-2-service__overlay"
          style={{ backgroundColor: finalProps.backgroundOverlay }}
        />
      )}
      
      <div className="hero-2-service__container">
        <div className="hero-2-service__content">
          {/* Left Side - Image */}
          {finalProps.leftImage?.url && (
            <div className="hero-2-service__image-section">
              <div className="hero-2-service__image-wrapper">
                <Image
                  src={finalProps.leftImage.url}
                  alt={finalProps.leftImage.alt || ''}
                  width={500}
                  height={400}
                  className="hero-2-service__image"
                />
              </div>
            </div>
          )}

          {/* Right Side - Content */}
          <div className="hero-2-service__text-section">
            <div className="hero-2-service__header">
              {finalProps.title && finalProps.title.trim() && (
                <h2 
                  className="hero-2-service__title"
                  style={{ color: finalProps.titleColor }}
                >
                  {finalProps.title}
                </h2>
              )}
              {finalProps.subtitle && finalProps.subtitle.trim() && (
                <h3 
                  className="hero-2-service__subtitle"
                  style={{ color: finalProps.subtitleColor }}
                >
                  {finalProps.subtitle}
                </h3>
              )}
              {finalProps.description && finalProps.description.trim() && (
                <p 
                  className="hero-2-service__description"
                  style={{ color: finalProps.descriptionColor }}
                >
                  {finalProps.description}
                </p>
              )}
            </div>

            {/* Content Section - Service Blocks or Bullet Points */}
            {finalProps.contentType === 'service_blocks' ? (
              finalProps.serviceBlocks && finalProps.serviceBlocks.length > 0 && (
                <div 
                  className={`hero-2-service__blocks ${getLayoutClass()}`}
                  data-count={finalProps.serviceBlocks?.length || 0}
                  data-layout={finalProps.serviceLayout}
                >
                  {finalProps.serviceBlocks?.map((block: ServiceBlock, index: number) => (
                    <div
                      key={index}
                      className="hero-2-service__block"
                      style={{ backgroundColor: block.backgroundColor || '#ffffff' }}
                    >
                      {block.title && block.title.trim() && (
                        <h4 className="hero-2-service__block-title">
                          {block.title}
                        </h4>
                      )}
                      {block.description && block.description.trim() && (
                        <p className="hero-2-service__block-description">
                          {block.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )
            ) : (
              finalProps.bulletPoints && finalProps.bulletPoints.length > 0 && (
                <div className="hero-2-service__bullet-points">
                  {finalProps.bulletPoints?.map((bullet: BulletPoint, index: number) => (
                    <div key={index} className="hero-2-service__bullet-item">
                      <div 
                        className="hero-2-service__bullet-dot"
                        style={{ backgroundColor: bullet.bullet_color || '#7ED4AD' }}
                      />
                      <div className="hero-2-service__bullet-content">
                        {bullet.heading && bullet.heading.trim() && (
                          <h4 
                            className="hero-2-service__bullet-heading"
                            style={{ color: bullet.heading_color || '#333333' }}
                          >
                            {bullet.heading}
                          </h4>
                        )}
                        {bullet.subheading && bullet.subheading.trim() && (
                          <h5 
                            className="hero-2-service__bullet-subheading"
                            style={{ color: bullet.subheading_color || '#666666' }}
                          >
                            {bullet.subheading}
                          </h5>
                        )}
                        {bullet.description && bullet.description.trim() && (
                          <p 
                            className="hero-2-service__bullet-description"
                            style={{ color: bullet.description_color || '#333333' }}
                          >
                            {bullet.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero2Service;