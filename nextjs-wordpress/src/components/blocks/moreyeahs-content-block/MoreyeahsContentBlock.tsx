'use client';

import React, { useState, useEffect } from 'react';
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
  };
}

export default function MoreyeahsContentBlock({ data }: MoreyeahsContentBlockProps) {
  // Handle different field name formats from WordPress
  const heading = data?.heading;
  const description = data?.description;
  const buttonText = data?.buttonText || data?.button_text;
  const buttonUrl = data?.buttonUrl || data?.button_url;

  // State for dynamically fetched image
  const [fetchedImage, setFetchedImage] = useState<{ url: string; alt: string; width: number; height: number } | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  // Handle image field - with enhanced REST API, it should now be a proper object
  let image: { url: string; alt?: string; width?: number; height?: number } | null = null;
  
  // Effect to fetch image data when we have an image ID
  useEffect(() => {
    if (typeof data?.image === 'number' && !fetchedImage && !isLoadingImage) {
      setIsLoadingImage(true);
      
      const wpBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost/moreyeahs-new';
      const imageId = data.image;
      
      fetch(`${wpBaseUrl}/wp-json/wp/v2/media/${imageId}`)
        .then(response => response.json())
        .then(imageData => {
          console.log('Fetched image data:', imageData);
          
          setFetchedImage({
            url: imageData.source_url || imageData.guid?.rendered || '',
            alt: imageData.alt_text || heading || 'Content image',
            width: imageData.media_details?.width || 600,
            height: imageData.media_details?.height || 400
          });
        })
        .catch(error => {
          console.error('Error fetching image data:', error);
        })
        .finally(() => {
          setIsLoadingImage(false);
        });
    }
  }, [data?.image, fetchedImage, isLoadingImage, heading]);

  if (typeof data?.image === 'number') {
    // If image is just an ID, use the fetched image data
    console.log('Image field returned ID, using fetched data:', data.image);
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
    console.warn('Image object missing URL:', data.image);
    image = null;
  }

  // Debug log to check data
  console.log('MoreyeahsContentBlock data:', data);
  console.log('Image URL:', image?.url);

  // Return null if no essential content
  if (!heading && !description && !image) {
    return null;
  }

  return (
    <section className="moreyeahs-content">
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
          
          {image && (
            <div className="moreyeahs-content__image-wrapper">
              <div className="moreyeahs-content__image">
                <img 
                  src={image.url} 
                  alt={image.alt || heading || 'Content image'}
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                />
              </div>
            </div>
          )}
          
        </div>
        
      </div>
    </section>
  );
}