# Full Width Left Text Section Block

A full-width section component with left-aligned text content and right-side image, designed for showcasing case studies and featured content.

## Features

- Full-width golden background (#b8860b)
- Left-aligned content area with heading, subheading, and CTA button
- Case studies section with two entries
- Right-side image display
- Decorative background elements
- Fully responsive design
- BEM-style SCSS architecture

## ACF Fields

### Main Content
- `heading` (Text) - Main heading text
- `sub_heading` (Text) - Subheading/tagline
- `button_text` (Text) - CTA button text
- `button_url` (URL) - CTA button link

### First Case Study
- `heading_bottom_1st` (Text) - First case study heading
- `title_bottom_1st` (Text) - First case study description
- `url_text` (Text) - First case study link text
- `url_link` (URL) - First case study link URL

### Second Case Study
- `heading_bottom_2nd` (Text) - Second case study heading
- `title_bottom_2nd` (Text) - Second case study description
- `url_title_2nd` (Text) - Second case study link text
- `url_link_2nd` (URL) - Second case study link URL

### Image
- `right_image` (Image) - Right-side decorative image

## Usage

This block is automatically registered as an ACF block type and can be added through the WordPress block editor.

### In WordPress
1. Go to any page/post editor
2. Click the "+" button to add a block
3. Search for "Full Width Left Text Section"
4. Fill in the ACF fields
5. Publish

### In Next.js
The block is automatically rendered through the BlockRenderer component when fetching page/post content from WordPress.

## File Structure

```
FullWidthLeftTextSection/
├── index.tsx       # React component
├── styles.scss     # SCSS styles (BEM methodology)
└── README.md       # This file
```

## Styling

The component uses BEM (Block Element Modifier) methodology for CSS class naming:

- `.full-width-left-text-section` - Main block
- `.full-width-left-text-section__container` - Content container
- `.full-width-left-text-section__content` - Left content area
- `.full-width-left-text-section__heading` - Main heading
- `.full-width-left-text-section__button` - CTA button
- `.full-width-left-text-section__case-study` - Individual case study
- `.full-width-left-text-section__image` - Right image container
- `.full-width-left-text-section__decoration` - Decorative elements

## Responsive Behavior

- Desktop: Two-column layout (content left, image right)
- Mobile (< 768px): Single-column stacked layout
- Decorative elements hidden on mobile
- Font sizes adjusted for smaller screens
