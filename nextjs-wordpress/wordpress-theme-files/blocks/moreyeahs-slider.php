<?php
/**
 * Moreyeahs Slider Block Template
 * 
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Get block attributes
$block_id = 'moreyeahs-slider-' . $block['id'];
$slides = get_post_meta($post_id, 'moreyeahs_slider_slides', true);

if (empty($slides)) {
    echo '<div class="moreyeahs-slider-placeholder">';
    echo '<p>Add slides to your slider</p>';
    echo '</div>';
    return;
}
?>

<div id="<?php echo esc_attr($block_id); ?>" class="moreyeahs-slider">
    <div class="slider-container">
        <?php foreach ($slides as $index => $slide): ?>
            <div class="slide <?php echo $index === 0 ? 'active' : ''; ?>">
                <?php if (!empty($slide['image'])): ?>
                    <img src="<?php echo esc_url($slide['image']); ?>" alt="<?php echo esc_attr($slide['heading']); ?>" class="slide-image" />
                <?php endif; ?>
                
                <div class="slide-overlay"></div>
                
                <div class="slide-caption">
                    <div class="container">
                        <?php if (!empty($slide['heading'])): ?>
                            <h2 class="slide-heading"><?php echo esc_html($slide['heading']); ?></h2>
                        <?php endif; ?>
                        
                        <?php if (!empty($slide['cta_text']) && !empty($slide['cta_url'])): ?>
                            <a href="<?php echo esc_url($slide['cta_url']); ?>" class="slide-cta">
                                <?php echo esc_html($slide['cta_text']); ?>
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
    
    <div class="slider-dots">
        <?php foreach ($slides as $index => $slide): ?>
            <button class="dot <?php echo $index === 0 ? 'active' : ''; ?>" data-slide="<?php echo $index; ?>">
                <span></span>
            </button>
        <?php endforeach; ?>
    </div>
</div>
