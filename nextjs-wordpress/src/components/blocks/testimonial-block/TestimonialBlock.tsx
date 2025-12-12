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

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Use provided testimonials or show sample testimonials if none provided
  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : [
    {
      quote: "Working here has been an incredible journey of growth and innovation. The collaborative environment and cutting-edge projects make every day exciting.",
      author_name: "Sarah Johnson",
      author_title: "Senior Developer",
      author_image: null
    },
    {
      quote: "The company culture is amazing. I've learned so much and had the opportunity to work on projects that truly make a difference.",
      author_name: "Michael Chen",
      author_title: "Product Manager",
      author_image: null
    }
  ];

  return (
    <section className="testimonial-block">
      <div className="testimonial-block__container">
        {/* Top Header Section */}
        <div className="testimonial-block__header">
          <h2 className="testimonial-block__heading">{heading || "Careers"}</h2>
          <p className="testimonial-block__subheading">{subheading || "Every team member is the navigator of our clients' digital transformation"}</p>
        </div>

        {/* Main Content with Background Image and Testimonial */}
        <div className="testimonial-block__main-content">
          {background_image?.url && (
            <div className="testimonial-block__background">
              <Image
                src={background_image.url}
                alt={background_image.alt || 'Background'}
                fill
                className="testimonial-block__bg-img"
                sizes="100vw"
                quality={85}
                priority
              />
            </div>
          )}

          <div className="testimonial-block__overlay-text">{overlay_text || "Life at Our Company"}</div>

          <div className="testimonial-block__slider">
            {displayTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-block__slide"
                style={{ display: index === currentSlide ? 'block' : 'none' }}
              >
                <div className="testimonial-block__quote-label">WHAT OUR PEOPLE SAY</div>

                <div className="testimonial-block__content-wrapper">
                  {testimonial.author_image?.url && (
                    <div className="testimonial-block__image">
                      <Image
                        src={testimonial.author_image.url}
                        alt={testimonial.author_image.alt || `${testimonial.author_name} avatar`}
                        width={60}
                        height={60}
                        className="testimonial-block__author-img"
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

            {displayTestimonials.length > 1 && (
              <div className="testimonial-block__dots">
                {displayTestimonials.map((_, index) => (
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
        <div className="testimonial-block__footer">
          <h3 className="testimonial-block__footer-heading">{bottom_heading || "Find opportunities right for you"}</h3>
          <a href={button_link || "#careers"} className="testimonial-block__button">
            {button_text || "EXPLORE CAREERS"}
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialBlock;
