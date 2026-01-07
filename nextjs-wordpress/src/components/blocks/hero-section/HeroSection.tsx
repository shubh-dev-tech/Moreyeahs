'use client';

import React from 'react';
import Image from 'next/image';
import './styles.scss';

interface HeroImage {
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

interface HeroSectionProps {
  data?: {
    heading?: string;
    sub_heading?: string;
    hero_image?: HeroImage | number;
    layout_settings?: {
      reverse_layout?: boolean;
      image_position?: 'left' | 'right';
      content_alignment?: 'left' | 'center' | 'right';
    };
    height_settings?: {
      section_height?: 'auto' | 'small' | 'medium' | 'large' | 'full';
    };
    color_settings?: {
      background_color?: string;
      background_image?: HeroImage | number;
      background_overlay?: number;
      heading_color?: string;
      sub_heading_color?: string;
    };
  };
  // Also support individual props for compatibility
  heading?: string;
  sub_heading?: string;
  hero_image?: HeroImage | number;
  reverse_layout?: boolean;
  background_color?: string;
  background_image?: HeroImage | number;
  background_overlay?: number;
  section_height?: 'auto' | 'small' | 'medium' | 'large' | 'full';
  heading_color?: string;
  sub_heading_color?: string;
  content_alignment?: 'left' | 'center' | 'right';
  image_position?: 'left' | 'right';
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  data,
  // Individual props as fallback
  heading: propHeading,
  sub_heading: propSubHeading,
  hero_image: propHeroImage,
  reverse_layout: propReverseLayout,
  background_color: propBackgroundColor,
  background_image: propBackgroundImage,
  background_overlay: propBackgroundOverlay,
  section_height: propSectionHeight,
  heading_color: propHeadingColor,
  sub_heading_color: propSubHeadingColor,
  content_alignment: propContentAlignment,
  image_position: propImagePosition
}) => {
  // Use data prop first, then fall back to individual props
  const {
    heading = propHeading,
    sub_heading = propSubHeading,
    hero_image = propHeroImage,
    layout_settings,
    height_settings,
    color_settings
  } = data || {};

  // Extract nested settings with fallbacks
  const reverse_layout = layout_settings?.reverse_layout ?? propReverseLayout ?? false;
  const image_position = layout_settings?.image_position ?? propImagePosition ?? 'right';
  const content_alignment = layout_settings?.content_alignment ?? propContentAlignment ?? 'left';
  const section_height = height_settings?.section_height ?? propSectionHeight ?? 'medium';
  const background_color = color_settings?.background_color ?? propBackgroundColor ?? '#f8f9fa';
  const background_image = color_settings?.background_image ?? propBackgroundImage;
  const background_overlay = color_settings?.background_overlay ?? propBackgroundOverlay ?? 50;
  const heading_color = color_settings?.heading_color ?? propHeadingColor ?? '#333333';
  const sub_heading_color = color_settings?.sub_heading_color ?? propSubHeadingColor ?? '#666666';

  // Process hero image to ensure it has proper URL
  const [processedImage, setProcessedImage] = React.useState<HeroImage | null>(null);
  const [processedBackgroundImage, setProcessedBackgroundImage] = React.useState<HeroImage | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Function to fetch image data from WordPress REST API if we only have ID
  const fetchImageData = React.useCallback(async (imageId: number): Promise<HeroImage | null> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost';
      const response = await fetch(`${baseUrl}/wp-json/wp/v2/media/${imageId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image ${imageId}`);
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
  const getImageUrl = (image: any, size: string = 'large') => {
    // If image is just a number (ID), try to construct the WordPress media URL
    if (typeof image === 'number' || (typeof image === 'string' && /^\d+$/.test(image))) {
      const imageId = typeof image === 'string' ? parseInt(image) : image;
      console.warn('⚠️ Image is still just an ID:', imageId, 'this should have been processed by WordPress');
      
      // For now, return a placeholder that shows the ID for debugging
      return `https://via.placeholder.com/800x400/ff6b6b/ffffff?text=ID+${imageId}`;
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
    return `https://via.placeholder.com/800x400/cccccc/666666?text=Missing+Image`;
  };

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🦸 HeroSection Debug:', {
      dataReceived: !!data,
      dataKeys: data ? Object.keys(data) : [],
      heroImageRaw: data?.hero_image,
      backgroundImageRaw: background_image,
      heroImageType: typeof hero_image,
      backgroundImageType: typeof background_image,
      processedImage,
      processedBackgroundImage,
      isProcessing,
      heading,
      reverse_layout,
      section_height,
      background_overlay
    });
  }

  React.useEffect(() => {
    const processImages = async () => {
      if (!hero_image && !background_image) {
        console.log('❌ No hero or background images provided');
        setProcessedImage(null);
        setProcessedBackgroundImage(null);
        setIsProcessing(false);
        return;
      }

      console.log('🔧 Processing images from WordPress:', { hero_image, background_image });
      setIsProcessing(true);

      // Process hero image
      if (hero_image) {
        // If image is already a complete object with URL and sizes, use it
        if (hero_image && typeof hero_image === 'object' && hero_image.url && hero_image.sizes) {
          setProcessedImage(hero_image as HeroImage);
        } else {
          // If image is just an ID, try to fetch the full data
          if (typeof hero_image === 'number' || (typeof hero_image === 'string' && /^\d+$/.test(hero_image))) {
            const imageId = typeof hero_image === 'string' ? parseInt(hero_image) : hero_image;
            console.log(`🔄 Fetching data for hero image ID: ${imageId}`);
            
            const imageData = await fetchImageData(imageId);
            if (imageData) {
              setProcessedImage(imageData);
            } else {
              // Create a fallback image object
              setProcessedImage({
                id: imageId,
                url: `https://via.placeholder.com/800x400/ff6b6b/ffffff?text=Error+ID+${imageId}`,
                alt: `Hero Image ${imageId}`,
                title: `Hero Image ${imageId}`,
                sizes: {
                  thumbnail: `https://via.placeholder.com/150x150/ff6b6b/ffffff?text=Error+ID+${imageId}`,
                  medium: `https://via.placeholder.com/400x200/ff6b6b/ffffff?text=Error+ID+${imageId}`,
                  large: `https://via.placeholder.com/800x400/ff6b6b/ffffff?text=Error+ID+${imageId}`,
                  full: `https://via.placeholder.com/1200x600/ff6b6b/ffffff?text=Error+ID+${imageId}`
                }
              });
            }
          } else if (hero_image && typeof hero_image === 'object' && ((hero_image as any).ID || (hero_image as any).id)) {
            const imageId = (hero_image as any).ID || (hero_image as any).id;
            const imageData = await fetchImageData(imageId);
            if (imageData) {
              setProcessedImage(imageData);
            }
          } else {
            console.warn('⚠️ Unrecognized hero image format:', hero_image);
            setProcessedImage(null);
          }
        }
      } else {
        setProcessedImage(null);
      }

      // Process background image
      if (background_image) {
        // If image is already a complete object with URL and sizes, use it
        if (background_image && typeof background_image === 'object' && background_image.url && background_image.sizes) {
          setProcessedBackgroundImage(background_image as HeroImage);
        } else {
          // If image is just an ID, try to fetch the full data
          if (typeof background_image === 'number' || (typeof background_image === 'string' && /^\d+$/.test(background_image))) {
            const imageId = typeof background_image === 'string' ? parseInt(background_image) : background_image;
            console.log(`🔄 Fetching data for background image ID: ${imageId}`);
            
            const imageData = await fetchImageData(imageId);
            if (imageData) {
              setProcessedBackgroundImage(imageData);
            } else {
              // Create a fallback image object
              setProcessedBackgroundImage({
                id: imageId,
                url: `https://via.placeholder.com/1200x600/cccccc/666666?text=BG+Error+ID+${imageId}`,
                alt: `Background Image ${imageId}`,
                title: `Background Image ${imageId}`,
                sizes: {
                  thumbnail: `https://via.placeholder.com/150x150/cccccc/666666?text=BG+Error+ID+${imageId}`,
                  medium: `https://via.placeholder.com/600x300/cccccc/666666?text=BG+Error+ID+${imageId}`,
                  large: `https://via.placeholder.com/1200x600/cccccc/666666?text=BG+Error+ID+${imageId}`,
                  full: `https://via.placeholder.com/1600x800/cccccc/666666?text=BG+Error+ID+${imageId}`
                }
              });
            }
          } else if (background_image && typeof background_image === 'object' && ((background_image as any).ID || (background_image as any).id)) {
            const imageId = (background_image as any).ID || (background_image as any).id;
            const imageData = await fetchImageData(imageId);
            if (imageData) {
              setProcessedBackgroundImage(imageData);
            }
          } else {
            console.warn('⚠️ Unrecognized background image format:', background_image);
            setProcessedBackgroundImage(null);
          }
        }
      } else {
        setProcessedBackgroundImage(null);
      }

      setIsProcessing(false);
    };

    processImages();
  }, [hero_image, background_image, fetchImageData]);

  // Get height class based on section_height setting
  const getHeightClass = () => {
    switch (section_height) {
      case 'small': return 'hero-height-small';
      case 'medium': return 'hero-height-medium';
      case 'large': return 'hero-height-large';
      case 'full': return 'hero-height-full';
      default: return 'hero-height-auto';
    }
  };

  // Determine layout classes
  const layoutClass = reverse_layout ? 'hero-reverse' : 'hero-normal';
  const imagePositionClass = image_position === 'left' ? 'hero-image-left' : 'hero-image-right';
  const contentAlignClass = `hero-content-${content_alignment}`;

  if (isProcessing) {
    return (
      <div className="acf-block-placeholder">
        <div className="acf-block-placeholder-icon">🦸</div>
        <div className="acf-block-placeholder-text">Hero Section</div>
        <div className="acf-block-placeholder-instructions">Loading hero image...</div>
      </div>
    );
  }

  if (!heading && !sub_heading && !processedImage && !processedBackgroundImage) {
    return (
      <div className="acf-block-placeholder">
        <div className="acf-block-placeholder-icon">🦸</div>
        <div className="acf-block-placeholder-text">Hero Section</div>
        <div className="acf-block-placeholder-instructions">Add heading, content, hero image, or background image to display the hero section</div>
      </div>
    );
  }

  // Build section styles
  const sectionStyles: React.CSSProperties = {
    backgroundColor: background_color
  };

  if (processedBackgroundImage) {
    const bgImageUrl = getImageUrl(processedBackgroundImage, 'large');
    sectionStyles.backgroundImage = `url(${bgImageUrl})`;
    sectionStyles.backgroundSize = 'cover';
    sectionStyles.backgroundPosition = 'center';
    sectionStyles.backgroundRepeat = 'no-repeat';
  }

  return (
    <section 
      className={`hero-section-block ${getHeightClass()} ${layoutClass} ${imagePositionClass} ${contentAlignClass}`}
      style={sectionStyles}
      data-height={section_height}
      data-reverse={reverse_layout}
      data-image-position={image_position}
      data-content-align={content_alignment}
      data-has-bg-image={!!processedBackgroundImage}
    >
      {processedBackgroundImage && background_overlay > 0 && (
        <div 
          className="hero-background-overlay" 
          style={{ opacity: background_overlay / 100 }}
        />
      )}
      
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text-content">
            {heading && (
              <h1 
                className="hero-heading"
                style={{ color: heading_color }}
              >
                {heading}
              </h1>
            )}
            
            {sub_heading && (
              <div 
                className="hero-sub-heading"
                style={{ color: sub_heading_color }}
                dangerouslySetInnerHTML={{ __html: sub_heading }}
              />
            )}
          </div>
        </div>

        {processedImage && (
          <div className="hero-image">
            <div className="hero-image-wrapper">
              <Image
                src={getImageUrl(processedImage, 'large')}
                alt={processedImage.alt || processedImage.title || 'Hero Image'}
                fill
                style={{ 
                  objectFit: 'cover'
                }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;