'use client';

import React from 'react';
import ImageGallerySection from '../../components/blocks/image-gallery-section/ImageGallerySection';

// Mock data for testing
const mockGalleryImages = [
  {
    id: 1,
    url: 'https://via.placeholder.com/400x300/0066cc/ffffff?text=AWS+Partner',
    alt: 'AWS Partner Logo',
    title: 'AWS Advanced Tier Services Partner',
    sizes: {
      thumbnail: 'https://via.placeholder.com/150x150/0066cc/ffffff?text=AWS',
      medium: 'https://via.placeholder.com/300x225/0066cc/ffffff?text=AWS',
      large: 'https://via.placeholder.com/400x300/0066cc/ffffff?text=AWS+Partner',
      full: 'https://via.placeholder.com/800x600/0066cc/ffffff?text=AWS+Partner'
    }
  },
  {
    id: 2,
    url: 'https://via.placeholder.com/400x300/00a1f1/ffffff?text=Microsoft+Partner',
    alt: 'Microsoft Solutions Partner Logo',
    title: 'Microsoft Solutions Partner',
    sizes: {
      thumbnail: 'https://via.placeholder.com/150x150/00a1f1/ffffff?text=MS',
      medium: 'https://via.placeholder.com/300x225/00a1f1/ffffff?text=MS',
      large: 'https://via.placeholder.com/400x300/00a1f1/ffffff?text=Microsoft+Partner',
      full: 'https://via.placeholder.com/800x600/00a1f1/ffffff?text=Microsoft+Partner'
    }
  },
  {
    id: 3,
    url: 'https://via.placeholder.com/400x300/4285f4/ffffff?text=Google+Cloud',
    alt: 'Google Cloud Partner Logo',
    title: 'Google Cloud Partner',
    sizes: {
      thumbnail: 'https://via.placeholder.com/150x150/4285f4/ffffff?text=GCP',
      medium: 'https://via.placeholder.com/300x225/4285f4/ffffff?text=GCP',
      large: 'https://via.placeholder.com/400x300/4285f4/ffffff?text=Google+Cloud',
      full: 'https://via.placeholder.com/800x600/4285f4/ffffff?text=Google+Cloud'
    }
  },
  {
    id: 4,
    url: 'https://via.placeholder.com/400x300/ff6900/ffffff?text=Salesforce',
    alt: 'Salesforce Partner Logo',
    title: 'Salesforce Partner',
    sizes: {
      thumbnail: 'https://via.placeholder.com/150x150/ff6900/ffffff?text=SF',
      medium: 'https://via.placeholder.com/300x225/ff6900/ffffff?text=SF',
      large: 'https://via.placeholder.com/400x300/ff6900/ffffff?text=Salesforce',
      full: 'https://via.placeholder.com/800x600/ff6900/ffffff?text=Salesforce'
    }
  },
  {
    id: 5,
    url: 'https://via.placeholder.com/400x300/e31837/ffffff?text=Oracle',
    alt: 'Oracle Partner Logo',
    title: 'Oracle Partner',
    sizes: {
      thumbnail: 'https://via.placeholder.com/150x150/e31837/ffffff?text=Oracle',
      medium: 'https://via.placeholder.com/300x225/e31837/ffffff?text=Oracle',
      large: 'https://via.placeholder.com/400x300/e31837/ffffff?text=Oracle',
      full: 'https://via.placeholder.com/800x600/e31837/ffffff?text=Oracle'
    }
  },
  {
    id: 6,
    url: 'https://via.placeholder.com/400x300/326ce5/ffffff?text=Docker',
    alt: 'Docker Partner Logo',
    title: 'Docker Partner',
    sizes: {
      thumbnail: 'https://via.placeholder.com/150x150/326ce5/ffffff?text=Docker',
      medium: 'https://via.placeholder.com/300x225/326ce5/ffffff?text=Docker',
      large: 'https://via.placeholder.com/400x300/326ce5/ffffff?text=Docker',
      full: 'https://via.placeholder.com/800x600/326ce5/ffffff?text=Docker'
    }
  },
  {
    id: 7,
    url: 'https://via.placeholder.com/400x300/f05032/ffffff?text=Red+Hat',
    alt: 'Red Hat Partner Logo',
    title: 'Red Hat Partner',
    sizes: {
      thumbnail: 'https://via.placeholder.com/150x150/f05032/ffffff?text=RH',
      medium: 'https://via.placeholder.com/300x225/f05032/ffffff?text=RH',
      large: 'https://via.placeholder.com/400x300/f05032/ffffff?text=Red+Hat',
      full: 'https://via.placeholder.com/800x600/f05032/ffffff?text=Red+Hat'
    }
  },
  {
    id: 8,
    url: 'https://via.placeholder.com/400x300/0db7ed/ffffff?text=Kubernetes',
    alt: 'Kubernetes Partner Logo',
    title: 'Kubernetes Partner',
    sizes: {
      thumbnail: 'https://via.placeholder.com/150x150/0db7ed/ffffff?text=K8s',
      medium: 'https://via.placeholder.com/300x225/0db7ed/ffffff?text=K8s',
      large: 'https://via.placeholder.com/400x300/0db7ed/ffffff?text=Kubernetes',
      full: 'https://via.placeholder.com/800x600/0db7ed/ffffff?text=Kubernetes'
    }
  }
];

