<?php
/**
 * More Years Service Block Template
 * 
 * A service block with heading, subheading, and repeatable service sections
 * Each service section has a service heading with URL and multiple services with URLs
 * Includes borders between service sections
 */

$heading = get_field('heading');
$subheading = get_field('subheading');
$service_sections = get_field('service_sections');
$block_id = 'moreyeahs-service-' . $block['id'];

if (!$service_sections) {
    return;
}
?>

<section id="<?php echo esc_attr($block_id); ?>" class="moreyeahs-service">
    <div class="moreyeahs-service__container">
        
        <?php if ($heading): ?>
            <h2 class="moreyeahs-service__heading"><?php echo esc_html($heading); ?></h2>
        <?php endif; ?>
        
        <?php if ($subheading): ?>
            <p class="moreyeahs-service__subheading"><?php echo esc_html($subheading); ?></p>
        <?php endif; ?>
        
        <div class="moreyeahs-service__sections">
            <?php foreach ($service_sections as $index => $section): ?>
                <?php 
                $service_heading = $section['service_heading'] ?? '';
                $service_heading_url = $section['service_heading_url'] ?? '';
                $services = $section['services'] ?? array();
                ?>
                
                <div class="moreyeahs-service__section <?php echo $index > 0 ? 'moreyeahs-service__section--bordered' : ''; ?>">
                    
                    <?php if ($service_heading): ?>
                        <div class="moreyeahs-service__section-header">
                            <?php if ($service_heading_url): ?>
                                <h3 class="moreyeahs-service__section-heading">
                                    <a href="<?php echo esc_url($service_heading_url); ?>" class="moreyeahs-service__section-link">
                                        <?php echo esc_html($service_heading); ?>
                                    </a>
                                </h3>
                            <?php else: ?>
                                <h3 class="moreyeahs-service__section-heading">
                                    <?php echo esc_html($service_heading); ?>
                                </h3>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($services): ?>
                        <div class="moreyeahs-service__services">
                            <?php foreach ($services as $service): ?>
                                <?php 
                                $service_name = $service['service_name'] ?? '';
                                $service_url = $service['service_url'] ?? '';
                                ?>
                                
                                <?php if ($service_name): ?>
                                    <div class="moreyeahs-service__service-item">
                                        <?php if ($service_url): ?>
                                            <a href="<?php echo esc_url($service_url); ?>" class="moreyeahs-service__service-link">
                                                <?php echo esc_html($service_name); ?>
                                            </a>
                                        <?php else: ?>
                                            <span class="moreyeahs-service__service-text">
                                                <?php echo esc_html($service_name); ?>
                                            </span>
                                        <?php endif; ?>
                                    </div>
                                <?php endif; ?>
                                
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                    
                </div>
                
            <?php endforeach; ?>
        </div>
        
    </div>
</section>