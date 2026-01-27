'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { sanitizeWordPressContent } from '@/lib/wordpress-content';
import './styles.scss';

interface TestimonialItem {
  quote: string;
  client_name: string;
  client_position?: string;
  client_company?: string;
  client_avatar?: {
    id: number;
    url: string;
    alt: string;
    sizes: {
      thumbnail: string;
      medium: string;
      large: string;
      full: string;
    };
  };
  rating?: number;
}

interface DiceTestimonialProps {
  data?: {
    heading?: string;
    heading_color?: string;
    heading_span_text?: string;
    heading_span_color?: string;
    sub_heading?: string;
    testimonial_items?: TestimonialItem[];
    autoplay_slider?: boolean;
    slider_speed?: number;
    show_navigation?: boolean;
    show_dots?: boolean;
    background_type?: 'color' | 'gradient' | 'image';
    background_color?: string;
    gradient_color_1?: string;
    gradient_color_2?: string;
    gradient_direction?: string;
    background_image?: {
      id: number;
      url: string;
      alt: string;
      sizes: {
        thumbnail: string;
        medium: string;
        large: string;
        full: string;
      };
    };
    background_height?: string;
    custom_height?: number;
    text_color?: string;
    accent_color?: string;
  };
}

const DiceTestimonial: React.FC<DiceTestimonialProps> = ({ data }) => {
  const {
    heading = "What Our Clients Say",
    heading_color = "#ffffff",
    heading_span_text = "",
    heading_span_color = "#ffd700",
    sub_heading = "",
    testimonial_items = [],
    autoplay_slider = true,
    slider_speed = 4,
    show_navigation = true,
    show_dots = true,
    background_type = 'color',
    background_color = '#0a0f1c',
    gradient_color_1 = '#0a0f1c',
    gradient_color_2 = '#1a1f3c',
    gradient_direction = 'to bottom right',
    background_image,
    background_height = 'large',
    custom_height = 600,
    text_color = '#ffffff',
    accent_color = '#ffd700'
  } = data || {};

  // Helper function to get section height
  const getSectionHeight = () => {
    switch (background_height) {
      case 'small':
        return '60vh';
      case 'medium':
        return '80vh';
      case 'large':
        return '100vh';
      case 'custom':
        return `${custom_height}px`;
      default:
        return 'auto';
    }
  };

  // Helper function to get background styles
  const getBackgroundStyles = () => {
    const styles: React.CSSProperties = {
      color: text_color,
      minHeight: getSectionHeight()
    };

    if (background_type === 'gradient') {
      styles.background = `linear-gradient(${gradient_direction}, ${gradient_color_1}, ${gradient_color_2})`;
    } else if (background_type === 'image' && background_image?.url) {
      styles.backgroundImage = `url(${background_image.url})`;
      styles.backgroundSize = 'cover';
      styles.backgroundPosition = 'center';
      styles.backgroundRepeat = 'no-repeat';
      styles.backgroundColor = background_color;
    } else {
      styles.backgroundColor = background_color;
    }

    return styles;
  };

  // Process heading with span - same approach as Specializations Section
  const renderHeading = () => {
    if (!heading_span_text || heading_span_text.trim() === '') {
      // No span text, just render the heading
      return heading;
    }
    
    // Render heading with span text separately
    return (
      <>
        {heading}{' '}
        <span style={{ color: heading_span_color }}>
          {heading_span_text}
        </span>
      </>
    );
  };

  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Generate unique ID for this instance
  const sliderId = useRef(`dice-testimonial-slider-${Math.random().toString(36).substring(2, 11)}`).current;

  // Handle visibility change (pause when tab is not visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const moveSlider = useCallback((direction: 'next' | 'prev' = 'next') => {
    if (isAnimating || !trackRef.current || testimonial_items.length === 0) return;

    setIsAnimating(true);
    
    let nextIndex;
    if (direction === 'next') {
      nextIndex = currentIndex + 1;
      if (nextIndex >= testimonial_items.length) {
        nextIndex = 0;
      }
    } else {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
        nextIndex = testimonial_items.length - 1;
      }
    }

    setCurrentIndex(nextIndex);

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  }, [isAnimating, testimonial_items.length, currentIndex]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!autoplay_slider || testimonial_items.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      moveSlider('next');
    }, slider_speed * 1000);

    return () => clearInterval(interval);
  }, [autoplay_slider, slider_speed, testimonial_items.length, isPaused, moveSlider]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Helper function to get image URL
  const getImageUrl = (image: any, size: string = 'medium') => {
    if (!image) return '/placeholder-avatar.jpg';
    
    if (image?.sizes?.[size]) {
      return image.sizes[size];
    }
    if (image?.url) {
      return image.url;
    }
    if (typeof image === 'string' && image.startsWith('http')) {
      return image;
    }
    
    return '/placeholder-avatar.jpg';
  };

  // Render stars for rating
  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        className={`star ${i < rating ? 'filled' : ''}`}
        style={{ color: i < rating ? accent_color : 'rgba(255, 255, 255, 0.3)' }}
      >
        ★
      </span>
    ));
  };

  if (testimonial_items.length === 0) {
    return (
      <div className="acf-block-placeholder">
        <div className="acf-block-placeholder-icon">💬</div>
        <div className="acf-block-placeholder-text">Dice Testimonial</div>
        <div className="acf-block-placeholder-instructions">Add testimonials in the Testimonials CPT to display them here</div>
      </div>
    );
  }

  return (
    <section 
      className="dice-testimonial-block"
      style={getBackgroundStyles()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="testimonial-background-pattern"></div>
      
      <div className="container">
        <div className="testimonial-header">
          <h2 className="testimonial-heading" style={{ color: heading_color }}>
            {renderHeading()}
          </h2>
          {sub_heading && sub_heading.trim() !== '' && (
            <div 
              className="testimonial-sub-heading"
              dangerouslySetInnerHTML={{ __html: sanitizeWordPressContent(sub_heading) }}
            />
          )}
        </div>

        <div className="testimonial-slider-container">
          <div className="testimonial-cards-wrapper" ref={trackRef}>
            {testimonial_items.map((testimonial, index) => {
              const isActive = index === currentIndex;
              const isPrev = index === (currentIndex - 1 + testimonial_items.length) % testimonial_items.length;
              const isNext = index === (currentIndex + 1) % testimonial_items.length;
              
              let cardClass = 'testimonial-card';
              if (isActive) cardClass += ' active';
              else if (isPrev) cardClass += ' prev';
              else if (isNext) cardClass += ' next';
              else cardClass += ' hidden';

              return (
                <div key={index} className={cardClass}>
                  {/* Testimonial Card */}
                  <div className="client-testimonial">
                    <div className="testimonial-content">
                      <div className="quote-icon" style={{ color: accent_color }}>
                        &ldquo;
                      </div>
                      <blockquote className="testimonial-quote">
                        {testimonial.quote}
                      </blockquote>
                      
                      <div className="testimonial-rating">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                    
                    <div className="client-info">
                      {testimonial.client_avatar && (
                        <div className="client-avatar">
                          <Image
                            src={getImageUrl(testimonial.client_avatar, 'thumbnail')}
                            alt={testimonial.client_name}
                            width={60}
                            height={60}
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      
                      <div className="client-details">
                        <h4 className="client-name">{testimonial.client_name}</h4>
                        {testimonial.client_position && (
                          <p className="client-position">{testimonial.client_position}</p>
                        )}
                        {testimonial.client_company && (
                          <p className="client-company">{testimonial.client_company}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          {show_navigation && testimonial_items.length > 1 && (
            <div className="testimonial-navigation">
              <button 
                className="nav-btn prev-btn"
                onClick={() => moveSlider('prev')}
                disabled={isAnimating}
                style={{ borderColor: accent_color }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <button 
                className="nav-btn next-btn"
                onClick={() => moveSlider('next')}
                disabled={isAnimating}
                style={{ borderColor: accent_color }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}

          {/* Dots Indicator */}
          {show_dots && testimonial_items.length > 1 && (
            <div className="testimonial-dots">
              {testimonial_items.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  style={{ 
                    backgroundColor: index === currentIndex ? accent_color : 'rgba(255, 255, 255, 0.3)' 
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DiceTestimonial;
