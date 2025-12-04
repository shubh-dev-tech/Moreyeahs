<?php
/**
 * Image Text Block Template
 */

$image = get_field('image');
$heading = get_field('heading');
$text = get_field('text');
$image_position = get_field('image_position') ?: 'left';

$block_id = 'image-text-' . $block['id'];
$class_name = 'image-text-block';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}

$flex_direction = $image_position === 'right' ? 'row-reverse' : 'row';
?>

<section id="<?php echo esc_attr($block_id); ?>" 
         class="<?php echo esc_attr($class_name); ?>"
         style="padding: 4rem 1rem;">
    
    <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-direction: <?php echo $flex_direction; ?>; gap: 2rem; align-items: center; flex-wrap: wrap;">
        
        <?php if ($image): ?>
            <div style="flex: 1; min-width: 300px;">
                <img src="<?php echo esc_url($image['url']); ?>" 
                     alt="<?php echo esc_attr($image['alt']); ?>"
                     style="width: 100%; height: auto; border-radius: 0.5rem;">
            </div>
        <?php endif; ?>
        
        <div style="flex: 1; min-width: 300px;">
            <?php if ($heading): ?>
                <h2 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">
                    <?php echo esc_html($heading); ?>
                </h2>
            <?php endif; ?>
            
            <?php if ($text): ?>
                <div style="line-height: 1.6;">
                    <?php echo wp_kses_post($text); ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>
