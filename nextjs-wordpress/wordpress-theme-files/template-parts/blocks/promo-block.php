<?php
/**
 * Promo Block Template
 * 
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Get ACF fields
$background_image = get_field('background_image');
$heading = get_field('heading');
$sub_heading = get_field('sub_heading');
$button_text = get_field('button_text');
$button_link = get_field('button_link');
$reverse_layout = get_field('reverse_layout');
$background_size = get_field('background_size') ?: 'contain';
$background_color = get_field('background_color') ?: '#131A4E';
$min_height = get_field('min_height') ?: 400;
$content_padding = get_field('content_padding') ?: 60;

// Return early if no content
if (empty($heading) && empty($sub_heading)) {
    return;
}

// Get background image URL
$bg_image_url = '';
if ($background_image) {
    $bg_image_url = is_array($background_image) ? $background_image['url'] : $background_image;
}

// Create unique ID for the block
$block_id = 'promo-block-' . $block['id'];
if (!empty($block['anchor'])) {
    $block_id = $block['anchor'];
}

// Create class attribute
$class_name = 'promo-block';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $class_name .= ' align' . $block['align'];
}
if ($reverse_layout) {
    $class_name .= ' promo-block--reversed';
}
?>

<section 
    id="<?php echo esc_attr($block_id); ?>" 
    class="<?php echo esc_attr($class_name); ?>"
    style="min-height: <?php echo esc_attr($min_height); ?>px;"
>
    <style>
        #<?php echo esc_attr($block_id); ?>::before {
            background-color: <?php echo esc_attr($background_color); ?>;
            background-size: <?php echo esc_attr($background_size); ?>;
            <?php if ($bg_image_url): ?>
                background-image: url('<?php echo esc_url($bg_image_url); ?>');
            <?php endif; ?>
        }
        #<?php echo esc_attr($block_id); ?> .promo-block__container {
            padding: <?php echo esc_attr($content_padding); ?>px 40px;
        }
        @media (max-width: 768px) {
            #<?php echo esc_attr($block_id); ?> .promo-block__container {
                padding: <?php echo esc_attr(max($content_padding * 0.7, 20)); ?>px 20px;
            }
        }
        @media (max-width: 480px) {
            #<?php echo esc_attr($block_id); ?> .promo-block__container {
                padding: <?php echo esc_attr(max($content_padding * 0.5, 15)); ?>px 15px;
            }
        }
    </style>
    <div class="promo-block__overlay">
        <div class="promo-block__container">
            <div class="promo-block__content">
                <?php if ($heading): ?>
                    <h2 class="promo-block__heading"><?php echo esc_html($heading); ?></h2>
                <?php endif; ?>
                
                <?php if ($sub_heading): ?>
                    <p class="promo-block__sub-heading"><?php echo esc_html($sub_heading); ?></p>
                <?php endif; ?>
                
                <?php if ($button_text && $button_link): ?>
                    <a 
                        href="<?php echo esc_url($button_link); ?>" 
                        class="promo-block__button"
                        aria-label="<?php echo esc_attr($button_text); ?>"
                    >
                        <?php echo esc_html($button_text); ?>
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>
