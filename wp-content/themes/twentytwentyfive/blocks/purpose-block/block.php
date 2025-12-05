<?php
/**
 * Purpose Block Template
 * 
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Get ACF fields
$heading = get_field('heading');
$sub_heading = get_field('sub_heading');
$button_text = get_field('button_text');
$button_link = get_field('button_link');
$border_color = get_field('border_color') ?: '#00A3E0';

// Return early if no content
if (empty($heading) && empty($sub_heading)) {
    return;
}

// Create unique ID for the block
$block_id = 'purpose-block-' . $block['id'];
if (!empty($block['anchor'])) {
    $block_id = $block['anchor'];
}

// Create class attribute
$class_name = 'purpose-block';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $class_name .= ' align' . $block['align'];
}
?>

<section 
    id="<?php echo esc_attr($block_id); ?>" 
    class="<?php echo esc_attr($class_name); ?>"
    style="--border-color: <?php echo esc_attr($border_color); ?>;"
>
    <div class="purpose-block__container">
        <div class="purpose-block__content">
            <?php if ($heading): ?>
                <h2 class="purpose-block__heading"><?php echo esc_html($heading); ?></h2>
            <?php endif; ?>
            
            <?php if ($sub_heading): ?>
                <p class="purpose-block__sub-heading"><?php echo esc_html($sub_heading); ?></p>
            <?php endif; ?>
            
            <?php if ($button_text && $button_link): ?>
                <a 
                    href="<?php echo esc_url($button_link); ?>" 
                    class="purpose-block__button"
                    aria-label="<?php echo esc_attr($button_text); ?>"
                >
                    <?php echo esc_html($button_text); ?>
                </a>
            <?php endif; ?>
        </div>
    </div>
</section>
