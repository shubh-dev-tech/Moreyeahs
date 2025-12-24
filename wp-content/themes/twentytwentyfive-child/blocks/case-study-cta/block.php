<?php
/**
 * Case Study CTA Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'case-study-cta-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'case-study-cta';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}

// Load values and assign defaults.
$cta_buttons = get_field('cta_buttons');
$background_color = get_field('background_color') ?: '#f8f9fa';
$show_divider = get_field('show_divider') !== false ? get_field('show_divider') : true;
$cta_alignment = get_field('cta_alignment') ?: 'center';

// Build inline styles
$cta_styles = array(
    'background-color: ' . $background_color,
    'text-align: ' . $cta_alignment
);
?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?>" style="<?php echo esc_attr(implode('; ', $cta_styles)); ?>">
    <?php if ($show_divider): ?>
        <div class="case-study-cta__divider"></div>
    <?php endif; ?>
    
    <div class="case-study-cta__content">
        <?php if ($cta_buttons): ?>
            <div class="case-study-cta__buttons">
                <?php foreach ($cta_buttons as $button): ?>
                    <?php
                    $button_style = $button['button_style'] ?: 'primary';
                    $button_size = $button['button_size'] ?: 'medium';
                    $button_classes = array(
                        'case-study-cta__button',
                        'cta-button--' . $button_style,
                        'cta-button--' . $button_size
                    );
                    
                    // Custom button colors
                    $button_inline_styles = array();
                    if ($button['custom_background_color']) {
                        $button_inline_styles[] = 'background-color: ' . $button['custom_background_color'];
                        $button_inline_styles[] = 'border-color: ' . $button['custom_background_color'];
                    }
                    if ($button['custom_text_color']) {
                        $button_inline_styles[] = 'color: ' . $button['custom_text_color'];
                    }
                    ?>
                    <a href="<?php echo esc_url($button['button_url']); ?>" 
                       class="<?php echo esc_attr(implode(' ', $button_classes)); ?>"
                       <?php echo $button['open_in_new_tab'] ? 'target="_blank" rel="noopener"' : ''; ?>
                       <?php echo !empty($button_inline_styles) ? 'style="' . esc_attr(implode('; ', $button_inline_styles)) . '"' : ''; ?>>
                        <?php if ($button['button_icon']): ?>
                            <img src="<?php echo esc_url($button['button_icon']['url']); ?>" 
                                 alt="" width="20" height="20" class="cta-button__icon">
                        <?php endif; ?>
                        <?php echo esc_html($button['button_text']); ?>
                    </a>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</div>