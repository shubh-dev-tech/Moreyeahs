/**
 * Test page to verify testimonial block rendering
 */

import { getPageWithBlocks } from '@/lib/wpFetch';
import TestimonialBlock from '@/components/blocks/testimonial-block';

// Build-safe: all test pages are force-dynamic
export const dynamic = 'force-dynamic';

async function getTestimonialData() {
  // Build-safe: use wpFetch instead of fetchWordPressAPI
  const pageData = await getPageWithBlocks('home');
  
  if (!pageData?.blocks) return null;
  
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
  
  const testimonialBlock = findTestimonialBlock(pageData.blocks);
  return testimonialBlock?.attrs?.data || null;
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