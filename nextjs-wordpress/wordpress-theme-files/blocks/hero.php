<?php
/**
 * Hero Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

$title = get_field('title');
$subtitle = get_field('subtitle');
$background_image = get_field('background_image');
$cta_text = get_field('cta_text');
$cta_link = get_field('cta_link');

$block_id = 'hero-' . $block['id'];
$class_name = 'hero-block';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
?>

<section id="<?php echo esc_attr($block_id); ?>" class="<?php echo esc_attr($class_name); ?>" style="position: relative; min-height: 600px; display: flex; align-items: center; justify-content: center; color: white;">
    
    <?php if ($background_image): ?>
        <div style="position: absolute; inset: 0; z-index: 0;">
            <img src="<?php echo esc_url($background_image['url']); ?>" 
                 alt="<?php echo esc_attr($background_image['alt']); ?>"
                 style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.4); z-index: 1;"></div>
    <?php endif; ?>
    
    <div style="position: relative; z-index: 10; text-align: center; max-width: 1200px; padding: 0 1rem;">
        <?php if ($title): ?>
            <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1rem;">
                <?php echo esc_html($title); ?>
            </h1>
        <?php endif; ?>
        
        <?php if ($subtitle): ?>
            <p style="font-size: 1.25rem; margin-bottom: 2rem;">
                <?php echo esc_html($subtitle); ?>
            </p>
        <?php endif; ?>
        
        <?php if ($cta_text && $cta_link): ?>
            <a href="<?php echo esc_url($cta_link); ?>" 
               style="display: inline-block; background: #2563eb; color: white; padding: 0.75rem 2rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none;">
                <?php echo esc_html($cta_text); ?>
            </a>
        <?php endif; ?>
    </div>
</section>
