'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import './styles.scss';

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  title: string;
  sizes: {
    thumbnail: string;
    medium: string;
    large: string;
    full: string;
  };
}

interface ImageGallerySectionProps {
  heading?: string;
  sub_heading?: string;
  gallery_images: GalleryImage[];
  gallery_layout: '3' | '4' | '5' | '6';
  enable_slider: boolean;
  slider_speed?: number;
  autoplay_slider?: boolean;
  background_color?: string;
  text_color?: string;
}

const ImageGallerySection: React.FC<ImageGallerySectionProps> = ({
  heading,
  sub_heading,
  gallery_images = [],
  gallery_layout = '4',
  enable_slider = false,
  slider_speed = 3,
  autoplay_slider = true,
  background_color = '#ffffff',
  text_color = '#333333'
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Generate unique ID for this instance
  const sliderId = `gallery-slider-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    if (!enable_slider || !autoplay_slider || gallery_images.length === 0) return;

    const interval = setInterval(() => {
      moveSlider();
    }, slider_speed * 1000);

    return () => clearInterval(interval);
  }, [enable_slider, autoplay_slider, slider_speed, gallery_images.length]);

  const moveSlider = () => {
    if (isAnimating || !trackRef.current) return;

    setIsAnimating(true);
    const slideWidth = 100 / parseInt(gallery_layout);
    const nextIndex = currentIndex + 1;
    const slideCount = gallery_images.length;

    const translateX = -(nextIndex * slideWidth);
    trackRef.current.style.transition = 'transform 0.5s ease-in-out';
    trackRef.current.style.transform = `translateX(${translateX}%)`;

    setTimeout(() => {
      if (nextIndex >= slideCount) {
        // Reset to beginning
        if (trackRef.current) {
          trackRef.current.style.transition = 'none';
          trackRef.current.style.transform = 'translateX(0%)';
        }
        setCurrentIndex(0);
      } else {
        setCurrentIndex(nextIndex);
      }
      setIsAnimating(false);
    }, 500);
  };

  if (gallery_images.length === 0) {
    return (
      <div className="acf-block-placeholder">
        <div className="acf-block-placeholder-icon">🖼️</div>
        <div className="acf-block-placeholder-text">Image Gallery Section</div>
        <div className="acf-block-placeholder-instructions">Add images to display the gallery</div>
      </div>
    );
  }

  // Duplicate images for infinite loop in slider
  const sliderImages = enable_slider ? [...gallery_images, ...gallery_images] : gallery_images;

  return (
    <section 
      className={`image-gallery-section ${enable_slider ? 'slider-mode' : 'grid-mode'}`}
      style={{ 
        backgroundColor: background_color, 
        color: text_color 
      }}
      data-layout={gallery_layout}
      data-slider={enable_slider}
    >
      <div className="container">
        {(heading || sub_heading) && (
          <div className="gallery-header">
            {heading && (
              <h2 className="gallery-heading">{heading}</h2>
            )}
            
            {sub_heading && (
              <div 
                className="gallery-sub-heading"
                dangerouslySetInnerHTML={{ __html: sub_heading }}
              />
            )}
          </div>
        )}

        <div className="gallery-container">
          {enable_slider ? (
            <div className="gallery-slider" id={sliderId} ref={sliderRef}>
              <div 
                className="gallery-slider-track" 
                ref={trackRef}
                style={{
                  transform: 'translateX(0%)'
                }}
              >
                {sliderImages.map((image, index) => (
                  <div 
                    key={`${image.id}-${index}`} 
                    className="gallery-slide"
                    style={{ minWidth: `${100 / parseInt(gallery_layout)}%` }}
                  >
                    <div className="gallery-image-wrapper">
                      <Image
                        src={image.sizes?.large || image.url}
                        alt={image.alt || image.title || `Gallery image ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes={`(max-width: 768px) 50vw, (max-width: 1024px) 33vw, ${100 / parseInt(gallery_layout)}vw`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`gallery-grid gallery-grid-${gallery_layout}`}>
              {gallery_images.map((image, index) => (
                <div key={image.id} className="gallery-item">
                  <div className="gallery-image-wrapper">
                    <Image
                      src={image.sizes?.large || image.url}
                      alt={image.alt || image.title || `Gallery image ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes={`(max-width: 768px) 50vw, (max-width: 1024px) 33vw, ${100 / parseInt(gallery_layout)}vw`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ImageGallerySection;