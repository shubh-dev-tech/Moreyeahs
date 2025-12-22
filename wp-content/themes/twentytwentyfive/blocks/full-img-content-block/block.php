<?php
/**
 * Full Image Content Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'full-img-content-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'full-img-content-block';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $className .= ' align' . $block['align'];
}

// Load values and assign defaults.
$background_image = get_field('background_image') ?: '';
$heading = get_field('heading') ?: '';
$content = get_field('content') ?: '';
$button_text = get_field('button_text') ?: '';
$button_link = get_field('button_link') ?: '';

?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?>">
    <?php if ($background_image): ?>
        <div class="background-image" style="background-image: url('<?php echo esc_url($background_image['url']); ?>');">
    <?php else: ?>
        <div class="background-image">
    <?php endif; ?>
        
        <div class="content-overlay">
            <div class="container">
                <?php if ($heading): ?>
                    <h2 class="block-heading"><?php echo esc_html($heading); ?></h2>
                <?php endif; ?>
                
                <?php if ($content): ?>
                    <div class="block-content">
                        <?php echo wp_kses_post($content); ?>
                    </div>
                <?php endif; ?>
                
                <?php if ($button_text && $button_link): ?>
                    <div class="block-cta">
                        <a href="<?php echo esc_url($button_link); ?>" class="btn btn-primary">
                            <?php echo esc_html($button_text); ?>
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>