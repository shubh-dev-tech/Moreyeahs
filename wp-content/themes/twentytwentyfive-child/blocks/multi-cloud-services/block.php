<?php
/**
 * Multi Cloud Services Block Template
 */

// Get field values
$main_heading = get_field('main_heading') ?: 'Delivering Seamless Services Across Multi-Cloud Platforms';
$description = get_field('description') ?: 'We enable enterprises to design, deploy, and manage secure, scalable, and high-performance solutions across leading cloud providers.';
$cloud_platforms = get_field('cloud_platforms') ?: [];
$services_sections = get_field('services_sections') ?: [];
$credentials_section = get_field('credentials_section') ?: [];
$implementations_section = get_field('implementations_section') ?: [];
$styling_options = get_field('styling_options') ?: [];

// Generate unique ID for this block
$block_id = 'multi-cloud-services-' . $block['id'];

// Build background styles
$background_style = '';
if (!empty($styling_options)) {
    $bg_type = $styling_options['background_type'] ?? 'gradient';
    
    switch ($bg_type) {
        case 'color':
            $bg_color = $styling_options['bg_color'] ?? '#c4b5fd';
            $background_style = "background-color: {$bg_color};";
            break;
        case 'gradient':
            $gradient_start = $styling_options['gradient_start'] ?? '#c4b5fd';
            $gradient_end = $styling_options['gradient_end'] ?? '#a78bfa';
            $background_style = "background: linear-gradient(135deg, {$gradient_start} 0%, {$gradient_end} 100%);";
            break;
        case 'image':
            if (!empty($styling_options['bg_image'])) {
                $bg_image_url = wp_get_attachment_image_url($styling_options['bg_image'], 'full');
                $background_style = "background-image: url('{$bg_image_url}'); background-size: cover; background-position: center;";
            }
            break;
    }
}

// Custom CSS variables
$custom_css = '';
if (!empty($styling_options)) {
    $text_color = $styling_options['text_color'] ?? '#374151';
    $heading_color = $styling_options['heading_color'] ?? '#1f2937';
    $card_bg_color = $styling_options['card_bg_color'] ?? '#ffffff';
    
    $custom_css = "
    <style>
    #{$block_id} {
        --text-color: {$text_color};
        --heading-color: {$heading_color};
        --card-bg-color: {$card_bg_color};
    }
    </style>
    ";
}

echo $custom_css;
?>

