'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CaseStudyCardProps {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  id,
  title,
  slug,
  excerpt,
  featured_image
}) => {
  // Ensure title and excerpt are strings
  const displayTitle = typeof title === 'string' && title ? title : 'Untitled Case Study';
  const displayExcerpt = typeof excerpt === 'string' ? excerpt : '';
  
  return (
    <Link
      href={`/case-study/${slug}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <article className="case-study-card">
        {featured_image && (
          <div className="case-study-card__image">
            <Image
              src={featured_image}
              alt={displayTitle}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
        
        <div className="case-study-card__content">
          <h2 className="case-study-card__title">
            {displayTitle}
          </h2>
          
          {displayExcerpt && (
            <div
              className="case-study-card__excerpt"
              dangerouslySetInnerHTML={{ __html: displayExcerpt.substring(0, 150) + '...' }}
            />
          )}
          
          <div className="case-study-card__link">
            Read More
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <style jsx>{`
          .case-study-card {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
            cursor: pointer;
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          
          .case-study-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }
          
          .case-study-card__image {
            position: relative;
            width: 100%;
            height: 250px;
            background-color: #f5f5f5;
          }
          
          .case-study-card__content {
            padding: 24px;
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          
          .case-study-card__title {
            font-size: 15px;
            margin-bottom: 12px;
            font-weight: 600;
          }
          
          .case-study-card__excerpt {
            color: #666;
            margin-bottom: 16px;
            flex: 1;
          }
          
          .case-study-card__link {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #0070f3;
            font-size: 0.95rem;
            font-weight: 500;
          }
        `}</style>
      </article>
    </Link>
  );
};

export default CaseStudyCard;
