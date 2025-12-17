# Stories & Blog Block

A dynamic ACF block that displays the latest 4 posts from a configured Custom Post Type (CPT) and category with customizable background styling. **No frontend dropdowns** - all configuration is done in the WordPress admin.

## Features

- **Backend-Only Configuration**: All settings configured in WordPress admin (no frontend user controls)
- **Custom Post Type Support**: Works with any post type (Posts, Case Studies, Products, Testimonials, etc.)
- **Category Filtering**: Filter posts by specific category ID
- **Custom Background**: Configurable background color and optional background image
- **Responsive Design**: Mobile-friendly grid layout
- **Custom Styling**: Customizable background with automatic text overlay for images
- **Custom CTA Button**: Configurable button text and URL
- **Automatic Content Loading**: Displays latest 4 posts based on backend configuration

## ACF Fields

### Content Settings
- **Heading**: Main section title (default: "Success Stories")
- **Subheading**: Descriptive text below the heading
- **Post Type**: Post type slug to display (e.g., 'posts', 'case-studies')
- **Category**: Category ID for filtering (optional, leave empty for all categories)
- **Button Text**: CTA button text (default: "Show More")
- **Button URL**: CTA button destination URL

### Background Customization
- **Background Color**: Color picker for custom background color (default: #4a148c)
- **Background Image**: Optional image upload for background (overlays color)

## Usage in WordPress

1. **Add the Block**: In the WordPress editor, add the "Stories & Blog Block"
2. **Configure Content**: Set your heading, subheading, post type, and category
3. **Customize Background**: Choose your background color and optionally upload an image
4. **Set Button**: Configure your CTA button text and URL
5. **Save**: The block will automatically display the latest 4 posts from your configuration

## Usage in Next.js

### Direct Component Usage (Client Components)
```tsx
'use client';
import { StoriesBlogBlock } from '@/components/blocks/stories-blog-block';

const data = {
  heading: 'Success Stories',
  subheading: 'Your partner through complexities of Agile and DevOps transformation',
  post_type: 'case-studies',
  category: '5',
  button_text: 'View All Case Studies',
  button_url: '/case-studies',
  background_color: '#2d1b69',
  background_image: 'https://example.com/bg-image.jpg'
};

<StoriesBlogBlock data={data} />
```

### WordPress Integration
The block automatically initializes via the `ClientBlockInitializer` component when WordPress renders the PHP template with data attributes.

## API Endpoints Used

The block fetches data from WordPress REST API endpoints based on configuration:

- **Posts**: `/wp/v2/posts` (standard posts)
- **Case Studies**: `/wp/v2/case-studies` (custom post type)
- **Products**: `/wp/v2/products` (custom post type)
- **Testimonials**: `/wp/v2/testimonials` (custom post type)
- **Query Parameters**: `per_page=4&_embed=true&orderby=date&order=desc&categories={id}`

## Background Customization

### Color Customization
- WordPress color picker for easy color selection
- Supports hex colors and opacity
- Default fallback to purple gradient

### Image Backgrounds
- Upload any image as background
- Automatic overlay for text readability
- Responsive background sizing (cover)
- Combines with background color

### CSS Implementation
```css
.stories-blog-block {
  background-color: var(--custom-bg-color);
  background-image: url(var(--custom-bg-image));
  background-size: cover;
  background-position: center;
}

/* Automatic overlay for images */
.stories-blog-block[style*="background-image"]::before {
  background: rgba(0, 0, 0, 0.4);
}
```

## Styling

The block uses SCSS for styling with:
- Customizable background (color and/or image)
- White content cards with hover effects
- Responsive grid layout
- Automatic text overlay for background images
- Smooth transitions and animations

## File Structure

```
stories-blog-block/
├── StoriesBlogBlock.tsx        # Main React client component
├── styles.scss                # Component styles
├── index.ts                   # Export file
└── README.md                  # This documentation
```

## WordPress Files

```
wp-content/themes/twentytwentyfive/
├── blocks/stories-blog-block/
│   └── block.php           # PHP template with background support
├── acf-json/
│   └── group_stories_blog_block.json  # ACF field definitions
└── inc/
    └── acf-blocks.php      # Block registration
```

## Changes from Previous Version

### Removed Features
- ❌ Frontend post type dropdown
- ❌ Frontend category dropdown
- ❌ Dynamic post type fetching
- ❌ Real-time content switching

### Added Features
- ✅ Background color customization (color picker)
- ✅ Background image upload option
- ✅ Automatic text overlay for images
- ✅ Simplified backend-only configuration
- ✅ Always displays latest 4 posts from configured settings

### Benefits
- **Simpler UX**: No confusing dropdowns for end users
- **Better Performance**: No dynamic API calls for post types/categories
- **Consistent Content**: Content is predictable and configured by admins
- **Visual Customization**: Full background control for brand consistency
- **Faster Loading**: Fewer API requests and simpler logic

## Customization

### Adding New Post Types
1. Register the post type in WordPress with `'show_in_rest' => true`
2. Add the post type slug to the endpoint mapping in the component
3. Configure the post type in the block settings

### Styling Changes
Modify `styles.scss` to customize:
- Default colors and gradients
- Card layouts and hover effects
- Typography and spacing
- Responsive breakpoints
- Background overlay opacity

## Browser Support

- Modern browsers with ES6+ support
- React 18+
- Next.js 13+

## Dependencies

- React 18+
- Next.js 13+ (with Image optimization)
- WordPress REST API
- ACF Pro (for block registration and color picker)
- SCSS support

## Performance Features

- **Next.js Image Optimization**: Automatic image optimization and lazy loading
- **Responsive Images**: Multiple sizes generated automatically
- **WebP/AVIF Support**: Modern image formats for better performance
- **Placeholder Images**: Fallback images for posts without featured media
- **Lazy Loading**: Images load only when needed
- **Reduced API Calls**: No dynamic post type or category fetching