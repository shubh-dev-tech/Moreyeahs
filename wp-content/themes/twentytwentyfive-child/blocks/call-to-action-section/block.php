<?php
/**
 * Call to Action Section Block
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'call-to-action-section-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$class_name = 'call-to-action-section';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $class_name .= ' align' . $block['align'];
}

// Get field values
$background_color = get_field('background_color') ?: '#1a1a2e';
$background_image = get_field('background_image');
$overlay_opacity = get_field('overlay_opacity') ?: 0.7;
$heading = get_field('heading');
$sub_heading = get_field('sub_heading');
$button_text = get_field('button_text');
$button_link = get_field('button_link');
$button_style = get_field('button_style') ?: 'primary';
$text_alignment = get_field('text_alignment') ?: 'center';

// Build inline styles
$section_styles = "background-color: {$background_color};";
if ($background_image) {
    $section_styles .= "background-image: url({$background_image['url']}); background-size: cover; background-position: center; background-repeat: no-repeat;";
}

$overlay_styles = "background-color: rgba(0, 0, 0, {$overlay_opacity});";

// Prevent rendering if no heading
if (empty($heading)) {
    if ($is_preview) {
        echo '<div style="padding: 20px; background: #f0f0f0; border: 2px dashed #ccc; text-align: center;">';
        echo '<h3>Call to Action Section</h3>';
        echo '<p>Please add a heading to display this block.</p>';
        echo '</div>';
    }
    return;
}
?>

<section id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($class_name); ?>" style="<?php echo esc_attr($section_styles); ?>">
    <?php if ($background_image): ?>
        <div class="cta-overlay" style="<?php echo esc_attr($overlay_styles); ?>"></div>
    <?php endif; ?>
    
    <div class="cta-particles">
        <?php for ($i = 0; $i < 50; $i++): ?>
            <div class="particle particle-<?php echo $i % 5; ?>"></div>
        <?php endfor; ?>
    </div>

    <div class="cta-container">
        <div class="cta-content cta-align-<?php echo esc_attr($text_alignment); ?>">
            <?php if ($heading): ?>
                <h2 class="cta-heading"><?php echo esc_html($heading); ?></h2>
            <?php endif; ?>
            
            <?php if ($sub_heading): ?>
                <p class="cta-subheading"><?php echo esc_html($sub_heading); ?></p>
            <?php endif; ?>

            <?php if ($button_text): ?>
                <div class="cta-button-wrapper">
                    <?php if ($button_link): ?>
                        <a href="<?php echo esc_url($button_link); ?>" class="cta-button cta-button-<?php echo esc_attr($button_style); ?>">
                            <?php echo esc_html($button_text); ?>
                            <span class="button-arrow">→</span>
                        </a>
                    <?php else: ?>
                        <button class="cta-button cta-button-<?php echo esc_attr($button_style); ?>">
                            <?php echo esc_html($button_text); ?>
                            <span class="button-arrow">→</span>
                        </button>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>