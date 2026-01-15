<?php
/**
 * Dice Testimonial Block
 * 
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'dice-testimonial-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$class_name = 'dice-testimonial-block';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $class_name .= ' align' . $block['align'];
}

// Load values and assign defaults.
$heading = get_field('heading') ?: 'What Our Clients Say';
$heading_color = get_field('heading_color') ?: '#ffffff';
$heading_span_text = get_field('heading_span_text') ?: '';
$heading_span_color = get_field('heading_span_color') ?: '#ffd700';
$sub_heading = get_field('sub_heading') ?: '';
$testimonial_category = get_field('testimonial_category');
$autoplay_slider = get_field('autoplay_slider');
$slider_speed = get_field('slider_speed') ?: 4;
$show_navigation = get_field('show_navigation');
$show_dots = get_field('show_dots');
$background_type = get_field('background_type') ?: 'color';
$background_color = get_field('background_color') ?: '#0a0f1c';
$gradient_color_1 = get_field('gradient_color_1') ?: '#0a0f1c';
$gradient_color_2 = get_field('gradient_color_2') ?: '#1a1f3c';
$gradient_direction = get_field('gradient_direction') ?: 'to bottom right';
$background_image = get_field('background_image');
$background_height = get_field('background_height') ?: 'large';
$custom_height = get_field('custom_height') ?: 600;
$text_color = get_field('text_color') ?: '#ffffff';
$accent_color = get_field('accent_color') ?: '#ffd700';

// Query testimonials from CPT
$args = array(
    'post_type' => 'testimonial',
    'posts_per_page' => -1,
    'post_status' => 'publish',
    'orderby' => 'date',
    'order' => 'DESC'
);

// Add category filter if specified
if ($testimonial_category) {
    $args['tax_query'] = array(
        array(
            'taxonomy' => 'testimonial_category',
            'field' => 'term_id',
            'terms' => $testimonial_category
        )
    );
}

$testimonials_query = new WP_Query($args);
$processed_testimonials = array();

if ($testimonials_query->have_posts()) {
    while ($testimonials_query->have_posts()) {
        $testimonials_query->the_post();
        $post_id = get_the_ID();
        
        $testimonial = array(
            'quote' => get_field('testimonial_quote', $post_id) ?: get_the_excerpt(),
            'client_name' => get_field('client_name', $post_id) ?: get_the_title(),
            'client_position' => get_field('client_position', $post_id) ?: '',
            'client_company' => get_field('client_company', $post_id) ?: '',
            'rating' => intval(get_field('rating', $post_id) ?: 5)
        );
        
        // Get featured image as client avatar
        $thumbnail_id = get_post_thumbnail_id($post_id);
        if ($thumbnail_id) {
            $image_data = wp_get_attachment_image_src($thumbnail_id, 'full');
            $testimonial['client_avatar'] = array(
                'id' => $thumbnail_id,
                'url' => $image_data[0],
                'alt' => get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true) ?: $testimonial['client_name'],
                'sizes' => array(
                    'thumbnail' => wp_get_attachment_image_url($thumbnail_id, 'thumbnail'),
                    'medium' => wp_get_attachment_image_url($thumbnail_id, 'medium'),
                    'large' => wp_get_attachment_image_url($thumbnail_id, 'large'),
                    'full' => $image_data[0]
                )
            );
        }
        
        $processed_testimonials[] = $testimonial;
    }
    wp_reset_postdata();
}

// Helper function to get section height
if (!function_exists('get_dice_section_height')) {
    function get_dice_section_height($background_height, $custom_height) {
        switch ($background_height) {
            case 'small':
                return '60vh';
            case 'medium':
                return '80vh';
            case 'large':
                return '100vh';
            case 'custom':
                return $custom_height . 'px';
            default:
                return 'auto';
        }
    }
}

// Helper function to get background styles
if (!function_exists('get_dice_background_styles')) {
    function get_dice_background_styles($background_type, $background_color, $gradient_color_1, $gradient_color_2, $gradient_direction, $background_image, $background_height, $custom_height, $text_color) {
        $styles = "color: {$text_color}; min-height: " . get_dice_section_height($background_height, $custom_height) . ";";
        
        if ($background_type === 'gradient') {
            $styles .= " background: linear-gradient({$gradient_direction}, {$gradient_color_1}, {$gradient_color_2});";
        } elseif ($background_type === 'image' && $background_image && !empty($background_image['url'])) {
            $styles .= " background-image: url('{$background_image['url']}'); background-size: cover; background-position: center; background-repeat: no-repeat; background-color: {$background_color};";
        } else {
            $styles .= " background-color: {$background_color};";
        }
        
        return $styles;
    }
}

// Process heading with span - same approach as Specializations Section
// Render heading and span text separately, not as replacement
$render_heading = function() use ($heading, $heading_span_text, $heading_span_color) {
    if (empty($heading_span_text) || trim($heading_span_text) === '') {
        return esc_html($heading);
    }
    
    // Render heading with span text separately (not as replacement)
    return esc_html($heading) . ' <span style="color: ' . esc_attr($heading_span_color) . ';">' . esc_html($heading_span_text) . '</span>';
};

$processed_heading = $render_heading();

// Prepare data for JSON output
$block_data = array(
    'heading' => $heading,
    'heading_color' => $heading_color,
    'heading_span_text' => $heading_span_text,
    'heading_span_color' => $heading_span_color,
    'sub_heading' => $sub_heading,
    'testimonial_items' => $processed_testimonials,
    'autoplay_slider' => $autoplay_slider,
    'slider_speed' => $slider_speed,
    'show_navigation' => $show_navigation,
    'show_dots' => $show_dots,
    'background_type' => $background_type,
    'background_color' => $background_color,
    'gradient_color_1' => $gradient_color_1,
    'gradient_color_2' => $gradient_color_2,
    'gradient_direction' => $gradient_direction,
    'background_image' => $background_image,
    'background_height' => $background_height,
    'custom_height' => $custom_height,
    'text_color' => $text_color,
    'accent_color' => $accent_color
);
?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($class_name); ?>" style="<?php echo esc_attr(get_dice_background_styles($background_type, $background_color, $gradient_color_1, $gradient_color_2, $gradient_direction, $background_image, $background_height, $custom_height, $text_color)); ?>">
    
    <!-- Background Pattern -->
    <div class="testimonial-background-pattern"></div>
    
    <div class="container">
        <!-- Header -->
        <div class="testimonial-header">
            <h2 class="testimonial-heading" style="color: <?php echo esc_attr($heading_color); ?>;">
                <?php echo wp_kses_post($processed_heading); ?>
            </h2>
            <?php if ($sub_heading && trim($sub_heading) !== ''): ?>
                <div class="testimonial-sub-heading">
                    <?php echo wp_kses_post($sub_heading); ?>
                </div>
            <?php endif; ?>
        </div>

        <?php if (!empty($processed_testimonials)): ?>
            <div class="testimonial-slider-container">
                <div class="testimonial-cards-wrapper">
                    <?php foreach ($processed_testimonials as $index => $testimonial): ?>
                        <div class="testimonial-card <?php echo $index === 0 ? 'active' : ($index === 1 ? 'next' : 'hidden'); ?>">
                            <!-- Client Testimonial -->
                            <div class="client-testimonial">
                                <div class="testimonial-content">
                                    <div class="quote-icon" style="color: <?php echo esc_attr($accent_color); ?>;">"</div>
                                    
                                    <blockquote class="testimonial-quote">
                                        <?php echo esc_html($testimonial['quote']); ?>
                                    </blockquote>
                                    
                                    <div class="testimonial-rating">
                                        <?php for ($i = 1; $i <= 5; $i++): ?>
                                            <span class="star <?php echo $i <= $testimonial['rating'] ? 'filled' : ''; ?>" 
                                                  style="color: <?php echo $i <= $testimonial['rating'] ? esc_attr($accent_color) : 'rgba(255, 255, 255, 0.3)'; ?>;">
                                                ★
                                            </span>
                                        <?php endfor; ?>
                                    </div>
                                </div>
                                
                                <div class="client-info">
                                    <?php if (!empty($testimonial['client_avatar'])): ?>
                                        <div class="client-avatar">
                                            <img src="<?php echo esc_url($testimonial['client_avatar']['sizes']['thumbnail']); ?>" 
                                                 alt="<?php echo esc_attr($testimonial['client_avatar']['alt'] ?: $testimonial['client_name']); ?>"
                                                 width="60" height="60">
                                        </div>
                                    <?php endif; ?>
                                    
                                    <div class="client-details">
                                        <h4 class="client-name"><?php echo esc_html($testimonial['client_name']); ?></h4>
                                        
                                        <?php if (!empty($testimonial['client_position'])): ?>
                                            <p class="client-position"><?php echo esc_html($testimonial['client_position']); ?></p>
                                        <?php endif; ?>
                                        
                                        <?php if (!empty($testimonial['client_company'])): ?>
                                            <p class="client-company"><?php echo esc_html($testimonial['client_company']); ?></p>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <!-- Navigation -->
                <?php if ($show_navigation && count($processed_testimonials) > 1): ?>
                    <div class="testimonial-navigation">
                        <button class="nav-btn prev-btn" style="border-color: <?php echo esc_attr($accent_color); ?>;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        
                        <button class="nav-btn next-btn" style="border-color: <?php echo esc_attr($accent_color); ?>;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                <?php endif; ?>

                <!-- Dots Indicator -->
                <?php if ($show_dots && count($processed_testimonials) > 1): ?>
                    <div class="testimonial-dots">
                        <?php foreach ($processed_testimonials as $index => $testimonial): ?>
                            <button class="dot <?php echo $index === 0 ? 'active' : ''; ?>" 
                                    data-slide="<?php echo $index; ?>"
                                    style="background-color: <?php echo $index === 0 ? esc_attr($accent_color) : 'rgba(255, 255, 255, 0.3)'; ?>;"></button>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

            <!-- JavaScript for slider functionality -->
            <script>
            (function() {
                const slider = document.querySelector('#<?php echo esc_js($id); ?> .testimonial-cards-wrapper');
                const cards = document.querySelectorAll('#<?php echo esc_js($id); ?> .testimonial-card');
                const prevBtn = document.querySelector('#<?php echo esc_js($id); ?> .prev-btn');
                const nextBtn = document.querySelector('#<?php echo esc_js($id); ?> .next-btn');
                const dots = document.querySelectorAll('#<?php echo esc_js($id); ?> .dot');
                
                let currentIndex = 0;
                let isAnimating = false;
                let autoplayInterval;
                
                const totalSlides = <?php echo count($processed_testimonials); ?>;
                const autoplay = <?php echo $autoplay_slider ? 'true' : 'false'; ?>;
                const speed = <?php echo intval($slider_speed) * 1000; ?>;
                const accentColor = '<?php echo esc_js($accent_color); ?>';
                
                function updateSlider() {
                    cards.forEach((card, index) => {
                        card.classList.remove('active', 'prev', 'next', 'hidden');
                        
                        if (index === currentIndex) {
                            card.classList.add('active');
                        } else if (index === (currentIndex - 1 + totalSlides) % totalSlides) {
                            card.classList.add('prev');
                        } else if (index === (currentIndex + 1) % totalSlides) {
                            card.classList.add('next');
                        } else {
                            card.classList.add('hidden');
                        }
                    });
                    
                    // Update dots
                    dots.forEach((dot, index) => {
                        dot.classList.toggle('active', index === currentIndex);
                        dot.style.backgroundColor = index === currentIndex ? accentColor : 'rgba(255, 255, 255, 0.3)';
                    });
                }
                
                function nextSlide() {
                    if (isAnimating) return;
                    isAnimating = true;
                    currentIndex = (currentIndex + 1) % totalSlides;
                    updateSlider();
                    setTimeout(() => { isAnimating = false; }, 800);
                }
                
                function prevSlide() {
                    if (isAnimating) return;
                    isAnimating = true;
                    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                    updateSlider();
                    setTimeout(() => { isAnimating = false; }, 800);
                }
                
                function goToSlide(index) {
                    if (isAnimating || index === currentIndex) return;
                    isAnimating = true;
                    currentIndex = index;
                    updateSlider();
                    setTimeout(() => { isAnimating = false; }, 800);
                }
                
                function startAutoplay() {
                    if (autoplay && totalSlides > 1) {
                        autoplayInterval = setInterval(nextSlide, speed);
                    }
                }
                
                function stopAutoplay() {
                    if (autoplayInterval) {
                        clearInterval(autoplayInterval);
                    }
                }
                
                // Event listeners
                if (nextBtn) nextBtn.addEventListener('click', nextSlide);
                if (prevBtn) prevBtn.addEventListener('click', prevSlide);
                
                dots.forEach((dot, index) => {
                    dot.addEventListener('click', () => goToSlide(index));
                });
                
                // Pause on hover
                const container = document.querySelector('#<?php echo esc_js($id); ?>');
                if (container) {
                    container.addEventListener('mouseenter', stopAutoplay);
                    container.addEventListener('mouseleave', startAutoplay);
                }
                
                // Pause when tab is not visible
                document.addEventListener('visibilitychange', () => {
                    if (document.hidden) {
                        stopAutoplay();
                    } else {
                        startAutoplay();
                    }
                });
                
                // Initialize
                updateSlider();
                startAutoplay();
            })();
            </script>

        <?php else: ?>
            <div class="acf-block-placeholder">
                <div class="acf-block-placeholder-icon">💬</div>
                <div class="acf-block-placeholder-text">Dice Testimonial</div>
                <div class="acf-block-placeholder-instructions">Add testimonials in the Testimonials CPT to display them here</div>
            </div>
        <?php endif; ?>
    </div>
    
    <!-- Block data for Next.js -->
    <script type="application/json" class="wp-block-data">
        <?php echo wp_json_encode($block_data); ?>
    </script>
</div>

<style>
<?php include 'style.css'; ?>
</style>
