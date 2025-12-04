# Icon Text Grid Block

A flexible, responsive grid block featuring text and icon sections that are fully clickable with smooth hover animations.

## Features

- **Flexible Grid**: Add 2-12 items dynamically via ACF repeater field
- **Fully Clickable**: Each section is a complete clickable link
- **Icon Rotation**: Icons rotate 360° on hover (one time)
- **Responsive Design**: Adapts from 1 column (mobile) to multiple columns (desktop)
- **Accessibility**: Keyboard navigation and ARIA labels included

## Structure

```
IconTextGrid/
├── IconTextGrid.tsx    # React component for Next.js
├── styles.scss         # SCSS styles with animations
└── README.md          # This file
```

## WordPress Files

```
wordpress-theme-files/
├── blocks/icon-text-grid.php                    # PHP template
└── ACF_FIELD_GROUP_icon_text_grid.json         # ACF field configuration
```

## Theme Files

```
wp-content/themes/twentytwentyfive/blocks/icon-text-grid/
├── block.php          # PHP template
├── style.scss         # Styles
└── script.js          # JavaScript interactions
```

## ACF Fields

- **items** (Repeater): Grid items collection
  - **text** (Text): Display text
  - **icon** (Image): Small icon (recommended 60x60px)
  - **link** (URL): Destination URL

## Usage in WordPress

1. Import the ACF field group JSON
2. Register the block in functions.php
3. Add block to any page/post
4. Configure items in the block editor

## Usage in Next.js

The block is automatically rendered via BlockRenderer when fetched from WordPress API.

```tsx
import IconTextGrid from '@/components/blocks/IconTextGrid';

const data = {
  items: [
    {
      text: 'Service offerings',
      icon: { url: '/icons/plus.svg', alt: 'Plus icon' },
      link: '/services'
    },
    // ... more items
  ]
};

<IconTextGrid data={data} />
```

The block is registered in `BlockRenderer.tsx` as `'acf/icon-text-grid'`.

## Responsive Breakpoints

- **Desktop (1200px+)**: Auto-fit grid with min 250px columns
- **Tablet (768px-1024px)**: Auto-fit grid with min 220px columns
- **Mobile (480px-768px)**: Auto-fit grid with min 180px columns
- **Small Mobile (<480px)**: Single column layout

## Customization

### Change Icon Size
Edit `&__icon-wrapper` width/height in styles.scss

### Adjust Animation Speed
Modify the `rotate360` animation duration (default: 0.6s)

### Change Grid Gap
Update `gap` property in `&__container`

### Modify Hover Effect
Edit `&__item:hover` styles for different effects
