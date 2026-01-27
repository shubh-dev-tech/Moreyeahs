<?php
/**
 * Service Across Multi Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'service-across-multi-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$class_name = 'service-across-multi-block';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $class_name .= ' align' . $block['align'];
}

// Load values and assign defaults.
$main_heading = get_field('main_heading') ?: 'Delivering Seamless Services Across Multi-Cloud Platforms';
$main_description = get_field('main_description') ?: 'We enable enterprises to design, deploy, and manage secure, scalable, and high-performance solutions across leading cloud providers.';
$cloud_platforms = get_field('cloud_platforms') ?: array();
$service_categories = get_field('service_categories') ?: array();
$implementations_title = get_field('implementations_title') ?: 'Implementations & Technologies';
$technology_badges = get_field('technology_badges') ?: array();
$testimonial_quote = get_field('testimonial_quote') ?: 'The best service is delivered when customer success becomes your own.';
$background_color = get_field('background_color') ?: '#0f172a';
$text_color = get_field('text_color') ?: '#ffffff';

// Preview mode defaults
if ($is_preview && empty($cloud_platforms)) {
    $cloud_platforms = array(
        array('platform_name' => 'Google Cloud Platform (GCP)', 'platform_icon' => null),
        array('platform_name' => 'Amazon Web Services (AWS)', 'platform_icon' => null),
        array('platform_name' => 'Microsoft Azure', 'platform_icon' => null),
    );
}

if ($is_preview && empty($service_categories)) {
    $service_categories = array(
        array(
            'category_title' => 'Core Cloud Services',
            'services' => array(
                array('service_name' => 'Software, Platform & Infrastructure Services'),
                array('service_name' => 'Compute Services'),
                array('service_name' => 'Storage Services'),
                array('service_name' => 'Networking Services'),
            )
        ),
        array(
            'category_title' => 'Security & Data',
            'services' => array(
                array('service_name' => 'Security & Identity Management'),
                array('service_name' => 'Database & Data Services'),
                array('service_name' => 'Analytics & Big Data'),
            )
        ),
        array(
            'category_title' => 'AI, DevOps & Monitoring',
            'services' => array(
                array('service_name' => 'AI & Machine Learning'),
                array('service_name' => 'DevOps & Automation'),
                array('service_name' => 'Monitoring & Management'),
            )
        ),
    );
}

if ($is_preview && empty($technology_badges)) {
    $technology_badges = array(
        array('tech_name' => 'GKE', 'tech_color' => '#1e3a8a'),
        array('tech_name' => 'AKS', 'tech_color' => '#0078d4'),
        array('tech_name' => 'EKS', 'tech_color' => '#ff9900'),
        array('tech_name' => 'Cloud Load Balancer', 'tech_color' => '#4285f4'),
        array('tech_name' => 'Big Data', 'tech_color' => '#34a853'),
        array('tech_name' => 'Cloud Storage', 'tech_color' => '#ea4335'),
        array('tech_name' => 'IAM', 'tech_color' => '#fbbc04'),
        array('tech_name' => 'Docker', 'tech_color' => '#2496ed'),
        array('tech_name' => 'Terraform', 'tech_color' => '#623ce4'),
        array('tech_name' => 'IaC', 'tech_color' => '#326ce5'),
        array('tech_name' => 'Key Vault', 'tech_color' => '#0078d4'),
        array('tech_name' => 'ARM Templates', 'tech_color' => '#0078d4'),
        array('tech_name' => 'Prometheus', 'tech_color' => '#e6522c'),
        array('tech_name' => 'Grafana', 'tech_color' => '#f46800'),
        array('tech_name' => 'ELK Stack', 'tech_color' => '#005571'),
        array('tech_name' => 'VPC', 'tech_color' => '#ff9900'),
        array('tech_name' => 'VPN Gateway', 'tech_color' => '#0078d4'),
        array('tech_name' => 'VMSS', 'tech_color' => '#0078d4'),
    );
}

// Don't render if no main heading
if (empty($main_heading)) {
    return;
}
?>

<div 
    id="<?php echo esc_attr($id); ?>" 
    class="<?php echo esc_attr($class_name); ?>"
    style="background-color: <?php echo esc_attr($background_color); ?>; color: <?php echo esc_attr($text_color); ?>;"
>
    <div class="samb-container">
        <!-- Main Header Section -->
        <div class="samb-header">
            <h1 class="samb-main-heading"><?php echo esc_html($main_heading); ?></h1>
            <p class="samb-main-description"><?php echo esc_html($main_description); ?></p>
        </div>

        <!-- Cloud Platforms Section -->
        <?php if (!empty($cloud_platforms)) : ?>
            <div class="samb-platforms">
                <div class="samb-platforms-grid">
                    <?php foreach ($cloud_platforms as $platform) : ?>
                        <div class="samb-platform-badge">
                            <?php if (!empty($platform['platform_icon'])) : ?>
                                <img 
                                    src="<?php echo esc_url($platform['platform_icon']['url']); ?>" 
                                    alt="<?php echo esc_attr($platform['platform_icon']['alt'] ?: $platform['platform_name']); ?>"
                                    class="samb-platform-icon"
                                />
                            <?php endif; ?>
                            <span class="samb-platform-name"><?php echo esc_html($platform['platform_name']); ?></span>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>

        <!-- Service Categories Section -->
        <?php if (!empty($service_categories)) : ?>
            <div class="samb-services">
                <div class="samb-services-grid">
                    <?php foreach ($service_categories as $category) : ?>
                        <div class="samb-service-category">
                            <h3 class="samb-category-title"><?php echo esc_html($category['category_title']); ?></h3>
                            
                            <?php if (!empty($category['services'])) : ?>
                                <ul class="samb-services-list">
                                    <?php foreach ($category['services'] as $service) : ?>
                                        <li class="samb-service-item">
                                            <span class="samb-service-checkmark">✓</span>
                                            <span class="samb-service-name"><?php echo esc_html($service['service_name']); ?></span>
                                        </li>
                                    <?php endforeach; ?>
                                </ul>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>

        <!-- Implementations & Technologies Section -->
        <?php if (!empty($technology_badges)) : ?>
            <div class="samb-implementations">
                <h2 class="samb-implementations-title"><?php echo esc_html($implementations_title); ?></h2>
                
                <div class="samb-tech-badges">
                    <?php foreach ($technology_badges as $tech) : ?>
                        <span 
                            class="samb-tech-badge"
                            style="background-color: <?php echo esc_attr($tech['tech_color']); ?>;"
                        >
                            <?php echo esc_html($tech['tech_name']); ?>
                        </span>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>

        <!-- Testimonial Quote Section -->
        <?php if (!empty($testimonial_quote)) : ?>
            <div class="samb-testimonial">
                <blockquote class="samb-quote">
                    "<?php echo esc_html($testimonial_quote); ?>"
                </blockquote>
            </div>
        <?php endif; ?>

        <!-- Decorative Elements -->
        <div class="samb-decorative-elements">
            <div class="samb-circle samb-circle-1"></div>
            <div class="samb-circle samb-circle-2"></div>
            <div class="samb-circle samb-circle-3"></div>
            <div class="samb-circle samb-circle-4"></div>
            <div class="samb-line samb-line-1"></div>
            <div class="samb-line samb-line-2"></div>
            <div class="samb-line samb-line-3"></div>
        </div>
    </div>
</div>