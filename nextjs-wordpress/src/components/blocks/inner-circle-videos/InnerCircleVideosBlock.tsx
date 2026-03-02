'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { transformMediaUrl } from '@/lib/wordpress';
import { WORDPRESS_BASE_URL } from '@/lib/env';
import './styles.scss';

interface Video {
  name: string;
  title: string;
  thumbnail: {
    url: string;
    alt: string;
    width: number;
    height: number;
    mediaId?: number;
  };
  video_url: string;
}

interface BackgroundImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface InnerCircleVideosBlockProps {
  data: {
    heading?: string;
    subheading?: string;
    videos: Video[];
    background_image?: BackgroundImage;
  };
}

interface VideoData {
  type: 'youtube' | 'vimeo' | 'direct';
  id: string;
  embedUrl: string;
}

const parseVideoUrl = (url: string): VideoData => {
  const videoData: VideoData = {
    type: 'direct',
    id: '',
    embedUrl: url,
  };

  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i
  );
  if (youtubeMatch) {
    videoData.type = 'youtube';
    videoData.id = youtubeMatch[1];
    videoData.embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`;
    return videoData;
  }

  // Vimeo
  const vimeoMatch = url.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/i
  );
  if (vimeoMatch) {
    videoData.type = 'vimeo';
    videoData.id = vimeoMatch[3];
    videoData.embedUrl = `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1`;
    return videoData;
  }

  return videoData;
};

export default function InnerCircleVideosBlock({ data }: InnerCircleVideosBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [videos, setVideos] = useState<Video[]>([]);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<number | null>(null);
  const autoplayLastTimeRef = useRef<number | null>(null);
  const autoplayOffsetRef = useRef(0);
  const activeIndexRef = useRef(0);

  const heading = data?.heading || 'Inner Circle Videos';
  const subheading = data?.subheading || 'Real stories and insights straight from our team.';
  const background_image = data?.background_image;

  // Helper function to parse flattened ACF repeater format
  const parseVideosFromFlat = (rawData: any): Video[] => {
    // If videos is already an array, return it
    if (Array.isArray(rawData?.videos)) {
      return rawData.videos;
    }

    // If no videos count, return empty array
    if (!rawData || !rawData.videos || isNaN(parseInt(rawData.videos))) {
      return [];
    }

    // Parse flattened format: videos_0_name, videos_0_title, etc.
    const videoCount = parseInt(rawData.videos);
    const parsedVideos: Video[] = [];

    for (let i = 0; i < videoCount; i++) {
      const name = rawData[`videos_${i}_name`] || '';
      const title = rawData[`videos_${i}_title`] || '';
      const video_url = rawData[`videos_${i}_video_url`] || '';
      let thumbnail = rawData[`videos_${i}_thumbnail`];

      // Handle thumbnail - could be ID or object
      if (typeof thumbnail === 'number' || (typeof thumbnail === 'string' && /^\d+$/.test(thumbnail))) {
        // It's a WordPress media ID, fetch the image from REST API
        const mediaId = parseInt(String(thumbnail));
        
        // Create a temporary thumbnail object that will be fetched asynchronously
        thumbnail = {
          url: `${WORDPRESS_BASE_URL}/wp-json/wp/v2/media/${mediaId}`,
          alt: name,
          width: 600,
          height: 400,
          mediaId: mediaId,
        };
      } else if (typeof thumbnail === 'object' && thumbnail?.url) {
        // Already expanded - use as is
      } else {
        // Create fallback placeholder
        thumbnail = {
          url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23f0f0f0" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="sans-serif"%3ENo image%3C/text%3E%3C/svg%3E',
          alt: name,
          width: 600,
          height: 400,
        };
      }

      if (name && video_url) {
        parsedVideos.push({
          name,
          title,
          video_url,
          thumbnail: thumbnail as any,
        });
      }
    }

    console.log('Parsed videos from flat format:', parsedVideos);
    return parsedVideos;
  };

  // Initialize videos and fetch media details on mount and when data changes
  useEffect(() => {
    const initializeVideos = async () => {
      const parsedVideos = parseVideosFromFlat(data);
      
      // Check if any videos have media IDs that need fetching
      const hasMediaIds = parsedVideos.some((v) => v.thumbnail?.mediaId);
      
      if (!hasMediaIds) {
        setVideos(parsedVideos);
        return;
      }

      // Fetch media details for videos with media IDs
      try {
        const updatedVideos = await Promise.all(
          parsedVideos.map(async (video) => {
            if (typeof video.thumbnail === 'object' && video.thumbnail.mediaId) {
              try {
                const response = await fetch(video.thumbnail.url);
                const mediaData = await response.json();
                console.log('Fetched media data for', video.name, ':', mediaData);
                
                return {
                  ...video,
                  thumbnail: {
                    url: mediaData.source_url,
                    alt: mediaData.alt_text || video.name,
                    width: mediaData.media_details?.width || 600,
                    height: mediaData.media_details?.height || 400,
                  },
                };
              } catch (error) {
                console.warn('Failed to fetch media details for ID', video.thumbnail.mediaId, error);
                return video;
              }
            }
            return video;
          })
        );
        console.log('Final videos with fetched images:', updatedVideos);
        setVideos(updatedVideos as any);
      } catch (error) {
        console.error('Error fetching media details:', error);
        setVideos(parsedVideos);
      }
    };

    initializeVideos();
  }, [data]);

  // Debug logging
  useEffect(() => {
    console.log('InnerCircleVideosBlock mounted');
    console.log('Data:', data);
    console.log('Videos:', videos);
    console.log('Heading:', heading);
    console.log('Background Image:', background_image);
  }, [data, videos, heading, background_image]);

  // Triple the videos for infinite loop
  const allVideos = videos.length > 0 ? [...videos, ...videos, ...videos] : [];
  const originalCount = videos.length;

  const getSlideWidth = useCallback(() => {
    if (!sliderRef.current) return 0;
    const slide = sliderRef.current.querySelector('.inner-circle-videos__slide') as HTMLElement;
    if (!slide) return 0;
    
    // Get the computed gap from the slider
    const sliderStyles = window.getComputedStyle(sliderRef.current);
    const gap = parseInt(sliderStyles.gap) || 30;
    
    return slide.offsetWidth + gap;
  }, []);

  const updateSliderPosition = useCallback((index: number, animate = true) => {
    if (!sliderRef.current) return;

    const slideWidth = getSlideWidth();
    const offset = -index * slideWidth;
    const slider = sliderRef.current;

    slider.style.transition = animate ? 'transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)' : 'none';
    requestAnimationFrame(() => {
      slider.style.transform = `translate3d(${offset}px, 0, 0)`;
    });

    autoplayOffsetRef.current = offset;
    setPrevTranslate(offset);
    setCurrentTranslate(offset);
    if (originalCount > 0) {
      const newActiveIndex = ((index % originalCount) + originalCount) % originalCount;
      activeIndexRef.current = newActiveIndex;
      setActiveIndex(newActiveIndex);
    }
  }, [getSlideWidth, originalCount]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    updateSliderPosition(index, true);
  }, [updateSliderPosition]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      updateSliderPosition(newIndex, true);

      // Loop back to middle set after animation
      if (originalCount > 0 && newIndex >= originalCount * 2) {
        setTimeout(() => {
          const middleIndex = originalCount;
          setCurrentIndex(middleIndex);
          updateSliderPosition(middleIndex, false);
        }, 550); // Wait for animation to complete
      }

      return newIndex;
    });
  }, [originalCount, updateSliderPosition]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      updateSliderPosition(newIndex, true);

      // Loop back to middle set after animation
      if (originalCount > 0 && newIndex < originalCount) {
        setTimeout(() => {
          const middleIndex = originalCount * 2 - 1;
          setCurrentIndex(middleIndex);
          updateSliderPosition(middleIndex, false);
        }, 550); // Wait for animation to complete
      }

      return newIndex;
    });
  }, [originalCount, updateSliderPosition]);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    if (originalCount === 0) return;

    const speed = 35; // px per second
    const tick = (time: number) => {
      const lastTime = autoplayLastTimeRef.current ?? time;
      const delta = time - lastTime;
      autoplayLastTimeRef.current = time;

      const slideWidth = getSlideWidth();
      const loopWidth = slideWidth * originalCount;

      if (slideWidth > 0 && loopWidth > 0 && sliderRef.current) {
        let nextOffset = autoplayOffsetRef.current - (speed * delta) / 1000;

        if (nextOffset <= -loopWidth * 2) {
          nextOffset += loopWidth;
        }

        autoplayOffsetRef.current = nextOffset;
        sliderRef.current.style.transition = 'none';
        sliderRef.current.style.transform = `translate3d(${nextOffset}px, 0, 0)`;

        const newActiveIndex = Math.round(Math.abs(nextOffset) / slideWidth) % originalCount;
        if (newActiveIndex !== activeIndexRef.current) {
          activeIndexRef.current = newActiveIndex;
          setActiveIndex(newActiveIndex);
        }
      }

      autoplayRef.current = requestAnimationFrame(tick);
    };

    autoplayRef.current = requestAnimationFrame(tick);
  }, [getSlideWidth, originalCount]);

  const stopAutoplay = () => {
    if (autoplayRef.current !== null) {
      cancelAnimationFrame(autoplayRef.current);
      autoplayRef.current = null;
    }
    autoplayLastTimeRef.current = null;
  };

  const handlePlayClick = (videoUrl: string) => {
    const videoData = parseVideoUrl(videoUrl);
    setCurrentVideo(videoData);
    setIsModalOpen(true);
    stopAutoplay();
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentVideo(null);
    startAutoplay();
  }, [startAutoplay]);

  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const pos = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartPos(pos);
    const currentOffset = autoplayOffsetRef.current || (currentIndex !== 0 ? -currentIndex * getSlideWidth() : 0);
    setPrevTranslate(currentOffset);
    setCurrentTranslate(currentOffset);
    autoplayOffsetRef.current = currentOffset;
    stopAutoplay();
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'none';
    }
  }, [currentIndex, getSlideWidth]);

  const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    
    const currentPosition = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newTranslate = prevTranslate + currentPosition - startPos;
    setCurrentTranslate(newTranslate);
    autoplayOffsetRef.current = newTranslate;
    
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translate3d(${newTranslate}px, 0, 0)`;
    }
  }, [isDragging, prevTranslate, startPos]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const movedBy = currentTranslate - prevTranslate;
    const slideWidth = getSlideWidth();
    
    if (Math.abs(movedBy) > slideWidth / 4) {
      if (movedBy > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    } else {
      updateSliderPosition(currentIndex, true);
    }
    
    startAutoplay();
  }, [isDragging, currentTranslate, prevTranslate, currentIndex, prevSlide, nextSlide, updateSliderPosition, startAutoplay, getSlideWidth]);

  useEffect(() => {
    if (videos.length === 0) return;
    
    // Initialize at middle set
    const timer = setTimeout(() => {
      const middleIndex = videos.length; // Start at beginning of middle set
      setCurrentIndex(middleIndex);
      updateSliderPosition(middleIndex, false);
      startAutoplay();
    }, 100);

    const handleResize = () => {
      // Recalculate position on resize
      setTimeout(() => {
        updateSliderPosition(currentIndex, false);
      }, 50);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoplay();
      } else if (!isModalOpen) {
        startAutoplay();
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timer);
      stopAutoplay();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [videos.length, updateSliderPosition, startAutoplay, isModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal]);

  // Ensure autoplay continues after slide changes
  useEffect(() => {
    if (!isModalOpen && !isDragging && videos.length > 0) {
      const timer = setTimeout(() => {
        if (sliderRef.current) {
          startAutoplay();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isModalOpen, isDragging, videos.length, startAutoplay]);

  // Early return after all hooks
  if (!videos || videos.length === 0) {
    console.warn('InnerCircleVideosBlock: No videos provided');
    return (
      <section className="inner-circle-videos">
        <div className="inner-circle-videos__container">
          <div className="inner-circle-videos__header">
            <h2 className="inner-circle-videos__heading">
              {heading.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="inner-circle-videos__heading-highlight">
                {heading.split(' ').slice(-1)}
              </span>
            </h2>
            <p className="inner-circle-videos__subheading">{subheading}</p>
          </div>
          <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px' }}>
            <p style={{ color: '#666', fontSize: '16px' }}>
              No videos configured yet. Please add videos in WordPress admin.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const actualIndex = activeIndex;

  const sectionStyle = background_image?.url
    ? { backgroundImage: `url(${transformMediaUrl(background_image.url)})` }
    : undefined;

  return (
    <section className="inner-circle-videos" style={sectionStyle}>
      <div className="inner-circle-videos__container">
        <div className="inner-circle-videos__header">
          <h2 className="inner-circle-videos__heading">
            {heading.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="inner-circle-videos__heading-highlight">
              {heading.split(' ').slice(-1)}
            </span>
          </h2>
          <p className="inner-circle-videos__subheading">{subheading}</p>
        </div>

        <div className="inner-circle-videos__slider-wrapper">
          <div
            ref={sliderRef}
            className="inner-circle-videos__slider"
            onMouseEnter={stopAutoplay}
            onMouseLeave={() => {
              if (!isModalOpen && !isDragging) {
                startAutoplay();
              }
            }}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onMouseLeave={() => {
              if (isDragging) {
                handleTouchEnd();
                return;
              }
              if (!isModalOpen) {
                startAutoplay();
              }
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDragStart={(e) => e.preventDefault()}
          >
            {allVideos.map((video, index) => {
              const videoData = parseVideoUrl(video.video_url);
              
              return (
                <div key={index} className="inner-circle-videos__slide">
                  <div className="inner-circle-videos__card">
                    <div className="inner-circle-videos__thumbnail">
                      <Image
                        src={transformMediaUrl(video.thumbnail.url)}
                        alt={video.name}
                        width={video.thumbnail.width || 600}
                        height={video.thumbnail.height || 750}
                        loading="lazy"
                      />
                      <div className="inner-circle-videos__info">
                        <h3 className="inner-circle-videos__name">{video.name}</h3>
                        <p className="inner-circle-videos__title">{video.title}</p>
                      </div>
                      <button
                        className="inner-circle-videos__play-btn"
                        onClick={() => handlePlayClick(video.video_url)}
                        aria-label={`Play video of ${video.name}`}
                      >
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 48 48"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="24" cy="24" r="24" fill="white" fillOpacity="0.95" />
                          <path d="M19 16L33 24L19 32V16Z" fill="#1a1a1a" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="inner-circle-videos__pagination">
            {Array.isArray(videos) && videos.map((_, index) => (
              <button
                key={index}
                className={`inner-circle-videos__dot ${index === actualIndex ? 'active' : ''}`}
                onClick={() => {
                  stopAutoplay();
                  goToSlide(originalCount + index);
                  // Restart autoplay after transition completes
                  setTimeout(() => {
                    startAutoplay();
                  }, 650);
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && currentVideo && (
        <div className="inner-circle-videos__modal active">
          <div className="inner-circle-videos__modal-overlay" onClick={closeModal} />
          <div className="inner-circle-videos__modal-content">
            <button
              className="inner-circle-videos__modal-close"
              onClick={closeModal}
              aria-label="Close video"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="inner-circle-videos__modal-video">
              {(currentVideo.type === 'youtube' || currentVideo.type === 'vimeo') && (
                <iframe
                  src={currentVideo.embedUrl}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              {currentVideo.type === 'direct' && (
                <video controls autoPlay>
                  <source src={currentVideo.embedUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
