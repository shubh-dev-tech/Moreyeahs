import React from 'react';
import './styles.scss';

interface CallToActionSectionProps {
  data: {
    background_color?: string;
    background_image?: {
      url: string;
      alt: string;
    };
    heading: string;
    sub_heading?: string;
    button_text?: string;
    button_link?: string;
    button_style?: 'primary' | 'secondary' | 'outline';
    text_alignment?: 'left' | 'center' | 'right';
    overlay_opacity?: number;
    // Allow for dynamic fields
    [key: string]: any;
  };
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({
  data
}) => {
  // Safety check for data
  if (!data) {
    console.warn('CallToActionSection: No data provided');
    return null;
  }

  const {
    background_color = '#1a1a2e',
    background_image,
    heading,
    sub_heading,
    button_text,
    button_link,
    button_style = 'primary',
    text_alignment = 'center',
    overlay_opacity = 0.7
  } = data;

  // Safety check for required fields
  if (!heading) {
    console.warn('CallToActionSection: No heading provided');
    return null;
  }

  // Build inline styles
  const sectionStyles: React.CSSProperties = {
    backgroundColor: background_color,
    ...(background_image && {
      backgroundImage: `url(${background_image.url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    })
  };

  const overlayStyles: React.CSSProperties = {
    backgroundColor: `rgba(0, 0, 0, ${overlay_opacity})`
  };

  return (
    <section className="call-to-action-section" style={sectionStyles}>
      {background_image && (
        <div className="cta-overlay" style={overlayStyles}></div>
      )}
      
      <div className="cta-particles">
        {/* Particle animation elements */}
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} className={`particle particle-${i % 5}`}></div>
        ))}
      </div>

      <div className="cta-container">
        <div className={`cta-content cta-align-${text_alignment}`}>
          {heading && (
            <h2 className="cta-heading">{heading}</h2>
          )}
          
          {sub_heading && (
            <p className="cta-subheading">{sub_heading}</p>
          )}

          {button_text && (
            <div className="cta-button-wrapper">
              {button_link ? (
                <a 
                  href={button_link} 
                  className={`cta-button cta-button-${button_style}`}
                >
                  {button_text}
                  <span className="button-arrow">→</span>
                </a>
              ) : (
                <button className={`cta-button cta-button-${button_style}`}>
                  {button_text}
                  <span className="button-arrow">→</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;