<?php
/**
 * Service Details Section Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'service-details-section-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$class_name = 'service-details-section';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $class_name .= ' align' . $block['align'];
}

// Get field values
$background_color = get_field('background_color') ?: '#f8f9fa';
$background_image = get_field('background_image');
$heading = get_field('heading');
$sub_heading = get_field('sub_heading');
$services = get_field('services');
$grid_columns = get_field('grid_columns') ?: '3';

// Debug: Log the services data
if (defined('WP_DEBUG') && WP_DEBUG) {
    error_log('Service Details Section - Services data: ' . print_r($services, true));
}

// Build inline styles
$section_styles = array();
$section_styles[] = 'background-color: ' . esc_attr($background_color);

if ($background_image) {
    $section_styles[] = 'background-image: url(' . esc_url($background_image['url']) . ')';
    $section_styles[] = 'background-size: cover';
    $section_styles[] = 'background-position: center';
    $section_styles[] = 'background-repeat: no-repeat';
}

$style_attr = !empty($section_styles) ? 'style="' . implode('; ', $section_styles) . '"' : '';

// Grid class based on columns
$grid_class = 'services-grid-' . $grid_columns;
?>

<section id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($class_name); ?>" <?php echo $style_attr; ?>>
    <div class="service-details-container">
        <?php if ($heading || $sub_heading): ?>
            <div class="service-details-header">
                <?php if ($heading): ?>
                    <h2 class="service-details-heading"><?php echo esc_html($heading); ?></h2>
                <?php endif; ?>
                
                <?php if ($sub_heading): ?>
                    <p class="service-details-subheading"><?php echo esc_html($sub_heading); ?></p>
                <?php endif; ?>
            </div>
        <?php endif; ?>

        <?php if ($services): ?>
            <div class="services-grid <?php echo esc_attr($grid_class); ?>">
                <?php foreach ($services as $service): 
                    $icon = $service['service_icon'];
                    $title = $service['service_title'];
                    $description = $service['service_description'];
                    $link = $service['service_link'];
                ?>
                    <div class="service-item">
                        <?php if ($link): ?>
                            <a href="<?php echo esc_url($link); ?>" class="service-link">
                        <?php endif; ?>
                        
                        <div class="service-content">
                            <?php if ($icon): ?>
                                <div class="service-icon">
                                    <img src="<?php echo esc_url($icon['url']); ?>" 
                                         alt="<?php echo esc_attr($icon['alt'] ?: $title); ?>" 
                                         width="64" 
                                         height="64">
                                </div>
                            <?php endif; ?>
                            
                            <?php if ($title): ?>
                                <h3 class="service-title"><?php echo esc_html($title); ?></h3>
                            <?php endif; ?>
                            
                            <?php if ($description): ?>
                                <div class="service-description">
                                    <?php echo wp_kses_post(nl2br($description)); ?>
                                </div>
                            <?php endif; ?>
                        </div>
                        
                        <?php if ($link): ?>
                            </a>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</section>