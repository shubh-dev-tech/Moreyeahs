<?php
/**
 * Roadmap Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'roadmap-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'roadmap-block';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $className .= ' align' . $block['align'];
}

// Get ACF fields
$heading = get_field('heading');
$subheading = get_field('subheading');
$left_image = get_field('left_image');
$background_color = get_field('background_color');
$roadmap_steps = get_field('roadmap_steps');

// Return early if no content
if (!$heading || !$roadmap_steps) {
    return;
}

// Set default background color if not provided
$bg_color = $background_color ? $background_color : '#1a0b2e';
?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?>" style="background-color: <?php echo esc_attr($bg_color); ?>;">
    <div class="roadmap-container">
        <!-- Left side - Sticky content -->
        <div class="roadmap-left">
            <div class="roadmap-left-sticky">
                <h2 class="roadmap-heading"><?php echo esc_html($heading); ?></h2>
                <?php if ($subheading): ?>
                    <p class="roadmap-subheading"><?php echo esc_html($subheading); ?></p>
                <?php endif; ?>
                
                <?php if ($left_image): ?>
                    <div class="roadmap-image">
                        <img src="<?php echo esc_url($left_image['url']); ?>" 
                             alt="<?php echo esc_attr($left_image['alt']); ?>" />
                    </div>
                <?php endif; ?>
            </div>
        </div>
        
        <!-- Right side - Scrollable steps -->
        <div class="roadmap-right">
            <?php if ($roadmap_steps): ?>
                <div class="roadmap-steps">
                    <?php foreach ($roadmap_steps as $index => $step): ?>
                        <div class="roadmap-step" data-step="<?php echo $index + 1; ?>">
                            <!-- Step counter with line -->
                            <div class="step-counter-wrapper">
                                <div class="step-counter">
                                    <span class="step-number"><?php echo $index + 1; ?></span>
                                </div>
                                <?php if ($index < count($roadmap_steps) - 1): ?>
                                    <div class="step-line"></div>
                                <?php endif; ?>
                            </div>
                            
                            <!-- Step content box -->
                            <div class="step-content">
                                <?php if (!empty($step['icon'])): ?>
                                    <div class="step-icon">
                                        <img src="<?php echo esc_url($step['icon']['url']); ?>" 
                                             alt="<?php echo esc_attr($step['icon']['alt']); ?>" />
                                    </div>
                                <?php endif; ?>
                                
                                <h3 class="step-heading"><?php echo esc_html($step['heading']); ?></h3>
                                
                                <?php if (!empty($step['subheading'])): ?>
                                    <p class="step-subheading"><?php echo esc_html($step['subheading']); ?></p>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>