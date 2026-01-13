import React from 'react';
import './styles.scss';

interface LeftItem {
  image?: {
    id: number;
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  heading: string;
  heading_color?: string;
  subheading?: string;
  subheading_color?: string;
}

interface RightParagraph {
  text: string;
  color?: string;
}

interface ImageData {
  id: number;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface SpecializationsSectionData {
  left_items?: LeftItem[] | number;
  right_heading?: string;
  right_heading_color?: string;
  right_span_text?: string;
  right_span_color?: string;
  right_paragraphs?: RightParagraph[];
  background_type?: 'color' | 'gradient' | 'image';
  background_color?: string;
  gradient_start?: string;
  gradient_end?: string;
  gradient_direction?: string;
  background_image?: ImageData;
  // Index signature for dynamic property access
  [key: string]: any;
}

interface SpecializationsSectionProps {
  data?: SpecializationsSectionData;
}

const SpecializationsSection: React.FC<SpecializationsSectionProps> = ({ data }) => {
  // Early return if no data
  if (!data) {
    return (
      <div className="specializations-section" style={{ backgroundColor: '#E0F7FA', padding: '40px 0' }}>
        <div className="container">
          <div className="specializations-content">
            <div className="left-side">
              <div className="specialization-item">
                <div className="item-content">
                  <h3 className="item-heading" style={{ color: '#333333' }}>
                    Our Specializations
                  </h3>
                  <p className="item-subheading" style={{ color: '#666666' }}>
                    Please add content in WordPress admin
                  </p>
                </div>
              </div>
            </div>
            <div className="right-side">
              <h2 className="right-heading" style={{ color: '#333333' }}>
                Our <span className="highlight" style={{ color: '#007acc' }}>Specializations</span>
              </h2>
              <div className="right-content">
                <p style={{ color: '#666666' }}>
                  This block is working but no content has been added yet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Destructure data with defaults
  const {
    left_items: rawLeftItems = [],
    right_heading,
    right_heading_color = '#333333',
    right_span_text,
    right_span_color = '#007acc',
    right_paragraphs: rawRightParagraphs = [],
    background_type = 'color',
    background_color = '#E0F7FA',
    gradient_start = '#E0F7FA',
    gradient_end = '#B2EBF2',
    gradient_direction = 'to right',
    background_image,
  } = data;

  // Handle left_items using the same pattern as Full One by Two Section
  let processedLeftItems: LeftItem[] = [];
  
  // If left_items is a number, it's the count - get individual items from data keys
  if (typeof rawLeftItems === 'number' && rawLeftItems > 0) {
    for (let i = 0; i < rawLeftItems; i++) {
      const keysToTry = [
        `left_items_${i}_heading`,
        `left_items_${i}`,
        `left_item_${i}_heading`,
        `heading_${i}`
      ];
      
      let heading: string | undefined = undefined;
      let subheading: string | undefined = undefined;
      let headingColor: string | undefined = undefined;
      let subheadingColor: string | undefined = undefined;
      let image: ImageData | undefined = undefined;
      
      // Try to find the heading
      for (const key of keysToTry) {
        if (data && data[key as keyof SpecializationsSectionData]) {
          heading = data[key as keyof SpecializationsSectionData] as string;
          break;
        }
      }
      
      // Get other fields for this item
      if (data) {
        subheading = (data[`left_items_${i}_subheading`] as string) || undefined;
        headingColor = (data[`left_items_${i}_heading_color`] as string) || '#333333';
        subheadingColor = (data[`left_items_${i}_subheading_color`] as string) || '#666666';
        image = (data[`left_items_${i}_image`] as ImageData) || undefined;
      }
      
      if (heading) {
        processedLeftItems.push({
          heading,
          subheading,
          heading_color: headingColor,
          subheading_color: subheadingColor,
          image
        });
      }
    }
  } 
  // If left_items is already an array, use it directly
  else if (rawLeftItems && Array.isArray(rawLeftItems)) {
    processedLeftItems = rawLeftItems;
  }

  // Handle right_paragraphs using the same pattern
  let processedRightParagraphs: RightParagraph[] = [];
  
  // If right_paragraphs is a number, it's the count - get individual items from data keys
  if (typeof rawRightParagraphs === 'number' && rawRightParagraphs > 0) {
    for (let i = 0; i < rawRightParagraphs; i++) {
      const text = (data[`right_paragraphs_${i}_text`] as string) || '';
      const color = (data[`right_paragraphs_${i}_color`] as string) || '#666666';
      
      if (text) {
        processedRightParagraphs.push({
          text,
          color
        });
      }
    }
  } 
  // If right_paragraphs is already an array, use it directly
  else if (rawRightParagraphs && Array.isArray(rawRightParagraphs)) {
    processedRightParagraphs = rawRightParagraphs;
  }

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
      className="specializations-section"
      style={getBackgroundStyle()}
    >
      <div className="container">
        <div className="specializations-content">
          {/* Left Side */}
          <div className="left-side">
            {Array.isArray(processedLeftItems) && processedLeftItems.length > 0 ? (
              processedLeftItems.map((item, index) => (
                <div key={index} className="specialization-item">
                  {item.image && item.image.url && (
                    <div className="item-image">
                      <img 
                        src={item.image.url} 
                        alt={item.image.alt || item.heading || 'Specialization icon'} 
                      />
                    </div>
                  )}
                  
                  <div className="item-content">
                    <h3 
                      className="item-heading"
                      style={{ color: item.heading_color || '#333333' }}
                    >
                      {item.heading}
                    </h3>
                    
                    {item.subheading && (
                      <p 
                        className="item-subheading"
                        style={{ color: item.subheading_color || '#666666' }}
                      >
                        {item.subheading}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="specialization-item">
                <div className="item-image">
                  <div className="placeholder-icon">📋</div>
                </div>
                <div className="item-content">
                  <h3 className="item-heading" style={{ color: '#333333' }}>
                    Add Specializations
                  </h3>
                  <p className="item-subheading" style={{ color: '#666666' }}>
                    Please add specialization items in WordPress admin
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Side */}
          <div className="right-side">
            <h2 className="right-heading" style={{ color: right_heading_color }}>
              {right_heading || 'Our'}{' '}
              <span className="highlight" style={{ color: right_span_color }}>
                {right_span_text || 'Specializations'}
              </span>
            </h2>

            <div className="right-content">
              {Array.isArray(processedRightParagraphs) && processedRightParagraphs.length > 0 ? (
                processedRightParagraphs.map((paragraph, index) => (
                  <p key={index} style={{ color: paragraph.color || '#666666' }}>
                    {paragraph.text}
                  </p>
                ))
              ) : (
                <p style={{ color: '#666666' }}>
                  Please add paragraph content in WordPress admin
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecializationsSection;