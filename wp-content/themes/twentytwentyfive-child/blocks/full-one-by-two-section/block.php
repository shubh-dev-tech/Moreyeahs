<?php
/**
 * Full One by Two Section Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'full-one-by-two-section-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$class_name = 'full-one-by-two-section';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $class_name .= ' align' . $block['align'];
}

// Get field values
$heading = get_field('heading');
$sub_heading = get_field('sub_heading');
$highlight_text = get_field('highlight_text');
$highlight_points = get_field('highlight_points');
$button_text = get_field('button_text');
$button_link = get_field('button_link');
$main_image = get_field('main_image');
$reverse_layout = get_field('reverse_layout');
$background_color = get_field('background_color') ?: '#1a5f4f';
$text_color = get_field('text_color') ?: '#ffffff';

// Add reverse class if enabled
if ($reverse_layout) {
    $class_name .= ' reverse-layout';
}

// Prepare inline styles
$section_styles = array(
    'background-color: ' . esc_attr($background_color),
    'color: ' . esc_attr($text_color)
);
$section_style = implode('; ', $section_styles);
?>

<section id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($class_name); ?>" style="<?php echo esc_attr($section_style); ?>">
    <div class="full-one-by-two-container">
        <div class="content-half">
            <?php if ($heading): ?>
                <h2 class="main-heading"><?php echo esc_html($heading); ?></h2>
            <?php endif; ?>
            
            <?php if ($sub_heading): ?>
                <p class="sub-heading"><?php echo esc_html($sub_heading); ?></p>
            <?php endif; ?>
            
            <?php if ($highlight_text || $highlight_points): ?>
                <div class="highlights-section">
                    <?php if ($highlight_text): ?>
                        <h3 class="highlight-title"><?php echo esc_html($highlight_text); ?></h3>
                    <?php endif; ?>
                    
                    <?php if ($highlight_points): ?>
                        <ul class="highlight-points">
                            <?php foreach ($highlight_points as $point): ?>
                                <?php if (!empty($point['point_text'])): ?>
                                    <li><?php echo esc_html($point['point_text']); ?></li>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </ul>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
            
            <?php if ($button_text && $button_link): ?>
                <div class="cta-section">
                    <a href="<?php echo esc_url($button_link); ?>" class="cta-button">
                        <?php echo esc_html($button_text); ?>
                        <span class="button-arrow">→</span>
                    </a>
                </div>
            <?php endif; ?>
        </div>
        
        <div class="image-half">
            <?php if ($main_image): ?>
                <div class="image-container">
                    <img src="<?php echo esc_url($main_image['url']); ?>" 
                         alt="<?php echo esc_attr($main_image['alt'] ?: $heading); ?>" 
                         class="main-image" />
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>