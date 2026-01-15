# Multi Cloud Services & Hero 2 Service - Update Instructions

## Multi Cloud Services Block

### 1. ACF JSON ✅ DONE
File: `wp-content/themes/twentytwentyfive-child/acf-json/group_multi_cloud_services.json`

Added fields at the beginning:
- heading_span_text
- heading_color  
- heading_span_color
- background_type
- background_color
- gradient_color_1
- gradient_color_2
- gradient_direction
- background_image
- section_height
- custom_height

### 2. WordPress block.php - NEEDS UPDATE
File: `wp-content/themes/twentytwentyfive-child/blocks/multi-cloud-services/block.php`

Add after existing field loading:
```php
// New fields for heading and background
$heading_span_text = get_field('heading_span_text') ?: '';
$heading_color = get_field('heading_color') ?: '#1f2937';
$heading_span_color = get_field('heading_span_color') ?: '#6366f1';
$background_type = get_field('background_type') ?: 'color';
$background_color = get_field('background_color') ?: '#f9fafb';
$gradient_color_1 = get_field('gradient_color_1') ?: '#f9fafb';
$gradient_color_2 = get_field('gradient_color_2') ?: '#e0e7ff';
$gradient_direction = get_field('gradient_direction') ?: 'to bottom right';
$background_image = get_field('background_image');
$section_height = get_field('section_height') ?: 'auto';
$custom_height = get_field('custom_height') ?: 600;
```

Add helper functions before the HTML output:
```php
// Helper function to get section height
if (!function_exists('get_mcs_section_height')) {
    function get_mcs_section_height($section_height, $custom_height) {
        switch ($section_height) {
            case 'small': return '60vh';
            case 'medium': return '80vh';
            case 'large': return '100vh';
            case 'custom': return $custom_height . 'px';
            default: return 'auto';
        }
    }
}

// Helper function to get background styles
if (!function_exists('get_mcs_background_styles')) {
    function get_mcs_background_styles($background_type, $background_color, $gradient_color_1, $gradient_color_2, $gradient_direction, $background_image, $section_height, $custom_height) {
        $styles = "min-height: " . get_mcs_section_height($section_height, $custom_height) . ";";
        
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

// Render heading with span
$render_heading = function() use ($main_heading, $heading_span_text, $heading_color, $heading_span_color) {
    if (empty($heading_span_text) || trim($heading_span_text) === '') {
        return '<span style="color: ' . esc_attr($heading_color) . ';">' . esc_html($main_heading) . '</span>';
    }
    
    return '<span style="color: ' . esc_attr($heading_color) . ';">' . esc_html($main_heading) . ' <span style="color: ' . esc_attr($heading_span_color) . ';">' . esc_html($heading_span_text) . '</span></span>';
};

$processed_heading = $render_heading();
```

Update the main container div to use background styles:
```php
<div class="multi-cloud-services" style="<?php echo esc_attr(get_mcs_background_styles($background_type, $background_color, $gradient_color_1, $gradient_color_2, $gradient_direction, $background_image, $section_height, $custom_height)); ?>">
```

Update the heading output:
```php
<h2 class="multi-cloud-services__heading">
    <?php echo wp_kses_post($processed_heading); ?>
</h2>
```

### 3. React Component - NEEDS UPDATE
File: `nextjs-wordpress/src/components/blocks/multi-cloud-services/MultiCloudServices.tsx`

Add to interface:
```typescript
interface MultiCloudServicesProps {
  data?: {
    main_heading?: string;
    heading_span_text?: string;
    heading_color?: string;
    heading_span_color?: string;
    description?: string;
    background_type?: 'color' | 'gradient' | 'image';
    background_color?: string;
    gradient_color_1?: string;
    gradient_color_2?: string;
    gradient_direction?: string;
    background_image?: any;
    section_height?: string;
    custom_height?: number;
    // ... existing fields
  };
}
```

Add helper functions:
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

const getBackgroundStyles = (): React.CSSProperties => {
  const styles: React.CSSProperties = {
    minHeight: getSectionHeight()
  };

  if (background_type === 'gradient') {
    styles.background = `linear-gradient(${gradient_direction}, ${gradient_color_1}, ${gradient_color_2})`;
  } else if (background_type === 'image' && background_image?.url) {
    styles.backgroundImage = `url(${background_image.url})`;
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
    return main_heading;
  }
  
  return (
    <>
      {main_heading}{' '}
      <span style={{ color: heading_span_color }}>
        {heading_span_text}
      </span>
    </>
  );
};
```

Update JSX:
```tsx
<section className="multi-cloud-services" style={getBackgroundStyles()}>
  <div className="container">
    <h2 className="multi-cloud-services__heading" style={{ color: heading_color }}>
      {renderHeading()}
    </h2>
    {/* rest of content */}
  </div>
</section>
```

### 4. Styles - ADD SPAN STYLING
File: `nextjs-wordpress/src/components/blocks/multi-cloud-services/MultiCloudServices.scss` or `.css`

Add to heading styles:
```scss
.multi-cloud-services__heading {
  // existing styles
  
  span {
    font-weight: inherit;
    transition: color 0.3s ease;
  }
}
```

---

## Hero 2 Service Block

### 1. ACF JSON - NEEDS UPDATE
File: Find `group_hero_2_service.json` or similar

Add same fields as Multi Cloud Services at the beginning of fields array.

### 2. WordPress block.php - NEEDS UPDATE
Same pattern as Multi Cloud Services

### 3. React Component - NEEDS UPDATE  
File: `nextjs-wordpress/src/components/blocks/hero-2-service/Hero2Service.tsx`

Same pattern as Multi Cloud Services

### 4. Styles - ADD SPAN STYLING
Same pattern as Multi Cloud Services

---

## Quick Copy-Paste Code Blocks

### For block.php (both blocks):
```php
// Add after existing get_field() calls
$heading_span_text = get_field('heading_span_text') ?: '';
$heading_color = get_field('heading_color') ?: '#1f2937';
$heading_span_color = get_field('heading_span_color') ?: '#6366f1';
$background_type = get_field('background_type') ?: 'color';
$background_color = get_field('background_color') ?: '#f9fafb';
$gradient_color_1 = get_field('gradient_color_1') ?: '#f9fafb';
$gradient_color_2 = get_field('gradient_color_2') ?: '#e0e7ff';
$gradient_direction = get_field('gradient_direction') ?: 'to bottom right';
$background_image = get_field('background_image');
$section_height = get_field('section_height') ?: 'auto';
$custom_height = get_field('custom_height') ?: 600;
```

### For React Component (both blocks):
```typescript
// Add to destructuring
const {
  main_heading = 'Default Heading',
  heading_span_text = '',
  heading_color = '#1f2937',
  heading_span_color = '#6366f1',
  background_type = 'color',
  background_color = '#f9fafb',
  gradient_color_1 = '#f9fafb',
  gradient_color_2 = '#e0e7ff',
  gradient_direction = 'to bottom right',
  background_image,
  section_height = 'auto',
  custom_height = 600,
  // ... existing fields
} = data || {};
```

## Testing Checklist

For each block:
- [ ] Sync ACF fields in WordPress
- [ ] Edit page with block
- [ ] Set heading and heading span text
- [ ] Choose heading colors
- [ ] Select background type (color/gradient/image)
- [ ] Set section height
- [ ] Save and view on frontend
- [ ] Verify heading span displays in different color
- [ ] Verify background works (color/gradient/image)
- [ ] Verify section height works
