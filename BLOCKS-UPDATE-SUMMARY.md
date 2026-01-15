# Blocks Update Summary

This document outlines the changes needed for Stories & Blog Block, Multi Cloud Services, and Hero 2 Service blocks.

## Changes Required for All Three Blocks:

### 1. ACF Fields to Add:
- `heading_span_text` - Text field for span text
- `heading_span_color` - Color picker for span color
- `background_type` - Select (color/gradient/image)
- `section_height` - Select (auto/small/medium/large/custom)
- `custom_height` - Number field (conditional on section_height=custom)
- `gradient_color_1` - Color picker (conditional on background_type=gradient)
- `gradient_color_2` - Color picker (conditional on background_type=gradient)
- `gradient_direction` - Select (to right/to left/to bottom/to top/to bottom right/to bottom left)

### 2. React Component Updates:

#### Add to interface:
```typescript
heading_span_text?: string;
heading_span_color?: string;
background_type?: 'color' | 'gradient' | 'image';
section_height?: string;
custom_height?: number;
gradient_color_1?: string;
gradient_color_2?: string;
gradient_direction?: string;
```

#### Add helper function:
```typescript
const getSectionHeight = () => {
  switch (section_height) {
    case 'small': return '60vh';
    case 'medium': return '80vh';
    case 'large': return '100vh';
    case 'custom': return `${custom_height}px`;
    default: return 'auto';
  }
};

const getBackgroundStyles = () => {
  const styles: React.CSSProperties = {
    minHeight: getSectionHeight()
  };

  if (background_type === 'gradient') {
    styles.background = `linear-gradient(${gradient_direction}, ${gradient_color_1}, ${gradient_color_2})`;
  } else if (background_type === 'image' && background_image) {
    styles.backgroundImage = `url(${background_image})`;
    styles.backgroundSize = 'cover';
    styles.backgroundPosition = 'center';
    styles.backgroundRepeat = 'no-repeat';
    styles.backgroundColor = background_color;
  } else {
    styles.backgroundColor = background_color;
  }

  return styles;
};

const renderHeading = () => {
  if (!heading_span_text || heading_span_text.trim() === '') {
    return heading;
  }
  
  return (
    <>
      {heading}{' '}
      <span style={{ color: heading_span_color }}>
        {heading_span_text}
      </span>
    </>
  );
};
```

#### Update JSX:
```tsx
<section className="block-name" style={getBackgroundStyles()}>
  <div className="container">
    <h2 style={{ color: heading_color }}>
      {renderHeading()}
    </h2>
    {/* rest of content */}
  </div>
</section>
```

### 3. WordPress block.php Updates:

#### Add to field loading:
```php
$heading_span_text = get_field('heading_span_text') ?: '';
$heading_span_color = get_field('heading_span_color') ?: '#ffd700';
$background_type = get_field('background_type') ?: 'color';
$section_height = get_field('section_height') ?: 'auto';
$custom_height = get_field('custom_height') ?: 600;
$gradient_color_1 = get_field('gradient_color_1') ?: '#4a148c';
$gradient_color_2 = get_field('gradient_color_2') ?: '#7b1fa2';
$gradient_direction = get_field('gradient_direction') ?: 'to bottom right';
```

#### Add helper functions:
```php
if (!function_exists('get_block_section_height')) {
    function get_block_section_height($section_height, $custom_height) {
        switch ($section_height) {
            case 'small': return '60vh';
            case 'medium': return '80vh';
            case 'large': return '100vh';
            case 'custom': return $custom_height . 'px';
            default: return 'auto';
        }
    }
}

if (!function_exists('get_block_background_styles')) {
    function get_block_background_styles($background_type, $background_color, $gradient_color_1, $gradient_color_2, $gradient_direction, $background_image, $section_height, $custom_height) {
        $styles = "min-height: " . get_block_section_height($section_height, $custom_height) . ";";
        
        if ($background_type === 'gradient') {
            $styles .= " background: linear-gradient({$gradient_direction}, {$gradient_color_1}, {$gradient_color_2});";
        } elseif ($background_type === 'image' && $background_image && !empty($background_image['url'])) {
            $styles .= " background-image: url('{$background_image['url']}'); background-size: cover; background-position: center; background-repeat: no-repeat; background-color: {$background_color};";
        } else {
            $styles .= " background-color: {$background_color};";
        }
        
        return $styles;
    }
}

$render_heading = function() use ($heading, $heading_span_text, $heading_span_color, $heading_color) {
    if (empty($heading_span_text) || trim($heading_span_text) === '') {
        return '<span style="color: ' . esc_attr($heading_color) . ';">' . esc_html($heading) . '</span>';
    }
    
    return '<span style="color: ' . esc_attr($heading_color) . ';">' . esc_html($heading) . ' <span style="color: ' . esc_attr($heading_span_color) . ';">' . esc_html($heading_span_text) . '</span></span>';
};

$processed_heading = $render_heading();
```

#### Update HTML:
```php
<div class="block-name" style="<?php echo esc_attr(get_block_background_styles($background_type, $background_color, $gradient_color_1, $gradient_color_2, $gradient_direction, $background_image, $section_height, $custom_height)); ?>">
    <div class="container">
        <h2><?php echo wp_kses_post($processed_heading); ?></h2>
        <!-- rest of content -->
    </div>
</div>
```

## Specific Block Files to Update:

### Stories & Blog Block:
- ✅ ACF JSON: `wp-content/themes/twentytwentyfive-child/acf-json/group_stories_blog_block.json` (DONE)
- ⏳ React Component: `nextjs-wordpress/src/components/blocks/stories-blog-block/StoriesBlogBlock.tsx`
- ⏳ WordPress PHP: `wp-content/themes/twentytwentyfive-child/blocks/stories-blog-block/block.php`

### Multi Cloud Services:
- ⏳ ACF JSON: Find and update the ACF JSON file
- ⏳ React Component: `nextjs-wordpress/src/components/blocks/multi-cloud-services/MultiCloudServices.tsx`
- ⏳ WordPress PHP: Find and update the block.php file

### Hero 2 Service:
- ⏳ ACF JSON: Find and update the ACF JSON file
- ⏳ React Component: `nextjs-wordpress/src/components/blocks/hero-2-service/Hero2Service.tsx`
- ⏳ WordPress PHP: Find and update the block.php file

## Testing Checklist:

For each block, test:
- [ ] Heading displays correctly
- [ ] Heading span text displays in different color
- [ ] Background color works
- [ ] Background gradient works with all directions
- [ ] Background image works
- [ ] Section height options work (auto, small, medium, large, custom)
- [ ] Custom height input works
- [ ] All fields show/hide based on conditional logic
- [ ] Block displays correctly on WordPress backend
- [ ] Block displays correctly on Next.js frontend
