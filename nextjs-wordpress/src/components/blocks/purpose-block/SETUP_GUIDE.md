# Purpose Block Setup Guide

A customizable block to display your organization's purpose statement with angled corner borders.

## Features

- ✅ Angled corner borders (right top and left bottom)
- ✅ Customizable border color via ACF color picker
- ✅ Heading, sub-heading, and optional CTA button
- ✅ Fully responsive design
- ✅ Clean, centered layout
- ✅ GraphQL support for Next.js

## WordPress Setup

### 1. Import ACF Field Group

Run the import script once:
```
https://your-site.com/wp-content/themes/twentytwentyfive/import-purpose-block.php
```

**Important:** Delete the import file after running for security.

### 2. Block Registration

The block is automatically registered in `inc/acf-blocks.php`. No additional configuration needed.

### 3. Add Block to Page

1. Edit any page in WordPress
2. Click the "+" button to add a block
3. Search for "Purpose Block"
4. Add and configure:
   - **Heading**: Main title (e.g., "Our Purpose:")
   - **Sub Heading**: Description text
   - **Button Text**: Optional CTA text
   - **Button Link**: Optional CTA URL
   - **Border Color**: Choose your brand color (default: #00A3E0)

## Next.js Setup

### 1. Component Location

```
nextjs-wordpress/src/components/blocks/purpose-block/
├── PurposeBlock.tsx
├── styles.scss
├── acf.json
└── SETUP_GUIDE.md
```

### 2. Import Component

In your block renderer:

```typescript
import PurposeBlock from '@/components/blocks/purpose-block/PurposeBlock';

// In your render function
case 'acf/purpose-block':
  return <PurposeBlock key={index} data={block.attributes.data} />;
```

### 3. GraphQL Query

Add to your page query:

```graphql
... on AcfPurposeBlock {
  name
  attributes {
    data {
      heading
      sub_heading
      button_text
      button_link
      border_color
    }
  }
}
```

## Customization

### Border Color

The border color can be customized:
- **In WordPress**: Use the color picker in block settings
- **In Code**: Pass `border_color` prop (hex format)

### Styling

Edit `styles.scss` to customize:
- Font sizes and weights
- Padding and spacing
- Border thickness (adjust `top`, `left`, `right`, `bottom` in `::before`)
- Corner angle size (adjust polygon values)

### Corner Angles

To adjust the corner cut size, modify the polygon values:
- Current: 40px corners (desktop), 30px (tablet), 20px (mobile)
- Change all instances of these values in the clip-path

## Design Specifications

- **Desktop**: 60px padding, 40px corner cuts
- **Tablet**: 40px padding, 30px corner cuts
- **Mobile**: 30px padding, 20px corner cuts
- **Border**: 3px thickness
- **Max Width**: 1200px container

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Uses CSS `clip-path` for angled corners
- Fallback: Standard rectangle on older browsers

## Troubleshooting

### Border not showing
- Check that `border_color` is a valid hex color
- Verify CSS custom property support in browser

### Corners not angled
- Ensure `clip-path` is supported
- Check for CSS conflicts

### Content not centered
- Verify container max-width
- Check padding values

## Example Usage

```tsx
<PurposeBlock 
  data={{
    heading: "Our Purpose:",
    sub_heading: "To amplify human potential and create the next opportunity for people, businesses and communities",
    button_text: "LEARN MORE",
    button_link: "/about",
    border_color: "#00A3E0"
  }}
/>
```
