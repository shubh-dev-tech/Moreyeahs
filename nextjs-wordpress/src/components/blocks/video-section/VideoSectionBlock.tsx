'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import './styles.scss';

interface Video {
  video_url: {
    url: string;
    mime_type: string;
  };
  video_thumbnail?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  video_title?: string;
  video_subtitle?: string;
  video_button_text?: string;
  video_button_url?: string;
}

interface VideoSectionData {
  heading?: string;
  sub_heading?: string;
  videos?: Video[];
  button_text?: string;
  button_url?: string;
  background_color?: string;
  background_image?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
}

interface VideoSectionBlockProps {
  data: VideoSectionData;
}

export default function VideoSectionBlock({ data }: VideoSectionBlockProps) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [playingVideos, setPlayingVideos] = useState<Set<number>>(new Set());
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const videos = data?.videos || [];

  // Navigate to specific slide
  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= videos.length) return;
    
    // Pause current video
    const currentVideo = videoRefs.current[currentSlide];
    if (currentVideo) {
      currentVideo.pause();
      currentVideo.currentTime = 0;
    }
    
    setCurrentSlide(index);
    setPlayingVideos(new Set());
  }, [videos.length, currentSlide]);

  // Navigate to next slide
  const nextSlide = useCallback(() => {
    const next = (currentSlide + 1) % videos.length;
    goToSlide(next);
  }, [currentSlide, videos.length, goToSlide]);

  // Navigate to previous slide
  const prevSlide = useCallback(() => {
    const prev = (currentSlide - 1 + videos.length) % videos.length;
    goToSlide(prev);
  }, [currentSlide, videos.length, goToSlide]);

  // Initialize video refs array
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videos.length);
  }, [videos.length]);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (videos.length > 1) {
      autoplayIntervalRef.current = setInterval(() => {
        nextSlide();
      }, 5000);

      return () => {
        if (autoplayIntervalRef.current) {
          clearInterval(autoplayIntervalRef.current);
        }
      };
    }
  }, [currentSlide, videos.length, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (!data?.videos || data.videos.length === 0) {
    return null;
  }

  // Handle play button click
  const handlePlayVideo = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.play();
      setPlayingVideos(prev => new Set(prev).add(index));
    }
  };

  // Toggle play/pause
  const togglePlayPause = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlayingVideos(prev => new Set(prev).add(index));
    } else {
      video.pause();
      setPlayingVideos(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };



  // Build proper inline styles for background
  const sectionStyle: React.CSSProperties = {};
  
  // Background image from ACF (takes priority)
  if (data.background_image?.url) {
    sectionStyle.backgroundImage = `url(${data.background_image.url})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
    sectionStyle.backgroundRepeat = 'no-repeat';
    sectionStyle.backgroundColor = 'transparent';
  }
  // Background color from ACF overrides default gradient
  else if (data.background_color) {
    sectionStyle.backgroundColor = data.background_color;
    sectionStyle.backgroundImage = 'none';
  }

  return (
    <section 
      className="video-section" 
      style={sectionStyle}
    >
      {data.background_image?.url && (
        <div className="video-section__bg-overlay" />
      )}
      
      <div className="video-section__container">
        <div className="video-section__content">
          
          {/* Text Content */}
          <div className="video-section__text-content">
            {data.heading && (
              <h2 className="video-section__heading">{data.heading}</h2>
            )}
            
            {data.sub_heading && (
              <p className="video-section__sub-heading">{data.sub_heading}</p>
            )}
            
            {data.button_text && (
              <div className="video-section__button-wrapper">
                {data.button_url ? (
                  <a 
                    href={data.button_url} 
                    className="video-section__button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.button_text}
                  </a>
                ) : (
                  <button 
                    className="video-section__button video-section__button--play" 
                    onClick={() => handlePlayVideo(currentSlide)}
                  >
                    {data.button_text}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Video Display */}
          <div className="video-section__carousel-wrapper">
            <div className="video-section__carousel">
              {videos.map((video, index) => (
                <div 
                  key={index}
                  className="video-section__slide"
                  style={{ display: index === currentSlide ? 'block' : 'none' }}
                >
                  <div className="video-section__video-container">
                    <video
                      ref={(el) => { videoRefs.current[index] = el; }}
                      className="video-section__video"
                      preload="metadata"
                      muted
                      poster={video.video_thumbnail?.url}
                    >
                      <source src={video.video_url.url} type={video.video_url.mime_type} />
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Play Button Overlay (shows when video not started) */}
                    <div className={`video-section__play-overlay ${playingVideos.has(index) ? 'playing' : ''}`}>
                      <button 
                        className="video-section__play-button" 
                        onClick={() => handlePlayVideo(index)}
                        aria-label="Play video"
                      >
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="30" cy="30" r="30" fill="rgba(255, 255, 255, 0.9)"/>
                          <path d="M25 20L40 30L25 40V20Z" fill="#333"/>
                        </svg>
                      </button>
                    </div>

                    {/* Hover Play/Pause Overlay */}
                    <div 
                      className="video-section__play-pause-overlay"
                      onClick={() => togglePlayPause(index)}
                    >
                      <button 
                        className="video-section__play-pause-button"
                        aria-label={playingVideos.has(index) ? "Pause video" : "Play video"}
                      >
                        {playingVideos.has(index) ? (
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                            <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5v14l11-7L8 5z" fill="currentColor"/>
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Video Title and Subtitle at Bottom */}
                    {(video.video_title || video.video_subtitle) && (
                      <div className="video-section__video-title">
                        {video.video_title && <h3>{video.video_title}</h3>}
                        {video.video_subtitle && (
                          <p className="video-section__video-subtitle">{video.video_subtitle}</p>
                        )}
                      </div>
                    )}

                    {video.video_button_text && (
                      <div className="video-section__video-button-wrapper">
                        {video.video_button_url ? (
                          <a 
                            href={video.video_button_url} 
                            className="video-section__video-button"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {video.video_button_text}
                          </a>
                        ) : (
                          <button 
                            className="video-section__video-button video-section__video-button--play" 
                            onClick={() => handlePlayVideo(index)}
                          >
                            {video.video_button_text}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {videos.length > 1 && (
              <>
                <button 
                  className="video-section__nav video-section__nav--prev" 
                  onClick={prevSlide}
                  aria-label="Previous video"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button 
                  className="video-section__nav video-section__nav--next" 
                  onClick={nextSlide}
                  aria-label="Next video"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}