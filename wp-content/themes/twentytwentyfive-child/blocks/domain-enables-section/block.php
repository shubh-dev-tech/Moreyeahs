<?php
/**
 * Domain Enables Section Block Template
 */

// Get field values
$heading = get_field('heading');
$subheading = get_field('subheading');
$background_type = get_field('background_type');
$background_color = get_field('background_color');
$gradient_start = get_field('gradient_start');
$gradient_end = get_field('gradient_end');
$gradient_direction = get_field('gradient_direction');
$background_image = get_field('background_image');
$icon_image = get_field('icon_image');
$feature_points = get_field('feature_points');
$main_image = get_field('main_image');

// Generate background style
$background_style = '';
switch ($background_type) {
    case 'color':
        $background_style = $background_color ? "background-color: {$background_color};" : '';
        break;
    case 'gradient':
        if ($gradient_start && $gradient_end && $gradient_direction) {
            $background_style = "background: linear-gradient({$gradient_direction}, {$gradient_start}, {$gradient_end});";
        }
        break;
    case 'image':
        if ($background_image) {
            $background_style = "background-image: url('{$background_image['url']}'); background-size: cover; background-position: center; background-repeat: no-repeat;";
        }
        break;
}

// Generate unique ID for the block
$block_id = 'domain-enables-' . uniqid();
?>

<div id="<?php echo esc_attr($block_id); ?>" class="domain-enables-section" style="<?php echo esc_attr($background_style); ?>">
    <div class="container">
        <div class="domain-enables-content">
            <div class="content-wrapper">
                <?php if ($heading): ?>
                    <div class="heading">
                        <?php echo $heading; ?>
                    </div>
                <?php endif; ?>

                <?php if ($subheading): ?>
                    <div class="subheading">
                        <?php echo $subheading; ?>
                    </div>
                <?php endif; ?>

                <?php if ($feature_points): ?>
                    <div class="feature-points">
                        <?php foreach ($feature_points as $point): ?>
                            <div class="feature-point">
                                <?php if ($icon_image): ?>
                                    <div class="point-icon">
                                        <img src="<?php echo esc_url($icon_image['url']); ?>" alt="<?php echo esc_attr($icon_image['alt']); ?>" />
                                    </div>
                                <?php else: ?>
                                    <div class="point-icon default-icon">
                                        <div class="checkmark">✓</div>
                                    </div>
                                <?php endif; ?>
                                <span class="point-text"><?php echo esc_html($point['text']); ?></span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

            <?php if ($main_image): ?>
                <div class="image-wrapper">
                    <img src="<?php echo esc_url($main_image['url']); ?>" alt="<?php echo esc_attr($main_image['alt']); ?>" class="main-image" />
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>