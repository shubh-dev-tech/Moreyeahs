'use client';

import React from 'react';
import Image from 'next/image';

interface BulletPoint {
  bullet_text: string;
}

interface CaseStudyContentSectionProps {
  enableSection?: boolean;
  sectionType?: 'challenges' | 'solution' | 'partner' | 'approach' | 'technology' | 'outcome' | 'efficiency' | 'lessons' | 'custom';
  sectionTitle?: string;
  sectionIcon?: {
    url: string;
    alt: string;
  };
  sectionContent?: string;
  sectionQuote?: string;
  bulletPoints?: BulletPoint[];
  showDivider?: boolean;
  iconColor?: string;
  className?: string;
}

const CaseStudyContentSection: React.FC<CaseStudyContentSectionProps> = ({
  enableSection = true,
  sectionType = 'custom',
  sectionTitle,
  sectionIcon,
  sectionContent,
  sectionQuote,
  bulletPoints = [],
  showDivider = true,
  iconColor = '#e91e63',
  className = ''
}) => {
  // Don't render if section is disabled
  if (!enableSection) {
    return null;
  }

  // Predefined section configurations
  const sectionConfigs = {
    challenges: {
      title: 'The Challenges',
      defaultIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      color: '#f44336'
    },
    solution: {
      title: 'The Solution',
      defaultIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H19V1h-2v1H7V1H5v1H4.5C3.11 2 2 3.11 2 4.5v15C2 20.89 3.11 22 4.5 22h15c1.39 0 2.5-1.11 2.5-2.5v-15C22 3.11 20.89 2 19.5 2z"/>
        </svg>
      ),
      color: '#4caf50'
    },
    partner: {
      title: 'The Partner',
      defaultIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2.01.99l-2.54 3.4c-.74.99-.74 2.31 0 3.3l2.54 3.4c.47.62 1.21.99 2.01.99h2v4h2z"/>
        </svg>
      ),
      color: '#2196f3'
    },
    approach: {
      title: 'The Approach',
      defaultIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      color: '#ff9800'
    },
    technology: {
      title: 'Technology & Innovation',
      defaultIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
        </svg>
      ),
      color: '#9c27b0'
    },
    outcome: {
      title: 'The Outcome',
      defaultIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      color: '#4caf50'
    },
    efficiency: {
      title: 'Efficiency Benefits',
      defaultIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ),
      color: '#00bcd4'
    },
    lessons: {
      title: 'Lessons Learned and Future Plans',
      defaultIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      color: '#795548'
    },
    custom: {
      title: 'Section Title',
      defaultIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      color: '#e91e63'
    }
  };

  const config = sectionConfigs[sectionType];
  const finalTitle = sectionTitle || config.title;
  const finalIconColor = sectionType !== 'custom' ? config.color : iconColor;

  const iconStyles = {
    color: finalIconColor
  };

  return (
    <div className={`case-study-content-section section-type-${sectionType} ${className}`}>
      <div className="content-section__header">
        <div className="content-section__icon" style={iconStyles}>
          {sectionIcon ? (
            <Image
              src={sectionIcon.url}
              alt={finalTitle}
              width={32}
              height={32}
            />
          ) : (
            config.defaultIcon
          )}
        </div>
        <h2 className="content-section__title">{finalTitle}</h2>
      </div>
      
      <div className="content-section__content">
        {sectionContent && (
          <div 
            className="content-section__text"
            dangerouslySetInnerHTML={{ __html: sectionContent }}
          />
        )}
        
        {bulletPoints.length > 0 && (
          <ul className="content-section__bullets">
            {bulletPoints.map((bullet, index) => (
              <li key={index}>{bullet.bullet_text}</li>
            ))}
          </ul>
        )}
        
        {sectionQuote && (
          <blockquote className="content-section__quote">
            <p>{sectionQuote}</p>
          </blockquote>
        )}
      </div>
      
      {showDivider && (
        <div className="content-section__divider"></div>
      )}

      <style jsx>{`
        .case-study-content-section {
          margin-bottom: 50px;
          position: relative;
        }

        .content-section__header {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 25px;
        }

        .content-section__icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 3px;
        }

        .content-section__icon :global(svg) {
          width: 40px;
          height: 40px;
        }

        .content-section__icon :global(img) {
          filter: brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
        }

        .content-section__title {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0;
          color: #e91e63;
          line-height: 1.3;
          flex: 1;
        }

        .content-section__content {
          padding-left: 55px;
        }

        .content-section__text {
          font-size: 1rem;
          line-height: 1.8;
          color: #555555;
          margin-bottom: 20px;
        }

        .content-section__text :global(p) {
          margin-bottom: 1.2em;
        }

        .content-section__text :global(strong),
        .content-section__text :global(b) {
          color: #333333;
          font-weight: 600;
        }

        .content-section__text :global(a) {
          color: #e91e63;
          text-decoration: underline;
        }

        .content-section__text :global(ul),
        .content-section__text :global(ol) {
          margin: 15px 0;
          padding-left: 25px;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow: hidden;
          display: block;
          position: relative;
        }

        .content-section__text :global(ul li),
        .content-section__text :global(ol li) {
          margin-bottom: 8px;
          line-height: 1.6;
          color: #555555;
          word-wrap: break-word;
          overflow-wrap: break-word;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          display: list-item;
          position: relative;
        }

        .content-section__text :global(ul ul),
        .content-section__text :global(ol ol),
        .content-section__text :global(ul ol),
        .content-section__text :global(ol ul) {
          margin: 8px 0;
          padding-left: 20px;
          max-width: calc(100% - 20px);
        }

        .content-section__bullets {
          list-style: none;
          padding: 0;
          margin: 20px 0;
        }

        .content-section__bullets li {
          position: relative;
          padding-left: 25px;
          margin-bottom: 15px;
          font-size: 1rem;
          line-height: 1.7;
          color: #555555;
        }

        .content-section__bullets li:before {
          content: '•';
          position: absolute;
          left: 0;
          color: #e91e63;
          font-weight: bold;
          font-size: 1.3em;
        }

        .content-section__quote {
          margin: 30px 0;
          padding: 25px 30px;
          background: #fff5f8;
          border-left: 4px solid #e91e63;
          font-style: italic;
          border-radius: 4px;
        }

        .content-section__quote p {
          margin: 0;
          font-size: 1.05rem;
          line-height: 1.7;
          color: #333333;
        }

        .content-section__divider {
          height: 1px;
          background: linear-gradient(to right, #e91e63 0%, transparent 100%);
          margin-top: 40px;
        }

        @media (max-width: 768px) {
          .content-section__header {
            gap: 12px;
          }

          .content-section__icon :global(svg) {
            width: 32px;
            height: 32px;
          }

          .content-section__title {
            font-size: 1.5rem;
          }

          .content-section__content {
            padding-left: 0;
          }

          .content-section__text {
            font-size: 0.95rem;
          }

          .content-section__bullets li {
            font-size: 0.95rem;
          }

          .content-section__quote {
            padding: 20px 25px;
          }
        }

        @media (max-width: 480px) {
          .content-section__title {
            font-size: 1.3rem;
          }

          .content-section__icon :global(svg) {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default CaseStudyContentSection;