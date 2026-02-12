'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import './styles.scss';

interface ImageData {
  id?: number;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface Slide {
  image?: string | ImageData;
  title: string;
  description?: string;
}

interface WorkSliderData {
  heading?: string;
  heading_color?: string;
  heading_span_text?: string;
  heading_span_color?: string;
  subheading?: string;
  subheading_color?: string;
  slides?: Slide[] | number;
  background_type?: 'color' | 'gradient' | 'image';
  background_color?: string;
  gradient_start_color?: string;
  gradient_end_color?: string;
  gradient_direction?: string;
  background_image?: string | ImageData;
  [key: string]: any;
}

interface WorkSliderProps {
  data?: WorkSliderData;
}

const WorkSlider: React.FC<WorkSliderProps> = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);

  // Debug logging
  console.log('[WorkSlider] Raw data:', data);

  // Destructure data with defaults
  const {
    heading = 'Our',
    heading_color = '#333333',
    heading_span_text = 'Work',
    heading_span_color = '#4a90e2',
    subheading = 'Powered solutions enabling intelligent automation, smarter document management, and enhanced enterprise collaboration across industries.',
    subheading_color = '#666666',
    slides: rawSlides = [],
    background_type = 'color',
    background_color = '#d4e4f0',
    gradient_start_color = '#B0C7E0',
    gradient_end_color = '#E8F4FA',
    gradient_direction = '177.31deg',
    background_image,
  } = data || {};

  // Process slides data (handle both array and flattened format)
  let processedSlides: Slide[] = [];
  
  if (typeof rawSlides === 'number' && rawSlides > 0) {
    console.log('[WorkSlider] Processing flattened format, count:', rawSlides);
    for (let i = 0; i < rawSlides; i++) {
      const title = data?.[`slides_${i}_title`] as string || '';
      const description = data?.[`slides_${i}_description`] as string || '';
      let image = data?.[`slides_${i}_image`] as any;
      
      console.log(`[WorkSlider] Slide ${i} raw image:`, image);
      
      // Handle different image formats
      if (typeof image === 'object' && image?.url) {
        image = image.url;
      } else if (typeof image === 'string' && image) {
        // Keep as is
      } else {
        image = '';
      }
      
      console.log(`[WorkSlider] Slide ${i} processed image:`, image);
      
      if (title) {
        processedSlides.push({ title, description, image });
      }
    }
  } else if (Array.isArray(rawSlides)) {
    console.log('[WorkSlider] Processing array format:', rawSlides);
    // Process array format and normalize image URLs
    processedSlides = rawSlides.map((slide, idx) => {
      console.log(`[WorkSlider] Array slide ${idx}:`, slide);
      const processedImage = typeof slide.image === 'object' && slide.image?.url 
        ? slide.image.url 
        : (typeof slide.image === 'string' ? slide.image : '');
      console.log(`[WorkSlider] Array slide ${idx} processed image:`, processedImage);
      return {
        ...slide,
        image: processedImage
      };
    });
  }

  console.log('[WorkSlider] Final processed slides:', processedSlides);

  // Create infinite loop slides (clone first and last slides)
  const infiniteSlides = processedSlides.length > 0 
    ? [processedSlides[processedSlides.length - 1], ...processedSlides, processedSlides[0]]
    : [];

  // Handle infinite loop transition
  useEffect(() => {
    if (processedSlides.length <= 1) return;

    const handleTransitionEnd = () => {
      setIsTransitioning(false);
      
      // Jump to real slide without transition
      if (currentSlide === -1) {
        setCurrentSlide(processedSlides.length - 1);
      } else if (currentSlide === processedSlides.length) {
        setCurrentSlide(0);
      }
      
      // Re-enable transition after jump
      setTimeout(() => setIsTransitioning(true), 50);
    };

    const track = trackRef.current;
    if (track) {
      track.addEventListener('transitionend', handleTransitionEnd);
      return () => track.removeEventListener('transitionend', handleTransitionEnd);
    }
  }, [currentSlide, processedSlides.length]);

  // Auto-play functionality - 6 seconds
  useEffect(() => {
    if (!isAutoPlaying || processedSlides.length <= 1) return;

    const interval = setInterval(() => {
      goToNextSlide();
    }, 6000); // Changed to 6 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, processedSlides.length]);

  // Generate background style
  const getBackgroundStyle = (): React.CSSProperties => {
    switch (background_type) {
      case 'color':
        return { backgroundColor: background_color };
      case 'gradient':
        return { 
          background: `linear-gradient(${gradient_direction}, ${gradient_start_color}, ${gradient_end_color})` 
        };
      case 'image':
        if (background_image) {
          const bgUrl = typeof background_image === 'object' && background_image.url 
            ? background_image.url 
            : (typeof background_image === 'string' ? background_image : '');
          
          return bgUrl ? {
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          } : { backgroundColor: background_color };
        }
        return { backgroundColor: background_color };
      default:
        return { backgroundColor: background_color };
    }
  };

  const handleDotClick = (index: number) => {
    setIsTransitioning(true);
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const goToNextSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  };

  const goToPrevSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev - 1);
  };

  if (processedSlides.length === 0) {
    return (
      <div className="work-slider-section" style={getBackgroundStyle()}>
        <div className="container">
          <div className="work-slider-header">
            <h2 className="work-slider-heading" style={{ color: heading_color }}>
              {heading}{' '}
              <span className="highlight" style={{ color: heading_span_color }}>
                {heading_span_text}
              </span>
            </h2>
            {subheading && (
              <p className="work-slider-subheading" style={{ color: subheading_color }}>
                {subheading}
              </p>
            )}
          </div>
          <div className="work-slider-placeholder">
            <p>Please add slides in the WordPress editor.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="work-slider-section" style={getBackgroundStyle()}>
      <div className="container">
        <div className="work-slider-header">
          <h2 className="work-slider-heading" style={{ color: heading_color }}>
            {heading}{' '}
            <span className="highlight" style={{ color: heading_span_color }}>
              {heading_span_text}
            </span>
          </h2>
          {subheading && (
            <p className="work-slider-subheading" style={{ color: subheading_color }}>
              {subheading}
            </p>
          )}
        </div>

        <div className="work-slider-wrapper">
          <div 
            ref={trackRef}
            className="work-slider-track"
            style={{ 
              transform: `translateX(-${(currentSlide + 1) * 100}%)`,
              transition: isTransitioning ? 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
            }}
          >
            {infiniteSlides.map((slide, index) => {
              // Extract image URL
              const imageUrl = typeof slide.image === 'object' && slide.image?.url 
                ? slide.image.url 
                : (typeof slide.image === 'string' ? slide.image : '');
              
              const actualIndex = index - 1;
              const isActive = actualIndex === currentSlide;
              
              console.log(`[WorkSlider] Rendering slide ${index}, imageUrl:`, imageUrl);
              
              return (
              <div
                key={`slide-${index}`}
                className={`work-slide ${isActive ? 'active' : ''}`}
                data-slide={index}
              >
                <div className="slide-content">
                  {imageUrl && (
                    <div className="slide-image">
                      <Image
                        src={imageUrl}
                        alt={slide.title}
                        width={600}
                        height={400}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        priority={index === 0}
                        onError={(e) => {
                          console.error('[WorkSlider] Image failed to load:', imageUrl);
                          e.currentTarget.style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('[WorkSlider] Image loaded successfully:', imageUrl);
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="slide-text">
                    <h3 className="slide-title" style={{ color: heading_color }}>
                      {slide.title}
                    </h3>
                    {slide.description && (
                      <p className="slide-description" style={{ color: subheading_color }}>
                        {slide.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          {processedSlides.length > 1 && (
            <div className="slider-dots">
              {processedSlides.map((_, index) => (
                <button
                  key={index}
                  className={`slider-dot ${index === (currentSlide < 0 ? processedSlides.length - 1 : currentSlide >= processedSlides.length ? 0 : currentSlide) ? 'active' : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkSlider;
