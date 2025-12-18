'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { transformMediaUrl } from '@/lib/wpFetch';
import './styles.scss';

interface Testimonial {
  content_type: 'text' | 'video';
  quote?: string;
  video?: {
    url: string;
    mime_type: string;
  };
  video_thumbnail?: {
    url: string;
    alt: string;
  };
  author_name: string;
  author_title?: string;
  author_company?: string;
  author_image?: {
    url: string;
    alt: string;
  };
}

interface InfinityTestimonialBothSideBlockProps {
  data: {
    show_rating?: boolean;
    rating_text?: string;
    rating_stars?: number;
    heading?: string;
    scroll_direction?: 'left_to_right' | 'right_to_left';
    background_color?: string;
    background_image?: {
      url: string;
      alt: string;
    };
    testimonials?: Testimonial[];
  };
}

const InfinityTestimonialBothSideBlock: React.FC<InfinityTestimonialBothSideBlockProps> = ({ data }) => {
  const {
    show_rating = true,
    rating_text = 'Rated 4/5 by over 1 Lakh users',
    rating_stars = 4,
    heading = 'Words of praise from others about our presence.',
    scroll_direction = 'left_to_right',
    background_color,
    background_image,
    testimonials = [],
  } = data;

  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const positionRef = useRef<number>(0);

  // Sample testimonials if none provided
  const sampleTestimonials: Testimonial[] = [
    {
      content_type: 'text',
      quote: 'Their ability to capture our brand essence in every project is unparalleled - an invaluable creative collaborator.',
      author_name: 'Isabella Rodriguez',
      author_title: 'CEO and Co-founder',
      author_company: 'ABC Company',
    },
    {
      content_type: 'text',
      quote: 'Creative geniuses who listen, understand, and craft captivating visuals - an agency that truly understands our needs.',
      author_name: 'Gabrielle Williams',
      author_title: 'CEO and Co-founder',
      author_company: 'ABC Company',
    },
    {
      content_type: 'text',
      quote: 'Exceeded our expectations with innovative designs that brought our vision to life - a truly remarkable creative agency.',
      author_name: 'Samantha Johnson',
      author_title: 'CEO and Co-founder',
      author_company: 'ABC Company',
    },
    {
      content_type: 'text',
      quote: 'A refreshing and imaginative agency that consistently delivers exceptional results - highly recommended for any project.',
      author_name: 'Victoria Thompson',
      author_title: 'CEO and Co-founder',
      author_company: 'ABC Company',
    },
    {
      content_type: 'text',
      quote: 'Their team\'s artistic flair and strategic approach resulted in remarkable campaigns - a reliable creative partner.',
      author_name: 'John Peter',
      author_title: 'CEO and Co-founder',
      author_company: 'ABC Company',
    },
  ];

  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : sampleTestimonials;
  
  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...displayTestimonials, ...displayTestimonials];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const slideWidth = 370; // 350px width + 20px gap
    const totalWidth = slideWidth * displayTestimonials.length;
    const speed = 0.5; // Always positive speed
    
    // Initialize position based on direction
    if (scroll_direction === 'left_to_right') {
      positionRef.current = -totalWidth; // Start from left (negative position)
    } else {
      positionRef.current = 0; // Start from right (zero position)
    }

    const animate = () => {
      if (scroll_direction === 'left_to_right') {
        positionRef.current += speed; // Move right (positive direction)
        // Reset when we've moved one full set
        if (positionRef.current >= 0) {
          positionRef.current = -totalWidth;
        }
      } else {
        positionRef.current -= speed; // Move left (negative direction)
        // Reset when we've moved one full set
        if (positionRef.current <= -totalWidth) {
          positionRef.current = 0;
        }
      }

      track.style.transform = `translateX(${positionRef.current}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Pause on hover - use slider container for better UX
    const sliderContainer = track.parentElement;
    
    const handleMouseEnter = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const handleMouseLeave = () => {
      animationRef.current = requestAnimationFrame(animate);
    };

    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', handleMouseEnter);
      sliderContainer.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (sliderContainer) {
        sliderContainer.removeEventListener('mouseenter', handleMouseEnter);
        sliderContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [scroll_direction, displayTestimonials.length]);

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < count ? 'filled' : 'empty'}`}
      >
        ★
      </span>
    ));
  };

  // Create dynamic styles for background
  const sectionStyle: React.CSSProperties = {};
  
  if (background_color) {
    sectionStyle.background = background_color;
  }
  
  if (background_image?.url) {
    sectionStyle.backgroundImage = `url(${transformMediaUrl(background_image.url)})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
    sectionStyle.backgroundRepeat = 'no-repeat';
  }

  return (
    <section className="infinity-testimonial-both-side" style={sectionStyle}>
      {background_image?.url && (
        <div className="infinity-testimonial-both-side__bg-overlay"></div>
      )}
      <div className="infinity-testimonial-both-side__container">
        
        {/* Rating Section */}
        {show_rating && (rating_text || rating_stars) && (
          <div className="infinity-testimonial-both-side__rating">
            {rating_stars && (
              <div className="infinity-testimonial-both-side__stars">
                <span className="star-icon">★</span>
                {renderStars(rating_stars)}
              </div>
            )}
            
            {rating_text && (
              <p className="infinity-testimonial-both-side__rating-text">{rating_text}</p>
            )}
          </div>
        )}

        {/* Heading */}
        {heading && (
          <div className="infinity-testimonial-both-side__header">
            <h2 className="infinity-testimonial-both-side__heading">{heading}</h2>
          </div>
        )}

        {/* Infinite Scroll Testimonials */}
        <div className="infinity-testimonial-both-side__slider-container">
          <div className="infinity-testimonial-both-side__slider">
            <div 
              ref={trackRef}
              className="infinity-testimonial-both-side__track"
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <div key={index} className="infinity-testimonial-both-side__slide">
                  <div className="infinity-testimonial-both-side__card">
                    
                    {/* Content based on type */}
                    {testimonial.content_type === 'video' && testimonial.video ? (
                      <div className="infinity-testimonial-both-side__video-container">
                        <video 
                          className="infinity-testimonial-both-side__video"
                          controls
                          preload="metadata"
                          poster={testimonial.video_thumbnail ? transformMediaUrl(testimonial.video_thumbnail.url) : undefined}
                        >
                          <source src={transformMediaUrl(testimonial.video.url)} type={testimonial.video.mime_type} />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      testimonial.quote && (
                        <div className="infinity-testimonial-both-side__quote-container">
                          <div className="infinity-testimonial-both-side__quote-icon">&quot;</div>
                          <p className="infinity-testimonial-both-side__quote">{testimonial.quote}</p>
                        </div>
                      )
                    )}

                    {/* Author Information */}
                    <div className="infinity-testimonial-both-side__author">
                      {testimonial.author_image?.url && (
                        <div className="infinity-testimonial-both-side__author-image">
                          <Image
                            src={transformMediaUrl(testimonial.author_image.url)}
                            alt={testimonial.author_image.alt || testimonial.author_name}
                            width={50}
                            height={50}
                            className="author-img"
                          />
                        </div>
                      )}
                      
                      <div className="infinity-testimonial-both-side__author-info">
                        {testimonial.author_name && (
                          <h4 className="infinity-testimonial-both-side__author-name">
                            {testimonial.author_name}
                          </h4>
                        )}
                        
                        {(testimonial.author_title || testimonial.author_company) && (
                          <p className="infinity-testimonial-both-side__author-details">
                            {testimonial.author_title}
                            {testimonial.author_title && testimonial.author_company && ' at '}
                            {testimonial.author_company}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfinityTestimonialBothSideBlock;