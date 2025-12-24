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
  backgroundColor = '#e91e63',
  textColor = '#ffffff',
  showQuotationMarks = true,
  quoteStyle = 'gradient',
  className = ''
}) => {
  // Helper function to adjust color brightness
  const adjustBrightness = (hex: string, percent: number): string => {
    // Remove # if present
    const cleanHex = hex.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);
    
    // Adjust brightness
    const newR = Math.max(0, Math.min(255, r + (r * percent / 100)));
    const newG = Math.max(0, Math.min(255, g + (g * percent / 100)));
    const newB = Math.max(0, Math.min(255, b + (b * percent / 100)));
    
    // Convert back to hex
    return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
  };

  const quoteStyles = quoteStyle === 'solid'
    ? {
        backgroundColor,
        color: textColor
      }
    : {
        background: `linear-gradient(135deg, ${backgroundColor} 0%, ${adjustBrightness(backgroundColor, -20)} 100%)`,
        color: textColor
      };

  return (
    <div className={`case-study-quote ${className}`}>
      <blockquote className="case-study-quote__content" style={quoteStyles}>
        {showQuotationMarks && (
          <div className="case-study-quote__marks">
            <span className="case-study-quote__mark case-study-quote__mark--open">&ldquo;</span>
          </div>
        )}
        
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
        
        {showQuotationMarks && (
          <div className="case-study-quote__marks case-study-quote__marks--close">
            <span className="case-study-quote__mark case-study-quote__mark--close">&rdquo;</span>
          </div>
        )}
      </blockquote>

      <style jsx>{`
        .case-study-quote {
          margin: 30px 0;
        }

        .case-study-quote__content {
          position: relative;
          margin: 0;
          padding: 30px 40px;
          border-radius: 0;
          box-shadow: none;
          font-style: normal;
          overflow: hidden;
        }

        .case-study-quote__marks {
          display: none;
        }

        .case-study-quote__text {
          position: relative;
          z-index: 2;
          font-size: 1.05rem;
          line-height: 1.7;
          margin: 0;
          font-weight: 400;
          text-align: left;
          font-style: italic;
        }

        .case-study-quote__attribution {
          position: relative;
          z-index: 2;
          text-align: left;
          border-top: none;
          padding-top: 15px;
          font-style: normal;
        }
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
          opacity: 0.9;
          font-weight: 400;
        }

        .case-study-quote__position,
        .case-study-quote__company {
          font-weight: 400;
        }

        @media (max-width: 768px) {
          .case-study-quote__content {
            padding: 30px 35px;
          }
          
          .case-study-quote__text {
            font-size: 1.2rem;
            margin-bottom: 20px;
          }
          
          .case-study-quote__marks {
            font-size: 4rem;
          }
          
          .case-study-quote__mark--open {
            top: -5px;
            left: 15px;
          }
          
          .case-study-quote__marks--close {
            bottom: -25px;
            right: 15px;
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
          
          .case-study-quote__content {
            padding: 25px 25px;
            border-radius: 12px;
          }
          
          .case-study-quote__text {
            font-size: 1.1rem;
            line-height: 1.5;
            margin-bottom: 15px;
          }
          
          .case-study-quote__marks {
            font-size: 3rem;
          }
          
          .case-study-quote__mark--open {
            top: 0px;
            left: 10px;
          }
          
          .case-study-quote__marks--close {
            bottom: -15px;
            right: 10px;
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