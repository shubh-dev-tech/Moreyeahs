# Service Details Section Block - Setup Guide

## Overview

The Service Details Section is a dynamic ACF block that displays services in a responsive grid layout. It's perfect for showcasing service offerings, solutions, or features with icons, descriptions, and optional links.

## Features

- **Customizable Background**: Choose background color and optional background image
- **Flexible Content**: Main heading, sub-heading, and repeatable service items
- **Responsive Grid**: 2, 3, or 4 column layouts that adapt to mobile
- **Service Items**: Each service includes icon, title, description, and optional link
- **Mobile Optimized**: Automatically stacks to single column on mobile devices
- **Hover Effects**: Smooth animations and hover states for better UX

## Files Created

### WordPress Backend (ACF Block)
```
wp-content/themes/twentytwentyfive-child/
├── blocks/service-details-section/
│   ├── block.php                    # PHP template
│   └── style.css                    # WordPress styles
├── acf-json/
│   └── group_service_details_section.json  # ACF field definitions
└── inc/acf-blocks.php              # Block registration (updated)
```

### Next.js Frontend
```
nextjs-wordpress/src/components/blocks/service-details-section/
├── ServiceDetailsSection.tsx        # React component
├── acf.json                        # Field schema for reference
└── styles.scss                     # Next.js styles
```

### Test & Sync Files
```
├── sync-service-details-acf.php     # ACF field sync script
└── nextjs-wordpress/src/app/test-service-details/page.tsx  # Test page
```

## Setup Instructions

### 1. Sync ACF Fields to WordPress

Run the sync script to register the ACF fields:

```bash
php sync-service-details-acf.php
```

### 2. Verify Block Registration

The block should now appear in the WordPress block editor under "Formatting" category as "Service Details Section".

### 3. Test the Block

#### WordPress Admin:
1. Edit any page/post
2. Add the "Service Details Section" block
3. Configure the fields:
   - Background color
   - Background image (optional)
   - Main heading
   - Sub heading
   - Add services with icons, titles, descriptions
   - Choose grid columns (2, 3, or 4)

#### Next.js Frontend:
Visit the test page: `http://localhost:3000/test-service-details`

## Block Configuration

### Background Settings
- **Background Color**: Color picker for section background
- **Background Image**: Optional image overlay on background color

### Content Settings
- **Main Heading**: Primary section title
- **Sub Heading**: Descriptive text below the heading

### Services (Repeater)
Each service item includes:
- **Service Icon**: Upload icon image (recommended 64x64px SVG/PNG)
- **Service Title**: Name of the service
- **Service Description**: Text description (supports bullet points with • or -)
- **Service Link**: Optional URL to link the entire service item

### Layout Settings
- **Grid Columns**: Choose 2, 3, or 4 columns for desktop layout

## Usage Examples

### Basic 3-Column Services Grid
```php
// WordPress ACF data structure
$services = [
    [
        'service_icon' => ['url' => '/path/to/icon1.svg'],
        'service_title' => 'Data Science & AI',
        'service_description' => "• AI/ML models\n• Computer vision\n• Predictive analytics",
        'service_link' => 'https://example.com/ai-services'
    ],
    // ... more services
];
```

### React Component Usage
```tsx
<ServiceDetailsSection
  background_color="#f8f9fa"
  heading="What We Mean by Solutions"
  sub_heading="We bring you powerful advantages"
  grid_columns="3"
  services={servicesData}
/>
```

## Responsive Behavior

- **Desktop (1024px+)**: Shows configured column count (2, 3, or 4)
- **Tablet (768px-1024px)**: 4-column becomes 2-column, others remain
- **Mobile (< 768px)**: All layouts become single column
- **Small Mobile (< 480px)**: Reduced padding and font sizes

## Styling Customization

### CSS Classes Available
```css
.service-details-section          /* Main section */
.service-details-container        /* Content wrapper */
.service-details-header          /* Header area */
.service-details-heading         /* Main heading */
.service-details-subheading      /* Sub heading */
.services-grid                   /* Grid container */
.services-grid-2                 /* 2-column grid */
.services-grid-3                 /* 3-column grid */
.services-grid-4                 /* 4-column grid */
.service-item                    /* Individual service card */
.service-content                 /* Service content wrapper */
.service-icon                    /* Icon container */
.service-title                   /* Service title */
.service-description             /* Service description */
.service-link                    /* Link wrapper (when URL provided) */
```

### Dark Background Support
The block automatically adjusts text colors for dark backgrounds:
- Detects dark background colors (#000, #333, etc.)
- Changes text to white/light colors for better contrast

## API Integration

### WordPress REST API
The block data is available through WordPress REST API:

```json
{
  "blockName": "acf/service-details-section",
  "attrs": {
    "data": {
      "background_color": "#f8f9fa",
      "heading": "What We Mean by Solutions",
      "sub_heading": "We bring you powerful advantages",
      "grid_columns": "3",
      "services": [
        {
          "service_icon": {"url": "...", "alt": "..."},
          "service_title": "Data Science & AI",
          "service_description": "• AI/ML models\n• Computer vision",
          "service_link": "https://example.com"
        }
      ]
    }
  }
}
```

### Next.js Integration
The block is automatically rendered by the `BlockRenderer` component when the page data is fetched from WordPress.

## Troubleshooting

### Block Not Appearing
1. Ensure ACF Pro is installed and active
2. Run the sync script: `php sync-service-details-acf.php`
3. Clear WordPress cache
4. Check if the block is registered in `wp-content/themes/twentytwentyfive-child/inc/acf-blocks.php`

### Styling Issues
1. Check if CSS files are being loaded
2. Verify file paths in block registration
3. Clear browser cache
4. Check for CSS conflicts

### Next.js Rendering Issues
1. Ensure the component is imported in `BlockRenderer.tsx`
2. Check the block name mapping in `BLOCK_COMPONENTS`
3. Verify TypeScript interfaces match the data structure

## Performance Considerations

- **Images**: Use optimized SVG icons for best performance
- **Lazy Loading**: Icons are loaded with proper alt attributes
- **CSS**: Styles are scoped to prevent conflicts
- **Mobile**: Grid automatically collapses for better mobile performance

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with CSS Grid polyfill if needed)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Potential improvements for future versions:
- Animation options (fade-in, slide-up)
- Icon color customization
- Card shadow/border options
- Advanced typography controls
- Integration with WordPress media library for bulk icon upload