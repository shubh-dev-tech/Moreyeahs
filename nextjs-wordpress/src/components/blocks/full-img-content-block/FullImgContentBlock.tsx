'use client';

import React from 'react';
import Image from 'next/image';
import './styles.scss';

interface IconSection {
  icon?: {
    url: string;
    alt: string;
  };
  heading: string;
  subheading: string;
}

interface ContentBox {
  heading: string;
  subheading: string;
}

interface FullImgContentBlockProps {
  background_image?: {
    url: string;
    alt: string;
  };
  main_heading?: string;
  content_box?: ContentBox;
  icon_sections?: IconSection[];
}

const FullImgContentBlock: React.FC<FullImgContentBlockProps> = ({
  background_image,
  main_heading,
  content_box,
  icon_sections = []
}) => {
  if (!background_image || !main_heading) {
    return null;
  }

  return (
    <div className="full-img-content-block">
      <div className="full-img-content-container">
        {/* Left side - Full width image (25%) */}
        <div className="full-img-content-image">
          <Image
            src={background_image.url}
            alt={background_image.alt || ''}
            fill
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            sizes="25vw"
            priority
          />
        </div>
        
        {/* Right side - Content area (75%) */}
        <div className="full-img-content-content">
          {/* Main heading */}
          <h2 className="main-heading">{main_heading}</h2>
          
          {/* Content box */}
          {content_box && (
            <div className="content-box">
              <h3 className="content-box-heading">{content_box.heading}</h3>
              <p className="content-box-subheading">{content_box.subheading}</p>
            </div>
          )}
          
          {/* Icon sections */}
          {icon_sections && icon_sections.length > 0 && (
            <div className="icon-sections">
              {icon_sections.map((section, index) => (
                <div key={index} className="icon-section">
                  <div className="icon-wrapper">
                    {section.icon ? (
                      <Image
                        src={section.icon.url}
                        alt={section.icon.alt || ''}
                        width={40}
                        height={40}
                        className="section-icon"
                      />
                    ) : (
                      <div className="default-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <h4 className="section-heading">{section.heading}</h4>
                  <p className="section-subheading">{section.subheading}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullImgContentBlock;