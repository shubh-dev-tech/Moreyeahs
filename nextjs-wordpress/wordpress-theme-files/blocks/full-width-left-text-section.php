<?php
/**
 * Full Width Left Text Section Block Template
 * 
 * Block fields:
 * - heading (Text)
 * - sub_heading (Text)
 * - button_text (Text)
 * - button_url (URL)
 * - heading_bottom_1st (Text)
 * - title_bottom_1st (Text)
 * - url_text (Text)
 * - url_link (URL)
 * - heading_bottom_2nd (Text)
 * - title_bottom_2nd (Text)
 * - url_title_2nd (Text)
 * - url_link_2nd (Text)
 * - right_image (Image)
 */

// Get ACF fields
$heading = get_field('heading');
$sub_heading = get_field('sub_heading');
$button_text = get_field('button_text');
$button_url = get_field('button_url');
$heading_bottom_1st = get_field('heading_bottom_1st');
$title_bottom_1st = get_field('title_bottom_1st');
$url_text = get_field('url_text');
$url_link = get_field('url_link');
$heading_bottom_2nd = get_field('heading_bottom_2nd');
$title_bottom_2nd = get_field('title_bottom_2nd');
$url_title_2nd = get_field('url_title_2nd');
$url_link_2nd = get_field('url_link_2nd');
$right_image = get_field('right_image');
$reverse_layout = get_field('reverse_layout');

// Get section settings
$background_color = get_field('background_color') ?: '#b8860b';
$section_height = get_field('section_height') ?: '100vh';
$section_width = get_field('section_width') ?: '100%';
$padding_top = get_field('padding_top') ?: '4rem';
$padding_bottom = get_field('padding_bottom') ?: '4rem';
$padding_left = get_field('padding_left') ?: '2rem';
$padding_right = get_field('padding_right') ?: '2rem';
$margin_top = get_field('margin_top') ?: '0';
$margin_bottom = get_field('margin_bottom') ?: '0';

// Block attributes
$block_id = 'full-width-left-text-' . $block['id'];
$class_name = 'full-width-left-text-section';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if ($reverse_layout) {
    $class_name .= ' full-width-left-text-section--reversed';
}

// Build inline styles
$inline_styles = sprintf(
    'background-color: %s; min-height: %s; width: %s; padding: %s %s %s %s; margin: %s 0 %s 0;',
    esc_attr($background_color),
    esc_attr($section_height),
    esc_attr($section_width),
    esc_attr($padding_top),
    esc_attr($padding_right),
    esc_attr($padding_bottom),
    esc_attr($padding_left),
    esc_attr($margin_top),
    esc_attr($margin_bottom)
);
?>

<section id="<?php echo esc_attr($block_id); ?>" class="<?php echo esc_attr($class_name); ?>" style="<?php echo $inline_styles; ?>">
    
    <div class="full-width-left-text-section__container">
        
        <!-- Left Content Section -->
        <div class="full-width-left-text-section__content">
            
            <!-- Main Heading and Subheading -->
            <?php if ($heading): ?>
                <h2 class="full-width-left-text-section__heading">
                    <?php echo esc_html($heading); ?>
                </h2>
            <?php endif; ?>
            
            <?php if ($sub_heading): ?>
                <p class="full-width-left-text-section__subheading">
                    <?php echo esc_html($sub_heading); ?>
                </p>
            <?php endif; ?>
            
            <!-- Explore Button -->
            <?php if ($button_text && $button_url): ?>
                <a href="<?php echo esc_url($button_url); ?>" class="full-width-left-text-section__button">
                    <?php echo esc_html($button_text); ?>
                </a>
            <?php endif; ?>
            
            <!-- Case Studies Section -->
            <div class="full-width-left-text-section__case-studies">
                <p class="full-width-left-text-section__case-studies-label">
                    CASE STUDIES
                </p>
                
                <!-- First Case Study -->
                <div class="full-width-left-text-section__case-study">
                    <?php if ($heading_bottom_1st): ?>
                        <h3 class="full-width-left-text-section__case-study-heading">
                            <?php echo esc_html($heading_bottom_1st); ?>
                        </h3>
                    <?php endif; ?>
                    
                    <?php if ($title_bottom_1st): ?>
                        <p class="full-width-left-text-section__case-study-text">
                            <?php echo esc_html($title_bottom_1st); ?>
                        </p>
                    <?php endif; ?>
                    
                    <?php if ($url_text && $url_link): ?>
                        <a href="<?php echo esc_url($url_link); ?>" class="full-width-left-text-section__case-study-link">
                            <?php echo esc_html($url_text); ?> →
                        </a>
                    <?php endif; ?>
                </div>
                
                <!-- Second Case Study -->
                <div class="full-width-left-text-section__case-study">
                    <?php if ($heading_bottom_2nd): ?>
                        <h3 class="full-width-left-text-section__case-study-heading">
                            <?php echo esc_html($heading_bottom_2nd); ?>
                        </h3>
                    <?php endif; ?>
                    
                    <?php if ($title_bottom_2nd): ?>
                        <p class="full-width-left-text-section__case-study-text">
                            <?php echo esc_html($title_bottom_2nd); ?>
                        </p>
                    <?php endif; ?>
                    
                    <?php if ($url_title_2nd && $url_link_2nd): ?>
                        <a href="<?php echo esc_url($url_link_2nd); ?>" class="full-width-left-text-section__case-study-link">
                            <?php echo esc_html($url_title_2nd); ?> →
                        </a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        
        <!-- Right Image Section -->
        <?php if ($right_image): ?>
            <div class="full-width-left-text-section__image">
                <img src="<?php echo esc_url($right_image['url']); ?>" 
                     alt="<?php echo esc_attr($right_image['alt'] ?: 'Decorative image'); ?>"
                     class="full-width-left-text-section__image-element">
            </div>
        <?php endif; ?>
    </div>
    
    <!-- Decorative Background Elements -->
    <div class="full-width-left-text-section__decoration full-width-left-text-section__decoration--1"></div>
    <div class="full-width-left-text-section__decoration full-width-left-text-section__decoration--2"></div>
    
</section>
