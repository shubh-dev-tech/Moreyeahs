# Specializations Section Block

A dynamic ACF block that displays a two-column layout with customizable content and background options.

## Features

### Left Side - Repeater Items
- **Image**: Upload custom images for each item
- **Heading**: Main title for each specialization
- **Heading Color**: Customizable color for each heading
- **Subheading**: Description text for each item
- **Subheading Color**: Customizable color for each subheading

### Right Side - Content Area
- **Main Heading**: Primary heading for the section
- **Heading Color**: Customizable color for the main heading
- **Span Text**: Highlighted text within the heading
- **Span Color**: Customizable color for the highlighted span
- **Paragraphs**: Repeater field for multiple paragraphs
- **Paragraph Colors**: Individual color control for each paragraph

### Background Options
- **Solid Color**: Single background color
- **Gradient**: Linear gradient with start/end colors and direction control
- **Background Image**: Upload custom background image with cover positioning

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Background Area                       │
│  ┌─────────────────────┐  ┌─────────────────────────┐   │
│  │     Left Side       │  │     Right Side          │   │
│  │                     │  │                         │   │
│  │  [Icon] Heading 1   │  │  Main Heading + Span    │   │
│  │         Subheading  │  │                         │   │
│  │                     │  │  Paragraph 1            │   │
│  │  [Icon] Heading 2   │  │  Paragraph 2            │   │
│  │         Subheading  │  │  Paragraph 3            │   │
│  │                     │  │                         │   │
│  │  [Icon] Heading 3   │  │                         │   │
│  │         Subheading  │  │                         │   │
│  └─────────────────────┘  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Usage

1. Add the "Specializations Section" block to your page
2. Configure the left side items:
   - Add images, headings, and subheadings
   - Customize colors for each element
3. Set up the right side content:
   - Add main heading and optional span text
   - Add multiple paragraphs as needed
   - Customize colors for all text elements
4. Choose background style:
   - Solid color, gradient, or background image
5. Preview and publish

## Responsive Design

- **Desktop**: Two-column layout with 60px gap
- **Tablet**: Single column layout with reduced spacing
- **Mobile**: Stacked layout with centered content and smaller images

## Default Fallback Content

If no content is provided, the block displays sample Microsoft specializations content as a reference.

## File Structure

```
blocks/specializations-section/
├── block.php          # WordPress template
├── style.css          # WordPress styles
└── README.md          # This documentation

nextjs-wordpress/src/components/blocks/specializations-section/
├── SpecializationsSection.tsx  # React component
├── styles.scss                 # NextJS styles
└── acf.json                   # Field definitions
```

## Color Customization

All text elements support individual color customization:
- Left item headings and subheadings
- Right main heading and span text
- Individual paragraph colors
- Default colors are provided for consistency

## Background Options

### Solid Color
- Single color picker
- Default: Light cyan (#E0F7FA)

### Gradient
- Start and end color pickers
- Direction options: Left to Right, Right to Left, Top to Bottom, Bottom to Top, Diagonal (45°), Diagonal (135°)
- Default: Light cyan to lighter cyan

### Background Image
- Image upload with full cover positioning
- Maintains aspect ratio and centers content