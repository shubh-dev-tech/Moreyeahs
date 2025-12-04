'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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
    <article className="relative w-full overflow-hidden">
      <div className="relative w-full h-[400px] md:h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            {slide.image && (
              <div className="relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.heading || 'Slide'}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Caption */}
            <div className="absolute inset-0 flex items-center z-10">
              <div className="container mx-auto px-4">
                <div className="w-full sm:w-7/12 md:w-7/12 lg:w-7/12">
                  {slide.heading && (
                    <div className="slide-heading">
                      <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 leading-tight">
                        {slide.heading}
                      </h2>
                    </div>
                  )}

                  {slide.subheading && (
                    <p className="text-white text-base md:text-lg font-normal uppercase tracking-wider mb-6 md:mb-8 opacity-90">
                      {slide.subheading}
                    </p>
                  )}

                  {slide.cta_text && slide.cta_url && (
                    <a
                      href={slide.cta_url}
                      className="inline-block px-8 md:px-12 py-3 md:py-4 bg-white text-black font-semibold uppercase text-sm md:text-base hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1"
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? 'w-10 md:w-12 h-3 bg-white rounded-full'
                  : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide}
            />
          ))}
        </div>
      )}
    </article>
  );
}
