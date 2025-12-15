# Image Grid Hover Block

A WordPress ACF block that displays 5 images in a unique grid layout with hover effects.

## File Structure

```
image-grid-hover/
├── block.php       # Main PHP template file
├── style.scss      # Source SCSS styles
├── style.css       # Compiled CSS (auto-loaded)
├── script.js       # JavaScript functionality (auto-loaded)
└── README.md       # This file
```

## Layout

- **Image 1**: Large image (50% width, spans 2 rows) - Left side
- **Images 2-5**: Small images (2x2 grid, 50% width) - Right side

```
┌─────────────┬──────┬──────┐
│             │  2   │  3   │
│      1      ├──────┼──────┤
│   (Large)   │  4   │  5   │
└─────────────┴──────┴──────┘
```

## Features

- Hover effects with overlay fade-in
- Smooth content slide-up animations
- Click-through URLs for each image
- Fully responsive (stacks on mobile)
- Auto-enqueued CSS and JS

## ACF Fields

Located in: `/acf-json/group_image_grid_hover.json`

- Section Heading
- Section Subheading
- For each of 5 images:
  - Image
  - Heading
  - Subheading
  - Text
  - URL

## Usage

1. Import ACF JSON from `/acf-json/` folder (auto-synced)
2. Add block in WordPress editor
3. Configure images and content
4. Publish!

## Customization

- Edit `style.scss` for styling changes
- Compile to CSS or edit `style.css` directly
- Modify `script.js` for interactive features
- Update `block.php` for template changes
