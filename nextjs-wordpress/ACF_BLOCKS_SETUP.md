# ACF Blocks Setup Guide

This guide will help you set up ACF (Advanced Custom Fields) blocks in WordPress to work with your Next.js frontend.

## Prerequisites

1. WordPress with WPGraphQL plugin installed
2. ACF Pro plugin (required for ACF Blocks)
3. WPGraphQL for ACF plugin

## WordPress Plugins Required

### 1. Install Required Plugins

```bash
# Via WordPress Admin Dashboard:
# - ACF Pro (https://www.advancedcustomfields.com/pro/)
# - WPGraphQL (https://wordpress.org/plugins/wp-graphql/)
# - WPGraphQL for Advanced Custom Fields (https://github.com/wp-graphql/wpgraphql-acf)
```

### 2. Enable Block Editor REST API

Add to your WordPress theme's `functions.php`:

```php
<?php
// Enable Gutenberg blocks in REST API
add_filter('rest_prepare_post', function($response, $post) {
    if (has_blocks($post->post_content)) {
        $blocks = parse_blocks($post->post_content);
        $response->data['blocks'] = $blocks;
    }
    return $response;
}, 10, 2);

// Enable ACF fields in GraphQL
add_filter('graphql_acf_get_root_id', function($id, $root) {
    return $root->ID ?? $id;
}, 10, 2);
```

## Creating ACF Blocks

### Example 1: Hero Block

Create a new file in your theme: `blocks/hero.php`

```php
<?php
/**
 * Hero Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

$title = get_field('title');
$subtitle = get_field('subtitle');
$background_image = get_field('background_image');
$cta_text = get_field('cta_text');
$cta_link = get_field('cta_link');
?>

<div class="hero-block">
    <?php if ($background_image): ?>
        <img src="<?php echo esc_url($background_image['url']); ?>" alt="<?php echo esc_attr($background_image['alt']); ?>">
    <?php endif; ?>
    
    <?php if ($title): ?>
        <h1><?php echo esc_html($title); ?></h1>
    <?php endif; ?>
    
    <?php if ($subtitle): ?>
        <p><?php echo esc_html($subtitle); ?></p>
    <?php endif; ?>
    
    <?php if ($cta_text && $cta_link): ?>
        <a href="<?php echo esc_url($cta_link); ?>"><?php echo esc_html($cta_text); ?></a>
    <?php endif; ?>
</div>
```

### Register the Block

Add to `functions.php`:

```php
<?php
add_action('acf/init', 'register_acf_blocks');

function register_acf_blocks() {
    if (function_exists('acf_register_block_type')) {
        
        // Hero Block
        acf_register_block_type(array(
            'name'              => 'hero',
            'title'             => __('Hero'),
            'description'       => __('A custom hero block.'),
            'render_template'   => 'blocks/hero.php',
            'category'          => 'formatting',
            'icon'              => 'cover-image',
            'keywords'          => array('hero', 'banner'),
            'supports'          => array(
                'align' => false,
                'mode' => false,
                'jsx' => true
            ),
        ));
        
        // CTA Block
        acf_register_block_type(array(
            'name'              => 'cta',
            'title'             => __('Call to Action'),
            'description'       => __('A custom CTA block.'),
            'render_template'   => 'blocks/cta.php',
            'category'          => 'formatting',
            'icon'              => 'megaphone',
            'keywords'          => array('cta', 'call to action'),
        ));
        
        // Image Text Block
        acf_register_block_type(array(
            'name'              => 'image-text',
            'title'             => __('Image + Text'),
            'description'       => __('Image with text content.'),
            'render_template'   => 'blocks/image-text.php',
            'category'          => 'formatting',
            'icon'              => 'align-pull-left',
            'keywords'          => array('image', 'text'),
        ));
        
        // Content Block
        acf_register_block_type(array(
            'name'              => 'content',
            'title'             => __('Content Block'),
            'description'       => __('A custom content block.'),
            'render_template'   => 'blocks/content.php',
            'category'          => 'formatting',
            'icon'              => 'text',
            'keywords'          => array('content', 'text'),
        ));
    }
}
```

## Creating ACF Field Groups

### Hero Block Fields

1. Go to WordPress Admin → Custom Fields → Add New
2. Create field group: "Hero Block"
3. Add fields:
   - `title` (Text)
   - `subtitle` (Text)
   - `background_image` (Image)
   - `cta_text` (Text)
   - `cta_link` (URL)
4. Location Rules: Block is equal to "Hero"
5. Show in GraphQL: Yes
6. GraphQL Field Name: `heroFields`

### CTA Block Fields

1. Create field group: "CTA Block"
2. Add fields:
   - `heading` (Text)
   - `description` (Textarea)
   - `button_text` (Text)
   - `button_link` (URL)
   - `background_color` (Color Picker)
3. Location Rules: Block is equal to "Call to Action"

### Image Text Block Fields

1. Create field group: "Image Text Block"
2. Add fields:
   - `image` (Image)
   - `heading` (Text)
   - `text` (WYSIWYG Editor)
   - `image_position` (Radio: left/right)
3. Location Rules: Block is equal to "Image + Text"

## Exposing Blocks to GraphQL

Add to `functions.php`:

```php
<?php
// Expose ACF blocks to GraphQL
add_filter('graphql_blocks_allowed_block_types', function($allowed_blocks) {
    $allowed_blocks[] = 'acf/hero';
    $allowed_blocks[] = 'acf/cta';
    $allowed_blocks[] = 'acf/image-text';
    $allowed_blocks[] = 'acf/content';
    return $allowed_blocks;
});

// Add ACF data to block attributes in GraphQL
add_filter('graphql_resolve_block', function($block_data, $block) {
    if (strpos($block['blockName'], 'acf/') === 0) {
        $block_data['attributes']['data'] = get_fields();
    }
    return $block_data;
}, 10, 2);
```

## Testing Your Setup

### 1. Create a Test Page in WordPress

1. Go to Pages → Add New
2. Add your ACF blocks using the block editor
3. Fill in the ACF fields
4. Publish the page

### 2. Test GraphQL Query

Go to GraphQL IDE (usually at `/graphql`) and run:

```graphql
query GetPageBlocks {
  page(id: "your-page-slug", idType: URI) {
    title
    content
    blocks {
      name
      attributes
      innerBlocks {
        name
      }
    }
  }
}
```

## Next.js Integration

### Update Your Page Component

```typescript
import { parseBlocks } from '@/lib/blocks';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await fetchPageData(params.slug);
  const blocks = parseBlocks(data.content);
  
  return (
    <main>
      <h1>{data.title}</h1>
      <BlockRenderer blocks={blocks} />
    </main>
  );
}
```

## Troubleshooting

### Blocks Not Showing in GraphQL

1. Ensure WPGraphQL for ACF is installed and activated
2. Check that field groups have "Show in GraphQL" enabled
3. Verify GraphQL Field Names are set

### ACF Data Not Available

1. Check that ACF Pro is activated
2. Ensure blocks are registered correctly
3. Verify field group location rules match your blocks

### Styling Issues

1. Update `globals.css` with block-specific styles
2. Use Tailwind classes in block components
3. Test responsive layouts

## Additional Resources

- [ACF Blocks Documentation](https://www.advancedcustomfields.com/resources/blocks/)
- [WPGraphQL Documentation](https://www.wpgraphql.com/docs/introduction)
- [WPGraphQL for ACF](https://github.com/wp-graphql/wpgraphql-acf)
