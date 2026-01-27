'use client';

import React from 'react';
import Image from 'next/image';

interface CTAButton {
  button_text: string;
  button_url: string;
  button_style?: 'primary' | 'secondary' | 'outline' | 'ghost';
  button_size?: 'small' | 'medium' | 'large';
  button_icon?: {
    url: string;
    alt: string;
  };
  open_in_new_tab?: boolean;
  custom_background_color?: string;
  custom_text_color?: string;
}

interface CaseStudyCTAProps {
  ctaButtons?: CTAButton[];
  backgroundColor?: string;
  showDivider?: boolean;
  ctaAlignment?: 'left' | 'center' | 'right';
  className?: string;
}

const CaseStudyCTA: React.FC<CaseStudyCTAProps> = ({
  ctaButtons = [],
  backgroundColor = '#f8f9fa',
  showDivider = true,
  ctaAlignment = 'center',
  className = ''
}) => {
  const ctaStyles = {
    backgroundColor,
    textAlign: ctaAlignment as 'left' | 'center' | 'right'
  };

  return (
    <div className={`case-study-cta ${className}`} style={ctaStyles}>
      {showDivider && (
        <div className="case-study-cta__divider"></div>
      )}
      
      <div className="case-study-cta__content">
        {ctaButtons.length > 0 && (
          <div className="case-study-cta__buttons">
            {ctaButtons.map((button, index) => {
              const buttonClasses = [
                'case-study-cta__button',
                `cta-button--${button.button_style || 'primary'}`,
                `cta-button--${button.button_size || 'medium'}`
              ].join(' ');
              
              const buttonInlineStyles: React.CSSProperties = {};
              if (button.custom_background_color) {
                buttonInlineStyles.backgroundColor = button.custom_background_color;
                buttonInlineStyles.borderColor = button.custom_background_color;
              }
              if (button.custom_text_color) {
                buttonInlineStyles.color = button.custom_text_color;
              }

              return (
                <a
                  key={index}
                  href={button.button_url}
                  className={buttonClasses}
                  target={button.open_in_new_tab ? '_blank' : '_self'}
                  rel={button.open_in_new_tab ? 'noopener noreferrer' : undefined}
                  style={buttonInlineStyles}
                >
                  {button.button_icon && (
                    <Image
                      src={button.button_icon.url}
                      alt=""
                      width={20}
                      height={20}
                      className="cta-button__icon"
                    />
                  )}
                  {button.button_text}
                </a>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .case-study-cta {
          margin: 60px 0;
          padding: 40px 30px;
          border-radius: 15px;
          position: relative;
        }

        .case-study-cta__divider {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #e91e63, #ad1457);
          border-radius: 2px;
        }

        .case-study-cta__content {
          padding-top: 20px;
        }

        .case-study-cta__buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          justify-content: center;
          align-items: center;
        }

        .case-study-cta__buttons[style*="text-align: left"] {
          justify-content: flex-start;
        }

        .case-study-cta__buttons[style*="text-align: right"] {
          justify-content: flex-end;
        }

        .case-study-cta__buttons[style*="text-align: center"] {
          justify-content: center;
        }

        :global(.case-study-cta__button) {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          cursor: pointer;
          white-space: nowrap;
        }

        :global(.case-study-cta__button:hover) {
          text-decoration: none;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        :global(.cta-button__icon) {
          flex-shrink: 0;
        }

        /* Button Styles */
        :global(.cta-button--primary) {
          background: linear-gradient(135deg, #e91e63 0%, #ad1457 100%);
          color: white;
          border-color: #e91e63;
        }

        :global(.cta-button--primary:hover) {
          background: linear-gradient(135deg, #ad1457 0%, #880e4f 100%);
          color: white;
        }

        :global(.cta-button--secondary) {
          background: transparent;
          color: #e91e63;
          border-color: #e91e63;
        }

        :global(.cta-button--secondary:hover) {
          background: #e91e63;
          color: white;
        }

        :global(.cta-button--outline) {
          background: transparent;
          color: #333333;
          border-color: #cccccc;
        }

        :global(.cta-button--outline:hover) {
          background: #333333;
          color: white;
          border-color: #333333;
        }

        :global(.cta-button--ghost) {
          background: transparent;
          color: #e91e63;
          border: none;
          text-decoration: underline;
        }

        :global(.cta-button--ghost:hover) {
          color: #ad1457;
          text-decoration: none;
          transform: none;
          box-shadow: none;
        }

        /* Button Sizes */
        :global(.cta-button--small) {
          padding: 8px 16px;
          font-size: 0.9rem;
        }

        :global(.cta-button--medium) {
          padding: 12px 24px;
          font-size: 1rem;
        }

        :global(.cta-button--large) {
          padding: 16px 32px;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .case-study-cta {
            margin: 40px 0;
            padding: 30px 20px;
          }
          
          .case-study-cta__buttons {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          
          :global(.case-study-cta__button) {
            justify-content: center;
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
          }
          
          :global(.cta-button--large) {
            padding: 14px 28px;
            font-size: 1rem;
          }
          
          :global(.cta-button--medium) {
            padding: 12px 20px;
            font-size: 0.95rem;
          }
          
          :global(.cta-button--small) {
            padding: 10px 16px;
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .case-study-cta {
            margin: 30px 0;
            padding: 25px 15px;
            border-radius: 12px;
          }
          
          .case-study-cta__content {
            padding-top: 15px;
          }
          
          .case-study-cta__buttons {
            gap: 10px;
          }
          
          :global(.case-study-cta__button) {
            padding: 12px 20px;
            font-size: 0.9rem;
            gap: 6px;
          }
          
          :global(.cta-button__icon) {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default CaseStudyCTA;