<div id="<?php echo esc_attr($block_id); ?>" class="multi-cloud-services-block" style="<?php echo esc_attr($background_style); ?>">
    <div class="container">
        <!-- Header Section -->
        <div class="mcs-header">
            <h2 class="mcs-main-heading"><?php echo esc_html($main_heading); ?></h2>
            <p class="mcs-description"><?php echo esc_html($description); ?></p>
            
            <!-- Cloud Platforms -->
            <?php if (!empty($cloud_platforms)): ?>
            <div class="mcs-platforms">
                <?php foreach ($cloud_platforms as $platform): ?>
                    <span class="platform-badge" style="background-color: <?php echo esc_attr($platform['platform_color'] ?? '#6366f1'); ?>">
                        <?php echo esc_html($platform['platform_name']); ?>
                    </span>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>
        </div>

        <!-- Services Grid -->
        <div class="mcs-services-grid">
            <!-- Left Column - Services Sections -->
            <div class="mcs-services-column">
                <?php if (!empty($services_sections)): ?>
                    <?php foreach ($services_sections as $section): ?>
                        <?php
                        $section_style = '';
                        if (!empty($section['section_bg_color']) || !empty($section['section_border_color'])) {
                            $bg_color = $section['section_bg_color'] ?? $styling_options['card_bg_color'] ?? '#ffffff';
                            $border_color = $section['section_border_color'] ?? '#e5e7eb';
                            $text_color = $section['section_text_color'] ?? $styling_options['text_color'] ?? '#374151';
                            $section_style = "background-color: {$bg_color}; border: 2px solid {$border_color}; color: {$text_color};";
                        }
                        ?>
                        <div class="mcs-service-card" style="<?php echo esc_attr($section_style); ?>">
                            <div class="service-header">
                                <?php if (!empty($section['section_icon'])): ?>
                                    <i class="<?php echo esc_attr($section['section_icon']); ?>"></i>
                                <?php endif; ?>
                                <h3 style="color: <?php echo esc_attr($section['section_text_color'] ?? $styling_options['heading_color'] ?? '#1f2937'); ?>">
                                    <?php echo esc_html($section['section_title']); ?>
                                </h3>
                            </div>
                            <?php if (!empty($section['section_items'])): ?>
                                <ul class="service-items">
                                    <?php foreach ($section['section_items'] as $item): ?>
                                        <li style="color: <?php echo esc_attr($section['section_text_color'] ?? $styling_options['text_color'] ?? '#374151'); ?>">
                                            <?php echo esc_html($item['item_text']); ?>
                                        </li>
                                    <?php endforeach; ?>
                                </ul>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>

                <!-- Implementations & Tech Section -->
                <?php if (!empty($implementations_section)): ?>
                    <?php
                    $impl_style = '';
                    if (!empty($implementations_section['section_bg_color']) || !empty($implementations_section['section_border_color'])) {
                        $impl_bg_color = $implementations_section['section_bg_color'] ?? $styling_options['card_bg_color'] ?? '#ffffff';
                        $impl_border_color = $implementations_section['section_border_color'] ?? '#e5e7eb';
                        $impl_text_color = $implementations_section['section_text_color'] ?? $styling_options['text_color'] ?? '#374151';
                        $impl_style = "background-color: {$impl_bg_color}; border: 2px solid {$impl_border_color}; color: {$impl_text_color};";
                    }
                    ?>
                    <div class="mcs-service-card" style="<?php echo esc_attr($impl_style); ?>">
                        <div class="service-header">
                            <h3 style="color: <?php echo esc_attr($implementations_section['section_text_color'] ?? $styling_options['heading_color'] ?? '#1f2937'); ?>">
                                <?php echo esc_html($implementations_section['title'] ?? 'Implementations & Tech'); ?>
                            </h3>
                        </div>
                        <?php if (!empty($implementations_section['tech_badges'])): ?>
                            <div class="tech-badges">
                                <?php foreach ($implementations_section['tech_badges'] as $badge): ?>
                                    <?php
                                    $badge_style = '';
                                    $is_outlined = ($badge['badge_style'] ?? 'filled') === 'outlined';
                                    $badge_color = $badge['color'] ?? '#ef4444';
                                    $badge_text_color = $badge['text_color'] ?? ($is_outlined ? $badge_color : '#ffffff');
                                    $badge_border_color = $badge['border_color'] ?? $badge_color;
                                    
                                    if ($is_outlined) {
                                        $badge_style = "background-color: transparent; color: {$badge_text_color}; border: 2px solid {$badge_border_color};";
                                    } else {
                                        $badge_style = "background-color: {$badge_color}; color: {$badge_text_color}; border: 2px solid {$badge_border_color};";
                                    }
                                    ?>
                                    <span class="tech-badge" style="<?php echo esc_attr($badge_style); ?>">
                                        <?php echo esc_html($badge['text']); ?>
                                    </span>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Right Column - Credentials -->
            <?php if (!empty($credentials_section)): ?>
                <?php
                $cred_bg_color = $credentials_section['bg_color'] ?? '#6366f1';
                $cred_text_color = $credentials_section['text_color'] ?? '#ffffff';
                $cred_border_color = $credentials_section['border_color'] ?? '#4f46e5';
                $cred_style = "background-color: {$cred_bg_color}; color: {$cred_text_color}; border: 2px solid {$cred_border_color};";
                ?>
                <div class="mcs-credentials-column">
                    <div class="mcs-credentials-card" style="<?php echo esc_attr($cred_style); ?>">
                        <h3 class="credentials-title" style="color: <?php echo esc_attr($cred_text_color); ?>">
                            <?php echo esc_html($credentials_section['title'] ?? 'Credentials'); ?>
                        </h3>
                        <?php if (!empty($credentials_section['items'])): ?>
                            <ul class="credentials-list">
                                <?php foreach ($credentials_section['items'] as $item): ?>
                                    <li style="color: <?php echo esc_attr($cred_text_color); ?>">
                                        <?php echo esc_html($item['text']); ?>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>