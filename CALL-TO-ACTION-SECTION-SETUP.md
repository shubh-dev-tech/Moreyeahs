# Call to Action Section Block Setup Guide

## Overview

The Call to Action Section block is a powerful, customizable block that creates engaging call-to-action sections with animated particle effects, flexible styling options, and responsive design. It's perfect for landing pages, service pages, and any content that needs to drive user engagement.

## Features

### Visual Features
- **Animated Particle Effects**: Floating particles with different colors and animations
- **Customizable Backgrounds**: Solid colors or background images with adjustable overlay
- **Multiple Button Styles**: Primary (blue gradient), Secondary (pink gradient), Outline (transparent)
- **Text Alignment Options**: Left, center, or right alignment
- **Responsive Design**: Optimized for all screen sizes
- **Hover Effects**: Interactive button animations and particle effects

### Content Features
- **Main Heading**: Large, prominent heading text
- **Sub Heading**: Supporting descriptive text
- **Call-to-Action Button**: Customizable button with link and styling options
- **Flexible Layout**: Supports full width and wide alignment

### Technical Features
- **ACF Integration**: Easy-to-use WordPress admin interface
- **NextJS Compatible**: Works seamlessly with headless WordPress setups
- **Performance Optimized**: CSS animations with hardware acceleration
- **Accessibility Compliant**: Proper semantic HTML and keyboard navigation
- **SEO Friendly**: Structured content with proper heading hierarchy

## Installation

### 1. Files Created

**NextJS Components:**
- `nextjs-wordpress/src/components/blocks/call-to-action-section/CallToActionSection.tsx`
- `nextjs-wordpress/src/components/blocks/call-to-action-section/styles.scss`
- `nextjs-wordpress/src/components/blocks/call-to-action-section/acf.json`

**WordPress Files:**
- `wp-content/themes/twentytwentyfive-child/blocks/call-to-action-section/block.php`
- `wp-content/themes/twentytwentyfive-child/blocks/call-to-action-section/style.css`
- `wp-content/themes/twentytwentyfive-child/acf-json/group_call_to_action_section.json`

**Test Files:**
- `nextjs-wordpress/src/app/test-call-to-action/page.tsx`
- `sync-call-to-action-acf.php`
- `test-call-to-action-block.php`

### 2. Block Registration

The block is automatically registered in `functions.php` with:
- Block name: `acf/call-to-action-section`
- Category: Formatting
- Icon: Megaphone
- Supports: Full/wide alignment, anchor links, JSX mode

### 3. ACF Field Group

