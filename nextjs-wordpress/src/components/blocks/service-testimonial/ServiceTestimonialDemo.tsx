'use client';

import React from 'react';
import ServiceTestimonial from './ServiceTestimonial';

const ServiceTestimonialDemo: React.FC = () => {
  const demoData = {
    heading: "What Our Clients Say",
    sub_heading: "Discover how our services have transformed businesses across industries",
    testimonial_items: [
      {
        quote: "The Data Engineering team completely transformed our data infrastructure. We went from manual processes to automated pipelines that save us 40 hours per week.",
        client_name: "Sarah Johnson",
        client_position: "CTO",
        client_company: "TechFlow Solutions",
        client_avatar: {
          id: 1,
          url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          alt: "Sarah Johnson",
          sizes: {
            thumbnail: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            medium: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
            large: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600&h=600&fit=crop&crop=face",
            full: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=800&fit=crop&crop=face"
          }
        },
        rating: 5
      },
      {
        quote: "Their DevOps expertise helped us achieve 99.9% uptime and reduced our deployment time from hours to minutes. Outstanding results!",
        client_name: "Michael Chen",
        client_position: "Lead Developer",
        client_company: "InnovateLab",
        client_avatar: {
          id: 2,
          url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          alt: "Michael Chen",
          sizes: {
            thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            medium: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
            large: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face",
            full: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face"
          }
        },
        rating: 5
      },
      {
        quote: "The Dynamics 365 implementation was seamless. Our sales team productivity increased by 60% and we have complete visibility into our pipeline.",
        client_name: "Emily Rodriguez",
        client_position: "Sales Director",
        client_company: "GrowthCorp",
        client_avatar: {
          id: 3,
          url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          alt: "Emily Rodriguez",
          sizes: {
            thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            medium: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
            large: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=600&fit=crop&crop=face",
            full: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop&crop=face"
          }
        },
        rating: 5
      }
    ],
    autoplay_slider: true,
    slider_speed: 5,
    show_navigation: true,
    show_dots: true,
    background_color: "#0a0f1c",
    text_color: "#ffffff",
    accent_color: "#ffd700"
  };

  return <ServiceTestimonial data={demoData} />;
};

export default ServiceTestimonialDemo;