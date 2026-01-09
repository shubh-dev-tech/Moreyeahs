'use client';

import React from 'react';

interface CaseStudyQuoteProps {
  quoteText: string;
  quoteAuthor?: string;
  quotePosition?: string;
  quoteCompany?: string;
  backgroundColor?: string;
  textColor?: string;
  showQuotationMarks?: boolean;
  quoteStyle?: 'gradient' | 'solid';
  className?: string;
}

const CaseStudyQuote: React.FC<CaseStudyQuoteProps> = ({
  quoteText = 'I wanted employees to concentrate on clients, not waste time creating file structures.',
  quoteAuthor,
  quotePosition,
  quoteCompany,
  backgroundColor = '#516FC2',
  textColor = '#333333',
  showQuotationMarks = true,
  quoteStyle = 'gradient',
  className = ''
}) => {
  // Don't render if quote text is empty or just whitespace
  if (!quoteText || quoteText.trim() === '') {
    return null;
  }

  return (
    <div className={`case-study-quote ${className}`}>
      <blockquote className="case-study-quote__content">
        <div className="case-study-quote__row">
          <div className="case-study-quote__icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" fill={backgroundColor}/>
            </svg>
          </div>
          
          <div className="case-study-quote__text-container">
            <p className="case-study-quote__text">{quoteText}</p>
            
            {(quoteAuthor || quotePosition || quoteCompany) && (
              <footer className="case-study-quote__attribution">
                {quoteAuthor && (
                  <cite className="case-study-quote__author">{quoteAuthor}</cite>
                )}
                {(quotePosition || quoteCompany) && (
                  <div className="case-study-quote__details">
                    {quotePosition && (
                      <span className="case-study-quote__position">{quotePosition}</span>
                    )}
                    {quoteCompany && (
                      <>
                        {quotePosition && ' • '}
                        <span className="case-study-quote__company">{quoteCompany}</span>
                      </>
                    )}
                  </div>
                )}
              </footer>
            )}
          </div>
        </div>
      </blockquote>

      <style jsx>{`
        .case-study-quote {
          margin: 30px 0;
        }

        .case-study-quote__content {
          position: relative;
          margin: 0;
          padding: 0;
          border: none;
          background: none;
          box-shadow: none;
          font-style: normal;
          overflow: visible;
        }

        .case-study-quote__row {
          display: flex;
          align-items: flex-start;
          gap: 20px;
        }

        .case-study-quote__icon {
          flex-shrink: 0;
          margin-top: 5px;
        }

        .case-study-quote__text-container {
          flex: 1;
        }

        .case-study-quote__text {
          position: relative;
          z-index: 2;
          font-size: 1.05rem;
          line-height: 1.7;
          margin: 0;
          font-weight: 600;
          text-align: left;
          font-style: italic;
          color: #516FC2;
        }

        .case-study-quote__attribution {
          position: relative;
          z-index: 2;
          text-align: left;
          border-top: none;
          padding-top: 15px;
          font-style: normal;
          color: #888888;
        }

        .case-study-quote__author {
          display: block;
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 5px;
          font-style: normal;
        }

        .case-study-quote__details {
          font-size: 0.9rem;
          opacity: 0.7;
          font-weight: 400;
        }

        .case-study-quote__position,
        .case-study-quote__company {
          font-weight: 400;
        }

        @media (max-width: 768px) {
          .case-study-quote__row {
            gap: 15px;
          }
          
          .case-study-quote__text {
            font-size: 1.2rem;
            margin-bottom: 20px;
          }
          
          .case-study-quote__author {
            font-size: 1rem;
          }
          
          .case-study-quote__details {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .case-study-quote {
            margin: 30px 0;
          }
          
          .case-study-quote__row {
            flex-direction: column;
            gap: 15px;
          }
          
          .case-study-quote__icon {
            margin-top: 0;
          }
          
          .case-study-quote__text {
            font-size: 1.1rem;
            line-height: 1.5;
            margin-bottom: 15px;
          }
          
          .case-study-quote__attribution {
            padding-top: 15px;
          }
          
          .case-study-quote__author {
            font-size: 0.95rem;
            margin-bottom: 6px;
          }
          
          .case-study-quote__details {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CaseStudyQuote;