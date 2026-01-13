'use client';

import React from 'react';
import Image from 'next/image';
import './styles.scss';

interface StepData {
  icon?: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  step_number: string;
  step_number_color?: string;
  title: string;
  title_color?: string;
  subtitle: string;
  subtitle_color?: string;
}

interface FitsTogetherSectionProps {
  data?: {
    span_heading?: string;
    span_heading_color?: string;
    main_heading?: string;
    main_heading_color?: string;
    background_type?: 'color' | 'gradient' | 'image';
    background_color?: string;
    gradient_start_color?: string;
    gradient_end_color?: string;
    background_image?: {
      url: string;
      alt: string;
    };
    steps?: StepData[] | any[] | any; // More flexible type for steps
  };
  // Also accept props directly for flexibility
  span_heading?: string;
  span_heading_color?: string;
  main_heading?: string;
  main_heading_color?: string;
  background_type?: 'color' | 'gradient' | 'image';
  background_color?: string;
  gradient_start_color?: string;
  gradient_end_color?: string;
  background_image?: {
    url: string;
    alt: string;
  };
  steps?: StepData[] | any[] | any; // More flexible type for steps
}

const FitsTogetherSection: React.FC<FitsTogetherSectionProps> = (props) => {
  // Extract data from either data prop or direct props
  const data = props.data || props;
  
  const {
    span_heading = 'How It',
    span_heading_color = '#6B7280',
    main_heading = 'Fits Together',
    main_heading_color = '#0EA5E9',
    background_type = 'gradient',
    background_color = '#A7F3D0',
    gradient_start_color = '#A7F3D0',
    gradient_end_color = '#7DD3FC',
    background_image,
    steps = []
  } = data;

  // Debug logging
  console.log('FitsTogetherSection props:', props);
  console.log('FitsTogetherSection data:', data);
  console.log('FitsTogetherSection steps raw:', steps);
  console.log('FitsTogetherSection steps type:', typeof steps);
  console.log('FitsTogetherSection steps isArray:', Array.isArray(steps));

  // Handle different data formats that might come from WordPress
  let processedSteps: StepData[] = [];
  
  if (Array.isArray(steps)) {
    processedSteps = steps;
  } else if (steps && typeof steps === 'object') {
    // If steps is an object, try to convert it to an array
    processedSteps = Object.values(steps).filter((step: any) => 
      step && typeof step === 'object' && step.title
    ) as StepData[];
  } else if (typeof steps === 'string') {
    // If steps is a string (maybe JSON), try to parse it
    try {
      const parsed = JSON.parse(steps);
      if (Array.isArray(parsed)) {
        processedSteps = parsed;
      }
    } catch (e) {
      console.warn('Failed to parse steps as JSON:', steps);
    }
  }

  console.log('FitsTogetherSection processedSteps:', processedSteps);

  // Generate background style
  const getBackgroundStyle = (): React.CSSProperties => {
    switch (background_type) {
      case 'color':
        return { backgroundColor: background_color };
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${gradient_start_color} 0%, ${gradient_end_color} 100%)`
        };
      case 'image':
        return background_image ? {
          backgroundImage: `url(${background_image.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {};
      default:
        return {
          background: `linear-gradient(135deg, ${gradient_start_color} 0%, ${gradient_end_color} 100%)`
        };
    }
  };

  // Arrow component
  const ArrowIcon = () => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="step-arrow-icon"
    >
      <path 
        d="M9 18L15 12L9 6" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  // Ensure steps is always an array
  const validSteps = Array.isArray(processedSteps) ? processedSteps : [];

  // If no valid steps, show default content with sample steps
  if (validSteps.length === 0) {
    const defaultSteps = [
      {
        step_number: 'Step 1',
        step_number_color: '#0EA5E9',
        title: 'Business Systems',
        title_color: '#1F2937',
        subtitle: 'Unified CRM/ERP core',
        subtitle_color: '#6B7280'
      },
      {
        step_number: 'Step 2', 
        step_number_color: '#0EA5E9',
        title: 'Workflow Auto',
        title_color: '#1F2937',
        subtitle: 'Process automation layer',
        subtitle_color: '#6B7280'
      },
      {
        step_number: 'Step 3',
        step_number_color: '#0EA5E9', 
        title: 'Collaboration',
        title_color: '#1F2937',
        subtitle: 'Seamless team synergy',
        subtitle_color: '#6B7280'
      },
      {
        step_number: 'Step 4',
        step_number_color: '#0EA5E9', 
        title: 'Data Insights',
        title_color: '#1F2937',
        subtitle: 'Reporting & intelligence',
        subtitle_color: '#6B7280'
      },
      {
        step_number: 'Step 5',
        step_number_color: '#0EA5E9', 
        title: 'Cloud Scale',
        title_color: '#1F2937',
        subtitle: 'Secure Azure growth',
        subtitle_color: '#6B7280'
      }
    ];

    return (
      <section 
        className="fits-together-section"
        style={getBackgroundStyle()}
      >
        <div className="fits-together-container">
          <div className="fits-together-header">
            <h2 className="fits-together-title">
              <span 
                className="fits-together-span"
                style={{ color: span_heading_color }}
              >
                {span_heading}
              </span>
              {' '}
              <span 
                className="fits-together-main"
                style={{ color: main_heading_color }}
              >
                {main_heading}
              </span>
            </h2>
          </div>
          <div className="fits-together-steps">
            {defaultSteps.map((step, index) => {
              const isLast = index === defaultSteps.length - 1;
              
              return (
                <div key={index} className="fits-together-step">
                  <div className="step-content">
                    <div className="step-info">
                      <div 
                        className="step-number"
                        style={{ color: step.step_number_color }}
                      >
                        {step.step_number}
                      </div>
                      <h3 
                        className="step-title"
                        style={{ color: step.title_color }}
                      >
                        {step.title}
                      </h3>
                      <p 
                        className="step-subtitle"
                        style={{ color: step.subtitle_color }}
                      >
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  {!isLast && (
                    <div className="step-arrow">
                      <ArrowIcon />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="fits-together-section"
      style={getBackgroundStyle()}
    >
      <div className="fits-together-container">
        <div className="fits-together-header">
          <h2 className="fits-together-title">
            <span 
              className="fits-together-span"
              style={{ color: span_heading_color }}
            >
              {span_heading}
            </span>
            {' '}
            <span 
              className="fits-together-main"
              style={{ color: main_heading_color }}
            >
              {main_heading}
            </span>
          </h2>
        </div>
        
        <div className="fits-together-steps">
          {validSteps.map((step, index) => {
            const isLast = index === validSteps.length - 1;
            
            // Ensure step is an object with required properties
            const safeStep = {
              step_number: step?.step_number || `Step ${index + 1}`,
              step_number_color: step?.step_number_color || '#0EA5E9',
              title: step?.title || 'Untitled Step',
              title_color: step?.title_color || '#1F2937',
              subtitle: step?.subtitle || 'Add subtitle in WordPress',
              subtitle_color: step?.subtitle_color || '#6B7280',
              icon: step?.icon || null
            };
            
            // Debug icon data
            if (safeStep.icon) {
              console.log(`Step ${index + 1} icon data:`, safeStep.icon);
            }
            
            return (
              <div key={index} className="fits-together-step">
                <div className="step-content">
                  {safeStep.icon && safeStep.icon.url && (
                    <div className="step-icon">
                      <Image
                        src={safeStep.icon.url}
                        alt={safeStep.icon.alt || `Step ${index + 1} icon`}
                        width={40}
                        height={40}
                        className="step-icon-image"
                        unoptimized={true}
                      />
                    </div>
                  )}
                  
                  <div className="step-info">
                    <div 
                      className="step-number"
                      style={{ color: safeStep.step_number_color }}
                    >
                      {safeStep.step_number}
                    </div>
                    <h3 
                      className="step-title"
                      style={{ color: safeStep.title_color }}
                    >
                      {safeStep.title}
                    </h3>
                    <p 
                      className="step-subtitle"
                      style={{ color: safeStep.subtitle_color }}
                    >
                      {safeStep.subtitle}
                    </p>
                  </div>
                </div>
                
                {!isLast && (
                  <div className="step-arrow">
                    <ArrowIcon />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FitsTogetherSection;