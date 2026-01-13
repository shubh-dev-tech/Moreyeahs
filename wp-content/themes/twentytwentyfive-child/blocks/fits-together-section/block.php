<?php
/**
 * Fits Together Section Block
 */

// Get ACF fields
$span_heading = get_field('span_heading') ?: 'How It';
$span_heading_color = get_field('span_heading_color') ?: '#6B7280';
$main_heading = get_field('main_heading') ?: 'Fits Together';
$main_heading_color = get_field('main_heading_color') ?: '#0EA5E9';
$background_type = get_field('background_type') ?: 'gradient';
$background_color = get_field('background_color') ?: '#A7F3D0';
$gradient_start_color = get_field('gradient_start_color') ?: '#A7F3D0';
$gradient_end_color = get_field('gradient_end_color') ?: '#7DD3FC';
$background_image = get_field('background_image');
$steps = get_field('steps') ?: [];

// Generate background style
$background_style = '';
switch ($background_type) {
    case 'color':
        $background_style = "background-color: {$background_color};";
        break;
    case 'gradient':
        $background_style = "background: linear-gradient(135deg, {$gradient_start_color} 0%, {$gradient_end_color} 100%);";
        break;
    case 'image':
        if ($background_image) {
            $background_style = "background-image: url('{$background_image['url']}'); background-size: cover; background-position: center;";
        }
        break;
}

// Block ID for unique styling
$block_id = 'fits-together-' . $block['id'];
?>

<section id="<?php echo esc_attr($block_id); ?>" class="fits-together-section" style="<?php echo esc_attr($background_style); ?>">
    <div class="fits-together-container">
        <div class="fits-together-header">
            <h2 class="fits-together-title">
                <span class="fits-together-span" style="color: <?php echo esc_attr($span_heading_color); ?>">
                    <?php echo esc_html($span_heading); ?>
                </span>
                <span class="fits-together-main" style="color: <?php echo esc_attr($main_heading_color); ?>">
                    <?php echo esc_html($main_heading); ?>
                </span>
            </h2>
        </div>
        
        <?php if (!empty($steps)): ?>
        <div class="fits-together-steps">
            <?php foreach ($steps as $index => $step): 
                $is_last = ($index === count($steps) - 1);
            ?>
            <div class="fits-together-step">
                <div class="step-content">
                    <?php if (!empty($step['icon'])): ?>
                    <div class="step-icon">
                        <img src="<?php echo esc_url($step['icon']['url']); ?>" 
                             alt="<?php echo esc_attr($step['icon']['alt']); ?>" />
                    </div>
                    <?php endif; ?>
                    
                    <div class="step-info">
                        <div class="step-number" style="color: <?php echo esc_attr($step['step_number_color'] ?: '#0EA5E9'); ?>">
                            <?php echo esc_html($step['step_number']); ?>
                        </div>
                        <h3 class="step-title" style="color: <?php echo esc_attr($step['title_color'] ?: '#1F2937'); ?>">
                            <?php echo esc_html($step['title']); ?>
                        </h3>
                        <p class="step-subtitle" style="color: <?php echo esc_attr($step['subtitle_color'] ?: '#6B7280'); ?>">
                            <?php echo esc_html($step['subtitle']); ?>
                        </p>
                    </div>
                </div>
                
                <?php if (!$is_last): ?>
                <div class="step-arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <?php endif; ?>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>
</section>