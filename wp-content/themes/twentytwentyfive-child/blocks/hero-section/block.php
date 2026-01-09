<?php
/**
 * Hero Section Block
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'hero-section-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'hero-section-block';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $className .= ' align' . $block['align'];
}

// Get ACF fields
$heading = get_field('heading');
$sub_heading = get_field('sub_heading');
$hero_image_raw = get_field('hero_image');

// Layout settings
$layout_settings = get_field('layout_settings');
$reverse_layout = $layout_settings['reverse_layout'] ?? false;
$image_position = $layout_settings['image_position'] ?? 'right';
$content_alignment = $layout_settings['content_alignment'] ?? 'left';

// Height settings
$height_settings = get_field('height_settings');
$section_height = $height_settings['section_height'] ?? 'medium';

// Color settings
$color_settings = get_field('color_settings');
$background_color = $color_settings['background_color'] ?? '#f8f9fa';
$background_image_raw = $color_settings['background_image'] ?? null;
$background_overlay = $color_settings['background_overlay'] ?? 50;
$heading_color = $color_settings['heading_color'] ?? '#333333';
$sub_heading_color = $color_settings['sub_heading_color'] ?? '#666666';

// Process background image
$background_image = null;
if ($background_image_raw) {
    if (function_exists('process_acf_image_field')) {
        $background_image = process_acf_image_field($background_image_raw);
    } else {
        // Fallback processing
        if (is_numeric($background_image_raw)) {
            $image_id = intval($background_image_raw);
            $image_data = wp_get_attachment_image_src($image_id, 'full');
            if ($image_data) {
                $background_image = [
                    'id' => $image_id,
                    'url' => $image_data[0],
                    'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true) ?: '',
                    'title' => get_the_title($image_id) ?: '',
                    'sizes' => [
                        'thumbnail' => wp_get_attachment_image_src($image_id, 'thumbnail')[0] ?? $image_data[0],
                        'medium' => wp_get_attachment_image_src($image_id, 'medium')[0] ?? $image_data[0],
                        'large' => wp_get_attachment_image_src($image_id, 'large')[0] ?? $image_data[0],
                        'full' => $image_data[0]
                    ]
                ];
            }
        } elseif (is_array($background_image_raw) && isset($background_image_raw['url'])) {
            $background_image = $background_image_raw;
        } elseif (is_array($background_image_raw) && isset($background_image_raw['ID'])) {
            $image_id = intval($background_image_raw['ID']);
            $image_data = wp_get_attachment_image_src($image_id, 'full');
            if ($image_data) {
                $background_image = [
                    'id' => $image_id,
                    'url' => $image_data[0],
                    'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true) ?: ($background_image_raw['alt'] ?? ''),
                    'title' => get_the_title($image_id) ?: ($background_image_raw['title'] ?? ''),
                    'sizes' => [
                        'thumbnail' => wp_get_attachment_image_src($image_id, 'thumbnail')[0] ?? $image_data[0],
                        'medium' => wp_get_attachment_image_src($image_id, 'medium')[0] ?? $image_data[0],
                        'large' => wp_get_attachment_image_src($image_id, 'large')[0] ?? $image_data[0],
                        'full' => $image_data[0]
                    ]
                ];
            }
        }
    }
}

// Debug logging for development
if (defined('WP_DEBUG') && WP_DEBUG) {
    error_log('Hero Section Block Debug:');
    error_log('Raw hero image: ' . print_r($hero_image_raw, true));
    error_log('Hero image type: ' . gettype($hero_image_raw));
    error_log('Layout settings: ' . print_r($layout_settings, true));
    error_log('Height settings: ' . print_r($height_settings, true));
    error_log('Color settings: ' . print_r($color_settings, true));
    error_log('Background image raw: ' . print_r($background_image_raw, true));
    error_log('Background overlay: ' . $background_overlay);
}

// Process hero image to ensure it has full image data
$hero_image = null;
if ($hero_image_raw) {
    if (function_exists('process_acf_image_field')) {
        $hero_image = process_acf_image_field($hero_image_raw);
    } else {
        // Fallback processing if function doesn't exist
        if (is_numeric($hero_image_raw)) {
            $image_id = intval($hero_image_raw);
            $image_data = wp_get_attachment_image_src($image_id, 'full');
            if ($image_data) {
                $hero_image = [
                    'id' => $image_id,
                    'url' => $image_data[0],
                    'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true) ?: '',
                    'title' => get_the_title($image_id) ?: '',
                    'sizes' => [
                        'thumbnail' => wp_get_attachment_image_src($image_id, 'thumbnail')[0] ?? $image_data[0],
                        'medium' => wp_get_attachment_image_src($image_id, 'medium')[0] ?? $image_data[0],
                        'large' => wp_get_attachment_image_src($image_id, 'large')[0] ?? $image_data[0],
                        'full' => $image_data[0]
                    ]
                ];
            }
        } elseif (is_array($hero_image_raw) && isset($hero_image_raw['url'])) {
            $hero_image = $hero_image_raw;
        } elseif (is_array($hero_image_raw) && isset($hero_image_raw['ID'])) {
            $image_id = intval($hero_image_raw['ID']);
            $image_data = wp_get_attachment_image_src($image_id, 'full');
            if ($image_data) {
                $hero_image = [
                    'id' => $image_id,
                    'url' => $image_data[0],
                    'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true) ?: ($hero_image_raw['alt'] ?? ''),
                    'title' => get_the_title($image_id) ?: ($hero_image_raw['title'] ?? ''),
                    'sizes' => [
                        'thumbnail' => wp_get_attachment_image_src($image_id, 'thumbnail')[0] ?? $image_data[0],
                        'medium' => wp_get_attachment_image_src($image_id, 'medium')[0] ?? $image_data[0],
                        'large' => wp_get_attachment_image_src($image_id, 'large')[0] ?? $image_data[0],
                        'full' => $image_data[0]
                    ]
                ];
            }
        }
    }
}

// If no content, show placeholder in admin
if (empty($heading) && empty($sub_heading) && empty($hero_image)) {
    if ($is_preview) {
        echo '<div class="acf-block-placeholder">
                <div class="acf-block-placeholder-icon">🦸</div>
                <div class="acf-block-placeholder-text">Hero Section</div>
                <div class="acf-block-placeholder-instructions">Add heading, content, or image to display the hero section</div>
              </div>';
    }
    return;
}

// Get height class based on section_height setting
$height_class = 'hero-height-' . $section_height;

// Determine layout classes
$layout_class = $reverse_layout ? 'hero-reverse' : 'hero-normal';
$image_position_class = $image_position === 'left' ? 'hero-image-left' : 'hero-image-right';
$content_align_class = 'hero-content-' . $content_alignment;

// Combine all classes
$all_classes = $className . ' ' . $height_class . ' ' . $layout_class . ' ' . $image_position_class . ' ' . $content_align_class;
?>

<?php
// Build inline styles
$section_styles = "background-color: " . esc_attr($background_color) . ";";

if ($background_image) {
    $bg_image_url = $background_image['sizes']['large'] ?? $background_image['sizes']['full'] ?? $background_image['url'];
    $section_styles .= " background-image: url('" . esc_url($bg_image_url) . "');";
    $section_styles .= " background-size: cover;";
    $section_styles .= " background-position: center;";
    $section_styles .= " background-repeat: no-repeat;";
}
?>

<section 
    id="<?php echo esc_attr($id); ?>" 
    class="<?php echo esc_attr($all_classes); ?>"
    style="<?php echo $section_styles; ?>"
    data-height="<?php echo esc_attr($section_height); ?>"
    data-reverse="<?php echo $reverse_layout ? 'true' : 'false'; ?>"
    data-image-position="<?php echo esc_attr($image_position); ?>"
    data-content-align="<?php echo esc_attr($content_alignment); ?>"
    data-has-bg-image="<?php echo $background_image ? 'true' : 'false'; ?>"
>
    <?php if ($background_image && $background_overlay > 0): ?>
        <div class="hero-background-overlay" style="opacity: <?php echo esc_attr($background_overlay / 100); ?>;"></div>
    <?php endif; ?>
    
    <div class="hero-container">
        <div class="hero-content">
            <div class="hero-text-content">
                <?php if ($heading): ?>
                    <h1 
                        class="hero-heading"
                        style="color: <?php echo esc_attr($heading_color); ?>;"
                    >
                        <?php echo esc_html($heading); ?>
                    </h1>
                <?php endif; ?>
                
                <?php if ($sub_heading): ?>
                    <div 
                        class="hero-sub-heading"
                        style="color: <?php echo esc_attr($sub_heading_color); ?>;"
                    >
                        <?php echo wp_kses_post($sub_heading); ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>

        <?php if ($hero_image): ?>
            <div class="hero-image">
                <div class="hero-image-wrapper">
                    <img 
                        src="<?php echo esc_url($hero_image['sizes']['large'] ?? $hero_image['sizes']['full'] ?? $hero_image['url']); ?>" 
                        alt="<?php echo esc_attr($hero_image['alt'] ?? $hero_image['title'] ?? 'Hero Image'); ?>"
                        loading="lazy"
                    />
                </div>
            </div>
        <?php endif; ?>
    </div>
</section>