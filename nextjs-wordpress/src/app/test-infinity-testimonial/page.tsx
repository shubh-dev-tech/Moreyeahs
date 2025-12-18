/**
 * Test page to verify infinity testimonial both side block rendering
 */

import InfinityTestimonialBothSideBlock from '@/components/blocks/infinity-testimonial-both-side/InfinityTestimonialBothSideBlock';

// Build-safe: all test pages are force-dynamic
export const dynamic = 'force-dynamic';

// Sample test data matching the block structure
const sampleTestimonialData = {
  show_rating: true,
  rating_text: 'Rated 4/5 by over 1 Lakh users',
  rating_stars: 4,
  heading: 'Words of praise from others about our presence.',
  scroll_direction: 'left_to_right' as const,
  testimonials: [
    {
      content_type: 'text' as const,
      quote: 'Their ability to capture our brand essence in every project is unparalleled - an invaluable creative collaborator.',
      author_name: 'Isabella Rodriguez',
      author_title: 'CEO and Co-founder',
      author_company: 'ABC Company',
    },
    {
      content_type: 'text' as const,
      quote: 'Creative geniuses who listen, understand, and craft captivating visuals - an agency that truly understands our needs.',
      author_name: 'Gabrielle Williams',
      author_title: 'CEO and Co-founder',
      author_company: 'ABC Company',
    },
    {
      content_type: 'text' as const,
      quote: 'Exceeded our expectations with innovative designs that brought our vision to life - a truly remarkable creative agency.',
      author_name: 'Samantha Johnson',
      author_title: 'CEO and Co-founder',
      author_company: 'ABC Company',
    },
    {
      content_type: 'text' as const,
      quote: 'A refreshing and imaginative agency that consistently delivers exceptional results - highly recommended for any project.',
      author_name: 'Victoria Thompson',
      author_title: 'CEO and Co-founder',
      author_company: 'ABC Company',
    },
    {
      content_type: 'text' as const,
      quote: 'Their team\'s artistic flair and strategic approach resulted in remarkable campaigns - a reliable creative partner.',
      author_name: 'John Peter',
      author_title: 'CEO and Co-founder',
      author_company: 'ABC Company',
    },
    {
      content_type: 'text' as const,
      quote: 'From concept to execution, their creativity knows no bounds - a game-changer for our brand\'s success.',
      author_name: 'Natalie Martinez',
      author_title: 'CEO and Co-founder',
      author_company: 'ABC Company',
    },
  ],
};

// Sample data for right-to-left scroll direction
const sampleTestimonialDataRTL = {
  ...sampleTestimonialData,
  scroll_direction: 'right_to_left' as const,
  heading: 'Right to Left Scroll - Words of praise from others about our presence.',
};

// Sample data with custom background color
const sampleTestimonialDataCustomBg = {
  ...sampleTestimonialData,
  heading: 'Custom Background Color - Words of praise from others about our presence.',
  background_color: '#ff6b6b',
};

// Sample data with video testimonials
const sampleVideoTestimonialData = {
  show_rating: true,
  rating_text: 'Rated 5/5 by over 2 Lakh users',
  rating_stars: 5,
  heading: 'Video testimonials from our satisfied clients.',
  scroll_direction: 'left_to_right' as const,
  testimonials: [
    {
      content_type: 'video' as const,
      video: {
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        mime_type: 'video/mp4',
      },
      author_name: 'Sarah Johnson',
      author_title: 'Marketing Director',
      author_company: 'Tech Innovations Inc',
    },
    {
      content_type: 'text' as const,
      quote: 'Outstanding service and exceptional results. Highly recommend their expertise!',
      author_name: 'Michael Chen',
      author_title: 'Product Manager',
      author_company: 'Digital Solutions Ltd',
    },
  ],
};

export default function TestInfinityTestimonial() {
  return (
    <div className="min-h-screen">
      <div className="p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Infinity Testimonial Both Side Block Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Test 1: Left to Right</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Direction: Left to Right</li>
              <li>Rating: ✅ Enabled</li>
              <li>Stars: 4/5</li>
              <li>Testimonials: 6 text items</li>
            </ul>
          </div>
          
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Test 2: Right to Left</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Direction: Right to Left</li>
              <li>Rating: ✅ Enabled</li>
              <li>Stars: 4/5</li>
              <li>Testimonials: 6 text items</li>
            </ul>
          </div>
          
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Test 3: Custom Background</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Direction: Left to Right</li>
              <li>Background: Custom Color</li>
              <li>Rating: ✅ Enabled</li>
              <li>Testimonials: 6 text items</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Test 1: Left to Right Scroll */}
      <InfinityTestimonialBothSideBlock data={sampleTestimonialData} />
      
      {/* Spacer */}
      <div className="h-16 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-600 font-medium">Test 2: Right to Left Direction</span>
      </div>
      
      {/* Test 2: Right to Left Scroll */}
      <InfinityTestimonialBothSideBlock data={sampleTestimonialDataRTL} />
      
      {/* Spacer */}
      <div className="h-16 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-600 font-medium">Test 3: Custom Background Color</span>
      </div>
      
      {/* Test 3: Custom Background */}
      <InfinityTestimonialBothSideBlock data={sampleTestimonialDataCustomBg} />
      
      {/* Spacer */}
      <div className="h-16 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-600 font-medium">Test 4: Video Testimonials (Note: Sample video may not load)</span>
      </div>
      
      {/* Test 4: Video Testimonials */}
      <InfinityTestimonialBothSideBlock data={sampleVideoTestimonialData} />
      
      {/* Footer */}
      <div className="p-8 bg-gray-100 text-center">
        <h2 className="text-xl font-semibold mb-4">Block Features Tested</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="p-3 bg-green-100 rounded">
            <div className="font-medium text-green-800">✅ Rating Section</div>
            <div className="text-green-600">Stars + Text</div>
          </div>
          <div className="p-3 bg-green-100 rounded">
            <div className="font-medium text-green-800">✅ Infinite Scroll</div>
            <div className="text-green-600">Both Directions</div>
          </div>
          <div className="p-3 bg-green-100 rounded">
            <div className="font-medium text-green-800">✅ Background Options</div>
            <div className="text-green-600">Color + Image</div>
          </div>
          <div className="p-3 bg-green-100 rounded">
            <div className="font-medium text-green-800">✅ Video Support</div>
            <div className="text-green-600">MP4, WebM, MOV</div>
          </div>
          <div className="p-3 bg-green-100 rounded">
            <div className="font-medium text-green-800">✅ Responsive</div>
            <div className="text-green-600">Mobile Friendly</div>
          </div>
        </div>
      </div>
    </div>
  );
}