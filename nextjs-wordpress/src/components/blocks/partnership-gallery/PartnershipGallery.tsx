'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
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

interface PartnershipGalleryProps {
  data?: {
    heading?: string;
    sub_heading?: string;
    gallery_images?: GalleryImage[];
    layout_type?: 'grid' | 'slider';
    columns_count?: '3' | '4' | '5' | '6';
    enable_slider?: boolean;
    slider_speed?: number;
    autoplay_slider?: boolean;
    slider_direction?: 'left' | 'right';
    image_style?: 'contain' | 'cover' | 'fill';
    image_hover_effect?: 'scale' | 'fade' | 'rotate' | 'none';
    background_color?: string;
    text_color?: string;
  };
  // Also support individual props for compatibility
  heading?: string;
  sub_heading?: string;
  gallery_images?: GalleryImage[];
  layout_type?: 'grid' | 'slider';
  columns_count?: '3' | '4' | '5' | '6';
  enable_slider?: boolean;
  slider_speed?: number;
  autoplay_slider?: boolean;
  slider_direction?: 'left' | 'right';
  image_style?: 'contain' | 'cover' | 'fill';
  image_hover_effect?: 'scale' | 'fade' | 'rotate' | 'none';
  background_color?: string;
  text_color?: string;
}

const PartnershipGallery: React.FC<PartnershipGalleryProps> = ({ 
  data,
  // Individual props as fallback
  heading: propHeading,
  sub_heading: propSubHeading,
  gallery_images: propGalleryImages,
  layout_type: propLayoutType,
  columns_count: propColumnsCount,
  enable_slider: propEnableSlider,
  slider_speed: propSliderSpeed,
  autoplay_slider: propAutoplaySlider,
  slider_direction: propSliderDirection,
  image_style: propImageStyle,
  image_hover_effect: propImageHoverEffect,
  background_color: propBackgroundColor,
  text_color: propTextColor
}) => {
  // Use data prop first, then fall back to individual props
  const {
    heading = propHeading,
    sub_heading = propSubHeading,
    gallery_images = propGalleryImages || [],
    layout_type = propLayoutType || 'grid',
    columns_count = propColumnsCount || '4',
    enable_slider = propEnableSlider || false,
    slider_speed = propSliderSpeed || 3,
    autoplay_slider = propAutoplaySlider !== undefined ? propAutoplaySlider : true,
    slider_direction = propSliderDirection || 'left',
    image_style = propImageStyle || 'contain',
    image_hover_effect = propImageHoverEffect || 'scale',
    background_color = propBackgroundColor || '#f8f9fa',
    text_color = propTextColor || '#333333'
  } = data || {};

  // Process gallery images to ensure they have proper URLs
  const [processedImages, setProcessedImages] = React.useState<GalleryImage[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Function to process gallery images via WordPress REST API
  const processGalleryImages = React.useCallback(async (imageIds: number[]): Promise<GalleryImage[]> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://dev.moreyeahs.com';
      const response = await fetch(`${baseUrl}/wp-json/wp/v2/process-gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_ids: imageIds
        })
      });
      
      if (!response.ok) {
        console.error(`Failed to process gallery images: ${response.status} ${response.statusText}`);
        return [];
      }
      
      const result = await response.json();
      
      if (result.success && result.images) {
        console.log('✅ Successfully processed gallery images via REST API:', result.images);
        return result.images;
      }
      
      return [];
    } catch (error) {
      console.error('Failed to process gallery images via REST API:', error);
      return [];
    }
  }, []);

  // Function to fetch image data from WordPress REST API if we only have IDs
  const fetchImageData = React.useCallback(async (imageId: number): Promise<GalleryImage | null> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost';
      
      // First try to get the image from WordPress media endpoint
      const response = await fetch(`${baseUrl}/wp-json/wp/v2/media/${imageId}`);
      
      if (!response.ok) {
        console.error(`Failed to fetch image ${imageId}: ${response.status} ${response.statusText}`);
        
        // If the media endpoint fails, try to construct a basic image object
        // This is a fallback for when WordPress media is not accessible
        const fallbackUrl = `${baseUrl}/wp-content/uploads/`;
        return {
          id: imageId,
          url: `${fallbackUrl}image-${imageId}.jpg`, // This won't work but prevents crashes
          alt: `Image ${imageId}`,
          title: `Image ${imageId}`,
          sizes: {
            thumbnail: `${fallbackUrl}image-${imageId}-150x150.jpg`,
            medium: `${fallbackUrl}image-${imageId}-300x300.jpg`,
            large: `${fallbackUrl}image-${imageId}-1024x1024.jpg`,
            full: `${fallbackUrl}image-${imageId}.jpg`
          }
        };
      }
      
      const imageData = await response.json();
      
      return {
        id: imageData.id,
        url: imageData.source_url,
        alt: imageData.alt_text || imageData.title?.rendered || '',
        title: imageData.title?.rendered || '',
        sizes: {
          thumbnail: imageData.media_details?.sizes?.thumbnail?.source_url || imageData.source_url,
          medium: imageData.media_details?.sizes?.medium?.source_url || imageData.source_url,
          large: imageData.media_details?.sizes?.large?.source_url || imageData.source_url,
          full: imageData.source_url
        }
      };
    } catch (error) {
      console.error('Failed to fetch image data for ID:', imageId, error);
      return null;
    }
  }, []);

  // Helper function to get image URL with multiple fallbacks
  const getImageUrl = (image: any, size: string = 'medium') => {
    // If image is just a number (ID), try to construct the WordPress media URL
    if (typeof image === 'number' || (typeof image === 'string' && /^\d+$/.test(image))) {
      const imageId = typeof image === 'string' ? parseInt(image) : image;
      console.warn('⚠️ Image is still just an ID:', imageId, 'constructing direct URL');
      
      // Try to construct a direct WordPress media URL
      const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://dev.moreyeahs.com';
      const directUrl = `${baseUrl}/wp-content/uploads/`;
      
      // This is a fallback - we don't know the actual filename, so we'll show a placeholder
      // but with a more helpful message
      return `https://via.placeholder.com/300x150/ff6b6b/ffffff?text=Image+ID+${imageId}+Not+Processed`;
    }
    
    // Try different possible structures for processed images
    if (image?.sizes?.[size]) {
      return image.sizes[size];
    }
    if (image?.sizes?.large) {
      return image.sizes.large;
    }
    if (image?.sizes?.medium) {
      return image.sizes.medium;
    }
    if (image?.sizes?.full) {
      return image.sizes.full;
    }
    if (image?.url) {
      return image.url;
    }
    if (image?.src) {
      return image.src;
    }
    if (typeof image === 'string' && image.startsWith('http')) {
      return image;
    }
    
    console.error('❌ Could not extract image URL from:', image);
    return `https://via.placeholder.com/300x150/cccccc/666666?text=Missing+Image`;
  };

  // Debug logging removed for production

  React.useEffect(() => {
    const processImages = async () => {
      if (!gallery_images || gallery_images.length === 0) {
        console.log('No gallery images provided');
        setProcessedImages([]);
        setIsProcessing(false);
        return;
      }

      console.log('🔍 Starting image processing with:', {
        count: gallery_images.length,
        firstImage: gallery_images[0],
        allImages: gallery_images
      });

      setIsProcessing(true);

      // Check if all images are just IDs - if so, try batch processing first
      const allImageIds = gallery_images.every(img => 
        typeof img === 'number' || (typeof img === 'string' && /^\d+$/.test(img))
      );

      if (allImageIds) {
        console.log('🔄 All images are IDs, trying batch processing...');
        const imageIds = gallery_images.map(img => 
          typeof img === 'string' ? parseInt(img) : img
        );
        
        const batchProcessed = await processGalleryImages(imageIds);
        if (batchProcessed.length > 0) {
          console.log('✅ Batch processing successful!');
          setProcessedImages(batchProcessed);
          setIsProcessing(false);
          return;
        }
        
        console.log('⚠️ Batch processing failed, falling back to individual processing...');
      }

      // Fallback to individual processing
      const processed: GalleryImage[] = [];

      for (let i = 0; i < gallery_images.length; i++) {
        const img = gallery_images[i];
        
        console.log(`Processing image ${i}:`, {
          type: typeof img,
          value: img,
          isNumeric: typeof img === 'number' || (typeof img === 'string' && /^\d+$/.test(img)),
          hasUrl: img?.url ? 'YES' : 'NO',
          hasSizes: img?.sizes ? 'YES' : 'NO',
          keys: typeof img === 'object' ? Object.keys(img) : 'not object'
        });

        // If image is already a complete object with URL and sizes, use it
        if (img && typeof img === 'object' && img.url && img.sizes) {
          console.log(`✅ Image ${i} already processed, using as-is`);
          processed.push(img as GalleryImage);
          continue;
        }

        // If image is just an ID, try to fetch the full data
        if (typeof img === 'number' || (typeof img === 'string' && /^\d+$/.test(img))) {
          const imageId = typeof img === 'string' ? parseInt(img) : img;
          console.log(`🔄 Fetching data for image ID: ${imageId}`);
          
          const imageData = await fetchImageData(imageId);
          if (imageData) {
            console.log(`✅ Successfully fetched data for image ID ${imageId}:`, imageData);
            processed.push(imageData);
          } else {
            console.log(`❌ Failed to fetch data for image ID ${imageId}, creating fallback`);
            // Create a fallback image object
            processed.push({
              id: imageId,
              url: `https://via.placeholder.com/300x150/ff6b6b/ffffff?text=Error+ID+${imageId}`,
              alt: `Image ${imageId}`,
              title: `Image ${imageId}`,
              sizes: {
                thumbnail: `https://via.placeholder.com/150x150/ff6b6b/ffffff?text=Error+ID+${imageId}`,
                medium: `https://via.placeholder.com/300x150/ff6b6b/ffffff?text=Error+ID+${imageId}`,
                large: `https://via.placeholder.com/600x300/ff6b6b/ffffff?text=Error+ID+${imageId}`,
                full: `https://via.placeholder.com/800x400/ff6b6b/ffffff?text=Error+ID+${imageId}`
              }
            });
          }
          continue;
        }

        // If image has an ID property, try to use that
        if (img && typeof img === 'object' && ((img as any).ID || (img as any).id)) {
          const imageId = (img as any).ID || (img as any).id;
          console.log(`🔄 Processing image with ID property: ${imageId}`);
          const imageData = await fetchImageData(imageId);
          if (imageData) {
            console.log(`✅ Successfully processed image with ID ${imageId}`);
            processed.push(imageData);
          }
          continue;
        }

        console.warn('⚠️ Unrecognized image format:', img);
      }

      console.log('🏁 Image processing complete:', {
        originalCount: gallery_images.length,
        processedCount: processed.length,
        processed: processed
      });

      setProcessedImages(processed);
      setIsProcessing(false);
    };

    processImages();
  }, [gallery_images, fetchImageData, processGalleryImages]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Generate unique ID for this instance
  const sliderId = `partnership-slider-${Math.random().toString(36).substring(2, 11)}`;

  // Handle visibility change (pause when tab is not visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const moveSlider = useCallback(() => {
    if (isAnimating || !trackRef.current) return;

    setIsAnimating(true);
    const slideWidth = 100 / parseInt(columns_count);
    const slideCount = processedImages.length; // Use processedImages instead of gallery_images

    if (slider_direction === 'right') {
      // Right to left movement
      const nextIndex = currentIndex - 1;
      
      if (nextIndex < 0) {
        // Jump to end without animation, then animate to previous
        trackRef.current.style.transition = 'none';
        trackRef.current.style.transform = `translateX(-${slideCount * slideWidth}%)`;
        setCurrentIndex(slideCount - 1);
        
        setTimeout(() => {
          if (trackRef.current) {
            trackRef.current.style.transition = 'transform 0.8s ease-in-out';
            const translateX = -((slideCount - 2) * slideWidth);
            trackRef.current.style.transform = `translateX(${translateX}%)`;
            setCurrentIndex(slideCount - 2);
          }
        }, 50);
      } else {
        const translateX = -(nextIndex * slideWidth);
        trackRef.current.style.transition = 'transform 0.8s ease-in-out';
        trackRef.current.style.transform = `translateX(${translateX}%)`;
        setCurrentIndex(nextIndex);
      }
    } else {
      // Left to right movement (default)
      const nextIndex = currentIndex + 1;
      const translateX = -(nextIndex * slideWidth);
      
      trackRef.current.style.transition = 'transform 0.8s ease-in-out';
      trackRef.current.style.transform = `translateX(${translateX}%)`;

      if (nextIndex >= slideCount) {
        // Reset to beginning after animation
        setTimeout(() => {
          if (trackRef.current) {
            trackRef.current.style.transition = 'none';
            trackRef.current.style.transform = 'translateX(0%)';
            setCurrentIndex(0);
          }
        }, 800);
      } else {
        setCurrentIndex(nextIndex);
      }
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  }, [isAnimating, columns_count, processedImages.length, slider_direction, currentIndex]); // Updated dependencies

  useEffect(() => {
    if (!enable_slider || !autoplay_slider || processedImages.length === 0 || layout_type !== 'slider' || isPaused) return;

    const interval = setInterval(() => {
      moveSlider();
    }, slider_speed * 1000);

    return () => clearInterval(interval);
  }, [enable_slider, autoplay_slider, slider_speed, processedImages.length, layout_type, isPaused, moveSlider]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  if (isProcessing) {
    return (
      <div className="acf-block-placeholder">
        <div className="acf-block-placeholder-icon">🤝</div>
        <div className="acf-block-placeholder-text">Partnership Gallery</div>
        <div className="acf-block-placeholder-instructions">Loading gallery images...</div>
      </div>
    );
  }

  if (processedImages.length === 0) {
    return (
      <div className="acf-block-placeholder">
        <div className="acf-block-placeholder-icon">🤝</div>
        <div className="acf-block-placeholder-text">Partnership Gallery</div>
        <div className="acf-block-placeholder-instructions">Add images to display the partnership gallery</div>
      </div>
    );
  }

  // Use processed images for rendering
  const imagesToRender = processedImages;

  // Duplicate images for infinite loop in slider
  const sliderImages = (layout_type === 'slider' && enable_slider) ? [...imagesToRender, ...imagesToRender] : imagesToRender;

  return (
    <section 
      className={`partnership-gallery-block ${layout_type === 'slider' && enable_slider ? 'slider-mode' : 'grid-mode'}`}
      style={{ 
        backgroundColor: background_color, 
        color: text_color 
      }}
      data-layout={layout_type}
      data-columns={columns_count}
      data-slider={enable_slider}
      data-direction={slider_direction}
    >
      <div className="container">
        {(heading || sub_heading) && (
          <div className="partnership-header">
            {heading && (
              <h2 className="partnership-heading">{heading}</h2>
            )}
            
            {sub_heading && (
              <div 
                className="partnership-sub-heading"
                dangerouslySetInnerHTML={{ __html: sub_heading }}
              />
            )}
          </div>
        )}

        <div className="partnership-container">
          {layout_type === 'slider' && enable_slider ? (
            <div 
              className="partnership-slider" 
              id={sliderId} 
              ref={sliderRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div 
                className="partnership-slider-track" 
                ref={trackRef}
                style={{
                  transform: 'translateX(0%)'
                }}
              >
                {sliderImages.map((image, index) => (
                  <div 
                    key={`${image.id}-${index}`} 
                    className="partnership-slide"
                    style={{ minWidth: `${100 / parseInt(columns_count)}%` }}
                  >
                    <div 
                      className="partnership-image-wrapper"
                      data-style={image_style}
                      data-hover={image_hover_effect}
                    >
                      <Image
                        src={getImageUrl(image, 'medium')}
                        alt={image.alt || image.title || `Partnership ${index + 1}`}
                        fill
                        style={{ 
                          objectFit: image_style === 'contain' ? 'contain' : 
                                   image_style === 'cover' ? 'cover' : 'fill'
                        }}
                        sizes={`(max-width: 768px) 50vw, (max-width: 1024px) 33vw, ${100 / parseInt(columns_count)}vw`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`partnership-grid partnership-grid-${columns_count}`}>
              {imagesToRender.map((image, index) => (
                <div key={image.id} className="partnership-item">
                  <div 
                    className="partnership-image-wrapper"
                    data-style={image_style}
                    data-hover={image_hover_effect}
                  >
                    <Image
                      src={getImageUrl(image, 'medium')}
                      alt={image.alt || image.title || `Partnership ${index + 1}`}
                      fill
                      style={{ 
                        objectFit: image_style === 'contain' ? 'contain' : 
                                 image_style === 'cover' ? 'cover' : 'fill'
                      }}
                      sizes={`(max-width: 768px) 50vw, (max-width: 1024px) 33vw, ${100 / parseInt(columns_count)}vw`}
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

export default PartnershipGallery;