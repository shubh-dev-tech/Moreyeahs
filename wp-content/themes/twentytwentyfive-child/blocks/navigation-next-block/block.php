<?php
/**
 * Navigation Next Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Get ACF fields
$regions = get_field('regions');
$heading = get_field('heading');
$button_text = get_field('button_text');
$button_link = get_field('button_link');
$background_type = get_field('background_type') ?: 'solid';
$background_color = get_field('background_color') ?: '#9b4d96';
$gradient_direction = get_field('gradient_direction') ?: 'to right';
$gradient_colors = get_field('gradient_colors');

// Block ID
$block_id = 'navigation-next-block-' . $block['id'];
if (!empty($block['anchor'])) {
    $block_id = $block['anchor'];
}

// Block classes
$class_name = 'navigation-next-block';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $class_name .= ' align' . $block['align'];
}

// Generate hover color (lighter version of background color)
if (!function_exists('lighten_color')) {
    function lighten_color($hex, $percent) {
        $hex = str_replace('#', '', $hex);
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));
        
        $r = min(255, $r + ($percent * 255 / 100));
        $g = min(255, $g + ($percent * 255 / 100));
        $b = min(255, $b + ($percent * 255 / 100));
        
        return sprintf("#%02x%02x%02x", $r, $g, $b);
    }
}

// Generate background style
$background_style = '';
$hover_background = '';

if ($background_type === 'gradient' && !empty($gradient_colors) && count($gradient_colors) >= 2) {
    // Build gradient
    $gradient_stops = array();
    foreach ($gradient_colors as $index => $color_stop) {
        $color = $color_stop['color'];
        $position = !empty($color_stop['position']) ? $color_stop['position'] . '%' : '';
        $gradient_stops[] = $color . ($position ? ' ' . $position : '');
    }
    
    $background_style = 'background: linear-gradient(' . $gradient_direction . ', ' . implode(', ', $gradient_stops) . ');';
    
    // Create hover gradient (lighter version)
    $hover_stops = array();
    foreach ($gradient_colors as $index => $color_stop) {
        $hover_color = lighten_color($color_stop['color'], 20);
        $position = !empty($color_stop['position']) ? $color_stop['position'] . '%' : '';
        $hover_stops[] = $hover_color . ($position ? ' ' . $position : '');
    }
    $hover_background = 'linear-gradient(' . $gradient_direction . ', ' . implode(', ', $hover_stops) . ')';
} else {
    // Solid color
    $background_style = 'background-color: ' . $background_color . ';';
    $hover_background = lighten_color($background_color, 20);
}
?>

<section id="<?php echo esc_attr($block_id); ?>" class="<?php echo esc_attr($class_name); ?>" style="<?php echo esc_attr($background_style); ?>">
    <div class="navigation-next-block__container">
        
        <?php if ($regions): ?>
        <div class="navigation-next-block__grid">
            <?php foreach ($regions as $region): ?>
            <a href="<?php echo esc_url($region['link']); ?>" 
               class="navigation-next-block__region" 
               style="<?php echo esc_attr($background_style); ?>"
               data-hover-background="<?php echo esc_attr($hover_background); ?>"
               data-background-type="<?php echo esc_attr($background_type); ?>">
                <span class="navigation-next-block__region-name">
                    <?php echo esc_html($region['name']); ?>
                </span>
            </a>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>

        <?php if ($heading || $button_text): ?>
        <div class="navigation-next-block__cta">
            <?php if ($heading): ?>
                <h2 class="navigation-next-block__heading"><?php echo esc_html($heading); ?></h2>
            <?php endif; ?>
            
            <?php if ($button_text && $button_link): ?>
                <a href="<?php echo esc_url($button_link); ?>" class="navigation-next-block__button">
                    <?php echo esc_html($button_text); ?>
                </a>
            <?php endif; ?>
        </div>
        <?php endif; ?>
    </div>
</section>

<script>
// Add hover effects with dynamic colors/gradients
document.addEventListener('DOMContentLoaded', function() {
    const regions = document.querySelectorAll('#<?php echo esc_js($block_id); ?> .navigation-next-block__region');
    
    regions.forEach(function(region) {
        const originalBackground = region.style.background || region.style.backgroundColor;
        const hoverBackground = region.getAttribute('data-hover-background');
        const backgroundType = region.getAttribute('data-background-type');
        
        region.addEventListener('mouseenter', function() {
            if (backgroundType === 'gradient') {
                this.style.background = hoverBackground;
            } else {
                this.style.backgroundColor = hoverBackground;
            }
        });
        
        region.addEventListener('mouseleave', function() {
            if (backgroundType === 'gradient') {
                this.style.background = originalBackground;
            } else {
                this.style.backgroundColor = originalBackground;
            }
        });
    });
});
</script>
