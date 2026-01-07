# Hero Section Block

A dynamic ACF block for creating hero sections with full customization options.

## Features

- **Full-size image support** - Images take the full size of their container
- **Background image option** - Set a background image for the entire section
- **Background overlay control** - Adjust overlay opacity (0-100%) when using background images
- **Reverse layout option** - Change content order on mobile devices
- **Background color customization** - Set any background color (works with or without background image)
- **Height options** - Auto, Small (400px), Medium (600px), Large (800px), Full Screen (100vh)
- **Heading and subheading color settings** - Customize text colors independently
- **Content alignment** - Left, Center, or Right alignment
- **Image position** - Left or Right side placement
- **Responsive design** - Optimized for all screen sizes

## Usage

### WordPress Admin

1. Add the "Hero Section" block to your page
2. Configure the following settings:
   - **Heading**: Main title text
   - **Sub Heading/Content**: Supporting text (supports rich text)
   - **Hero Image**: Main image for the section
   - **Layout Settings**:
     - Reverse Section Layout: Changes mobile layout order
     - Image Position: Left or Right side
     - Content Alignment: Text alignment
   - **Height Settings**:
     - Section Height: Choose from predefined heights
   - **Color Settings**:
     - Background Color: Section background
     - Background Image: Optional background image for the section
     - Background Overlay Opacity: Control overlay darkness (0-100%)
     - Heading Color: Main title color
     - Sub Heading Color: Content text color

### NextJS Frontend

The block automatically renders with the `HeroSection` component, which handles:
- Image processing and optimization
- Responsive layout adjustments
- Color and styling application
- Accessibility features

## Example

Based on the "Why DevOps?" section shown in the design, this block creates:
- Purple gradient background (or background image with overlay)
- Left-aligned content with heading and paragraph text
- Right-side image with technical graphics
- Medium height (600px) container
- Customizable overlay opacity for background images
- Responsive mobile layout

## File Structure

```
hero-section/
├── HeroSection.tsx     # React component
├── styles.scss         # SCSS styles
├── acf.json           # ACF field configuration
└── README.md          # This documentation
```

## WordPress Files

```
wp-content/themes/twentytwentyfive-child/
├── blocks/hero-section/
│   ├── block.php      # PHP template
│   └── style.css      # CSS styles
└── acf-json/
    └── group_hero_section.json  # ACF field group
```