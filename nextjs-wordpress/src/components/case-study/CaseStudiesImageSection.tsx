'use client';

import React from 'react';
import Image from 'next/image';

interface CaseStudiesImageSectionProps {
  title?: string;
  images?: {
    url: string;
    alt?: string;
  }[];
  backgroundColor?: string;
  textColor?: string;
  minHeight?: string;
  className?: string;
}

const CaseStudiesImageSection: React.FC<CaseStudiesImageSectionProps> = ({
  title = 'CASE STUDIES',
  images = [],
  backgroundColor = '#c9a227',
  textColor = '#ffffff',
  minHeight = '500px',
  className = ''
}) => {
  const sectionStyles = {
    backgroundColor,
    color: textColor,
    minHeight
  };

  return (
    <div className={`case-studies-image-section ${className}`} style={sectionStyles}>
      <div className="case-studies-image-section__content">
        {title && (
          <h2 className="case-studies-image-section__title">{title}</h2>
        )}
        {images.length > 0 && (
          <div className="case-studies-image-section__images">
            {images.map((image, index) => (
              <div key={index} className="case-studies-image-section__image">
                <Image
                  src={image.url}
                  alt={image.alt || `Case study image ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .case-studies-image-section {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 50px 0;
          border-radius: 0;
        }

        .case-studies-image-section__content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1400px;
          padding: 60px 40px;
          text-align: center;
        }

        .case-studies-image-section__title {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: 0.1em;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .case-studies-image-section__images {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 40px;
        }

        .case-studies-image-section__image {
          position: relative;
          width: 100%;
          padding-bottom: 75%;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .case-studies-image-section__content {
            padding: 40px 20px;
          }

          .case-studies-image-section__title {
            font-size: 1.5rem;
          }

          .case-studies-image-section__images {
            grid-template-columns: 1fr;
            gap: 15px;
            margin-top: 30px;
          }
        }

        @media (max-width: 480px) {
          .case-studies-image-section__content {
            padding: 30px 15px;
          }

          .case-studies-image-section__title {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CaseStudiesImageSection;
