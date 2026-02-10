'use client';

import React, { useEffect, useState } from 'react';
import DiceTestimonial from '@/components/blocks/dice-testimonial/DiceTestimonial';

interface TestimonialItem {
  quote: string;
  client_name: string;
  client_position?: string;
  client_company?: string;
  client_avatar?: {
    id: number;
    url: string;
    alt: string;
    sizes: {
      thumbnail: string;
      medium: string;
      large: string;
      full: string;
    };
  };
  rating?: number;
}

interface TestimonialData {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf?: {
    client_name?: string;
    client_position?: string;
    client_company?: string;
    client_avatar?: {
      id: number;
      url: string;
      alt: string;
      sizes: {
        thumbnail: string;
        medium: string;
        large: string;
        full: string;
      };
    };
    rating?: number;
    quote?: string;
  };
}

// Transform WordPress testimonial data to DiceTestimonial format
function transformTestimonialData(wpTestimonials: TestimonialData[]): TestimonialItem[] {
  return wpTestimonials.map(testimonial => {
    // Get quote from ACF field first, then content, then title as fallback
    let quote = '';
    if (testimonial.acf?.quote) {
      quote = testimonial.acf.quote;
    } else if (testimonial.content?.rendered) {
      // Strip HTML tags from content
      quote = testimonial.content.rendered.replace(/<[^>]*>/g, '').trim();
    } else if (testimonial.title?.rendered) {
      quote = testimonial.title.rendered;
    }

    // Get client name from ACF field first, then title as fallback
    const client_name = testimonial.acf?.client_name || testimonial.title?.rendered || 'Anonymous';

    return {
      quote: quote || 'Great experience working with this team!',
      client_name: client_name,
      client_position: testimonial.acf?.client_position || '',
      client_company: testimonial.acf?.client_company || '',
      client_avatar: testimonial.acf?.client_avatar || undefined,
      rating: testimonial.acf?.rating || 5
    };
  }).filter(testimonial => testimonial.quote.length > 0); // Filter out empty quotes
}

const DiceTestimonialWrapper: React.FC = () => {
  const [testimonialItems, setTestimonialItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // Get WordPress API URL from environment
        const wpApiUrl = process.env.NEXT_PUBLIC_WP_API || 
                        (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
                          ? 'http://localhost/moreyeahs-new/wp-json'
                          : 'https://dev.moreyeahs.com/wp-json');
        
        const apiUrl = `${wpApiUrl}/wp/v2/testimonials?per_page=10&status=publish`;
        console.log('Fetching testimonials from:', apiUrl);
        
        // Fetch testimonials from WordPress REST API
        const response = await fetch(apiUrl);
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const wpTestimonials: TestimonialData[] = await response.json();
        console.log('Fetched testimonials:', wpTestimonials);
        
        // Transform the data
        const transformedItems = transformTestimonialData(wpTestimonials);
        console.log('Transformed testimonials:', transformedItems);
        
        setTestimonialItems(transformedItems);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
        
        // Fallback: Use sample testimonials for demonstration
        console.log('Using fallback testimonials for demonstration');
        const fallbackTestimonials: TestimonialItem[] = [
          {
            quote: "Working with this team has been an absolute game-changer for our business. Their expertise and dedication exceeded all our expectations.",
            client_name: "Sarah Johnson",
            client_position: "CEO",
            client_company: "TechStart Inc.",
            rating: 5
          },
          {
            quote: "The level of professionalism and quality of work delivered was outstanding. I would highly recommend their services to anyone.",
            client_name: "Michael Chen",
            client_position: "CTO",
            client_company: "Innovation Labs",
            rating: 5
          },
          {
            quote: "From start to finish, the project was handled with care and attention to detail. The results speak for themselves.",
            client_name: "Emily Rodriguez",
            client_position: "Marketing Director",
            client_company: "Growth Solutions",
            rating: 5
          }
        ];
        
        setTestimonialItems(fallbackTestimonials);
        setError(null); // Clear error since we're using fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Don't render anything while loading or if there's an error or no testimonials
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        Loading testimonials...
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#ff6b6b' }}>
        Error loading testimonials: {error}
      </div>
    );
  }
  
  if (testimonialItems.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        No testimonials found. Please add testimonials in WordPress Admin.
      </div>
    );
  }

  // Configuration for the dice testimonial block
  const testimonialData = {
    heading: "Clients",
    heading_color: "rgb(0, 0, 0)",
    heading_span_text: "Testimonials",
    heading_span_color: "rgb(72, 72, 72)",
    // sub_heading: "Don't just take our word for it - hear from our satisfied clients",
    testimonial_items: testimonialItems,
    autoplay_slider: true,
    slider_speed: 5,
    show_navigation: true,
    show_dots: true,
    background_type: 'gradient' as const,
    gradient_color_1: '#0a0f1c',
    gradient_color_2: '#1a1f3c',
    gradient_direction: 'to bottom right',
    background_height: 'medium',
    text_color: '#ffffff',
    accent_color: 'rgb(0, 162, 255)'
  };

  return <DiceTestimonial data={testimonialData} />;
};

export default DiceTestimonialWrapper;