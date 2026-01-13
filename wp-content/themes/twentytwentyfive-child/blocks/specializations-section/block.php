<?php
/**
 * Specializations Section Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'specializations-section-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'specializations-section';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $className .= ' align' . $block['align'];
}

// Get field values
$left_items = get_field('left_items');
$right_heading = get_field('right_heading');
$right_heading_color = get_field('right_heading_color');
$right_span_text = get_field('right_span_text');
$right_span_color = get_field('right_span_color');
$right_paragraphs = get_field('right_paragraphs');
$background_type = get_field('background_type');
$background_color = get_field('background_color');
$gradient_start = get_field('gradient_start');
$gradient_end = get_field('gradient_end');
$gradient_direction = get_field('gradient_direction');
$background_image = get_field('background_image');

// Generate background style
$background_style = '';
switch ($background_type) {
    case 'color':
        $background_style = 'background-color: ' . ($background_color ?: '#E0F7FA') . ';';
        break;
    case 'gradient':
        $start = $gradient_start ?: '#E0F7FA';
        $end = $gradient_end ?: '#B2EBF2';
        $direction = $gradient_direction ?: 'to right';
        $background_style = "background: linear-gradient({$direction}, {$start}, {$end});";
        break;
    case 'image':
        if ($background_image) {
            $background_style = "background-image: url({$background_image['url']}); background-size: cover; background-position: center; background-repeat: no-repeat;";
        }
        break;
    default:
        $background_style = 'background-color: ' . ($background_color ?: '#E0F7FA') . ';';
        break;
}
?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?>" style="<?php echo esc_attr($background_style); ?>">
    <div class="container">
        <div class="specializations-content">
            <!-- Left Side -->
            <div class="left-side">
                <?php if ($left_items): ?>
                    <?php foreach ($left_items as $item): ?>
                        <div class="specialization-item">
                            <?php if ($item['image']): ?>
                                <div class="item-image">
                                    <img src="<?php echo esc_url($item['image']['url']); ?>" 
                                         alt="<?php echo esc_attr($item['image']['alt'] ?: $item['heading']); ?>">
                                </div>
                            <?php endif; ?>
                            
                            <div class="item-content">
                                <h3 class="item-heading" 
                                    style="color: <?php echo esc_attr($item['heading_color'] ?: '#333333'); ?>">
                                    <?php echo esc_html($item['heading']); ?>
                                </h3>
                                
                                <?php if ($item['subheading']): ?>
                                    <p class="item-subheading" 
                                       style="color: <?php echo esc_attr($item['subheading_color'] ?: '#666666'); ?>">
                                        <?php echo esc_html($item['subheading']); ?>
                                    </p>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>

            <!-- Right Side -->
            <div class="right-side">
                <?php if ($right_heading): ?>
                    <h2 class="right-heading" style="color: <?php echo esc_attr($right_heading_color ?: '#333333'); ?>">
                        <?php echo esc_html($right_heading); ?>
                        <?php if ($right_span_text): ?>
                            <span class="highlight" style="color: <?php echo esc_attr($right_span_color ?: '#007acc'); ?>">
                                <?php echo esc_html($right_span_text); ?>
                            </span>
                        <?php endif; ?>
                    </h2>
                <?php endif; ?>

                <?php if ($right_paragraphs): ?>
                    <div class="right-content">
                        <?php foreach ($right_paragraphs as $paragraph): ?>
                            <p style="color: <?php echo esc_attr($paragraph['color'] ?: '#666666'); ?>">
                                <?php echo esc_html($paragraph['text']); ?>
                            </p>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>