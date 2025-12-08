# Navigation Next Block

A regional navigation block with a 2x2 grid layout featuring hover effects and a call-to-action section.

## Features

- **Regional Grid**: 2x2 grid layout for displaying regions (Americas, Asia Pacific, Europe, Middle East and Africa)
- **Hover Effects**: Smooth transitions with scale, shadow, and color changes on hover
- **CTA Section**: Bottom section with heading and button
- **Responsive**: Mobile-friendly with single column layout on smaller screens
- **Customizable**: All content editable through WordPress ACF fields

## Usage

### In WordPress

1. Add the "Navigation Next Block" from the block inserter
2. Configure the regions:
   - Add region names (e.g., "Americas", "Asia Pacific")
   - Set links for each region
3. Set the CTA heading (e.g., "Let's help you navigate your next")
4. Configure the button text and link

### In Next.js

The block is automatically rendered through the BlockRenderer component when present in WordPress content.

```tsx
import NavigationNextBlock from '@/components/blocks/navigation-next-block';

<NavigationNextBlock
  regions={[
    { name: 'Americas', link: '/americas' },
    { name: 'Asia Pacific', link: '/asia-pacific' },
    { name: 'Europe', link: '/europe' },
    { name: 'Middle East and Africa', link: '/mea' }
  ]}
  heading="Let's help you navigate your next"
  button_text="CONTACT US"
  button_link="/contact"
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `regions` | `Region[]` | Yes | Array of region objects with name and link |
| `heading` | `string` | No | CTA heading text |
| `button_text` | `string` | No | Button text |
| `button_link` | `string` | No | Button URL |

### Region Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | Region name |
| `link` | `string` | Yes | Region page URL |

## Styling

The block uses SCSS with the following features:
- Purple gradient background (#9b4d96)
- Hover effects with transform and shadow
- Responsive grid layout
- Smooth transitions

## Files

- `NavigationNextBlock.tsx` - React component
- `styles.scss` - Component styles
- `acf.json` - ACF field configuration for Next.js
- `block.php` - WordPress block template
- `style.css` - WordPress block styles
- `group_navigation_next_block.json` - ACF field group for WordPress