export default function TestImageGalleryPage() {
  return (
    <div className="test-page">
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#333' }}>
          Image Gallery Section Test Page
        </h1>
        
        {/* Test 1: 4 Column Grid Layout */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ color: '#666', marginBottom: '20px' }}>Test 1: 4 Column Grid Layout</h2>
          <ImageGallerySection
            heading="Cloud & Platform Partnerships"
            sub_heading="Trusted partnerships with leading technology providers to deliver comprehensive solutions"
            gallery_images={mockGalleryImages}
            gallery_layout="4"
            enable_slider={false}
            background_color="#ffffff"
            text_color="#333333"
          />
        </div>

        {/* Test 2: 3 Column Grid Layout */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ color: '#666', marginBottom: '20px' }}>Test 2: 3 Column Grid Layout</h2>
          <ImageGallerySection
            heading="Technology Partners"
            sub_heading="Strategic alliances that power innovation"
            gallery_images={mockGalleryImages.slice(0, 6)}
            gallery_layout="3"
            enable_slider={false}
            background_color="#f8f9fa"
            text_color="#2c3e50"
          />
        </div>

        {/* Test 3: 6 Column Grid Layout */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ color: '#666', marginBottom: '20px' }}>Test 3: 6 Column Grid Layout</h2>
          <ImageGallerySection
            heading="Certification Partners"
            gallery_images={mockGalleryImages}
            gallery_layout="6"
            enable_slider={false}
            background_color="#e3f2fd"
            text_color="#1565c0"
          />
        </div>

        {/* Test 4: Infinite Slider Mode - 4 Columns */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ color: '#666', marginBottom: '20px' }}>Test 4: Infinite Slider Mode (4 Columns)</h2>
          <ImageGallerySection
            heading="Our Partners in Motion"
            sub_heading="Continuously evolving partnerships that drive success"
            gallery_images={mockGalleryImages}
            gallery_layout="4"
            enable_slider={true}
            slider_speed={3}
            autoplay_slider={true}
            background_color="#2c3e50"
            text_color="#ffffff"
          />
        </div>

        {/* Test 5: Infinite Slider Mode - 5 Columns */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ color: '#666', marginBottom: '20px' }}>Test 5: Infinite Slider Mode (5 Columns)</h2>
          <ImageGallerySection
            heading="Innovation Ecosystem"
            sub_heading="A dynamic network of technology leaders"
            gallery_images={mockGalleryImages}
            gallery_layout="5"
            enable_slider={true}
            slider_speed={2.5}
            autoplay_slider={true}
            background_color="#f1f8e9"
            text_color="#2e7d32"
          />
        </div>

        {/* Test 6: Minimal Content */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ color: '#666', marginBottom: '20px' }}>Test 6: Minimal Content (No Headings)</h2>
          <ImageGallerySection
            gallery_images={mockGalleryImages.slice(0, 4)}
            gallery_layout="4"
            enable_slider={false}
            background_color="#fff3e0"
            text_color="#e65100"
          />
        </div>

        {/* Test 7: Fast Slider */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ color: '#666', marginBottom: '20px' }}>Test 7: Fast Slider (1.5s speed)</h2>
          <ImageGallerySection
            heading="Rapid Innovation"
            gallery_images={mockGalleryImages}
            gallery_layout="3"
            enable_slider={true}
            slider_speed={1.5}
            autoplay_slider={true}
            background_color="#fce4ec"
            text_color="#c2185b"
          />
        </div>

        {/* Test 8: No Autoplay Slider */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ color: '#666', marginBottom: '20px' }}>Test 8: Manual Slider (No Autoplay)</h2>
          <ImageGallerySection
            heading="Manual Control"
            sub_heading="Slider without autoplay - for demonstration purposes"
            gallery_images={mockGalleryImages}
            gallery_layout="4"
            enable_slider={true}
            slider_speed={3}
            autoplay_slider={false}
            background_color="#e8f5e8"
            text_color="#1b5e20"
          />
        </div>
      </div>
    </div>
  );
}