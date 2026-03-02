# Core Values Block

A responsive ACF block that displays company core values in a grid layout with a team image and center content section.

## Features

- **Responsive Grid Layout**: 3 columns on desktop, 2 on tablet, 1 on mobile
- **Team Image**: Large team photo in the center with customizable aspect ratio
- **Background Image Support**: Optional background image with overlay
- **Smooth Animations**: Cards fade in on scroll with staggered timing
- **Hover Effects**: Cards lift and shadow on hover
- **Fully Customizable**: All content editable through WordPress ACF fields

## Layout Structure

```
┌─────────────────────────────────────────┐
│  Value 1    │  Value 2    │  Value 3    │  (Top Row)
├─────────────────────────────────────────┤
│                                         │
│          Team Image (Center)            │
│                                         │
│     Center Heading & Description        │
│                                         │
├─────────────────────────────────────────┤
│  Value 4    │  Value 5    │  Value 6    │  (Bottom Row)
└─────────────────────────────────────────┘
```

## ACF Fields

### Core Values (Repeater)
- **Title**: Short value name (e.g., "Humility", "Integrity")
- **Description**: Detailed explanation of the value
- **Min**: 1 value
- **Max**: 6 values (recommended for optimal layout)

### Team Image (Image)
- **Required**: Yes
- **Recommended Size**: 1200x400px
- **Formats**: JPG, PNG, WebP
- **Min Size**: 800x300px

### Center Heading (Text)
- **Default**: "Push Beyond Boundaries"
- **Optional**: Can be customized

### Center Description (Textarea)
- **Default**: Pre-filled with sample text
- **Optional**: Can be customized

### Background Image (Image)
- **Optional**: Background image for the entire section
- **Effect**: Semi-transparent white overlay applied

## Usage in WordPress

1. Add the "Core Values Block" in the WordPress block editor
2. Add 3-6 core values with titles and descriptions
3. Upload a team image (1200x400px recommended)
4. Customize the center heading and description (optional)
5. Add a background image (optional)
6. Publish or update the page

## Usage in Next.js Frontend

The block is automatically rendered by the BlockRenderer component when the page data is fetched from WordPress.

### Component Location
```
nextjs-wordpress/src/components/blocks/core-values-block/CoreValuesBlock.tsx
```

### Styles Location
```
nextjs-wordpress/src/components/blocks/core-values-block/styles.scss
```

## Responsive Breakpoints

- **Desktop** (>1024px): 3 columns, full spacing
- **Tablet** (768px-1024px): 2 columns, reduced spacing
- **Mobile** (480px-768px): 1 column, compact spacing
- **Small Mobile** (<480px): 1 column, minimal spacing

## Customization

### Colors
Edit the SCSS file to change colors:
- Card background: `.core-values-block__card { background: #ffffff; }`
- Text colors: `.core-values-block__card-title { color: #000000; }`
- Overlay: `.core-values-block::before { background: rgba(255, 255, 255, 0.95); }`

### Spacing
Adjust padding and gaps in the SCSS file:
- Section padding: `.core-values-block { padding: 80px 20px; }`
- Card gap: `.core-values-block__row { gap: 30px; }`

### Animations
Modify the JavaScript file to change animation behavior:
- Stagger delay: `index * 100` (in milliseconds)
- Animation duration: `transition: 'opacity 0.6s ease, transform 0.6s ease'`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy (h2, h3)
- Alt text for images
- Keyboard navigation support
- Screen reader friendly

## Performance

- Lazy loading for images
- CSS-only hover effects
- Intersection Observer for scroll animations
- Optimized image formats (WebP recommended)

## Notes

- The block works best with exactly 6 values (3 top, 3 bottom)
- Team image aspect ratio adjusts automatically on different screen sizes
- Background image is optional and will be overlaid with semi-transparent white
- All animations are progressive enhancement (work without JavaScript)
