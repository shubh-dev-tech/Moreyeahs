# ACF Blocks Management

This directory contains the centralized ACF blocks registration system.

## File Structure

```
inc/
└── acf-blocks.php          # Main registration file
```

## How to Add a New ACF Block

### 1. Create Your Block Template

Create a PHP template file in `blocks/` directory:

```php
// blocks/your-block-name.php
<?php
$field_name = get_field('field_name');
?>
<div class="your-block">
    <?php echo esc_html($field_name); ?>
</div>
```

### 2. Register the Block

Open `inc/acf-blocks.php` and add your block to the `$blocks` array:

```php
array(
    'name'              => 'your-block-name',
    'title'             => __('Your Block Name', 'twentytwentyfive'),
    'description'       => __('Description of your block', 'twentytwentyfive'),
    'category'          => 'formatting',
    'icon'              => 'admin-customizer',
    'keywords'          => array('keyword1', 'keyword2'),
    'render_template'   => 'blocks/your-block-name.php',
    'enqueue_style'     => get_template_directory_uri() . '/assets/css/your-block.css',
    'enqueue_script'    => get_template_directory_uri() . '/assets/js/your-block.js',
    'supports'          => array(
        'align' => array('wide', 'full'),
        'mode'  => true,
    ),
),
```

### 3. Create ACF Fields

1. Go to WordPress Admin → Custom Fields
2. Create a new Field Group
3. Set location rule: Block is equal to `acf/your-block-name`
4. Add your fields
5. Save (fields will auto-save to `acf-json/` directory)

## Block Parameters

### Required Parameters

- **name**: Unique identifier (slug format, no spaces)
- **title**: Display name in block inserter
- **description**: Brief description of the block
- **category**: Block category (common, formatting, layout, widgets, embed, custom-blocks)
- **icon**: Dashicon name or custom SVG
- **keywords**: Array of search terms
- **render_template**: Path to template file

### Optional Parameters

- **enqueue_style**: Path to CSS file (leave empty for inline styles)
- **enqueue_script**: Path to JS file
- **supports**: Array of supported features
  - `align`: true or array of alignments ('left', 'center', 'right', 'wide', 'full')
  - `mode`: true (allows switching between edit/preview modes)
  - `jsx`: true (enables JSX support)
  - `anchor`: true (allows custom anchor ID)
  - `customClassName`: true (allows custom CSS class)

## Available Icons

Common Dashicons:
- `admin-customizer`
- `megaphone`
- `format-quote`
- `images-alt2`
- `testimonial`
- `star-filled`
- `admin-users`
- `admin-post`

[Full list](https://developer.wordpress.org/resource/dashicons/)

## Example: Adding a Testimonial Block

1. Create `blocks/testimonial-block.php`
2. Add to `$blocks` array in `inc/acf-blocks.php`:

```php
array(
    'name'              => 'testimonial-block',
    'title'             => __('Testimonial', 'twentytwentyfive'),
    'description'       => __('Display customer testimonials', 'twentytwentyfive'),
    'category'          => 'custom-blocks',
    'icon'              => 'format-quote',
    'keywords'          => array('testimonial', 'review', 'quote'),
    'render_template'   => 'blocks/testimonial-block.php',
    'supports'          => array(
        'align' => true,
        'mode'  => true,
    ),
),
```

3. Create ACF fields in WordPress admin
4. Done! Your block is now available in the editor

## Benefits of This System

✅ **Centralized Management**: All blocks in one place
✅ **Easy to Add**: Just add to the array
✅ **Clean functions.php**: No clutter
✅ **Consistent Structure**: Same pattern for all blocks
✅ **Easy Maintenance**: Update all blocks from one file
✅ **Well Documented**: Clear examples and comments

## Troubleshooting

**Block not appearing?**
- Check ACF plugin is active
- Verify template file path is correct
- Clear WordPress cache

**Styles not loading?**
- Check file path in `enqueue_style`
- Verify file exists
- Check browser console for errors

**Fields not showing?**
- Verify ACF field group location rule matches block name
- Check `acf-json/` directory for field group JSON
