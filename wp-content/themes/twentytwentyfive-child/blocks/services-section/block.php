<?php
/**
 * Services Section Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'services-section-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$class_name = 'services-section';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $class_name .= ' align' . $block['align'];
}

// Get ACF fields
$main_heading = get_field('main_heading') ?: 'Our Services';
$main_heading_color = get_field('main_heading_color') ?: '#333333';
$span_text = get_field('span_text') ?: 'Services';
$span_color = get_field('span_color') ?: '#007acc';
$description = get_field('description') ?: '';
$description_color = get_field('description_color') ?: '#666666';
$service_items = get_field('service_items') ?: [];
$background_type = get_field('background_type') ?: 'gradient';
$background_color = get_field('background_color') ?: '#E0F7FA';
$gradient_start = get_field('gradient_start') ?: '#E0F7FA';
$gradient_end = get_field('gradient_end') ?: '#B2EBF2';
$gradient_direction = get_field('gradient_direction') ?: 'to bottom';
$background_image = get_field('background_image');

// Build background style
$background_style = '';
switch ($background_type) {
    case 'color':
        $background_style = "background-color: {$background_color};";
        break;
    case 'gradient':
        $background_style = "background: linear-gradient({$gradient_direction}, {$gradient_start}, {$gradient_end});";
        break;
    case 'image':
        if ($background_image) {
            $background_style = "background-image: url('{$background_image['url']}'); background-size: cover; background-position: center; background-repeat: no-repeat;";
        }
        break;
}
?>

<section id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($class_name); ?>" style="<?php echo esc_attr($background_style); ?>">
    <div class="services-section__container">
        <div class="services-section__header">
            <h2 class="services-section__heading" style="color: <?php echo esc_attr($main_heading_color); ?>;">
                <?php 
                if ($span_text && strpos($main_heading, $span_text) !== false) {
                    echo str_replace($span_text, '<span style="color: ' . esc_attr($span_color) . ';">' . esc_html($span_text) . '</span>', esc_html($main_heading));
                } elseif ($span_text) {
                    echo esc_html($main_heading) . ' <span style="color: ' . esc_attr($span_color) . ';">' . esc_html($span_text) . '</span>';
                } else {
                    echo esc_html($main_heading);
                }
                ?>
            </h2>
            <?php if ($description): ?>
                <p class="services-section__description" style="color: <?php echo esc_attr($description_color); ?>;">
                    <?php echo esc_html($description); ?>
                </p>
            <?php endif; ?>
        </div>

        <?php if ($service_items): ?>
            <div class="services-section__grid">
                <?php foreach ($service_items as $item): ?>
                    <?php 
                    $has_url = !empty($item['url']);
                    $tag_open = $has_url ? '<a href="' . esc_url($item['url']) . '" class="services-section__item-link">' : '';
                    $tag_close = $has_url ? '</a>' : '';
                    ?>
                    
                    <?php echo $tag_open; ?>
                    <div class="services-section__item<?php echo $has_url ? ' clickable' : ''; ?>">
                        <?php if (!empty($item['image'])): ?>
                            <div class="services-section__item-icon">
                                <img src="<?php echo esc_url($item['image']['url']); ?>" 
                                     alt="<?php echo esc_attr($item['image']['alt'] ?: $item['heading']); ?>" 
                                     width="<?php echo esc_attr($item['image']['width']); ?>" 
                                     height="<?php echo esc_attr($item['image']['height']); ?>">
                            </div>
                        <?php endif; ?>
                        
                        <h3 class="services-section__item-heading" 
                            style="color: <?php echo esc_attr($item['heading_color'] ?: '#333333'); ?>;">
                            <?php echo esc_html($item['heading']); ?>
                        </h3>
                        
                        <?php if (!empty($item['description'])): ?>
                            <p class="services-section__item-description" 
                               style="color: <?php echo esc_attr($item['description_color'] ?: '#666666'); ?>;">
                                <?php echo esc_html($item['description']); ?>
                            </p>
                        <?php endif; ?>
                        
                        <?php if ($has_url): ?>
                            <div class="services-section__item-arrow">
                                <span>→</span>
                            </div>
                        <?php endif; ?>
                    </div>
                    <?php echo $tag_close; ?>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</section>