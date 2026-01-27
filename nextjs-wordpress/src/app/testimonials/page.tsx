import React from 'react';
import { Metadata } from 'next';
import { getPageWithBlocks } from '@/lib/wpFetch';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('testimonials');
}

// Build-safe: force dynamic for testimonials page
// This ensures fresh data on each request
export const dynamic = 'force-dynamic';

interface Testimonial {
  id: number;
  name: string;
  position?: string;
  company?: string;
  content: string;
  image?: {
    url: string;
    alt: string;
  };
}

interface TestimonialBlockData {
  heading?: string;
  testimonials?: Testimonial[];
  background_image?: {
    url: string;
    alt: string;
  };
  button_text?: string;
  button_url?: string;
}

// Build-safe function to extract testimonial data from blocks
function extractTestimonialData(blocks: any[]): TestimonialBlockData | null {
  if (!blocks || !Array.isArray(blocks)) return null;
  
  // Recursively search for testimonial blocks
  function findTestimonialBlock(blockList: any[]): any {
    for (const block of blockList) {
      if (block?.blockName === 'acf/testimonial-block') {
        return block;
      }
      if (block?.innerBlocks && Array.isArray(block.innerBlocks)) {
        const found = findTestimonialBlock(block.innerBlocks);
        if (found) return found;
      }
    }
    return null;
  }
  
  const testimonialBlock = findTestimonialBlock(blocks);
  return testimonialBlock?.attrs?.data || null;
}

export default async function TestimonialsPage() {
  // Build-safe: try to get testimonials from homepage or dedicated page
  let testimonialData: TestimonialBlockData | null = null;
  
  // Try to get from homepage first
  const homePage = await getPageWithBlocks('home');
  if (homePage?.blocks) {
    testimonialData = extractTestimonialData(homePage.blocks);
  }
  
  // If not found, try dedicated testimonials page
  if (!testimonialData) {
    const testimonialsPage = await getPageWithBlocks('testimonials');
    if (testimonialsPage?.blocks) {
      testimonialData = extractTestimonialData(testimonialsPage.blocks);
    }
  }
  
  // Build-safe fallback: render page even without data
  if (!testimonialData || !testimonialData.testimonials?.length) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Testimonials</h1>
          <p className="text-lg text-gray-600 mb-8">
            What our customers say about us
          </p>
          <div className="bg-gray-100 p-8 rounded-lg">
            <p className="text-gray-500">
              Testimonials will appear here when configured in WordPress.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { heading, testimonials, background_image, button_text, button_url } = testimonialData;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative py-20 px-8"
        style={{
          backgroundImage: background_image?.url ? `url(${background_image.url})` : undefined,
          backgroundColor: background_image?.url ? undefined : '#f3f4f6',
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">
            {heading || 'Testimonials'}
          </h1>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id || index} 
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                {testimonial.image?.url && (
                  <div className="mb-4">
                    <img
                      src={testimonial.image.url}
                      alt={testimonial.image.alt || testimonial.name}
                      className="w-16 h-16 rounded-full mx-auto object-cover"
                    />
                  </div>
                )}
                
                <blockquote className="text-gray-700 mb-4 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>
                
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  {testimonial.position && (
                    <div className="text-sm text-gray-600">
                      {testimonial.position}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Call to Action */}
          {button_text && button_url && (
            <div className="text-center mt-12">
              <a
                href={button_url}
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {button_text}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}