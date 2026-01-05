'use client';

import React, { useMemo } from 'react';
import './styles.scss';

interface Region {
  name: string;
  link: string;
}

interface GradientColor {
  color: string;
  position?: number;
}

interface NavigationNextBlockProps {
  data: {
    heading?: string;
    button_text?: string;
    button_link?: string;
    regions?: Region[];
    background_type?: 'solid' | 'gradient';
    background_color?: string;
    gradient_direction?: string;
    gradient_colors?: GradientColor[];
  };
}

const NavigationNextBlock: React.FC<NavigationNextBlockProps> = ({
  data,
}) => {
  const { 
    heading, 
    button_text, 
    button_link, 
    regions,
    background_type = 'solid',
    background_color = '#9b4d96',
    gradient_direction = 'to right',
    gradient_colors = []
  } = data || {};
  
  // Ensure regions is an array
  const regionsArray = Array.isArray(regions) ? regions : [];
  
  // Generate background style
  const backgroundStyle = useMemo(() => {
    if (background_type === 'gradient' && gradient_colors && gradient_colors.length >= 2) {
      const gradientStops = gradient_colors.map((colorStop, index) => {
        const color = colorStop.color;
        // If position is not set, let CSS handle auto-positioning
        const position = colorStop.position !== undefined && colorStop.position !== null
          ? `${colorStop.position}%` 
          : '';
        return position ? `${color} ${position}` : color;
      });
      
      return {
        background: `linear-gradient(${gradient_direction}, ${gradientStops.join(', ')})`
      };
    } else {
      return {
        backgroundColor: background_color
      };
    }
  }, [background_type, background_color, gradient_direction, gradient_colors]);

  // Generate hover background style
  const hoverBackgroundStyle = useMemo(() => {
    const lightenColor = (hex: string, percent: number): string => {
      const num = parseInt(hex.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = (num >> 8 & 0x00FF) + amt;
      const B = (num & 0x0000FF) + amt;
      return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    };

    if (background_type === 'gradient' && gradient_colors && gradient_colors.length >= 2) {
      const hoverGradientStops = gradient_colors.map((colorStop, index) => {
        const hoverColor = lightenColor(colorStop.color, 20);
        const position = colorStop.position !== undefined && colorStop.position !== null
          ? `${colorStop.position}%` 
          : '';
        return position ? `${hoverColor} ${position}` : hoverColor;
      });
      
      return `linear-gradient(${gradient_direction}, ${hoverGradientStops.join(', ')})`;
    } else {
      return lightenColor(background_color, 20);
    }
  }, [background_type, background_color, gradient_direction, gradient_colors]);
  
  if (regionsArray.length === 0) {
    return null;
  }

  return (
    <section 
      className="navigation-next-block"
      style={backgroundStyle}
    >
      <div className="navigation-next-block__container">
        <div className="navigation-next-block__grid">
          {regionsArray.map((region, index) => (
            <a
              key={index}
              href={region.link || '#'}
              className="navigation-next-block__region"
              style={backgroundStyle}
              onMouseEnter={(e) => {
                if (background_type === 'gradient') {
                  e.currentTarget.style.background = hoverBackgroundStyle;
                } else {
                  e.currentTarget.style.backgroundColor = hoverBackgroundStyle;
                }
              }}
              onMouseLeave={(e) => {
                if (background_type === 'gradient') {
                  e.currentTarget.style.background = backgroundStyle.background || '';
                } else {
                  e.currentTarget.style.backgroundColor = backgroundStyle.backgroundColor || '';
                }
              }}
            >
              <span className="navigation-next-block__region-name">
                {region.name}
              </span>
            </a>
          ))}
        </div>

        {(heading || button_text) && (
          <div className="navigation-next-block__cta">
            {heading && (
              <h2 className="navigation-next-block__heading">{heading}</h2>
            )}
            {button_text && button_link && (
              <a href={button_link} className="navigation-next-block__button">
                {button_text}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NavigationNextBlock;
