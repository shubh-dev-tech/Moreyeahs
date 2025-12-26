'use client';

import React from 'react';
import Image from 'next/image';

interface MeetTheClientProps {
  sectionTitle?: string;
  clientImage?: {
    url: string;
    alt: string;
  };
  clientName?: string;
  clientDesignation?: string;
  clientCompany?: string;
  clientContent?: string;
  clientQuote?: string;
  showIcon?: boolean;
  sectionIcon?: {
    url: string;
    alt: string;
  };
  iconColor?: string;
  backgroundColor?: string;
  className?: string;
}

const MeetTheClient: React.FC<MeetTheClientProps> = ({
  sectionTitle = 'Meet the Client',
  clientImage,
  clientName = 'Haseet Sanghrajka',
  clientDesignation = 'CEO',
  clientCompany,
  clientContent,
  clientQuote,
  showIcon = true,
  sectionIcon,
  iconColor = '#e91e63',
  backgroundColor = 'transparent',
  className = ''
}) => {
  const iconStyles = {
    color: iconColor
  };

  const containerStyles = {
    backgroundColor
  };

  return (
    <div className={`meet-the-client ${className}`} style={containerStyles}>
      <div className="meet-client__header">
        {showIcon && (
          <div className="meet-client__icon" style={iconStyles}>
            {sectionIcon ? (
              <Image
                src={sectionIcon.url}
                alt={sectionTitle}
                width={32}
                height={32}
              />
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            )}
          </div>
        )}
        <h2 className="meet-client__title">{sectionTitle}</h2>
      </div>
      
      <div className="meet-client__content">
        {clientContent && (
          <div 
            className="meet-client__description"
            dangerouslySetInnerHTML={{ __html: clientContent }}
          />
        )}
        
        <div className="meet-client__profile">
          {clientImage && (
            <div className="meet-client__image">
              <Image
                src={clientImage.url}
                alt={clientName}
                width={80}
                height={80}
              />
            </div>
          )}
          
          <div className="meet-client__info">
            <h3 className="meet-client__name">{clientName}</h3>
            <div className="meet-client__position">
              {clientDesignation && (
                <span className="meet-client__designation">{clientDesignation}</span>
              )}
              {clientCompany && (
                <>
                  {clientDesignation && ' • '}
                  <span className="meet-client__company">{clientCompany}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {clientQuote && (
          <blockquote className="meet-client__quote">
            <p>{clientQuote}</p>
          </blockquote>
        )}
      </div>

      <style jsx>{`
        .meet-the-client {
          margin-bottom: 50px;
          padding: 0;
          background: transparent;
          border-radius: 0;
          box-shadow: none;
          border: none;
        }

        .meet-client__header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
          padding-bottom: 0;
          border-bottom: none;
        }

        .meet-client__icon {
          flex-shrink: 0;
          color: #e91e63;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .meet-client__icon :global(svg) {
          width: 40px;
          height: 40px;
        }

        .meet-client__icon :global(img) {
          filter: brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
        }

        .meet-client__title {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0;
          color: #333333;
        }

        .meet-client__content {
          display: flex;
          flex-direction: column;
          gap: 25px;
          padding-left: 55px;
        }

        .meet-client__description {
          font-size: 1rem;
          line-height: 1.8;
          color: #555555;
        }

        .meet-client__description :global(p) {
          margin: 0 0 1.2em 0;
        }

        .meet-client__description :global(p:last-child) {
          margin-bottom: 0;
        }

        .meet-client__profile {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 0;
          background: transparent;
          border-radius: 0;
          border: none;
        }

        .meet-client__image {
          flex-shrink: 0;
        }

        .meet-client__image :global(img) {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e91e63;
          box-shadow: 0 2px 8px rgba(233, 30, 99, 0.2);
        }

        .meet-client__info {
          flex: 1;
        }

        .meet-client__name {
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0 0 4px 0;
          color: #333333;
        }

        .meet-client__position {
          font-size: 0.9rem;
          color: #666666;
          font-weight: 400;
        }

        .meet-client__designation {
          font-weight: 600;
          color: #333333;
        }

        .meet-client__company {
          font-weight: 400;
        }

        .meet-client__quote {
          margin: 0;
          padding: 0;
          background: transparent;
          color: #555555;
          border-radius: 0;
          position: relative;
          font-style: italic;
        }

        .meet-client__quote::before {
          display: none;
        }

        .meet-client__quote p {
          margin: 0;
          font-size: 1rem;
          line-height: 1.7;
          position: relative;
          z-index: 1;
        }
        .meet-client__quote p {
          margin: 0;
          font-size: 1rem;
          line-height: 1.7;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .meet-the-client {
            margin-bottom: 40px;
          }
          
          .meet-client__header {
            margin-bottom: 20px;
          }

          .meet-client__icon :global(svg) {
            width: 32px;
            height: 32px;
          }
          
          .meet-client__title {
            font-size: 1.5rem;
          }

          .meet-client__content {
            padding-left: 0;
          }
          
          .meet-client__profile {
            gap: 15px;
          }
          
          .meet-client__image :global(img) {
            width: 55px;
            height: 55px;
          }
          
          .meet-client__name {
            font-size: 1rem;
          }

          .meet-client__position {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .meet-the-client {
            margin-bottom: 30px;
          }
          
          .meet-client__header {
            gap: 10px;
          }

          .meet-client__icon :global(svg) {
            width: 28px;
            height: 28px;
          }
          
          .meet-client__title {
            font-size: 1.3rem;
          }
          
          .meet-client__content {
            gap: 20px;
          }
          
          .meet-client__image :global(img) {
            width: 50px;
            height: 50px;
          }

          .meet-client__name {
            font-size: 0.95rem;
          }

          .meet-client__position {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MeetTheClient;