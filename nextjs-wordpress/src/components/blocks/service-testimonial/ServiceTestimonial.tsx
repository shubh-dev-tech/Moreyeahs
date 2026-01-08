'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
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

interface ServiceTestimonialProps {
  data?: {
    heading?: string;
    sub_heading?: string;
    testimonial_items?: TestimonialItem[];
    autoplay_slider?: boolean;
    slider_speed?: number;
    show_navigation?: boolean;
    show_dots?: boolean;
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
    background_color?: string;
    background_height?: string;
    custom_height?: number;
    text_color?: string;
    accent_color?: string;
  };
  // Also support individual props for compatibility
  heading?: string;
  sub_heading?: string;
  testimonial_items?: TestimonialItem[];
  autoplay_slider?: boolean;
  slider_speed?: number;
  show_navigation?: boolean;
  show_dots?: boolean;
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
  background_color?: string;
  background_height?: string;
  custom_height?: number;
  text_color?: string;
  accent_color?: string;
}

const ServiceTestimonial: React.FC<ServiceTestimonialProps> = ({ 
  data,
  // Individual props as fallback
  heading: propHeading,
  sub_heading: propSubHeading,
  testimonial_items: propTestimonialItems,
  autoplay_slider: propAutoplaySlider,
  slider_speed: propSliderSpeed,
  show_navigation: propShowNavigation,
  show_dots: propShowDots,
  background_image: propBackgroundImage,
  background_color: propBackgroundColor,
  background_height: propBackgroundHeight,
  custom_height: propCustomHeight,
  text_color: propTextColor,
  accent_color: propAccentColor
}) => {
  // Use data prop first, then fall back to individual props
  const {
    heading = propHeading || "What Our Clients Say",
    sub_heading = propSubHeading || "Discover how our services have transformed businesses",
    testimonial_items = propTestimonialItems || [],
    autoplay_slider = propAutoplaySlider !== undefined ? propAutoplaySlider : true,
    slider_speed = propSliderSpeed || 4,
    show_navigation = propShowNavigation !== undefined ? propShowNavigation : true,
    show_dots = propShowDots !== undefined ? propShowDots : true,
    background_image = propBackgroundImage,
    background_color = propBackgroundColor || '#0a0f1c',
    background_height = propBackgroundHeight || 'large',
    custom_height = propCustomHeight || 600,
    text_color = propTextColor || '#ffffff',
    accent_color = propAccentColor || '#ffd700'
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
      backgroundColor: background_color,
      color: text_color,
      minHeight: getSectionHeight()
    };

    if (background_image?.url) {
      styles.backgroundImage = `url(${background_image.url})`;
      styles.backgroundSize = 'cover';
      styles.backgroundPosition = 'center';
      styles.backgroundRepeat = 'no-repeat';
    }

    return styles;
  };

  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Generate unique ID for this instance
  const sliderId = `testimonial-slider-${Math.random().toString(36).substring(2, 11)}`;

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
        <div className="acf-block-placeholder-text">Service Testimonial</div>
        <div className="acf-block-placeholder-instructions">Add testimonials to display the service testimonial slider</div>
      </div>
    );
  }

  return (
    <section 
      className="service-testimonial-block"
      style={getBackgroundStyles()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="testimonial-background-pattern"></div>
      
      <div className="container">
        <div className="testimonial-header">
          <h2 className="testimonial-heading">{heading}</h2>
          {sub_heading && (
            <div 
              className="testimonial-sub-heading"
              dangerouslySetInnerHTML={{ __html: sub_heading }}
            />
          )}
        </div>

        <div className="testimonial-slider-container">
          <div className="testimonial-cards-wrapper">
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

export default ServiceTestimonial;