'use client';

import React from 'react';
import Image from 'next/image';

interface CaseStudyHeaderProps {
  logo?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  title: string;
  subtitle?: string;
  backgroundImage?: {
    url: string;
    alt: string;
  };
  gradientOverlay?: boolean;
  gradientColors?: {
    color_1: string;
    color_2: string;
  };
  className?: string;
}

const CaseStudyHeader: React.FC<CaseStudyHeaderProps> = ({
  logo,
  title,
  subtitle,
  backgroundImage,
  gradientOverlay = true,
  gradientColors = { color_1: '#00bcd4', color_2: '#9c27b0' },
  className = ''
}) => {
  const gradientStyle = gradientOverlay
    ? {
        background: `linear-gradient(135deg, ${gradientColors.color_1} 0%, ${gradientColors.color_2} 100%)${
          backgroundImage ? `, url(${backgroundImage.url})` : ''
        }`,
        backgroundBlendMode: backgroundImage ? 'overlay' : 'normal',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {};

  return (
    <div className={`case-study-header ${className}`} style={gradientStyle}>
      <div className="case-study-header__content">
        <div className="case-study-header__container">
          <div className="case-study-header__text">
            <h1 className="case-study-header__title">{title}</h1>
            {subtitle && (
              <p className="case-study-header__subtitle">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .case-study-header {
          position: relative;
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          overflow: hidden;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          padding: 0;
        }

        .case-study-header__content {
         position: relative;
          z-index: 2;
          width: 1200px;
          padding: 120px 20px 50px 20px;
          margin: auto;
        }

        .case-study-header__container {
          max-width: 1400px;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0;
        }

        .case-study-header__text {
          flex: 1;
          color: white;
        }

        .case-study-header__title {
          font-size: 3.5rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          line-height: 1.1;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          letter-spacing: -0.02em;
        }

        .case-study-header__subtitle {
          font-size: 0.95rem;
          font-weight: 400;
          margin: 0;
          opacity: 0.95;
          line-height: 1.3;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .case-study-header__content {
            padding: 30px 20px;
          }
          
          .case-study-header__title {
            font-size: 2.5rem;
          }
          
          .case-study-header__subtitle {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .case-study-header__content {
            padding: 25px 15px;
          }
          
          .case-study-header__title {
            font-size: 2rem;
          }
          
          .case-study-header__subtitle {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CaseStudyHeader;