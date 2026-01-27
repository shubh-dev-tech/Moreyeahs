<?php
/**
 * CTA Block Template
 */

$heading = get_field('heading');
$description = get_field('description');
$button_text = get_field('button_text');
$button_link = get_field('button_link');
$background_color = get_field('background_color') ?: '#1e40af';

$block_id = 'cta-' . $block['id'];
$class_name = 'cta-block';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
?>

<section id="<?php echo esc_attr($block_id); ?>" 
         class="<?php echo esc_attr($class_name); ?>"
         style="background-color: <?php echo esc_attr($background_color); ?>; padding: 5rem 1rem; color: white;">
    
    <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
        <?php if ($heading): ?>
            <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem;">
                <?php echo esc_html($heading); ?>
            </h2>
        <?php endif; ?>
        
        <?php if ($description): ?>
            <p style="font-size: 1.25rem; margin-bottom: 2rem;">
                <?php echo esc_html($description); ?>
            </p>
        <?php endif; ?>
        
        <?php if ($button_text && $button_link): ?>
            <a href="<?php echo esc_url($button_link); ?>"
               style="display: inline-block; background: white; color: #1e40af; padding: 0.75rem 2rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none;">
                <?php echo esc_html($button_text); ?>
            </a>
        <?php endif; ?>
    </div>
</section>
