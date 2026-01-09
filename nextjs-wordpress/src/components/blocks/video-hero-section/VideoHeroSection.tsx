'use client';

import React, { useRef, useState, useEffect } from 'react';
import './styles.scss';

interface Video {
  video_title?: string;
  video_source?: 'upload' | 'url' | 'embed';
  video_file?: {
    url: string;
    mime_type?: string;
  };
  video_url?: string;
  video_embed?: string;
  poster_image?: {
    url: string;
    alt?: string;
  };
}

interface SliderSettings {
  autoplay_slider?: boolean;
  slider_speed?: number;
  show_dots?: boolean;
  show_arrows?: boolean;
  pause_on_hover?: boolean;
}

interface BackgroundSettings {
  background_type?: 'color' | 'gradient' | 'image';
  bg_color?: string;
  gradient_start?: string;
  gradient_end?: string;
  gradient_direction?: string;
  bg_image?: {
    url: string;
    alt?: string;
  };
  bg_image_overlay?: string;
}

interface VideoSettings {
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
}

// Removed overlay content interface - no longer needed

interface StylingOptions {
  section_height?: 'auto' | 'viewport' | 'custom';
  custom_height?: number;
  video_aspect_ratio?: string;
  text_color?: string;
  heading_color?: string;
  border_radius?: number;
}

interface CTAButton {
  button_text: string;
  button_url: string;
  button_style?: 'primary' | 'secondary' | 'outline';
  button_color?: string;
}

interface VideoHeroSectionProps {
  main_heading?: string;
  subtitle?: string;
  videos?: Video[];
  slider_settings?: SliderSettings;
  background_settings?: BackgroundSettings;
  video_settings?: VideoSettings;
  styling_options?: StylingOptions;
  cta_buttons?: CTAButton[];
}

const VideoHeroSection: React.FC<VideoHeroSectionProps> = ({
  main_heading = 'Follow Your Heart Rescue!',
  subtitle = 'Pet Supplies & Toy Drive',
  videos = [],
  background_settings = {
    background_type: 'gradient',
    gradient_start: '#667eea',
    gradient_end: '#764ba2',
    gradient_direction: '135deg'
  }
}) => {
  // Ensure we have at least one video
  const videoList = videos && videos.length > 0 ? videos : [{
    video_source: 'url' as const,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }];

  // Generate background styles
  const getBackgroundStyles = (): React.CSSProperties => {
    if (!background_settings) return {};

    switch (background_settings.background_type) {
      case 'color':
        return {
          backgroundColor: background_settings.bg_color || '#667eea'
        };
      case 'gradient':
        return {
          background: `linear-gradient(${background_settings.gradient_direction || '135deg'}, ${background_settings.gradient_start || '#667eea'} 0%, ${background_settings.gradient_end || '#764ba2'} 100%)`
        };
      case 'image':
        return background_settings.bg_image?.url ? {
          backgroundImage: `linear-gradient(${background_settings.bg_image_overlay || 'rgba(0, 0, 0, 0.4)'}, ${background_settings.bg_image_overlay || 'rgba(0, 0, 0, 0.4)'}), url(${background_settings.bg_image.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {};
      default:
        return {
          background: `linear-gradient(135deg, ${background_settings.gradient_start || '#667eea'} 0%, ${background_settings.gradient_end || '#764ba2'} 100%)`
        };
    }
  };

  return (
    <div 
      className="video-hero-section"
      style={{
        ...getBackgroundStyles(),
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1rem',
        overflow: 'hidden',
        minHeight: '100vh'
      }}
    >
      <div style={{ 
        width: '100%', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        position: 'relative', 
        zIndex: 1, 
        textAlign: 'center' 
      }}>
        {/* Header Content Above Video */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 700, 
            margin: '0 0 1rem 0', 
            color: '#ffffff', 
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', 
            lineHeight: 1.2 
          }}>
            {main_heading}
          </h1>
          {subtitle && (
            <p style={{ 
              fontSize: '1.5rem', 
              fontWeight: 400, 
              margin: 0, 
              color: '#ffffff', 
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)', 
              opacity: 0.9 
            }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Video Container */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          aspectRatio: '16/9',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}>
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1&rel=0&modestbranding=1"
            title={main_heading}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoHeroSection;