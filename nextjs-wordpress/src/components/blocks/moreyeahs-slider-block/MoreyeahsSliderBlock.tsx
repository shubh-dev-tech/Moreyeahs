'use client';

import { useState, useEffect } from 'react';
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
  slides: Slide[];
}

export default function MoreyeahsSliderBlock({ slides }: MoreyeahsSliderBlockProps) {
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
    <article className="moreyeahs-slider-block">
      <div className="moreyeahs-slider-block__wrapper">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`moreyeahs-slider-block__slide${index === currentSlide ? ' moreyeahs-slider-block__slide--active' : ''}`}
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
          {slides.map((_, index) => (
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