The ACF field group includes:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Background Color | Color Picker | No | Section background color (default: #1a1a2e) |
| Background Image | Image | No | Optional background image |
| Overlay Opacity | Range | No | Darkness overlay for background images (0-1) |
| Main Heading | Text | Yes | Primary heading text |
| Sub Heading | Textarea | No | Supporting description text |
| Button Text | Text | No | Call-to-action button text |
| Button Link | URL | No | Button destination URL |
| Button Style | Select | No | Primary/Secondary/Outline styles |
| Text Alignment | Select | No | Left/Center/Right alignment |

## Usage

### In WordPress Admin

1. **Add the Block**
   - Go to Pages > Add New or edit existing page
   - Click the '+' button to add a block
   - Search for "Call to Action Section"
   - Add the block to your page

2. **Configure Fields**
   - **Main Heading**: Enter your primary call-to-action message
   - **Sub Heading**: Add supporting text to explain the value proposition
   - **Button Text**: Set the action text (e.g., "Get Started", "Contact Us")
   - **Button Link**: Enter the destination URL
   - **Button Style**: Choose from three styles:
     - Primary: Blue gradient background
     - Secondary: Pink gradient background  
     - Outline: Transparent with white border
   - **Text Alignment**: Choose left, center, or right alignment
   - **Background**: Set color and optionally add background image
   - **Overlay**: Adjust darkness when using background images

3. **Preview and Publish**
   - Use the preview to see how it looks
   - Adjust settings as needed
   - Publish when satisfied

### In NextJS

```tsx
import CallToActionSection from '../components/blocks/call-to-action-section/CallToActionSection';

const data = {
  background_color: '#1a1a2e',
  heading: "Let's Solve What's Next",
  sub_heading: "Tell us your challenge. We'll design the solution.",
  button_text: "Talk to Our Experts",
  button_link: "#contact",
  button_style: 'primary',
  text_alignment: 'center',
  overlay_opacity: 0.7
};

<CallToActionSection data={data} />
```

## Styling Options

### Button Styles

**Primary Button (default)**
- Blue gradient background (#667eea to #764ba2)
- White text
- Hover effects with shadow and lift

**Secondary Button**
- Pink gradient background (#f093fb to #f5576c)
- White text
- Hover effects with shadow and lift

**Outline Button**
- Transparent background
- White border and text
- Hover effects with subtle background

### Text Alignment

**Center Aligned (default)**
- All content centered
- Best for hero sections and main CTAs

**Left Aligned**
- Content aligned to the left
- Good for sidebar CTAs or asymmetric layouts

**Right Aligned**
- Content aligned to the right
- Useful for specific design requirements

## Customization

### CSS Variables

The block uses CSS custom properties that can be overridden:

```scss
.call-to-action-section {
  --cta-primary-color: #667eea;
  --cta-secondary-color: #f093fb;
  --cta-text-color: #ffffff;
  --cta-particle-color: rgba(255, 255, 255, 0.6);
}
```

### Particle Effects

Particles are automatically generated with:
- 50 particles per section
- 5 different animation patterns
- Randomized positions and colors
- CSS-only animations for performance

### Responsive Breakpoints

- **Desktop**: Full effects and sizing
- **Tablet (768px)**: Reduced padding and font sizes
- **Mobile (480px)**: Optimized for small screens

## Best Practices

### Content Guidelines

1. **Heading**: Keep it concise and action-oriented (5-8 words)
2. **Sub Heading**: Explain the value proposition clearly (1-2 sentences)
3. **Button Text**: Use action verbs ("Get Started", "Learn More", "Contact Us")
4. **Button Link**: Always provide a meaningful destination

### Design Guidelines

1. **Background Images**: Use high-quality images (1920px+ width)
2. **Overlay Opacity**: Ensure text remains readable (0.5-0.8 recommended)
3. **Color Contrast**: Maintain accessibility standards
4. **Alignment**: Center alignment works best for most use cases

### Performance Tips

1. **Image Optimization**: Compress background images
2. **Particle Count**: Default 50 particles provide good balance
3. **Animation Performance**: Uses CSS transforms for hardware acceleration

## Troubleshooting

### Common Issues

**Block Not Appearing**
- Ensure ACF plugin is active
- Run the sync script: `php sync-call-to-action-acf.php`
- Check that functions.php includes the block registration

**Styling Issues**
- Verify CSS file is being loaded
- Check for theme conflicts
- Ensure proper file permissions

**Field Data Not Saving**
- Confirm ACF field group is active
- Check field names match exactly
- Verify WordPress user permissions

### Debug Commands

```bash
# Sync ACF fields
php sync-call-to-action-acf.php

# Test block functionality
php test-call-to-action-block.php

# Check file permissions
ls -la wp-content/themes/twentytwentyfive-child/blocks/call-to-action-section/
```

## Examples

### Basic CTA (Matching Original Design)
```php
// WordPress ACF data
$data = [
    'heading' => "Let's Solve What's Next",
    'sub_heading' => "Tell us your challenge. We'll design the solution.",
    'button_text' => "Talk to Our Experts",
    'button_link' => "#contact",
    'button_style' => 'primary',
    'text_alignment' => 'center',
    'background_color' => '#1a1a2e'
];
```

### CTA with Background Image
```php
$data = [
    'heading' => "Ready to Transform Your Business?",
    'sub_heading' => "Join hundreds of companies that trust us with their digital transformation journey.",
    'button_text' => "Get Started Today",
    'button_link' => "https://example.com/contact",
    'button_style' => 'secondary',
    'text_alignment' => 'center',
    'background_color' => '#1a1a2e',
    'background_image' => [
        'url' => 'https://example.com/bg-image.jpg',
        'alt' => 'Technology background'
    ],
    'overlay_opacity' => 0.6
];
```

### Left-Aligned Outline CTA
```php
$data = [
    'heading' => "Need Expert Consultation?",
    'sub_heading' => "Our team of specialists is ready to help you navigate complex challenges.",
    'button_text' => "Schedule a Call",
    'button_link' => "/contact",
    'button_style' => 'outline',
    'text_alignment' => 'left',
    'background_color' => '#2d3748'
];
```

## Testing

### Test Page
Visit `/test-call-to-action` in your NextJS application to see all variations of the block in action.

### WordPress Testing
1. Create a new page in WordPress admin
2. Add the Call to Action Section block
3. Configure with test content
4. Preview to verify functionality

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all files are in place
3. Run the test scripts to diagnose problems
4. Check WordPress and ACF documentation for advanced customization

The Call to Action Section block provides a professional, engaging way to drive user action while maintaining flexibility and ease of use for content creators.