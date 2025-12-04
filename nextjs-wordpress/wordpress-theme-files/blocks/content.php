<?php
/**
 * Content Block Template
 */

$heading = get_field('heading');
$content = get_field('content');
$background_color = get_field('background_color');

$block_id = 'content-' . $block['id'];
$class_name = 'content-block';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}

$style = 'padding: 4rem 1rem;';
if ($background_color) {
    $style .= ' background-color: ' . esc_attr($background_color) . ';';
}
?>

<section id="<?php echo esc_attr($block_id); ?>" 
         class="<?php echo esc_attr($class_name); ?>"
         style="<?php echo $style; ?>">
    
    <div style="max-width: 1200px; margin: 0 auto;">
        <?php if ($heading): ?>
            <h2 style="font-size: 2rem; font-weight: bold; margin-bottom: 1.5rem;">
                <?php echo esc_html($heading); ?>
            </h2>
        <?php endif; ?>
        
        <?php if ($content): ?>
            <div style="line-height: 1.8; font-size: 1.125rem;">
                <?php echo wp_kses_post($content); ?>
            </div>
        <?php endif; ?>
    </div>
</section>
