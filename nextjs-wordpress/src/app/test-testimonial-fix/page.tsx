'use client';

import { useState, useEffect } from 'react';
import TestimonialBlock from '@/components/blocks/testimonial-block';

export default function TestTestimonialFix() {
  const [testimonialData, setTestimonialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://dev.moreyeahs.com';
        const response = await fetch(`${apiUrl}/wp-json/wp/v2/pages-with-blocks/home`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const pageData = await response.json();
        
        // Find testimonial block
        const findTestimonialBlock = (blocks: any[]): any => {
          for (const block of blocks) {
            if (block.blockName === 'acf/testimonial-block') {
              return block;
            }
            if (block.innerBlocks && block.innerBlocks.length > 0) {
              const found = findTestimonialBlock(block.innerBlocks);
              if (found) return found;
            }
          }
          return null;
        };

        const testimonialBlock = findTestimonialBlock(pageData.blocks || []);
        
        if (testimonialBlock && testimonialBlock.attrs?.data) {
          setTestimonialData(testimonialBlock.attrs.data);
        } else {
          setError('No testimonial block found');
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading testimonial data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Testimonial Block Test</h1>
        
        <div className="mb-8 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold mb-4">Data Preview:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Background Image:</strong> {testimonialData?.background_image?.url ? '✅ Dynamic' : '❌ Missing'}
            </div>
            <div>
              <strong>Testimonials Count:</strong> {testimonialData?.testimonials?.length || 0}
            </div>
            <div>
              <strong>Heading:</strong> {testimonialData?.heading || 'N/A'}
            </div>
            <div>
              <strong>Overlay Text:</strong> {testimonialData?.overlay_text || 'N/A'}
            </div>
          </div>
          
          {testimonialData?.testimonials?.map((testimonial: any, index: number) => (
            <div key={index} className="mt-4 p-3 bg-white rounded">
              <div className="font-semibold">Testimonial {index + 1}:</div>
              <div><strong>Quote:</strong> {testimonial.quote}</div>
              <div><strong>Author:</strong> {testimonial.author_name}</div>
              <div><strong>Title:</strong> {testimonial.author_title}</div>
              <div><strong>Image:</strong> {testimonial.author_image?.url ? '✅ Dynamic' : '❌ Missing'}</div>
            </div>
          ))}
        </div>
      </div>

      {testimonialData && (
        <TestimonialBlock data={testimonialData} />
      )}
    </div>
  );
}