# Moreyeahs Slider Block - Setup Guide

## Overview

A dynamic slider block **without ACF plugin** that uses WordPress native block editor (Gutenberg) with custom attributes.

**Block Name:** `moreyeahs/slider`

## Features

✅ No ACF plugin required - uses native WordPress blocks  
✅ Multiple slides with image, heading, and CTA  
✅ Auto-play with 5-second intervals  
✅ Dot navigation  
✅ Responsive design  
✅ Smooth transitions  
✅ GraphQL support for Next.js  

## Files Created

### WordPress Files
```
wp-content/themes/twentytwentyfive/
├── functions.php (updated with block registration)
└── blocks/
    └── moreyeahs-slider-block.js (editor interface)
```

### Next.js Files
```
nextjs-wordpress/src/components/blocks/
├── MoreyeahsSliderBlock.tsx (React component)
└── BlockRenderer.tsx (updated)
```

### Reference Files (for other themes)
```
nextjs-wordpress/wordpress-theme-files/
├── moreyeahs-slider-block.php (standalone registration)
├── blocks/
│   ├── moreyeahs-slider.php (template)
│   └── moreyeahs-slider-block.js (editor JS)
```

## Installation Status

✅ **Already Installed!** The block is ready to use in your WordPress editor.

## How to Use

### 1. Add Block in WordPress

1. Edit any page or post
2. Click the **+** button to add a block
3. Search for **"Moreyeahs Slider"**
4. Click to add the block

### 2. Add Slides

In the right sidebar (Block Settings):

1. Click **"Add Slide"** button
2. For each slide, configure:
   - **Image**: Click "Select Image" to choose from media library
   - **Heading**: Enter your slide heading text
   - **CTA Text**: Button text (e.g., "Read more", "Learn more")
   - **CTA URL**: Button link (e.g., "/about", "https://example.com")

3. Add more slides by clicking **"Add Slide"** again
4. Reorder slides using ↑ ↓ buttons
5. Remove slides using **"Remove"** button

### 3. Publish

Click **"Publish"** or **"Update"** to save your changes.

### 4. View in Next.js

The slider will automatically render in your Next.js frontend!

```bash
cd nextjs-wordpress
npm run dev
```

Visit your page to see the slider in action.

## Example Configuration

### Slide 1
- **Image**: `/images/hero-1.jpg`
- **Heading**: "Infosys Unveils AI-first GCC Model"
- **CTA Text**: "Read more"
- **CTA URL**: "/news/gcc-model"

### Slide 2
- **Image**: `/images/hero-2.jpg`
- **Heading**: "Infosys Topaz Fabric™"
- **CTA Text**: "Know more"
- **CTA URL**: "/products/topaz-fabric"

### Slide 3
- **Image**: `/images/hero-3.jpg`
- **Heading**: "Champions Evolve"
- **CTA Text**: "Know More"
- **CTA URL**: "/champions"

## Block Structure

The block stores data as JSON in the block attributes:

```json
{
  "slides": [
    {
      "image": "https://example.com/image.jpg",
      "heading": "Your Heading",
      "cta_text": "Read more",
      "cta_url": "/your-link"
    }
  ]
}
```

## GraphQL Query

The block is automatically exposed to GraphQL:

```graphql
query GetPageWithSlider($slug: ID!) {
  page(id: $slug, idType: URI) {
    blocks {
      name
      ... on CoreBlock {
        attributes {
          ... on MoreyeahsSliderAttributes {
            slides {
              image
              heading
              cta_text
              cta_url
            }
          }
        }
      }
    }
  }
}
```

## Customization

### Change Autoplay Speed

In `functions.php`, find:
```javascript
autoplayInterval = setInterval(nextSlide, 5000);
```

Change `5000` to your desired milliseconds (e.g., `3000` for 3 seconds).

### Change Slider Height

In `functions.php`, find:
```css
.slider-container {
    height: 600px;
}
```

Change to your desired height.

### Change Overlay Opacity

In `functions.php`, find:
```css
.slide-overlay {
    background: rgba(0, 0, 0, 0.4);
}
```

Change `0.4` to your desired opacity (0 = transparent, 1 = solid black).

## Styling

The block includes inline CSS for:
- Responsive design (mobile & desktop)
- Smooth transitions
- Hover effects
- Dot navigation

You can override styles in your theme's CSS:

```css
.moreyeahs-slider .slide-heading {
    font-size: 60px !important;
    color: #your-color !important;
}

.moreyeahs-slider .slide-cta {
    background: #your-brand-color !important;
}
```

## Troubleshooting

### Block Not Appearing in Editor

1. Check if JavaScript file exists:
   ```
   wp-content/themes/twentytwentyfive/blocks/moreyeahs-slider-block.js
   ```

2. Clear WordPress cache
3. Hard refresh browser (Ctrl+Shift+R)

### Block Not Rendering in Next.js

1. Check `BlockRenderer.tsx` includes the import
2. Verify block name is `moreyeahs/slider`
3. Check browser console for errors
4. Ensure GraphQL returns block data

### Images Not Loading

1. Use full URLs for images
2. Check image permissions
3. Verify CORS settings if using external images

### Autoplay Not Working

1. Check browser console for JavaScript errors
2. Ensure multiple slides exist (autoplay needs 2+ slides)
3. Verify JavaScript is not blocked

## Next Steps

1. ✅ Block is installed and ready
2. 🎨 Add your first slider to a page
3. 📝 Configure slides with your content
4. 🚀 Test in Next.js frontend
5. 🎯 Customize styling to match your brand

## Differences from ACF Blocks

| Feature | ACF Blocks | Moreyeahs Slider |
|---------|-----------|------------------|
| Plugin Required | ✅ ACF Pro | ❌ None |
| Field Interface | ACF UI | Native Gutenberg |
| Data Storage | Post Meta | Block Attributes |
| Repeater Fields | ACF Repeater | Array Attributes |
| GraphQL | ACF GraphQL | Native Block GraphQL |

## Support

- **Setup Issues**: Check this guide
- **Styling**: See Customization section
- **GraphQL**: Check block attributes in GraphQL
- **Next.js**: Check `MoreyeahsSliderBlock.tsx`

---

**Your Moreyeahs Slider block is ready to use! 🎉**

Start adding beautiful sliders to your pages without any plugins!
