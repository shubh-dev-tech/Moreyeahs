'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { fetchWordPressAPI } from '@/lib/wordpress';
import { CLIENT_WORDPRESS_API_URL } from '@/lib/client-env';
import './styles.scss';



interface Post {
  id: number;
  title?: {
    rendered?: string;
  };
  excerpt?: {
    rendered?: string;
  };
  link: string;
  date: string;
  featured_media: number;
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

interface StoriesBlogBlockProps {
  data: {
    heading?: string;
    heading_span_text?: string;
    heading_color?: string;
    heading_span_color?: string;
    subheading?: string;
    subheading_color?: string;
    card_label?: string;
    post_type?: string;
    category?: string;
    button_text?: string;
    button_url?: string;
    background_type?: 'color' | 'gradient' | 'image';
    background_color?: string;
    gradient_color_1?: string;
    gradient_color_2?: string;
    gradient_direction?: string;
    background_image?: string;
    section_height?: string;
    custom_height?: number;
  };
}

export default function StoriesBlogBlock({ data }: StoriesBlogBlockProps) {
  // Check if we're getting data from PHP template data attributes
  const getDataFromElement = () => {
    if (typeof window !== 'undefined') {
      const element = document.querySelector('.stories-blog-block-data');
      if (element) {
        return {
          heading: element.getAttribute('data-heading') || 'Success Stories',
          heading_span_text: element.getAttribute('data-heading-span-text') || '',
          heading_color: element.getAttribute('data-heading-color') || '#ffffff',
          heading_span_color: element.getAttribute('data-heading-span-color') || '#ffd700',
          subheading: element.getAttribute('data-subheading') || 'Your partner through complexities of Agile and DevOps transformation',
          subheading_color: element.getAttribute('data-subheading-color') || '#ffffff',
          card_label: element.getAttribute('data-card-label') || '',
          post_type: element.getAttribute('data-post-type') || 'post',
          category: element.getAttribute('data-category') || '',
          button_text: element.getAttribute('data-button-text') || 'Show More',
          button_url: element.getAttribute('data-button-url') || '#',
          background_type: (element.getAttribute('data-background-type') as 'color' | 'gradient' | 'image') || 'color',
          background_color: element.getAttribute('data-background-color') || '#4a148c',
          gradient_color_1: element.getAttribute('data-gradient-color-1') || '#4a148c',
          gradient_color_2: element.getAttribute('data-gradient-color-2') || '#7b1fa2',
          gradient_direction: element.getAttribute('data-gradient-direction') || 'to bottom right',
          background_image: element.getAttribute('data-background-image') || '',
          section_height: element.getAttribute('data-section-height') || 'auto',
          custom_height: parseInt(element.getAttribute('data-custom-height') || '600')
        };
      }
    }
    return null;
  };

  const elementData = getDataFromElement();
  
  const {
    heading = 'Success Stories',
    heading_span_text = '',
    heading_color = '#ffffff',
    heading_span_color = '#ffd700',
    subheading = 'Your partner through complexities of Agile and DevOps transformation',
    subheading_color = '#ffffff',
    card_label = '',
    post_type = 'post',
    category = '',
    button_text = 'Show More',
    button_url = '#',
    background_type = 'color',
    background_color = '#4a148c',
    gradient_color_1 = '#4a148c',
    gradient_color_2 = '#7b1fa2',
    gradient_direction = 'to bottom right',
    background_image = '',
    section_height = 'auto',
    custom_height = 600
  } = elementData || data || {};

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts based on backend-configured post type and category
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // First, try to get the post type information to determine the correct endpoint
        let endpoint = `/wp/v2/posts`; // Default fallback
        
        try {
          // Try to fetch post type information
          const postTypes = await fetchWordPressAPI<any>('/wp/v2/types');
          
          if (postTypes && postTypes[post_type]) {
            // Use the rest_base from the post type definition
            const restBase = postTypes[post_type].rest_base || post_type;
            endpoint = `/wp/v2/${restBase}`;
          } else {
            // Fallback to common patterns
            const endpointMap: { [key: string]: string } = {
              'post': 'posts',
              'posts': 'posts',
              'page': 'pages',
              'pages': 'pages'
            };
            
            endpoint = `/wp/v2/${endpointMap[post_type] || post_type}`;
          }
        } catch (typeError) {
          console.warn('Could not fetch post types, using fallback mapping:', typeError);
          // Use fallback mapping if post types endpoint fails
          const endpointMap: { [key: string]: string } = {
            'post': 'posts',
            'posts': 'posts',
            'page': 'pages',
            'pages': 'pages',
            'case_study': 'case_study',
            'case-studies': 'case-studies',
            'products': 'products',
            'testimonials': 'testimonials'
          };
          
          endpoint = `/wp/v2/${endpointMap[post_type] || post_type}`;
        }

        // Build POST data object for the request
        const postData: any = {
          per_page: 4,
          _embed: true,
          orderby: 'date',
          order: 'desc'
        };

        // Add category filter if specified
        if (category) {
          // Check if category is numeric (ID) or string (slug)
          if (isNaN(Number(category))) {
            // It's a slug, we need to get the category ID first
            try {
              // Try custom POST endpoint first, fallback to standard GET
              let categories;
              try {
                categories = await fetchWordPressAPI<any[]>('/wp/v2/categories-data', { slug: category });
              } catch {
                // Fallback to standard WordPress endpoint
                const response = await fetch(`${CLIENT_WORDPRESS_API_URL}/wp/v2/categories?slug=${category}`);
                if (response.ok) {
                  categories = await response.json();
                }
              }
              
              if (categories && categories.length > 0) {
                postData.categories = categories[0].id.toString();
              }
            } catch (catError) {
              console.warn('Could not fetch category by slug, trying as ID:', catError);
              postData.categories = category;
            }
          } else {
            // It's already an ID
            postData.categories = category;
          }
        }

        // Try different approaches based on post type
        let postsData;
        try {
          // For standard WordPress post types (post, page), use direct REST API
          if (post_type === 'post' || post_type === 'posts') {
            const params = new URLSearchParams({
              per_page: '4',
              _embed: 'true',
              orderby: 'date',
              order: 'desc'
            });
            
            if (postData.categories) {
              params.append('categories', postData.categories);
            }
            
            const response = await fetch(`${CLIENT_WORDPRESS_API_URL}/wp/v2/posts?${params.toString()}`);
            if (response.ok) {
              postsData = await response.json();
            }
          }
          // For case_study post type, try the specific endpoint first
          else if (post_type === 'case_study') {
            try {
              const params = new URLSearchParams({
                per_page: '4',
                _embed: 'true',
                orderby: 'date',
                order: 'desc'
              });
              
              if (postData.categories) {
                params.append('categories', postData.categories);
              }
              
              const response = await fetch(`${CLIENT_WORDPRESS_API_URL}${endpoint}?${params.toString()}`);
              if (response.ok) {
                postsData = await response.json();
              }
            } catch (caseStudyError) {
              console.warn('Case study endpoint failed, trying fallback:', caseStudyError);
            }
          }
          
          // If no data yet, try the generic posts-data endpoint
          if (!postsData) {
            postsData = await fetchWordPressAPI<Post[]>('/wp/v2/posts-data', {
              ...postData,
              post_type: post_type
            });
          }
        } catch (apiError) {
          console.warn('Custom API failed, trying final fallback:', apiError);
          
          // Final fallback to standard WordPress endpoint
          const params = new URLSearchParams({
            per_page: '4',
            _embed: 'true',
            orderby: 'date',
            order: 'desc'
          });
          
          if (postData.categories) {
            params.append('categories', postData.categories);
          }
          
          // Use the correct endpoint based on post type
          const fallbackEndpoint = (post_type === 'post' || post_type === 'posts') ? '/wp/v2/posts' : endpoint;
          
          try {
            const response = await fetch(`${CLIENT_WORDPRESS_API_URL}${fallbackEndpoint}?${params.toString()}`);
            if (response.ok) {
              postsData = await response.json();
            }
          } catch (fallbackError) {
            console.error('All API attempts failed:', fallbackError);
          }
        }
        setPosts(postsData || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [post_type, category]);

  // Helper function to get section height
  const getSectionHeight = () => {
    switch (section_height) {
      case 'small':
        return '60vh';
      case 'medium':
        return '80vh';
      case 'large':
        return '100vh';
      case 'custom':
        return `${custom_height}px`;
      default:
        return 'auto';
    }
  };

  // Helper function to get background styles
  const getBackgroundStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      minHeight: getSectionHeight()
    };

