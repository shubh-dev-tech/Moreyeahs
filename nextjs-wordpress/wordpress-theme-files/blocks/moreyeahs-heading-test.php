<?php
/**
 * Moreyeahs Heading Test Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

$heading = get_field('heading');
$subheading = get_field('subheading');
$text_color = get_field('text_color') ?: '#000000';
$background_color = get_field('background_color') ?: 'transparent';
$alignment = get_field('alignment') ?: 'center';

$block_id = 'moreyeahs-heading-test-' . $block['id'];
$class_name = 'moreyeahs-heading-test-block';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}

$align_styles = array(
    'left' => 'text-align: left;',
    'center' => 'text-align: center;',
    'right' => 'text-align: right;',
);

$text_align = isset($align_styles[$alignment]) ? $align_styles[$alignment] : $align_styles['center'];
?>

<section 
    id="<?php echo esc_attr($block_id); ?>" 
    class="<?php echo esc_attr($class_name); ?>"
    style="background-color: <?php echo esc_attr($background_color); ?>; padding: 3rem 1rem;">
    
    <div style="max-width: 1200px; margin: 0 auto; <?php echo $text_align; ?>">
        <?php if ($heading): ?>
            <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem; color: <?php echo esc_attr($text_color); ?>;">
                <?php echo esc_html($heading); ?>
            </h2>
        <?php endif; ?>
        
        <?php if ($subheading): ?>
            <p style="font-size: 1.25rem; color: <?php echo esc_attr($text_color); ?>;">
                <?php echo esc_html($subheading); ?>
            </p>
        <?php endif; ?>
    </div>
</section>
