'use client';

import React from 'react';

interface DetailItem {
  label: string;
  value: string;
}

interface CaseStudyDetailsCardProps {
  title?: string;
  details?: DetailItem[];
  backgroundColor?: string;
  textColor?: string;
  className?: string;
}

const CaseStudyDetailsCard: React.FC<CaseStudyDetailsCardProps> = ({
  title = 'CASE STUDY DETAILS',
  details = [],
  backgroundColor = '#e91e63',
  textColor = '#ffffff',
  className = ''
}) => {
  const cardStyles = {
    backgroundColor,
    color: textColor
  };

  return (
    <div className={`case-study-details-card ${className}`} style={cardStyles}>
      <h3 className="details-card__title">{title}</h3>
      <div className="details-card__items">
        {details.map((detail, index) => (
          <div key={index} className="details-card__item">
            <div className="details-card__label">{detail.label}</div>
            <div className="details-card__value">{detail.value}</div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .case-study-details-card {
          border-radius: 8px;
          padding: 30px 25px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          margin-bottom: 30px;
          width: 280px;
          max-width: 100%;
        }

        .details-card__title {
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0 0 25px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1.3;
        }

        .details-card__items {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .details-card__item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .details-card__label {
          font-size: 0.85rem;
          font-weight: 600;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .details-card__value {
          font-size: 0.95rem;
          font-weight: 400;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .case-study-details-card {
            width: 100%;
            padding: 25px 20px;
          }

          .details-card__title {
            font-size: 1rem;
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default CaseStudyDetailsCard;
