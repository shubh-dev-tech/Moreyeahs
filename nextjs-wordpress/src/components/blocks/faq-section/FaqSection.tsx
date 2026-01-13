'use client';

import React, { useState } from 'react';
import './styles.scss';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionData {
  background_type?: 'color' | 'gradient' | 'image';
  background_color?: string;
  gradient_start_color?: string;
  gradient_end_color?: string;
  background_image?: {
    id: number;
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  section_height?: string;
  title_part1?: string;
  title_part2?: string;
  title_color?: string;
  title_highlight_color?: string;
  title_font_size?: string;
  faq_items?: FaqItem[] | number;
  // Index signature for dynamic property access
  [key: string]: any;
}

interface FaqSectionProps {
  data?: FaqSectionData;
}

const FaqSection: React.FC<FaqSectionProps> = ({ data }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Extract data with defaults
  const {
    background_type = 'gradient',
    background_color = '#e0f7fa',
    gradient_start_color = '#e0f7fa',
    gradient_end_color = '#b2ebf2',
    background_image,
    section_height = 'auto',
    title_part1 = 'Frequently Asked',
    title_part2 = 'Questions',
    title_color = '#1a365d',
    title_highlight_color = '#0ea5e9',
    title_font_size = '2.5rem',
    faq_items: rawFaqItems = []
  } = data || {};

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Handle faq_items using the same pattern as Services Section
  let processedFaqItems: FaqItem[] = [];
  
  // If faq_items is a number, it's the count - get individual items from data keys
  if (typeof rawFaqItems === 'number' && rawFaqItems > 0) {
    for (let i = 0; i < rawFaqItems; i++) {
      let question: string | undefined = undefined;
      let answer: string | undefined = undefined;
      
      // Get fields for this item
      if (data) {
        question = (data[`faq_items_${i}_question`] as string) || undefined;
        answer = (data[`faq_items_${i}_answer`] as string) || undefined;
      }
      
      if (question && answer) {
        processedFaqItems.push({
          question,
          answer
        });
      }
    }
  } 
  // If faq_items is already an array, use it directly
  else if (rawFaqItems && Array.isArray(rawFaqItems)) {
    processedFaqItems = rawFaqItems;
  }

  // Generate background style based on type
  const getBackgroundStyle = () => {
    const baseStyle: React.CSSProperties = {
      minHeight: section_height === 'auto' ? 'auto' : section_height,
      height: section_height === 'auto' ? 'auto' : section_height,
    };

    switch (background_type) {
      case 'color':
        return {
          ...baseStyle,
          background: background_color,
        };
      case 'gradient':
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${gradient_start_color} 0%, ${gradient_end_color} 100%)`,
        };
      case 'image':
        return {
          ...baseStyle,
          backgroundImage: background_image?.url ? `url(${background_image.url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        };
      default:
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${gradient_start_color} 0%, ${gradient_end_color} 100%)`,
        };
    }
  };

  const titleStyle: React.CSSProperties = {
    color: title_color,
    fontSize: title_font_size,
  };

  const highlightStyle: React.CSSProperties = {
    color: title_highlight_color,
  };

  return (
    <section className="faq-section" style={getBackgroundStyle()}>
      <div className="container">
        <div className="faq-section__content">
          <h2 className="faq-section__title" style={titleStyle}>
            {title_part1} <span className="highlight" style={highlightStyle}>{title_part2}</span>
          </h2>
          
          {processedFaqItems && processedFaqItems.length > 0 && (
            <div className="faq-section__items">
              {processedFaqItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`faq-item ${openIndex === index ? 'faq-item--open' : ''}`}
                >
                  <button
                    className="faq-item__question"
                    type="button"
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="faq-item__question-text">
                      {item.question}
                    </span>
                    <span className="faq-item__icon" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path 
                          d="M19 9L12 16L5 9" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                  <div 
                    className="faq-item__answer"
                    id={`faq-answer-${index}`}
                    aria-hidden={openIndex !== index}
                  >
                    <div 
                      className="faq-item__answer-content"
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;