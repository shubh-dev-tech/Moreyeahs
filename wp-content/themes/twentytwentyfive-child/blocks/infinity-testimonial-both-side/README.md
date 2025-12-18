# Infinity Testimonial Both Side Block

An advanced testimonial block with infinite scroll animation, video support, rating section, and bidirectional scrolling.

## Features

- ✅ **Rating Section**: Display star ratings with customizable text
- ✅ **Infinite Scroll**: Smooth, continuous scrolling animation
- ✅ **Bidirectional**: Choose between left-to-right or right-to-left scroll
- ✅ **Video Support**: Upload video testimonials (MP4, WebM, MOV)
- ✅ **Text Testimonials**: Traditional quote-based testimonials
- ✅ **Responsive Design**: Mobile-friendly and adaptive
- ✅ **Hover Pause**: Animation pauses when hovering over testimonials
- ✅ **Accessibility**: Reduced motion support and keyboard navigation

## Block Configuration

### Rating Section
- **Show Rating**: Toggle to show/hide the rating section
- **Rating Text**: Custom text (e.g., "Rated 4/5 by over 1 Lakh users")
- **Rating Stars**: Number of stars to display (1-5)

### Content
- **Heading**: Main heading for the testimonial section
- **Scroll Direction**: Choose between:
  - Left to Right
  - Right to Left

### Testimonials (Repeater)
Each testimonial can be configured with:

#### Content Type
- **Text Testimonial**: Traditional quote-based testimonial
  - Quote: The testimonial text
- **Video Testimonial**: Video-based testimonial
  - Video: Upload video file (MP4, WebM, MOV)
  - Video Thumbnail: Optional thumbnail image

#### Author Information (Both Types)
- **Author Name**: Name of the person (required)
- **Author Title**: Job title or position
- **Author Company**: Company name
- **Author Image**: Profile photo

## Usage in WordPress

1. Add a new block in the WordPress editor
2. Search for "Infinity Testimonial Both Side"
3. Configure the rating section (optional)
4. Add your heading
5. Choose scroll direction
6. Add testimonials:
   - Select content type (text or video)
   - Fill in testimonial content
   - Add author information
7. Publish and view on the frontend

## Usage in Next.js

The block is automatically rendered through the BlockRenderer component:

```tsx
import InfinityTestimonialBothSideBlock from '@/components/blocks/infinity-testimonial-both-side/InfinityTestimonialBothSideBlock';

<InfinityTestimonialBothSideBlock data={blockData} />
```

### Data Structure

```typescript
interface InfinityTestimonialBothSideBlockProps {
  data: {
    show_rating?: boolean;
    rating_text?: string;
    rating_stars?: number;
    heading?: string;
    scroll_direction?: 'left_to_right' | 'right_to_left';
    testimonials?: Array<{
      content_type: 'text' | 'video';
      quote?: string;
      video?: {
        url: string;
        mime_type: string;
      };
      video_thumbnail?: {
        url: string;
        alt: string;
      };
      author_name: string;
      author_title?: string;
      author_company?: string;
      author_image?: {
        url: string;
        alt: string;
      };
    }>;
  };
}
```

## Testing

### Test Page
Visit `/test-infinity-testimonial` to see the block in action with sample data.

### Test Script
Run the test script to verify block registration:

```bash
cd nextjs-wordpress
node test-infinity-testimonial-block.js
```

## Files

### WordPress (Child Theme)
- `wp-content/themes/twentytwentyfive-child/acf-json/group_infinity_testimonial_both_side_block.json` - ACF field configuration
- `wp-content/themes/twentytwentyfive-child/blocks/infinity-testimonial-both-side/block.php` - WordPress template
- `wp-content/themes/twentytwentyfive-child/blocks/infinity-testimonial-both-side/style.css` - WordPress styles
- `wp-content/themes/twentytwentyfive-child/functions.php` - Block registration

### Next.js
- `nextjs-wordpress/src/components/blocks/infinity-testimonial-both-side/InfinityTestimonialBothSideBlock.tsx` - React component
- `nextjs-wordpress/src/components/blocks/infinity-testimonial-both-side/styles.scss` - Component styles
- `nextjs-wordpress/src/components/blocks/BlockRenderer.tsx` - Block renderer registration
- `nextjs-wordpress/src/app/test-infinity-testimonial/page.tsx` - Test page

## Customization

### Styling
Modify the SCSS/CSS files to customize:
- Colors and gradients
- Card dimensions
- Animation speed
- Spacing and padding
- Typography

### Animation Speed
In the React component, adjust the `speed` constant:
```typescript
const speed = scroll_direction === 'right_to_left' ? -0.5 : 0.5;
// Increase for faster, decrease for slower
```

In the PHP template, adjust the `moveDistance` variable:
```javascript
const moveDistance = 0.5; // Pixels per frame
```

### Card Width
Adjust the slide width in both CSS files:
```css
.infinity-testimonial-both-side__slide {
  width: 350px; /* Change this value */
}
```

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support
- IE11: Not supported (uses modern CSS features)

## Performance

- Uses `requestAnimationFrame` for smooth 60fps animation
- Hardware-accelerated transforms
- Optimized for mobile devices
- Respects `prefers-reduced-motion` for accessibility

## Troubleshooting

### Block not appearing in WordPress
1. Ensure ACF plugin is active
2. Check if child theme is active
3. Clear WordPress cache
4. Check browser console for errors

### Animation not working
1. Check browser console for JavaScript errors
2. Ensure testimonials array has items
3. Verify CSS is loading correctly

### Videos not playing
1. Check video file format (MP4, WebM, MOV)
2. Verify video URL is accessible
3. Check browser video codec support

## Credits

Designed to match the reference image with infinite scroll functionality, rating display, and modern card-based layout.