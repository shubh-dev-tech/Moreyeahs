'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { transformMediaUrl } from '@/lib/wpFetch';
import './styles.scss';

interface Testimonial {
  quote: string;
  author_name: string;
  author_title: string;
  author_image?: {
    url: string;
    alt: string;
  };
}

interface TestimonialBlockProps {
  data: {
    heading?: string;
    subheading?: string;
    background_image?: {
      url: string;
      alt: string;
    };
    overlay_text?: string;
    testimonials?: Testimonial[];
    bottom_heading?: string;
    button_text?: string;
    button_link?: string;
  };
}

const TestimonialBlock: React.FC<TestimonialBlockProps> = ({ data }) => {
  const {
    heading,
    subheading,
    background_image,
    overlay_text,
    testimonials = [],
    bottom_heading,
    button_text,
    button_link,
  } = data;
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use provided testimonials or show sample testimonials if none provided
  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : [
    {
      quote: "MoreYeahs tireless efforts deliver excellent work on the CMS PM3 project. As SuitDave subcontractor, we greatly appreciate the professionalism and magnificent work that you provide for the team, and we are grateful for your services to us.",
      author_name: "MICHAEL W. KENNEDY",
      author_title: "Chief Data Officer",
      author_image: null
    },
    {
      quote: "The team consistently delivers high-quality solutions that exceed our expectations. Their attention to detail and commitment to excellence is remarkable.",
      author_name: "SARAH JOHNSON",
      author_title: "Project Manager",
      author_image: null
    },
    {
      quote: "Working with this team has been transformative for our business. They bring innovation and expertise to every project.",
      author_name: "DAVID CHEN",
      author_title: "Technical Director",
      author_image: null
    }
  ];

  // Autoplay functionality
  const startAutoplay = () => {
    if (displayTestimonials.length <= 1) return;
    
    autoplayRef.current = setInterval(() => {
      if (!isAutoplayPaused) {
        setCurrentSlide((prev) => (prev + 1) % displayTestimonials.length);
      }
    }, 5000); // Change slide every 5 seconds
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  const pauseAutoplay = () => {
    setIsAutoplayPaused(true);
  };

  const resumeAutoplay = () => {
    setIsAutoplayPaused(false);
  };

  const handleUserInteraction = () => {
    pauseAutoplay();
    
    // Clear any existing pause timeout
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    // Resume autoplay after 10 seconds of no interaction
    pauseTimeoutRef.current = setTimeout(() => {
      resumeAutoplay();
    }, 10000);
  };

  const nextSlide = () => {
    handleUserInteraction();
    setCurrentSlide((prev) => (prev + 1) % displayTestimonials.length);
  };

  const prevSlide = () => {
    handleUserInteraction();
    setCurrentSlide((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
  };

  // Initialize autoplay
  useEffect(() => {
    startAutoplay();
    
    return () => {
      stopAutoplay();
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [displayTestimonials.length, isAutoplayPaused]);

  // Handle mouse enter/leave for hover pause
  const handleMouseEnter = () => {
    pauseAutoplay();
  };

  const handleMouseLeave = () => {
    resumeAutoplay();
  };

  return (
    <section className="testimonial-block">
      <div className="testimonial-block__container">
        {/* Top Header Section */}
        {(heading || subheading) && (
          <div className="testimonial-block__header">
            {heading && <h2 className="testimonial-block__heading">{heading}</h2>}
            {subheading && <p className="testimonial-block__subheading">{subheading}</p>}
          </div>
        )}

        {/* Main Content with Background Image and Testimonial Slider */}
        <div className="testimonial-block__main-content">
          {background_image?.url && (
            <div className="testimonial-block__background">
              <Image
                src={transformMediaUrl(background_image.url)}
                alt={background_image.alt || 'Background'}
                fill
                className="testimonial-block__bg-img"
                sizes="100vw"
                quality={85}
                priority
              />
              <div className="testimonial-block__background-overlay"></div>
            </div>
          )}

          {overlay_text && (
            <div className="testimonial-block__overlay-text">{overlay_text}</div>
          )}

          <div 
            className="testimonial-block__slider-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="testimonial-block__slider">
              {displayTestimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="testimonial-block__slide"
                  style={{ 
                    display: index === currentSlide ? 'block' : 'none',
                    opacity: index === currentSlide ? 1 : 0,
                    transform: index === currentSlide ? 'translateX(0)' : 'translateX(20px)'
                  }}
                >
                  <div className="testimonial-block__card">
                    {testimonial.quote && (
                      <div className="testimonial-block__quote">
                        {testimonial.quote}
                      </div>
                    )}
                    
                    <div className="testimonial-block__author-section">
                      {testimonial.author_image?.url && (
                        <div className="testimonial-block__author-image">
                          <Image
                            src={transformMediaUrl(testimonial.author_image.url)}
                            alt={testimonial.author_image.alt || `${testimonial.author_name} avatar`}
                            width={50}
                            height={50}
                            className="testimonial-block__author-img"
                          />
                        </div>
                      )}
                      
                      <div className="testimonial-block__author-info">
                        {testimonial.author_name && (
                          <div className="testimonial-block__author-name">
                            {testimonial.author_name}
                          </div>
                        )}
                        
                        {testimonial.author_title && (
                          <div className="testimonial-block__author-title">
                            {testimonial.author_title}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {displayTestimonials.length > 1 && (
              <div className="testimonial-block__navigation">
                <button 
                  className="testimonial-block__nav-btn testimonial-block__nav-prev"
                  onClick={prevSlide}
                  aria-label="Previous testimonial"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button 
                  className="testimonial-block__nav-btn testimonial-block__nav-next"
                  onClick={nextSlide}
                  aria-label="Next testimonial"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}

            {/* Progress indicator */}
            {displayTestimonials.length > 1 && (
              <div className="testimonial-block__progress">
                <div className="testimonial-block__progress-dots">
                  {displayTestimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`testimonial-block__progress-dot ${
                        index === currentSlide ? 'testimonial-block__progress-dot--active' : ''
                      }`}
                      onClick={() => {
                        handleUserInteraction();
                        setCurrentSlide(index);
                      }}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        {(bottom_heading || button_text) && (
          <div className="testimonial-block__footer">
            {bottom_heading && (
              <h3 className="testimonial-block__footer-heading">{bottom_heading}</h3>
            )}
            {button_text && button_link && (
              <a href={button_link} className="testimonial-block__button">
                {button_text}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialBlock;
