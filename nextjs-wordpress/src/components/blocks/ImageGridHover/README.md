# Image Grid Hover Block

A responsive image grid block with hover effects showing 5 images in a unique layout: 1 large image (50% width) on the left and 4 smaller images in a 2x2 grid (50% width) on the right.

## Features

- Section heading and subheading
- 5 images with individual hover overlays
- Each image has: heading, subheading, text, and optional URL
- Responsive layout that adapts to mobile
- Smooth hover animations with content reveal
- Click-through functionality with Next.js Link

## Layout

```
┌─────────────┬──────┬──────┐
│             │  2   │  3   │
│      1      ├──────┼──────┤
│   (Large)   │  4   │  5   │
└─────────────┴──────┴──────┘
```

## ACF Fields

- Section Heading (text)
- Section Subheading (textarea)
- For each of 5 images:
  - Image (image field)
  - Heading (text)
  - Subheading (text)
  - Text (textarea)
  - URL (url field)

## Usage in WordPress

1. Import the ACF JSON file in WordPress
2. Copy the PHP block file to your theme's blocks folder
3. Register the block in functions.php
4. Add the block in the WordPress editor

## Usage in Next.js

```tsx
import ImageGridHover from '@/components/blocks/ImageGridHover';

<ImageGridHover
  section_heading="The next"
  section_subheading="We bring you powerful advantages..."
  image_1={imageData1}
  image_1_heading="Experience"
  image_1_subheading="Design-led transformation"
  image_1_text="Create unified digital experiences..."
  image_1_url="/experience"
  // ... repeat for images 2-5
/>
```
