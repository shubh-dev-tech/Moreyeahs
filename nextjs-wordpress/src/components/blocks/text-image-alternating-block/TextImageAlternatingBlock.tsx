import React from 'react';
import Image from 'next/image';
import './styles.scss';

interface ContentSection {
  layout_type: 'text-left' | 'text-right';
  text_content: string;
  section_image: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
}

interface TextImageAlternatingBlockProps {
  data: {
    background_image?: {
      url: string;
      alt: string;
    };
    main_heading?: string;
    main_subheading?: string;
    content_sections?: ContentSection[];
  };
  className?: string;
  anchor?: string;
}

const TextImageAlternatingBlock: React.FC<TextImageAlternatingBlockProps> = ({
  data,
  className = '',
  anchor
}) => {
  const {
    background_image,
    main_heading,
    main_subheading,
    content_sections = []
  } = data || {};

  const blockId = anchor || `text-image-alternating-${Math.random().toString(36).substr(2, 9)}`;
  
  const backgroundStyle = background_image?.url 
    ? { backgroundImage: `url(${background_image.url})` }
    : {};

  // If no content, don't render
  if (!main_heading && !main_subheading && (!content_sections || content_sections.length === 0)) {
    return null;
  }

  return (
    <div 
      id={blockId}
      className={`text-image-alternating-block ${className}`}
      style={backgroundStyle}
    >
      <div className="text-image-alternating-container">
        
        {(main_heading || main_subheading) && (
          <div className="text-image-alternating-header">
            {main_heading && (
              <h2 className="text-image-alternating-heading">
                {main_heading}
              </h2>
            )}
            
            {main_subheading && (
              <p className="text-image-alternating-subheading">
                {main_subheading}
              </p>
            )}
          </div>
        )}

        {content_sections && content_sections.length > 0 && (
          <div className="text-image-alternating-content">
            {content_sections.map((section, index) => {
              const layoutClass = section.layout_type || 'text-left';
              const sectionId = `${blockId}-section-${index + 1}`;
              
              return (
                <div 
                  key={index}
                  className={`content-section ${layoutClass}`}
                  id={sectionId}
                >
                  <div className="content-section-inner">
                    
                    <div className="text-content">
                      {section.text_content && (
                        <p>{section.text_content}</p>
                      )}
                    </div>
                    
                    <div className="image-content">
                      {section.section_image?.url && (
                        <div className="image-wrapper">
                          <Image
                            src={section.section_image.url}
                            alt={section.section_image.alt || 'Section Image'}
                            width={section.section_image.width || 400}
                            height={section.section_image.height || 200}
                            loading="lazy"
                            className="section-image"
                          />
                        </div>
                      )}
                    </div>
                    
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
      </div>
    </div>
  );
};

export default TextImageAlternatingBlock;