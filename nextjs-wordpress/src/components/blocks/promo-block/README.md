# Promo Block

A full-width promotional banner block with background image, heading, sub-heading, and call-to-action button.

## Features

- Full-width background image support
- Overlay effect for better text readability
- Responsive design
- Customizable heading and sub-heading
- Call-to-action button with link
- Smooth hover animations

## ACF Fields

- **Background Image**: Upload background image
- **Heading**: Main heading text (required)
- **Sub Heading**: Secondary text
- **Button Text**: CTA button text
- **Button Link**: CTA button URL

## Usage in WordPress

1. Import the ACF JSON file in WordPress ACF settings
2. Register the block in your theme's functions.php
3. Add the block to any page using the Gutenberg editor

## Block Registration (WordPress)

Add this to your theme's `functions.php`:

```php
add_action('acf/init', 'register_promo_block');
function register_promo_block() {
    if (function_exists('acf_register_block_type')) {
        acf_register_block_type(array(
            'name'              => 'promo-block',
            'title'             => __('Promo Block'),
            'description'       => __('A promotional banner with background image and CTA'),
            'render_template'   => 'template-parts/blocks/promo-block.php',
            'category'          => 'formatting',
            'icon'              => 'megaphone',
            'keywords'          => array('promo', 'banner', 'cta'),
            'supports'          => array(
                'align' => array('full', 'wide'),
            ),
        ));
    }
}
```

## Styling

The block uses SCSS with BEM methodology. Customize colors and spacing in `styles.scss`.

## Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px
