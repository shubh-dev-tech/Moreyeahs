# Promo Block - Setup Guide

## Quick Start

This promo block has been created with all necessary files for both Next.js and WordPress.

## Files Created

### Next.js Files (Frontend)
- `PromoBlock.tsx` - Main React component
- `index.tsx` - Export file
- `styles.scss` - SCSS styles
- `acf.json` - ACF field configuration
- `README.md` - Documentation
- `SETUP_GUIDE.md` - This file

### WordPress Files (Backend)
- `wordpress-theme-files/promo-block-registration.php` - Block registration
- `wordpress-theme-files/template-parts/blocks/promo-block.php` - PHP template

## WordPress Setup

### Step 1: Import ACF Fields

1. Go to WordPress Admin → Custom Fields → Tools
2. Click "Import Field Groups"
3. Upload or paste the content from `acf.json`
4. Click "Import"

### Step 2: Register the Block

Add this to your theme's `functions.php`:

```php
// Include the promo block registration
require_once get_template_directory() . '/inc/blocks/promo-block-registration.php';
```

Or copy the code from `wordpress-theme-files/promo-block-registration.php` directly into your `functions.php`.

### Step 3: Add PHP Template

1. Create folder: `wp-content/themes/your-theme/template-parts/blocks/`
2. Copy `promo-block.php` to that folder

### Step 4: Add Styles to WordPress

Add the SCSS/CSS to your theme's stylesheet or enqueue it:

```php
function enqueue_promo_block_styles() {
    wp_enqueue_style('promo-block', get_template_directory_uri() . '/css/blocks/promo-block.css');
}
add_action('wp_enqueue_scripts', 'enqueue_promo_block_styles');
```

## Next.js Setup

The block is already registered in `BlockRenderer.tsx` and ready to use!

## Usage

### In WordPress Editor

1. Create or edit a page
2. Click "+" to add a block
3. Search for "Promo Block"
4. Fill in the fields:
   - Background Image
   - Heading
   - Sub Heading
   - Button Text
   - Button Link

### Field Details

- **Background Image**: Full-width background (recommended: 1920x600px)
- **Heading**: Main promotional text (required)
- **Sub Heading**: Secondary text (optional)
- **Button Text**: CTA button label (optional)
- **Button Link**: URL for the button (optional)

## Customization

### Colors

Edit `styles.scss` to change colors:

```scss
// Overlay color
background: rgba(13, 27, 62, 0.85);

// Text color
color: #ffffff;

// Button colors
background-color: #ffffff;
color: #0d1b3e;
```

### Spacing

Adjust padding and margins in `styles.scss`:

```scss
padding: 60px 20px; // Container padding
min-height: 400px;  // Minimum block height
```

## Troubleshooting

### Block not appearing in WordPress
- Check if ACF Pro is installed and activated
- Verify the block registration code is in functions.php
- Clear WordPress cache

### Styles not loading
- Check if SCSS is compiled to CSS
- Verify the stylesheet is enqueued
- Clear browser cache

### Next.js not rendering
- Check BlockRenderer.tsx has the import
- Verify the block name matches: 'acf/promo-block'
- Check browser console for errors

## Support

For issues or questions, refer to the main README.md file.
