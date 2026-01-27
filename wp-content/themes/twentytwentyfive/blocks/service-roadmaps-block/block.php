<?php
/**
 * Service Roadmaps Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'service-roadmaps-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$class_name = 'service-roadmaps-block';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $class_name .= ' align' . $block['align'];
}

// Load values and assign defaults.
$heading = get_field('heading') ?: 'Our DevOps Strategy Roadmap';
$subheading = get_field('subheading') ?: '';
$right_image = get_field('right_image');
$background_color = get_field('background_color') ?: '#e8f5e8';
$roadmap_steps = get_field('roadmap_steps') ?: array();

// If no steps, show placeholder in preview mode
if (empty($roadmap_steps) && $is_preview) {
    $roadmap_steps = array(
        array(
            'step_title' => 'Assess & Analyze',
            'step_description' => 'Evaluate current DevOps maturity using industry frameworks, identify capability gaps, and establish baseline metrics for improvement tracking',
            'step_icon' => null
        ),
        array(
            'step_title' => 'Implement Automation',
            'step_description' => 'Deploy CI/CD pipelines with clear milestones, automate testing and deployment processes, and establish measurable success criteria',
            'step_icon' => null
        ),
        array(
            'step_title' => 'Build Culture',
            'step_description' => 'Foster transparency through open communication channels, establish shared responsibility models, and create psychological safety for innovation',
            'step_icon' => null
        ),
        array(
            'step_title' => 'Refine & Optimize',
            'step_description' => 'Continuously enhance processes based on real-time feedback, performance metrics, and lessons learned from each iteration',
            'step_icon' => null
        )
    );
}

// Don't render if no heading or steps
if (empty($heading) || empty($roadmap_steps)) {
    return;
}
?>

<div 
    id="<?php echo esc_attr($id); ?>" 
    class="<?php echo esc_attr($class_name); ?>"
    style="background-color: <?php echo esc_attr($background_color); ?>;"
>
    <div class="srb-container">
        <!-- Left side - Content -->
        <div class="srb-left">
            <div class="srb-content">
                <h2 class="srb-heading"><?php echo esc_html($heading); ?></h2>
                
                <?php if (!empty($subheading)) : ?>
                    <p class="srb-subheading"><?php echo esc_html($subheading); ?></p>
                <?php endif; ?>
                
                <div class="srb-steps">
                    <?php foreach ($roadmap_steps as $index => $step) : ?>
                        <div class="srb-step" data-step="<?php echo $index + 1; ?>">
                            <!-- Step counter with connecting line -->
                            <div class="srb-counter-wrapper">
                                <div class="srb-counter">
                                    <?php if (!empty($step['step_icon'])) : ?>
                                        <img 
                                            src="<?php echo esc_url($step['step_icon']['url']); ?>" 
                                            alt="<?php echo esc_attr($step['step_icon']['alt'] ?: $step['step_title']); ?>"
                                            class="srb-icon"
                                        />
                                    <?php else : ?>
                                        <span class="srb-number"><?php echo $index + 1; ?></span>
                                    <?php endif; ?>
                                </div>
                                
                                <?php if ($index < count($roadmap_steps) - 1) : ?>
                                    <div class="srb-line"></div>
                                <?php endif; ?>
                            </div>
                            
                            <!-- Step content -->
                            <div class="srb-step-content">
                                <h3 class="srb-step-title"><?php echo esc_html($step['step_title']); ?></h3>
                                <p class="srb-step-description"><?php echo esc_html($step['step_description']); ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
        
        <!-- Right side - Image -->
        <?php if (!empty($right_image)) : ?>
            <div class="srb-right">
                <div class="srb-image">
                    <img 
                        src="<?php echo esc_url($right_image['url']); ?>" 
                        alt="<?php echo esc_attr($right_image['alt'] ?: $heading); ?>"
                        loading="lazy"
                    />
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>