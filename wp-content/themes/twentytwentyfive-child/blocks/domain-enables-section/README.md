# Domain Enables Section Block

A dynamic ACF block that displays a section with customizable background, feature points with icons, and layout controls.

## Features

### Background Options
- **Solid Color**: Choose any color with opacity support
- **Gradient**: Create linear gradients with start/end colors and direction control
- **Background Image**: Upload and use custom background images

### Content Management
- **Heading**: Rich text editor with HTML support (use `<span class="highlight">text</span>` for colored text)
- **Subheading**: Rich text editor for description content
- **Feature Points**: Repeater field for adding multiple feature items

### Icon Management
- **Global Icon**: Upload one icon image that automatically applies to all feature points
- **Default Checkmark**: If no icon is uploaded, a styled checkmark appears automatically

### Layout Controls
- **Reverse Layout**: Toggle to flip the design (image on left, content on right)
- **Responsive**: Automatically adapts to mobile devices

## Usage in WordPress

1. Add the "Domain Enables Section" block to your page
2. Configure the background (color, gradient, or image)
3. Add your heading and subheading content
4. Upload an icon image (optional - defaults to checkmark)
5. Add feature points using the repeater field
6. Upload a main illustration image
7. Toggle reverse layout if needed

## Usage in NextJS

The block automatically renders in NextJS frontend with all styling and functionality preserved.

## Styling

- CSS file: `style.css` (WordPress)
- SCSS file: `styles.scss` (NextJS)
- Responsive breakpoints: 768px and 480px
- Hover effects on feature points
- Smooth transitions and animations

## Example Content

```
Heading: What This <span class="highlight">Domain Enables</span>
Subheading: We help organizations unlock the full value of the Microsoft ecosystem...
Feature Points:
- Centralize business operations
- Automate repetitive processes  
- Improve cross team collaboration
- Scale securely with Azure
```