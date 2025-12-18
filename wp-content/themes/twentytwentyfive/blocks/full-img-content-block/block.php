<?php
/**
 * Full Image Content Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
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

// Get ACF fields
$background_image = get_field('background_image');
$main_heading = get_field('main_heading');
$content_box = get_field('content_box');
$icon_sections = get_field('icon_sections');

// Return early if no content
if (!$background_image || !$main_heading) {
    return;
}
?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?>">
    <div class="full-img-content-container">
        <!-- Left side - Full width image (25%) -->
        <div class="full-img-content-image">
            <img src="<?php echo esc_url($background_image['url']); ?>" 
                 alt="<?php echo esc_attr($background_image['alt']); ?>" />
        </div>
        
        <!-- Right side - Content area (75%) -->
        <div class="full-img-content-content">
            <!-- Main heading -->
            <h2 class="main-heading"><?php echo esc_html($main_heading); ?></h2>
            
            <?php if ($content_box): ?>
            <!-- Content box -->
            <div class="content-box">
                <h3 class="content-box-heading"><?php echo esc_html($content_box['heading']); ?></h3>
                <p class="content-box-subheading"><?php echo esc_html($content_box['subheading']); ?></p>
            </div>
            <?php endif; ?>
            
            <?php if ($icon_sections): ?>
            <!-- Icon sections -->
            <div class="icon-sections">
                <?php foreach ($icon_sections as $section): ?>
                <div class="icon-section">
                    <div class="icon-wrapper">
                        <img src="<?php echo esc_url($section['icon']['url']); ?>" 
                             alt="<?php echo esc_attr($section['icon']['alt']); ?>" 
                             class="section-icon" />
                    </div>
                    <h4 class="section-heading"><?php echo esc_html($section['heading']); ?></h4>
                    <p class="section-subheading"><?php echo esc_html($section['subheading']); ?></p>
                </div>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>
        </div>
    </div>
</div>