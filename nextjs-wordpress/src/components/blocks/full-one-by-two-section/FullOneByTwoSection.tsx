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
    highlight_points?: (HighlightPoint | string)[];
    button_text?: string;
    button_link?: string;
    main_image?: {
      url: string;
      alt: string;
      width?: number;
      height?: number;
    };
    reverse_layout?: boolean | string | number;
    background_color?: string;
    text_color?: string;
    // Allow for dynamic fields
    [key: string]: any;
  };
}

const FullOneByTwoSection: React.FC<FullOneByTwoSectionProps> = ({
  data
}) => {
  // Safety check for data
  if (!data) {
    console.warn('FullOneByTwoSection: No data provided');
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

  // Handle WordPress ACF data - properly convert reverse_layout to boolean
  // ACF true_false fields can return true, false, "1", "0", 1, 0, or null
  const isReversed = Boolean(reverse_layout === true || reverse_layout === "true" || reverse_layout === 1 || reverse_layout === "1");
  
  // Handle WordPress ACF data - convert false to empty array for highlight_points
  // Also handle cases where highlight_points might be false, null, undefined, or a number
  let safeHighlightPoints = [];
  
  // If highlight_points is a number, it might be the count - try to get the actual data from a different property
  if (typeof highlight_points === 'number' && highlight_points > 0) {
    // Check if there are individual point properties in the data object
    const pointsFromData = [];
    
    for (let i = 0; i < highlight_points; i++) {
      let foundPoint = null;
      
      // Try various key patterns
      const keysToTry = [
        `highlight_points_${i}_point_text`,
        `highlight_points_${i}`,
        `highlight_point_${i}`,
        `point_text_${i}`,
        `points_${i}`
      ];
      
      for (const key of keysToTry) {
        if (data[key]) {
          foundPoint = data[key];
          break;
        }
      }
      
      if (foundPoint) {
        pointsFromData.push(typeof foundPoint === 'string' ? foundPoint : foundPoint.point_text || foundPoint);
      }
    }
    
    if (pointsFromData.length > 0) {
      safeHighlightPoints = pointsFromData.filter(text => text && text.trim && text.trim());
    }
  } else if (highlight_points && Array.isArray(highlight_points)) {
    safeHighlightPoints = highlight_points
      .map(point => {
        // Handle both string arrays and object arrays
        if (typeof point === 'string') {
          return point.trim();
        }
        if (typeof point === 'object' && point && point.point_text) {
          return point.point_text.trim();
        }
        return null;
      })
      .filter(text => text && text.length > 0);
  }
  
  // Handle main_image - it could be false, null, or an object
  const safeMainImage = main_image && typeof main_image === 'object' && main_image.url ? main_image : null;

  // Safety check for required fields
  if (!heading) {
    console.warn('FullOneByTwoSection: Missing required heading');
    return null;
  }

  const sectionClasses = [
    'full-one-by-two-section',
    isReversed ? 'reverse-layout' : ''
  ].filter(Boolean).join(' ');

  const sectionStyles = {
    backgroundColor: background_color,
    color: text_color
  };

  return (
    <section className={sectionClasses} style={sectionStyles}>
      <div className="full-one-by-two-container">
        <div className="content-half">
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
                  {safeHighlightPoints.map((pointText, index) => (
                    <li key={index}>{pointText}</li>
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

export default FullOneByTwoSection;