    if (background_type === 'gradient') {
      styles.background = `linear-gradient(${gradient_direction}, ${gradient_color_1}, ${gradient_color_2})`;
    } else if (background_type === 'image' && background_image) {
      styles.backgroundImage = `url(${background_image})`;
      styles.backgroundSize = 'cover';
      styles.backgroundPosition = 'center';
      styles.backgroundRepeat = 'no-repeat';
      styles.backgroundColor = background_color;
    } else {
      styles.backgroundColor = background_color;
    }

    return styles;
  };

  // Helper function to render heading with span
  const renderHeading = () => {
    if (!heading_span_text || heading_span_text.trim() === '') {
      return heading;
    }
    
    return (
      <>
        {heading}{' '}
        <span style={{ color: heading_span_color }}>
          {heading_span_text}
        </span>
      </>
    );
  };

  const getPostTypeLabel = () => {
    // If custom card label is provided, use it
    if (card_label && card_label.trim()) {
      return card_label.trim();
    }
    
    // Otherwise, convert post type to readable label
    const labelMap: { [key: string]: string } = {
      'post': 'ARTICLE',
      'posts': 'ARTICLE',
      'page': 'PAGE',
      'pages': 'PAGE',
      'case_study': 'CASE STUDY',
      'case-studies': 'CASE STUDY',
      'case_studies': 'CASE STUDY',
      'products': 'PRODUCT',
      'product': 'PRODUCT',
      'testimonials': 'TESTIMONIAL',
      'testimonial': 'TESTIMONIAL',
      'portfolio': 'PORTFOLIO',
      'event': 'EVENT',
      'events': 'EVENT',
      'news': 'NEWS',
      'service': 'SERVICE',
      'services': 'SERVICE'
    };
    
    // Return mapped label or convert post type to readable format
    return labelMap[post_type] || post_type.toUpperCase().replace(/[-_]/g, ' ');
  };

  const getFeaturedImage = (post: Post) => {
    const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    return imageUrl || 'https://via.placeholder.com/400x200/4a148c/ffffff?text=No+Image';
  };

  const getFeaturedImageAlt = (post: Post) => {
    return post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || post.title?.rendered || 'Post image';
  };

  const stripHtml = (html: string | undefined) => {
    if (!html || typeof html !== 'string') {
      return '';
    }
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const getPostUrl = (post: Post) => {
    // Convert WordPress URLs to Next.js frontend URLs
    if (post_type === 'case_study' && post.link) {
      // Extract slug from WordPress URL
      // Example: http://localhost/moreyeahs-new/case-study/hello-world/ -> hello-world
      const urlParts = post.link.split('/');
      const slug = urlParts[urlParts.length - 2] || urlParts[urlParts.length - 1];
      
      if (slug) {
        // Use current origin for the Next.js URL (automatically detects the correct port)
        if (typeof window !== 'undefined') {
          return `${window.location.origin}/case-study/${slug}`;
        }
        // Fallback for server-side rendering
        return `/case-study/${slug}`;
      }
    }
    
    // For other post types, you can add similar logic
    // For now, fallback to original link
    return post.link;
  };

  return (
    <section className="stories-blog-block" style={getBackgroundStyles()}>
      <div className="stories-blog-block__container">
        {/* Header Section */}
        <div className="stories-blog-block__header">
          <h2 
            className="stories-blog-block__heading"
            style={{ color: heading_color }}
          >
            {renderHeading()}
          </h2>
          <p 
            className="stories-blog-block__subheading"
            style={{ color: subheading_color }}
          >
            {subheading}
          </p>
        </div>

        {/* Content Grid */}
        <div className="stories-blog-block__grid">
          {loading ? (
            <div className="stories-blog-block__loading">Loading...</div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.id} className="stories-blog-block__card">
                <div className="stories-blog-block__card-image">
                  <Image
                    src={getFeaturedImage(post)}
                    alt={getFeaturedImageAlt(post)}
                    width={400}
                    height={200}
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x200/4a148c/ffffff?text=Image+Not+Found';
                    }}
                  />
                  <div className="stories-blog-block__card-label">
                    {getPostTypeLabel()}
                  </div>
                </div>
                <div className="stories-blog-block__card-content">
                  <h3 className="stories-blog-block__card-title">
                    <a href={getPostUrl(post)} target="_blank" rel="noopener noreferrer">
                      {stripHtml(post.title?.rendered)}
                    </a>
                  </h3>
                  <p className="stories-blog-block__card-excerpt">
                    {stripHtml(post.excerpt?.rendered).substring(0, 120)}...
                  </p>
                  <time className="stories-blog-block__card-date">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              </article>
            ))
          ) : (
            <div className="stories-blog-block__no-posts">
              No posts found for the selected criteria.
            </div>
          )}
        </div>

        {/* Button */}
        {button_text && button_url && (
          <div className="stories-blog-block__button-container">
            <a href={button_url} className="stories-blog-block__button">
              {button_text}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
