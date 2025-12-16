/**
 * Full Width Left Text Section Block Component
 * ACF Block: acf/full-width-left-text-section
 */

import React from 'react';
import Image from 'next/image';
import { transformMediaUrl } from '@/lib/wpFetch';
import './styles.scss';

interface FullWidthLeftTextSectionProps {
  data: {
    heading?: string;
    sub_heading?: string;
    button_text?: string;
    button_url?: string;
    heading_bottom_1st?: string;
    title_bottom_1st?: string;
    url_text?: string;
    url_link?: string;
    heading_bottom_2nd?: string;
    title_bottom_2nd?: string;
    url_title_2nd?: string;
    url_link_2nd?: string;
    right_image?: {
      url: string;
      alt: string;
      width: number;
      height: number;
    };
    reverse_layout?: boolean;
    background_color?: string;
    section_height?: string;
    section_width?: string;
    padding_top?: string;
    padding_bottom?: string;
    padding_left?: string;
    padding_right?: string;
    margin_top?: string;
    margin_bottom?: string;
  };
}

export function FullWidthLeftTextSection({ data }: FullWidthLeftTextSectionProps) {
  const {
    heading,
    sub_heading,
    button_text,
    button_url,
    heading_bottom_1st,
    title_bottom_1st,
    url_text,
    url_link,
    heading_bottom_2nd,
    title_bottom_2nd,
    url_title_2nd,
    url_link_2nd,
    right_image,
    reverse_layout,
    background_color = '#b8860b',
    section_height = '100vh',
    section_width = '100%',
    padding_top = '4rem',
    padding_bottom = '4rem',
    padding_left = '2rem',
    padding_right = '2rem',
    margin_top = '0',
    margin_bottom = '0',
  } = data;

  const sectionClassName = `full-width-left-text-section${reverse_layout ? ' full-width-left-text-section--reversed' : ''}`;

  const sectionStyles: React.CSSProperties = {
    '--bg-color': background_color,
    '--section-height': section_height,
    '--section-width': section_width,
    '--padding-top': padding_top,
    '--padding-bottom': padding_bottom,
    '--padding-left': padding_left,
    '--padding-right': padding_right,
    '--margin-top': margin_top,
    '--margin-bottom': margin_bottom,
  } as React.CSSProperties;

  return (
    <section className={sectionClassName} style={sectionStyles}>
      <div className="full-width-left-text-section__container">
        
        {/* Left Content Section */}
        <div className="full-width-left-text-section__content">
          
          {/* Main Heading and Subheading */}
          {heading && (
            <h2 className="full-width-left-text-section__heading">
              {heading}
            </h2>
          )}
          
          {sub_heading && (
            <p className="full-width-left-text-section__subheading">
              {sub_heading}
            </p>
          )}
          
          {/* Explore Button */}
          {button_text && button_url && (
            <a
              href={button_url}
              className="full-width-left-text-section__button"
            >
              {button_text}
            </a>
          )}
          
          {/* Case Studies Section */}
          <div className="full-width-left-text-section__case-studies">
            <p className="full-width-left-text-section__case-studies-label">
              CASE STUDIES
            </p>
            
            <div className="full-width-left-text-section__case-studies-wrapper">
              {/* First Case Study */}
              <div className="full-width-left-text-section__case-study">
                {heading_bottom_1st && (
                  <h3 className="full-width-left-text-section__case-study-heading">
                    {heading_bottom_1st}
                  </h3>
                )}
                
                {title_bottom_1st && (
                  <p className="full-width-left-text-section__case-study-text">
                    {title_bottom_1st}
                  </p>
                )}
                
                {url_text && url_link && (
                  <a
                    href={url_link}
                    className="full-width-left-text-section__case-study-link"
                  >
                    {url_text} →
                  </a>
                )}
              </div>
              
              {/* Second Case Study */}
              <div className="full-width-left-text-section__case-study">
                {heading_bottom_2nd && (
                  <h3 className="full-width-left-text-section__case-study-heading">
                    {heading_bottom_2nd}
                  </h3>
                )}
                
                {title_bottom_2nd && (
                  <p className="full-width-left-text-section__case-study-text">
                    {title_bottom_2nd}
                  </p>
                )}
                
                {url_title_2nd && url_link_2nd && (
                  <a
                    href={url_link_2nd}
                    className="full-width-left-text-section__case-study-link"
                  >
                    {url_title_2nd} →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Image Section */}
        {right_image && (
          <div className="full-width-left-text-section__image">
            <Image
              src={transformMediaUrl(right_image.url)}
              alt={right_image.alt || 'Decorative image'}
              width={right_image.width || 600}
              height={right_image.height || 600}
              className="full-width-left-text-section__image-element"
            />
          </div>
        )}
      </div>
      
      {/* Decorative Background Elements */}
      <div className="full-width-left-text-section__decoration full-width-left-text-section__decoration--1"></div>
      <div className="full-width-left-text-section__decoration full-width-left-text-section__decoration--2"></div>
    </section>
  );
}
