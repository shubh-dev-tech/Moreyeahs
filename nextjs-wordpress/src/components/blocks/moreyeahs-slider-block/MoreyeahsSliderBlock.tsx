'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { transformMediaUrl } from '@/lib/wpFetch';
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
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [slideDirection, setSlideDirection] = useState<string>('left');

  // Random slide directions
  const getRandomDirection = () => {
    const directions = ['left', 'right'];
    return directions[Math.floor(Math.random() * directions.length)];
  };

  useEffect(() => {
    if (!isAutoplay || !slides || slides.length === 0) return;

    const interval = setInterval(() => {
      setSlideDirection(getRandomDirection());
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoplay, slides]);

  if (!slides || slides.length === 0) {
    return null;
  }

  const goToSlide = (index: number) => {
    setSlideDirection(getRandomDirection());
    setCurrentSlide(index);
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 4000);
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
            data-direction={slideDirection}
          >
            {/* Background Image */}
            {slide.image && (
              <div className="moreyeahs-slider-block__image">
                <Image
                  src={transformMediaUrl(slide.image)}
                  alt={slide.heading || 'Slide'}
                  fill
                  className="moreyeahs-slider-block__img"
                  sizes="100vw"
                  quality={85}
                  priority={index === 0}
                />
              </div>
            )}

            {/* Overlay */}
            <div className="moreyeahs-slider-block__overlay" />

            {/* Caption */}
            <div className="moreyeahs-slider-block__content">
              <div className="moreyeahs-slider-block__container">
                <div className="moreyeahs-slider-block__text-wrapper">
                  {slide.heading && (
                    <div className="moreyeahs-slider-block__heading-wrapper">
                      <h2 className="moreyeahs-slider-block__heading">
                        {slide.heading}
                      </h2>
                    </div>
                  )}

                  {slide.subheading && (
                    <p className="moreyeahs-slider-block__subheading">
                      {slide.subheading}
                    </p>
                  )}

                  {slide.cta_text && slide.cta_url && (
                    <a
                      href={slide.cta_url}
                      className="moreyeahs-slider-block__cta"
                      aria-label={`${slide.cta_text} - ${slide.heading}`}
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
        <div className="moreyeahs-slider-block__dots">
          {slides.map((_: Slide, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`moreyeahs-slider-block__dot${index === currentSlide ? ' moreyeahs-slider-block__dot--active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide}
            />
          ))}
        </div>
      )}
    </article>
  );
}

export { MoreyeahsSliderBlock };
