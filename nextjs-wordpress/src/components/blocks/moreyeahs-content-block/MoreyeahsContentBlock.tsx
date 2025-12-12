'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import './styles.scss';

interface MoreyeahsContentBlockProps {
  data: {
    heading?: string;
    description?: string;
    image?: {
      id?: number;
      url: string;
      alt?: string;
      width?: number;
      height?: number;
      title?: string;
      caption?: string;
      description?: string;
      mime_type?: string;
    } | number;  // Sometimes WordPress returns just the image ID
    buttonText?: string;
    buttonUrl?: string;
    button_text?: string;  // WordPress field name
    button_url?: string;   // WordPress field name
    reverseLayout?: boolean;
    reverse_layout?: boolean;  // WordPress field name
  };
}

export default function MoreyeahsContentBlock({ data }: MoreyeahsContentBlockProps) {
  // Handle different field name formats from WordPress
  const heading = data?.heading;
  const description = data?.description;
  const buttonText = data?.buttonText || data?.button_text;
  const buttonUrl = data?.buttonUrl || data?.button_url;
  const reverseLayout = data?.reverseLayout || data?.reverse_layout;

  // State for dynamically fetched image
  const [fetchedImage, setFetchedImage] = useState<{ url: string; alt: string; width: number; height: number } | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle image field - with enhanced REST API, it should now be a proper object
  let image: { url: string; alt?: string; width?: number; height?: number } | null = null;
  
  // Effect to fetch image data when we have an image ID
  useEffect(() => {
    if (typeof data?.image === 'number' && !fetchedImage && !isLoadingImage && !imageError) {
      setIsLoadingImage(true);
      setImageError(false);
      
      const wpBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost/moreyeahs-new';
      const imageId = data.image;
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      fetch(`${wpBaseUrl}/wp-json/wp/v2/media/${imageId}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
        .then(response => {
          clearTimeout(timeoutId);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(imageData => {
          if (imageData && (imageData.source_url || imageData.guid?.rendered)) {
            setFetchedImage({
              url: imageData.source_url || imageData.guid?.rendered || '',
              alt: imageData.alt_text || heading || 'Content image',
              width: imageData.media_details?.width || 600,
              height: imageData.media_details?.height || 400
            });
            setImageError(false);
          } else {
            setImageError(true);
          }
        })
        .catch(error => {
          clearTimeout(timeoutId);
          setImageError(true);
          setFetchedImage(null);
          
          // Only log in development mode to avoid console spam
          if (process.env.NODE_ENV === 'development') {
            if (error.name === 'AbortError') {
              console.warn(`Image fetch timeout for ID ${imageId}`);
            } else {
              console.warn(`Failed to fetch image data for ID ${imageId}:`, error.message);
            }
          }
        })
        .finally(() => {
          setIsLoadingImage(false);
        });
    }
  }, [data?.image, fetchedImage, isLoadingImage, heading, imageError]);

  if (typeof data?.image === 'number') {
    // If image is just an ID, use the fetched image data
    image = fetchedImage;
  } else if (data?.image && typeof data.image === 'object' && data.image.url) {
    // If image is a proper object with URL (from enhanced REST API)
    image = {
      url: data.image.url,
      alt: data.image.alt || heading || 'Content image',
      width: data.image.width,
      height: data.image.height
    };
  } else if (data?.image && typeof data.image === 'object') {
    // If image object doesn't have URL, it's not properly formatted
    if (process.env.NODE_ENV === 'development') {
      console.warn('Image object missing URL:', data.image);
    }
    image = null;
  }

  // Return null if no essential content
  if (!heading && !description && !image) {
    return null;
  }

  return (
    <section className={`moreyeahs-content${reverseLayout ? ' moreyeahs-content--reversed' : ''}`}>
      <div className="moreyeahs-content__container">
        
        <div className="moreyeahs-content__wrapper">
          
          <div className="moreyeahs-content__text-content">
            
            {heading && (
              <h2 className="moreyeahs-content__heading">{heading}</h2>
            )}
            
            {description && (
              <div 
                className="moreyeahs-content__description"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
            
            {(buttonText || data?.button_text) && (buttonUrl || data?.button_url) && (
              <div className="moreyeahs-content__cta">
                <a 
                  href={buttonUrl || data?.button_url} 
                  className="moreyeahs-content__button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {buttonText || data?.button_text}
                </a>
              </div>
            )}
            
          </div>
          
          {(image && image.url && !imageError) ? (
            <div className="moreyeahs-content__image-wrapper">
              <div className="moreyeahs-content__image">
                <Image 
                  src={image.url} 
                  alt={image.alt || heading || 'Content image'}
                  width={image.width || 600}
                  height={image.height || 400}
                  loading="lazy"
                  onError={() => {
                    if (process.env.NODE_ENV === 'development') {
                      console.warn('Failed to load image:', image.url);
                    }
                    setImageError(true);
                  }}
                />
              </div>
            </div>
          ) : isLoadingImage ? (
            <div className="moreyeahs-content__image-wrapper">
              <div className="moreyeahs-content__image moreyeahs-content__image--loading">
                <div style={{ 
                  width: '600px', 
                  height: '400px', 
                  backgroundColor: '#f0f0f0', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: '8px',
                  color: '#666'
                }}>
                  Loading image...
                </div>
              </div>
            </div>
          ) : null}
          
        </div>
        
      </div>
    </section>
  );
}