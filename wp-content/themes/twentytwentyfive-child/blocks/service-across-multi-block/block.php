<?php
/**
 * Service Across Multi Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'service-across-multi-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$classes = 'service-across-multi-block';
if (!empty($block['className'])) {
    $classes .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $classes .= ' align' . $block['align'];
}

// Get ACF fields
$main_heading = get_field('main_heading') ?: 'Delivering Seamless Services Across Multi-Cloud Platforms';
$main_description = get_field('main_description') ?: 'We enable enterprises to design, deploy, and manage secure, scalable, and high-performance solutions across leading cloud providers.';
$cloud_platforms = get_field('cloud_platforms') ?: array();
$service_categories = get_field('service_categories') ?: array();
$implementations_title = get_field('implementations_title') ?: 'Implementations & Technologies';
$technology_badges = get_field('technology_badges') ?: array();
$testimonial_quote = get_field('testimonial_quote') ?: 'The best service is delivered when customer success becomes your own.';
$background_color = get_field('background_color') ?: '#0f172a';
$text_color = get_field('text_color') ?: '#ffffff';

// Build inline styles
$style_attr = '';
if ($background_color || $text_color) {
    $styles = array();
    if ($background_color) {
        $styles[] = 'background-color: ' . esc_attr($background_color);
    }
    if ($text_color) {
        $styles[] = 'color: ' . esc_attr($text_color);
    }
    $style_attr = 'style="' . implode('; ', $styles) . '"';
}
?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($classes); ?>" <?php echo $style_attr; ?>>
    <div class="sam-container">
        
        <!-- Header Section -->
        <div class="sam-header">
            <h2 class="sam-main-heading"><?php echo esc_html($main_heading); ?></h2>
            <p class="sam-main-description"><?php echo esc_html($main_description); ?></p>
        </div>

        <!-- Cloud Platforms Section -->
        <?php if (!empty($cloud_platforms)) : ?>
        <div class="sam-cloud-platforms">
            <?php foreach ($cloud_platforms as $platform) : 
                $platform_name = $platform['platform_name'] ?? '';
                $platform_icon = $platform['platform_icon'] ?? null;
            ?>
                <div class="sam-platform-badge">
                    <?php if ($platform_icon) : ?>
                        <img src="<?php echo esc_url($platform_icon['url']); ?>" 
                             alt="<?php echo esc_attr($platform_icon['alt'] ?: $platform_name); ?>" 
                             class="sam-platform-icon">
                    <?php endif; ?>
                    <span class="sam-platform-name"><?php echo esc_html($platform_name); ?></span>
                </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>

        <!-- Service Categories Section -->
        <?php if (!empty($service_categories)) : ?>
        <div class="sam-service-categories">
            <?php foreach ($service_categories as $category) : 
                $category_title = $category['category_title'] ?? '';
                $services = $category['services'] ?? array();
            ?>
                <div class="sam-service-category">
                    <h3 class="sam-category-title"><?php echo esc_html($category_title); ?></h3>
                    <?php if (!empty($services)) : ?>
                        <ul class="sam-services-list">
                            <?php foreach ($services as $service) : 
                                $service_name = $service['service_name'] ?? '';
                            ?>
                                <li class="sam-service-item">
                                    <span class="sam-checkmark">✓</span>
                                    <?php echo esc_html($service_name); ?>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>

        <!-- Implementations & Technologies Section -->
        <?php if (!empty($technology_badges)) : ?>
        <div class="sam-implementations">
            <h3 class="sam-implementations-title"><?php echo esc_html($implementations_title); ?></h3>
            <div class="sam-technology-badges">
                <?php foreach ($technology_badges as $tech) : 
                    $tech_name = $tech['tech_name'] ?? '';
                    $tech_color = $tech['tech_color'] ?? '#1e3a8a';
                ?>
                    <span class="sam-tech-badge" style="background-color: <?php echo esc_attr($tech_color); ?>">
                        <?php echo esc_html($tech_name); ?>
                    </span>
                <?php endforeach; ?>
            </div>
        </div>
        <?php endif; ?>

        <!-- Testimonial Quote Section -->
        <?php if (!empty($testimonial_quote)) : ?>
        <div class="sam-testimonial">
            <blockquote class="sam-quote">
                "<?php echo esc_html($testimonial_quote); ?>"
            </blockquote>
        </div>
        <?php endif; ?>

        <!-- Decorative Elements -->
        <div class="sam-decorative-elements">
            <div class="sam-circle sam-circle-1"></div>
            <div class="sam-circle sam-circle-2"></div>
            <div class="sam-circle sam-circle-3"></div>
            <div class="sam-line sam-line-1"></div>
            <div class="sam-line sam-line-2"></div>
            <div class="sam-dots sam-dots-1"></div>
            <div class="sam-dots sam-dots-2"></div>
        </div>
    </div>
</div>