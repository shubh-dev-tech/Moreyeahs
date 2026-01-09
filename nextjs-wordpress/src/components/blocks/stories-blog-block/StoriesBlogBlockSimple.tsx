'use client';

import React, { useState, useEffect } from 'react';

interface Post {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  link: string;
  date: string;
}

interface StoriesBlogBlockSimpleProps {
  data?: {
    heading?: string;
    subheading?: string;
    post_type?: string;
    category?: string;
    button_text?: string;
    button_url?: string;
    background_color?: string;
    background_image?: string;
  };
}

export default function StoriesBlogBlockSimple({ data = {} }: StoriesBlogBlockSimpleProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});

  const {
    heading = 'Success Stories',
    subheading = 'Testing WordPress API Connection',
    post_type = 'post',
    category = '',
    button_text = 'Show More',
    button_url = '#',
    background_color = '#4a148c',
    background_image = ''
  } = data;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Use the same API function as the main component
        const { fetchWordPressAPI } = await import('@/lib/wordpress');
        
        // Build endpoint like the main component
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
            'case-studies': 'case-studies',
            'products': 'products',
            'testimonials': 'testimonials'
          };
          
          endpoint = `/wp/v2/${endpointMap[post_type] || post_type}`;
        }

        // Add query parameters
        const params = new URLSearchParams({
          per_page: '4',
          _embed: 'true',
          orderby: 'date',
          order: 'desc'
        });

        if (category) {
          params.append('categories', category);
        }

        const fullUrl = `${endpoint}?${params.toString()}`;
        
        setDebugInfo({
          post_type,
          category,
          endpoint,
          fullUrl,
          timestamp: new Date().toISOString()
        });

        const postsData = await fetchWordPressAPI<Post[]>(fullUrl);
        setPosts(postsData || []);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [post_type, category]);

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

  const backgroundStyles: React.CSSProperties = {
    backgroundColor: background_color,
    ...(background_image && {
      backgroundImage: `url(${background_image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    })
  };

  return (
    <section className="stories-blog-block" style={backgroundStyles}>
      <div className="stories-blog-block__container">
        <div className="stories-blog-block__header">
          <h2 className="stories-blog-block__heading">{heading}</h2>
          <p className="stories-blog-block__subheading">{subheading}</p>
        </div>

        {/* Debug Information */}
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: 'white' }}>Debug Info:</h4>
          <pre style={{ 
            background: 'rgba(0,0,0,0.3)', 
            padding: '10px', 
            borderRadius: '4px',
            color: 'white',
            fontSize: '12px',
            overflow: 'auto'
          }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="stories-blog-block__grid">
          {loading ? (
            <div className="stories-blog-block__loading" style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: 'white'
            }}>
              Loading posts...
            </div>
          ) : error ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: '#ff6b6b',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}>
              <h3>Error Loading Posts</h3>
              <p>{error}</p>
              <p style={{ fontSize: '14px', opacity: 0.8 }}>
                Check console for more details
              </p>
            </div>
          ) : posts.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px' 
            }}>
              {posts.map((post) => (
                <article key={post.id} style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '20px',
                  color: '#333'
                }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
                    <a href={getPostUrl(post)} target="_blank" rel="noopener noreferrer" style={{
                      color: '#333',
                      textDecoration: 'none'
                    }}>
                      {post.title.rendered}
                    </a>
                  </h3>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#666',
                    marginBottom: '10px'
                  }}>
                    {post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </div>
                  <time style={{ fontSize: '12px', color: '#999' }}>
                    {new Date(post.date).toLocaleDateString()}
                  </time>
                </article>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: 'white',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}>
              No posts found for the selected criteria.
            </div>
          )}
        </div>

        {button_text && button_url && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <a href={button_url} style={{
              display: 'inline-block',
              padding: '15px 30px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '25px',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              {button_text}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}