<?php
/**
 * Work Slider Block Template
 *
 * @param array $block The block settings and attributes.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'work-slider-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'work-slider-section';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $className .= ' align' . $block['align'];
}

// Get field values
$heading = get_field('heading') ?: 'Our';
$heading_span_text = get_field('heading_span_text') ?: 'Work';
$heading_color = get_field('heading_color') ?: '#333333';
$heading_span_color = get_field('heading_span_color') ?: '#4a90e2';
$subheading = get_field('subheading') ?: 'Powered solutions enabling intelligent automation, smarter document management, and enhanced enterprise collaboration across industries.';
$subheading_color = get_field('subheading_color') ?: '#666666';
$slides = get_field('slides');
$background_type = get_field('background_type') ?: 'color';
$background_color = get_field('background_color') ?: '#d4e4f0';
$background_image = get_field('background_image');
$background_gradient = get_field('background_gradient') ?: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

// Generate background style
$background_style = '';
switch ($background_type) {
    case 'color':
        $background_style = 'background-color: ' . esc_attr($background_color) . ';';
        break;
    case 'gradient':
        $background_style = 'background: ' . esc_attr($background_gradient) . ';';
        break;
    case 'image':
        if ($background_image) {
            $bg_url = is_array($background_image) ? $background_image['url'] : $background_image;
            $background_style = "background-image: url('" . esc_url($bg_url) . "'); background-size: cover; background-position: center; background-repeat: no-repeat;";
        }
        break;
}
?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?>" style="<?php echo $background_style; ?>">
    <div class="container">
        <div class="work-slider-header">
            <h2 class="work-slider-heading" style="color: <?php echo esc_attr($heading_color); ?>">
                <?php echo esc_html($heading); ?>
                <span class="highlight" style="color: <?php echo esc_attr($heading_span_color); ?>">
                    <?php echo esc_html($heading_span_text); ?>
                </span>
            </h2>
            
            <?php if ($subheading): ?>
                <p class="work-slider-subheading" style="color: <?php echo esc_attr($subheading_color); ?>">
                    <?php echo esc_html($subheading); ?>
                </p>
            <?php endif; ?>
        </div>

        <?php if ($slides && is_array($slides)): ?>
            <div class="work-slider-wrapper">
                <div class="work-slider-track">
                    <?php foreach ($slides as $index => $slide): ?>
                        <div class="work-slide <?php echo $index === 0 ? 'active' : ''; ?>" data-slide="<?php echo $index; ?>">
                            <div class="slide-content">
                                <?php if (!empty($slide['image'])): ?>
                                    <?php 
                                    $slide_image_url = is_array($slide['image']) ? $slide['image']['url'] : $slide['image'];
                                    $slide_image_alt = is_array($slide['image']) ? $slide['image']['alt'] : $slide['title'];
                                    ?>
                                    <div class="slide-image">
                                        <img src="<?php echo esc_url($slide_image_url); ?>" alt="<?php echo esc_attr($slide_image_alt); ?>" />
                                    </div>
                                <?php endif; ?>
                                
                                <div class="slide-text">
                                    <h3 class="slide-title" style="color: <?php echo esc_attr($heading_color); ?>">
                                        <?php echo esc_html($slide['title']); ?>
                                    </h3>
                                    
                                    <?php if (!empty($slide['description'])): ?>
                                        <p class="slide-description" style="color: <?php echo esc_attr($subheading_color); ?>">
                                            <?php echo esc_html($slide['description']); ?>
                                        </p>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <?php if (count($slides) > 1): ?>
                    <div class="slider-dots">
                        <?php foreach ($slides as $index => $slide): ?>
                            <button 
                                class="slider-dot <?php echo $index === 0 ? 'active' : ''; ?>" 
                                data-slide="<?php echo $index; ?>"
                                aria-label="Go to slide <?php echo $index + 1; ?>"
                            ></button>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        <?php else: ?>
            <div class="work-slider-placeholder">
                <p>Please add slides in the WordPress editor.</p>
            </div>
        <?php endif; ?>
    </div>
</div>
