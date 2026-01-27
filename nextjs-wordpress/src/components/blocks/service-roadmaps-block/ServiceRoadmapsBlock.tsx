'use client';

import React from 'react';
import Image from 'next/image';
import './styles.scss';

interface RoadmapStep {
  step_icon?: {
    url: string;
    alt: string;
  };
  step_title: string;
  step_description: string;
}

interface ServiceRoadmapsBlockProps {
  heading?: string;
  subheading?: string;
  right_image?: {
    url: string;
    alt: string;
  };
  background_color?: string;
  roadmap_steps?: RoadmapStep[];
}

const ServiceRoadmapsBlock: React.FC<ServiceRoadmapsBlockProps> = ({
  heading = 'Our DevOps Strategy Roadmap',
  subheading,
  right_image,
  background_color = '#e8f5e8',
  roadmap_steps = []
}) => {
  // Don't render if no heading or steps
  if (!heading || roadmap_steps.length === 0) {
    return null;
  }

  return (
    <div 
      className="service-roadmaps-block" 
      style={{ backgroundColor: background_color }}
    >
      <div className="srb-container">
        {/* Left side - Content */}
        <div className="srb-left">
          <div className="srb-content">
            <h2 className="srb-heading">{heading}</h2>
            
            {subheading && (
              <p className="srb-subheading">{subheading}</p>
            )}
            
            <div className="srb-steps">
              {roadmap_steps.map((step, index) => (
                <div 
                  key={index} 
                  className="srb-step" 
                  data-step={index + 1}
                >
                  {/* Step counter with connecting line */}
                  <div className="srb-counter-wrapper">
                    <div className="srb-counter">
                      {step.step_icon ? (
                        <Image
                          src={step.step_icon.url}
                          alt={step.step_icon.alt || step.step_title}
                          width={30}
                          height={30}
                          className="srb-icon"
                          style={{ 
                            width: '30px',
                            height: '30px',
                            objectFit: 'contain'
                          }}
                        />
                      ) : (
                        <span className="srb-number">{index + 1}</span>
                      )}
                    </div>
                    
                    {index < roadmap_steps.length - 1 && (
                      <div className="srb-line"></div>
                    )}
                  </div>
                  
                  {/* Step content */}
                  <div className="srb-step-content">
                    <h3 className="srb-step-title">{step.step_title}</h3>
                    <p className="srb-step-description">{step.step_description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right side - Image */}
        {right_image && (
          <div className="srb-right">
            <div className="srb-image">
              <Image
                src={right_image.url}
                alt={right_image.alt || heading}
                width={400}
                height={300}
                style={{ 
                  width: '100%',
                  height: 'auto',
                  borderRadius: '20px'
                }}
                priority
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRoadmapsBlock;