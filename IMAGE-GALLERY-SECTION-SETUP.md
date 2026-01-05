# Image Gallery Section Block - Setup Guide

## Overview

The Image Gallery Section is a flexible ACF block that allows users to create beautiful image galleries with multiple layout options and an infinite slider mode. Perfect for showcasing partnerships, certifications, portfolios, or any collection of images.

## Features

### ✨ Core Features
- **Flexible Grid Layouts**: Choose from 3, 4, 5, or 6 column layouts
- **Infinite Slider Mode**: Smooth infinite loop carousel with customizable speed
- **Responsive Design**: Automatically adapts to different screen sizes
- **Customizable Colors**: Background and text color options
- **Hover Effects**: Elegant hover animations and transitions
- **Modern Styling**: Glass morphism effects and smooth animations

### 🎛️ User Controls
- **Heading & Sub-heading**: Optional title and description
- **Gallery Images**: Upload multiple images with ACF gallery field
- **Layout Options**: 3/4/5/6 column grid layouts
- **Slider Toggle**: Enable/disable infinite slider mode
- **Slider Speed**: Adjustable animation speed (1-10 seconds)
- **Autoplay Control**: Enable/disable automatic sliding
- **Color Customization**: Background and text color pickers

## File Structure

```
wp-content/themes/twentytwentyfive-child/
├── acf-json/
│   └── group_image_gallery_section.json          # ACF field definitions
├── blocks/
│   └── image-gallery-section/
│       ├── block.php                             # WordPress block template
│       └── style.css                             # WordPress block styles
└── inc/
    └── acf-blocks.php                            # Block registration (updated)

nextjs-wordpress/src/components/blocks/
└── image-gallery-section/
    ├── ImageGallerySection.tsx                   # React component
    ├── styles.scss                               # Next.js styles
    └── acf.json                                  # ACF field definitions (copy)

Root files:
├── sync-image-gallery-acf.php                   # ACF sync script
└── IMAGE-GALLERY-SECTION-SETUP.md              # This documentation
```

## Installation Steps

### 1. Sync ACF Fields

Run the sync script to register the ACF field group:

```bash
php sync-image-gallery-acf.php
```

### 2. Verify Block Registration

The block has been added to `wp-content/themes/twentytwentyfive-child/inc/acf-blocks.php`. Verify it appears in the WordPress block editor under the "Media" category.

### 3. Test the Block

1. **WordPress Admin**: Create a new page/post and add the "Image Gallery Section" block
2. **Next.js**: Visit `/test-image-gallery` to see all layout variations

## Usage Examples

### Basic 4-Column Grid
```php
// In WordPress block editor:
- Heading: "Cloud & Platform Partnerships"
- Sub Heading: "Trusted partnerships with leading technology providers"
- Gallery Images: Upload 4-8 images
- Gallery Layout: "4 Columns"
- Enable Infinite Slider: No
- Background Color: #ffffff
- Text Color: #333333
```

### Infinite Slider Mode
```php
// In WordPress block editor:
- Heading: "Our Partners in Motion"
- Sub Heading: "Continuously evolving partnerships"
- Gallery Images: Upload 6+ images
- Gallery Layout: "4 Columns"
- Enable Infinite Slider: Yes
- Slider Speed: 3 seconds
- Autoplay Slider: Yes
- Background Color: #f8f9fa
- Text Color: #2c3e50
```

## ACF Field Configuration

### Field Group: `group_image_gallery_section`

| Field Name | Type | Description | Required |
|------------|------|-------------|----------|
| `heading` | Text | Main section heading | No |
| `sub_heading` | Textarea | Description text | No |
| `gallery_images` | Gallery | Multiple image upload | Yes |
| `gallery_layout` | Select | Column count (3/4/5/6) | Yes |
| `enable_slider` | True/False | Toggle slider mode | No |
| `slider_speed` | Number | Animation speed (1-10s) | No |
| `autoplay_slider` | True/False | Auto-advance slides | No |
| `background_color` | Color Picker | Section background | No |
| `text_color` | Color Picker | Text color | No |

## Responsive Behavior

### Desktop (1024px+)
- All column layouts display as configured
- Hover effects fully active
- Smooth animations

### Tablet (768px - 1024px)
- 6 columns → 4 columns
- 5 columns → 4 columns
- 3-4 columns remain unchanged

