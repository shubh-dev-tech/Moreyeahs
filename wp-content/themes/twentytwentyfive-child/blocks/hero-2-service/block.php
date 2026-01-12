<?php
/**
 * Hero 2 Service Block
 */

// Get ACF fields
$title = get_field('title') ?: 'What is Data Engineering?';
$subtitle = get_field('subtitle') ?: 'Integrating Development and Operations.';
$description = get_field('description') ?: 'DevOps is a set of practices that unifies software development and IT operations. Its goal is to shorten development cycles, increase deployment frequency, and deliver reliable software through automation, collaboration, and continuous improvement.';
$left_image = get_field('left_image');
$image_full_width = get_field('image_full_width') ?: false;

// Content type and data
$content_type = get_field('content_type') ?: 'service_blocks';
$service_blocks = get_field('service_blocks') ?: [];
$bullet_points = get_field('bullet_points') ?: [];

// Background settings
$background_type = get_field('background_type') ?: 'color';
$background_color = get_field('background_color') ?: '#7ED4AD';
$gradient_color1 = get_field('gradient_color1') ?: '#7ED4AD';
$gradient_color2 = get_field('gradient_color2') ?: '#4ECDC4';
$gradient_direction = get_field('gradient_direction') ?: 'to right';
$background_image = get_field('background_image');
$background_overlay = get_field('background_overlay');

// Text colors
$title_color = get_field('title_color') ?: '#333333';
$subtitle_color = get_field('subtitle_color') ?: '#666666';
$description_color = get_field('description_color') ?: '#333333';

// Layout
$service_layout = get_field('service_layout') ?: '1x3';
$reverse_layout = get_field('reverse_layout') ?: false;

// Generate background style
$background_style = '';
switch ($background_type) {
    case 'gradient':
        $background_style = "background: linear-gradient({$gradient_direction}, {$gradient_color1}, {$gradient_color2});";
        break;
    case 'image':
        if ($background_image) {
            $background_style = "background-image: url('{$background_image['url']}'); background-size: cover; background-position: center; background-repeat: no-repeat;";
            if ($background_overlay) {
                $background_style .= " position: relative;";
            }
        } else {
            $background_style = "background-color: {$background_color};";
        }
        break;
    default:
        $background_style = "background-color: {$background_color};";
        break;
}

$block_count = count($service_blocks);
$section_classes = 'hero-2-service';
if ($reverse_layout) {
    $section_classes .= ' hero-2-service--reverse';
}
if ($image_full_width) {
    $section_classes .= ' hero-2-service--full-width-image';
}
?>

<section class="<?php echo esc_attr($section_classes); ?>" style="<?php echo esc_attr($background_style); ?>">
    <?php if ($background_type === 'image' && $background_overlay): ?>
        <div class="hero-2-service__overlay" style="background-color: <?php echo esc_attr($background_overlay); ?>;"></div>
    <?php endif; ?>
    
    <div class="hero-2-service__container">
        <div class="hero-2-service__content">
            <!-- Left Side - Image -->
            <?php if ($left_image): ?>
                <div class="hero-2-service__image-section">
                    <div class="hero-2-service__image-wrapper">
                        <img 
                            src="<?php echo esc_url($left_image['url']); ?>" 
                            alt="<?php echo esc_attr($left_image['alt']); ?>"
                            class="hero-2-service__image"
                        />
                    </div>
                </div>
            <?php endif; ?>

            <!-- Right Side - Content -->
            <div class="hero-2-service__text-section">
                <div class="hero-2-service__header">
                    <?php if (!empty(trim($title))): ?>
                        <h2 class="hero-2-service__title" style="color: <?php echo esc_attr($title_color); ?>;">
                            <?php echo esc_html($title); ?>
                        </h2>
                    <?php endif; ?>
                    <?php if (!empty(trim($subtitle))): ?>
                        <h3 class="hero-2-service__subtitle" style="color: <?php echo esc_attr($subtitle_color); ?>;">
                            <?php echo esc_html($subtitle); ?>
                        </h3>
                    <?php endif; ?>
                    <?php if (!empty(trim($description))): ?>
                        <p class="hero-2-service__description" style="color: <?php echo esc_attr($description_color); ?>;">
                            <?php echo esc_html($description); ?>
                        </p>
                    <?php endif; ?>
                </div>

                <!-- Content Section - Service Blocks or Bullet Points -->
                <?php if ($content_type === 'service_blocks' && !empty($service_blocks)): ?>
                    <!-- Service Blocks -->
                    <div class="hero-2-service__blocks hero-2-service__blocks--<?php echo esc_attr($service_layout); ?>" 
                         data-count="<?php echo esc_attr(count($service_blocks)); ?>" 
                         data-layout="<?php echo esc_attr($service_layout); ?>">
                        <?php foreach ($service_blocks as $block): ?>
                            <div class="hero-2-service__block" style="background-color: <?php echo esc_attr($block['background_color'] ?: '#ffffff'); ?>;">
                                <?php if (!empty(trim($block['title']))): ?>
                                    <h4 class="hero-2-service__block-title" style="color: <?php echo esc_attr($block['title_color'] ?: '#333333'); ?>;">
                                        <?php echo esc_html($block['title']); ?>
                                    </h4>
                                <?php endif; ?>
                                <?php if (!empty(trim($block['description']))): ?>
                                    <p class="hero-2-service__block-description" style="color: <?php echo esc_attr($block['description_color'] ?: '#666666'); ?>;">
                                        <?php echo esc_html($block['description']); ?>
                                    </p>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php elseif ($content_type === 'bullet_points' && !empty($bullet_points)): ?>
                    <!-- Bullet Points -->
                    <div class="hero-2-service__bullet-points">
                        <?php foreach ($bullet_points as $bullet): ?>
                            <div class="hero-2-service__bullet-item">
                                <div class="hero-2-service__bullet-dot" 
                                     style="background-color: <?php echo esc_attr($bullet['bullet_color'] ?: '#7ED4AD'); ?>;"></div>
                                <div class="hero-2-service__bullet-content">
                                    <?php if (!empty(trim($bullet['heading']))): ?>
                                        <h4 class="hero-2-service__bullet-heading" 
                                            style="color: <?php echo esc_attr($bullet['heading_color'] ?: '#333333'); ?>;">
                                            <?php echo esc_html($bullet['heading']); ?>
                                        </h4>
                                    <?php endif; ?>
                                    <?php if (!empty(trim($bullet['subheading']))): ?>
                                        <h5 class="hero-2-service__bullet-subheading" 
                                            style="color: <?php echo esc_attr($bullet['subheading_color'] ?: '#666666'); ?>;">
                                            <?php echo esc_html($bullet['subheading']); ?>
                                        </h5>
                                    <?php endif; ?>
                                    <?php if (!empty(trim($bullet['description']))): ?>
                                        <p class="hero-2-service__bullet-description" 
                                           style="color: <?php echo esc_attr($bullet['description_color'] ?: '#333333'); ?>;">
                                            <?php echo esc_html($bullet['description']); ?>
                                        </p>
                                    <?php endif; ?>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>