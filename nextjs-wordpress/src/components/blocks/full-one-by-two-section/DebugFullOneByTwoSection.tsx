import React from 'react';
import Image from 'next/image';
import './styles.scss';

interface HighlightPoint {
  point_text: string;
}

interface FullOneByTwoSectionProps {
  data: {
    heading?: string;
    sub_heading?: string;
    highlight_text?: string;
    highlight_points?: HighlightPoint[];
    button_text?: string;
    button_link?: string;
    main_image?: {
      url: string;
      alt: string;
      width?: number;
      height?: number;
    };
    reverse_layout?: boolean;
    background_color?: string;
    text_color?: string;
    // Allow for dynamic fields
    [key: string]: any;
  };
}

const DebugFullOneByTwoSection: React.FC<FullOneByTwoSectionProps> = ({
  data
}) => {
  // Debug logging
  console.log('DebugFullOneByTwoSection - Full data object:', data);
  console.log('DebugFullOneByTwoSection - reverse_layout value:', data?.reverse_layout);
  console.log('DebugFullOneByTwoSection - reverse_layout type:', typeof data?.reverse_layout);
  console.log('DebugFullOneByTwoSection - highlight_points:', data?.highlight_points);
  console.log('DebugFullOneByTwoSection - highlight_points type:', typeof data?.highlight_points);
  console.log('DebugFullOneByTwoSection - highlight_points isArray:', Array.isArray(data?.highlight_points));

  // Safety check for data
  if (!data) {
    console.warn('DebugFullOneByTwoSection: No data provided');
    return null;
  }

  const {
    heading,
    sub_heading,
    highlight_text,
    highlight_points,
    button_text,
    button_link,
    main_image,
    reverse_layout = false,
    background_color = '#1a5f4f',
    text_color = '#ffffff'
  } = data;

  // Handle WordPress ACF data - convert false to empty array for highlight_points
  const safeHighlightPoints = Array.isArray(highlight_points) ? highlight_points : [];
  
  // Handle main_image - it could be false, null, or an object
  const safeMainImage = main_image && typeof main_image === 'object' && main_image.url ? main_image : null;

  // Debug processed values
  console.log('DebugFullOneByTwoSection - processed reverse_layout:', reverse_layout);
  console.log('DebugFullOneByTwoSection - processed safeHighlightPoints:', safeHighlightPoints);
  console.log('DebugFullOneByTwoSection - processed safeMainImage:', safeMainImage);

  // Safety check for required fields
  if (!heading) {
    console.warn('DebugFullOneByTwoSection: Missing required heading');
    return null;
  }

  const sectionClasses = [
    'full-one-by-two-section',
    reverse_layout ? 'reverse-layout' : ''
  ].filter(Boolean).join(' ');

  console.log('DebugFullOneByTwoSection - sectionClasses:', sectionClasses);

  const sectionStyles = {
    backgroundColor: background_color,
    color: text_color
  };

  return (
    <section className={sectionClasses} style={sectionStyles}>
      <div className="full-one-by-two-container">
        <div className="content-half">
          {/* Debug info overlay */}
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'rgba(255,0,0,0.8)',
            color: 'white',
            padding: '5px',
            fontSize: '12px',
            zIndex: 1000,
            borderRadius: '3px'
          }}>
            Reverse: {reverse_layout ? 'TRUE' : 'FALSE'} | 
            Points: {safeHighlightPoints.length}
          </div>

          {heading && (
            <h2 className="main-heading">{heading}</h2>
          )}
          
          {sub_heading && (
            <p className="sub-heading">{sub_heading}</p>
          )}
          
          {(highlight_text || safeHighlightPoints.length > 0) && (
            <div className="highlights-section">
              {highlight_text && (
                <h3 className="highlight-title">{highlight_text}</h3>
              )}
              
              {safeHighlightPoints.length > 0 && (
                <ul className="highlight-points">
                  {safeHighlightPoints.map((point, index) => (
                    point.point_text && (
                      <li key={index}>{point.point_text}</li>
                    )
                  ))}
                </ul>
              )}
            </div>
          )}
          
          {button_text && button_link && (
            <div className="cta-section">
              <a href={button_link} className="cta-button">
                {button_text}
                <span className="button-arrow">→</span>
              </a>
            </div>
          )}
        </div>
        
        <div className="image-half">
          {safeMainImage && (
            <div className="image-container">
              <Image
                src={safeMainImage.url}
                alt={safeMainImage.alt || heading || 'Section image'}
                fill
                className="main-image"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                sizes="50vw"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DebugFullOneByTwoSection;