### Mobile (480px - 768px)
- 4+ columns → 3 columns
- Reduced image heights
- Simplified animations

### Small Mobile (< 480px)
- All layouts → 2 columns
- Minimal padding
- Touch-optimized

## Styling Features

### Grid Mode
- **Hover Effects**: Images scale and lift on hover
- **Box Shadows**: Subtle depth with enhanced shadows on hover
- **Border Radius**: Modern rounded corners (12px)
- **Transitions**: Smooth CSS transitions for all interactions

### Slider Mode
- **Infinite Loop**: Seamless continuous scrolling
- **Fade Edges**: Gradient overlays on slider edges
- **Smooth Animation**: CSS transitions with easing functions
- **Auto-reset**: Invisible reset to beginning for infinite effect

### Visual Enhancements
- **Glass Morphism**: Semi-transparent backgrounds with blur effects
- **Loading Animation**: Shimmer effect while images load
- **Dark Mode Support**: Automatic dark theme detection
- **Accessibility**: Proper alt text and keyboard navigation

## Customization Options

### Color Schemes
```scss
// Light theme
background-color: #ffffff
text-color: #333333

// Dark theme  
background-color: #2c3e50
text-color: #ffffff

// Brand colors
background-color: #f8f9fa
text-color: #1565c0
```

### Layout Variations
- **3 Columns**: Best for detailed images, fewer items
- **4 Columns**: Balanced layout, most versatile
- **5 Columns**: Compact display, many items
- **6 Columns**: Maximum density, logos/icons

### Slider Settings
- **Speed Range**: 1-10 seconds per slide
- **Autoplay**: Can be disabled for manual control
- **Infinite Loop**: Always enabled when slider mode is active

## Browser Support

- **Modern Browsers**: Full feature support
- **CSS Grid**: Required for layout (IE11+ support)
- **CSS Transforms**: Required for slider animation
- **Backdrop Filter**: Enhanced on supporting browsers

## Performance Considerations

### Image Optimization
- Uses Next.js Image component for optimization
- Responsive image sizes based on layout
- Lazy loading for better performance

### Animation Performance
- CSS transforms for smooth 60fps animations
- Hardware acceleration enabled
- Minimal JavaScript for slider logic

### Loading Strategy
```javascript
// Image sizes based on layout
sizes={`(max-width: 768px) 50vw, (max-width: 1024px) 33vw, ${100 / parseInt(gallery_layout)}vw`}
```

## Troubleshooting

### Common Issues

1. **Block Not Appearing**
   - Run `php sync-image-gallery-acf.php`
   - Check ACF Pro is activated
   - Verify block registration in `acf-blocks.php`

2. **Images Not Loading**
   - Check image upload permissions
   - Verify image URLs are accessible
   - Ensure proper image sizes are generated

3. **Slider Not Working**
   - Check JavaScript console for errors
   - Verify slider mode is enabled
   - Ensure minimum 2 images are uploaded

4. **Styling Issues**
   - Clear cache if using caching plugins
   - Check CSS file is properly enqueued
   - Verify no theme conflicts

### Debug Steps

1. **Check ACF Fields**:
   ```php
   // Add to block.php for debugging
   echo '<pre>';
   print_r(get_fields());
   echo '</pre>';
   ```

2. **Verify Block Registration**:
   ```php
   // Check registered blocks
   $blocks = acf_get_block_types();
   var_dump($blocks);
   ```

3. **Test Image URLs**:
   ```php
   // Verify image data structure
   $images = get_field('gallery_images');
   foreach($images as $image) {
       echo $image['url'] . '<br>';
   }
   ```

## Future Enhancements

### Planned Features
- [ ] Lightbox/modal view for images
- [ ] Image captions and descriptions
- [ ] Masonry/Pinterest-style layout
- [ ] Video support in gallery
- [ ] Advanced animation options
- [ ] Drag-and-drop reordering

### Customization Ideas
- Add custom CSS classes option
- Integration with popular lightbox plugins
- Advanced hover effects selection
- Custom breakpoint settings
- Animation timing controls

## Support

For issues or questions:
1. Check this documentation first
2. Review the test page at `/test-image-gallery`
3. Examine the browser console for JavaScript errors
4. Verify ACF field group is properly synced

---

**Created**: January 2026  
**Version**: 1.0.0  
**Compatibility**: WordPress 5.0+, ACF Pro 5.8+, Next.js 13+