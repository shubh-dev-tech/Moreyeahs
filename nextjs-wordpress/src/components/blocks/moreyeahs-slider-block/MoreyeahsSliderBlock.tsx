'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import './styles.scss';

interface Slide {
  image: string;
  subheading?: string;
  heading: string;
  cta_text: string;
  cta_url: string;
}

interface MoreyeahsSliderBlockProps {
  slides?: Slide[];
  data?: {
    slides?: Slide[];
  };
  [key: string]: any;
}

export default function MoreyeahsSliderBlock({ slides: slidesProp, data, ...attrs }: MoreyeahsSliderBlockProps) {
  // Handle different data structures - wrapped in useMemo to prevent recreation
  const slides = useMemo(() => slidesProp || data?.slides || attrs.slides || [], [slidesProp, data?.slides, attrs.slides]);
  
  // Debug logging
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('MoreyeahsSliderBlock props:', { slidesProp, data, attrs, slides });
  }
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (!isAutoplay || !slides || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoplay, slides]);

  if (!slides || slides.length === 0) {
    return null;
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 10000);
  };

  return (
    <article 
      className="moreyeahs-slider-block"
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <div 
        className="moreyeahs-slider-block__wrapper"
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh'
        }}
      >
        {slides.map((slide: Slide, index: number) => (
          <div
            key={index}
            className={`moreyeahs-slider-block__slide${index === currentSlide ? ' moreyeahs-slider-block__slide--active' : ''}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out'
            }}
          >
            {/* Background Image */}
            {slide.image && (
              <div className="moreyeahs-slider-block__image">
                <Image
                  src={slide.image}
                  alt={slide.heading || 'Slide'}
                  fill
                  className="moreyeahs-slider-block__img"
                  priority={index === 0}
                />
              </div>
            )}

            {/* Overlay */}
            <div 
              className="moreyeahs-slider-block__overlay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.4)'
              }}
            />

            {/* Caption */}
            <div 
              className="moreyeahs-slider-block__content"
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                transform: 'translateY(-50%)',
                zIndex: 10
              }}
            >
              <div 
                className="moreyeahs-slider-block__container"
                style={{
                  maxWidth: '1200px',
                  margin: '0 auto',
                  padding: '0 20px'
                }}
              >
                <div className="moreyeahs-slider-block__text-wrapper">
                  {slide.heading && (
                    <div className="moreyeahs-slider-block__heading-wrapper">
                      <h2 
                        className="moreyeahs-slider-block__heading"
                        style={{
                          color: 'white',
                          fontSize: '48px',
                          fontWeight: 'bold',
                          marginBottom: '15px',
                          lineHeight: 1.2
                        }}
                      >
                        {slide.heading}
                      </h2>
                    </div>
                  )}

                  {slide.subheading && (
                    <p 
                      className="moreyeahs-slider-block__subheading"
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 400,
                        marginBottom: '30px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        opacity: 0.9
                      }}
                    >
                      {slide.subheading}
                    </p>
                  )}

                  {slide.cta_text && slide.cta_url && (
                    <a
                      href={slide.cta_url}
                      className="moreyeahs-slider-block__cta"
                      aria-label={`${slide.cta_text} - ${slide.heading}`}
                      style={{
                        display: 'inline-block',
                        padding: '10px 40px',
                        background: 'transparent',
                        color: '#fff',
                        textDecoration: 'none',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        border: '1px solid white',
                        position: 'relative',
                        overflow: 'hidden',
                        zIndex: 1
                      }}
                    >
                      {slide.cta_text}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Navigation */}
      {slides.length > 1 && (
        <div 
          className="moreyeahs-slider-block__dots"
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
            zIndex: 20
          }}
        >
          {slides.map((_: Slide, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`moreyeahs-slider-block__dot${index === currentSlide ? ' moreyeahs-slider-block__dot--active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide}
              style={{
                width: index === currentSlide ? '40px' : '12px',
                height: '12px',
                borderRadius: index === currentSlide ? '6px' : '50%',
                background: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.5)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      )}
    </article>
  );
}

export { MoreyeahsSliderBlock };
