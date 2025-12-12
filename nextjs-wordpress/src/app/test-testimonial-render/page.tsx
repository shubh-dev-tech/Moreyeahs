/**
 * Test page to verify testimonial block rendering
 */

import { fetchWordPressAPI } from '@/lib/wordpress';
import TestimonialBlock from '@/components/blocks/testimonial-block/TestimonialBlock';

async function getTestimonialData() {
  try {
    const pageData = await fetchWordPressAPI<any>('/wp/v2/pages-with-blocks/home');
    
    // Find testimonial block recursively
    function findTestimonialBlock(blocks: any[]): any {
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
    }
    
    const testimonialBlock = findTestimonialBlock(pageData.blocks || []);
    return testimonialBlock?.attrs?.data || null;
  } catch (error) {
    console.error('Error fetching testimonial data:', error);
    return null;
  }
}

export default async function TestTestimonialRender() {
  const testimonialData = await getTestimonialData();

  if (!testimonialData) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-4">Testimonial Test - No Data</h1>
        <p>Could not load testimonial data from WordPress.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="p-8 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Testimonial Block Test</h1>
        <div className="mb-4 p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Data Summary:</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Heading: {testimonialData.heading}</li>
            <li>Testimonials Count: {testimonialData.testimonials?.length || 0}</li>
            <li>Background Image: {testimonialData.background_image?.url ? '✅' : '❌'}</li>
            <li>Button Text: {testimonialData.button_text}</li>
          </ul>
        </div>
      </div>
      
      <TestimonialBlock data={testimonialData} />
    </div>
  );
}