'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
}

const TestimonialBlock: React.FC<TestimonialBlockProps> = ({
  heading,
  subheading,
  background_image,
  overlay_text,
  testimonials = [],
  bottom_heading,
  button_text,
  button_link,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

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

        {/* Main Content with Background Image and Testimonial */}
        <div className="testimonial-block__main-content">
          {background_image && (
            <div className="testimonial-block__background">
              <Image
                src={background_image.url}
                alt={background_image.alt || 'Background'}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          )}

          {overlay_text && (
            <div className="testimonial-block__overlay-text">{overlay_text}</div>
          )}

          <div className="testimonial-block__slider">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-block__slide"
                style={{ display: index === currentSlide ? 'block' : 'none' }}
              >
                <div className="testimonial-block__quote-label">WHAT OUR PEOPLE SAY</div>

                <div className="testimonial-block__content-wrapper">
                  {testimonial.author_image && (
                    <div className="testimonial-block__image">
                      <Image
                        src={testimonial.author_image.url}
                        alt={testimonial.author_image.alt || 'Author'}
                        width={60}
                        height={60}
                      />
                    </div>
                  )}

                  <div className="testimonial-block__content">
                    {testimonial.quote && (
                      <p className="testimonial-block__quote-heading">
                        &quot;{testimonial.quote}&quot;
                      </p>
                    )}

                    {testimonial.author_name && (
                      <p className="testimonial-block__author">
                        - {testimonial.author_name}
                        {testimonial.author_title && (
                          <span>{testimonial.author_title}</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {testimonials.length > 1 && (
              <div className="testimonial-block__dots">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`testimonial-block__dot ${
                      index === currentSlide ? 'testimonial-block__dot--active' : ''
                    }`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
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
