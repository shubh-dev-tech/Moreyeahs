<?php
/**
 * Navigation Next Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Get ACF fields
$regions = get_field('regions');
$heading = get_field('heading');
$button_text = get_field('button_text');
$button_link = get_field('button_link');

// Block ID
$block_id = 'navigation-next-block-' . $block['id'];
if (!empty($block['anchor'])) {
    $block_id = $block['anchor'];
}

// Block classes
$class_name = 'navigation-next-block';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $class_name .= ' align' . $block['align'];
}
?>

<section id="<?php echo esc_attr($block_id); ?>" class="<?php echo esc_attr($class_name); ?>">
    <div class="navigation-next-block__container">
        
        <?php if ($regions): ?>
        <div class="navigation-next-block__grid">
            <?php foreach ($regions as $region): ?>
            <a href="<?php echo esc_url($region['link']); ?>" class="navigation-next-block__region">
                <span class="navigation-next-block__region-name">
                    <?php echo esc_html($region['name']); ?>
                </span>
            </a>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>

        <?php if ($heading || $button_text): ?>
        <div class="navigation-next-block__cta">
            <?php if ($heading): ?>
                <h2 class="navigation-next-block__heading"><?php echo esc_html($heading); ?></h2>
            <?php endif; ?>
            
            <?php if ($button_text && $button_link): ?>
                <a href="<?php echo esc_url($button_link); ?>" class="navigation-next-block__button">
                    <?php echo esc_html($button_text); ?>
                </a>
            <?php endif; ?>
        </div>
        <?php endif; ?>
    </div>
</section>
