# Service Roadmaps Block

A customizable ACF block for displaying service roadmaps with steps, icons, and a right-side image. This block uses unique CSS classes with the `srb-` prefix to avoid conflicts with other roadmap blocks.

## Features

- **Unique CSS Namespace**: Uses `srb-` prefixed classes to prevent conflicts with other blocks
- **Customizable Steps**: Add unlimited roadmap steps with titles and descriptions
- **Optional Icons**: Upload custom icons for each step or use automatic numbering
- **Right-side Image**: Display an image alongside the roadmap steps
- **Background Color**: Customize the background color of the entire section
- **Responsive Design**: Fully responsive layout that works on all devices
- **Smooth Animations**: Professional slide-in animations for steps and image
- **Proper Alignment**: Improved grid layout and alignment for better visual presentation

## CSS Classes Structure

The block uses a unique namespace to avoid conflicts:

- `.service-roadmaps-block` - Main container
- `.srb-container` - Grid container
- `.srb-left` / `.srb-right` - Left and right sections
- `.srb-content` - Content wrapper
- `.srb-heading` / `.srb-subheading` - Typography
- `.srb-steps` - Steps container
- `.srb-step` - Individual step
- `.srb-counter-wrapper` / `.srb-counter` - Step counter elements
- `.srb-number` / `.srb-icon` - Counter content
- `.srb-line` - Connecting line between steps
- `.srb-step-content` - Step text content
- `.srb-step-title` / `.srb-step-description` - Step typography
- `.srb-image` - Image container

## ACF Fields

### Main Fields
- **Heading** (required): Main title for the roadmap section
- **Subheading** (optional): Additional descriptive text
- **Right Side Image** (optional): Image displayed on the right side
- **Background Color** (optional): Section background color (default: #e8f5e8)

### Roadmap Steps (Repeater)
- **Step Icon** (optional): Custom icon for the step
- **Step Title** (required): Title for the step
- **Step Description** (required): Detailed description of the step

## Usage

1. Add the "Service Roadmaps Block" to your page in the WordPress editor
2. Fill in the heading and optional subheading
3. Upload a right-side image if desired
4. Choose a background color
5. Add roadmap steps using the repeater field:
   - Enter a title for each step
   - Add a description
   - Optionally upload an icon (if no icon is provided, numbers will be used)

## Example Configuration

```
Heading: "Our DevOps Strategy Roadmap"
Subheading: "Strategic approach to digital transformation"
Background Color: #e8f5e8

Steps:
1. Assess & Analyze
   - Description: "Evaluate current DevOps maturity using industry frameworks..."
   
2. Implement Automation
   - Description: "Deploy CI/CD pipelines with clear milestones..."
   
3. Build Culture
   - Description: "Foster transparency through open communication channels..."
   
4. Refine & Optimize
   - Description: "Continuously enhance processes based on real-time feedback..."
```

## Styling

The block includes comprehensive CSS styling with:
- Unique `srb-` prefixed classes to prevent conflicts
- Responsive breakpoints for mobile, tablet, and desktop
- Hover effects on step counters and images
- Smooth animations and transitions (`srbSlideInLeft`, `srbSlideInRight`)
- Customizable color scheme
- Improved grid alignment and layout

## Block Alignment

Supports WordPress block alignment:
- **Wide**: Extends beyond content width
- **Full**: Full viewport width

## Conflict Prevention

This block is specifically designed to avoid conflicts with the existing roadmap block:
- Uses completely different CSS class names
- Unique animation names (`srbSlideInLeft` vs `slideInLeft`)
- Separate namespace (`srb-` prefix)
- Independent styling system

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes

## Files

- `block.php` - PHP template for WordPress rendering
- `style.css` - CSS styles for the block (with `srb-` prefixed classes)
- `ServiceRoadmapsBlock.tsx` - React component for Next.js frontend
- `styles.scss` - SCSS styles for React component (with `srb-` prefixed classes)
- ACF JSON configuration in `acf-json/group_service_roadmaps_block.json`