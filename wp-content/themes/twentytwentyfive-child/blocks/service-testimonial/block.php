<?php
/**
 * Service Testimonial Block
 * 
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'service-testimonial-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$class_name = 'service-testimonial-block';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $class_name .= ' align' . $block['align'];
}

// Load values and assign defaults.
$heading = get_field('heading') ?: 'What Our Clients Say';
$sub_heading = get_field('sub_heading') ?: 'Discover how our services have transformed businesses';
$testimonial_items = get_field('testimonial_items') ?: [];
$autoplay_slider = get_field('autoplay_slider');
$slider_speed = get_field('slider_speed') ?: 4;
$show_navigation = get_field('show_navigation');
$show_dots = get_field('show_dots');
$background_image = get_field('background_image');
$background_color = get_field('background_color') ?: '#0a0f1c';
$background_height = get_field('background_height') ?: 'large';
$custom_height = get_field('custom_height') ?: 600;
$text_color = get_field('text_color') ?: '#ffffff';
$accent_color = get_field('accent_color') ?: '#ffd700';

// Process testimonial items to ensure proper data structure
$processed_testimonials = [];
if ($testimonial_items) {
    foreach ($testimonial_items as $testimonial) {
        $processed_testimonial = [
            'quote' => $testimonial['quote'] ?? '',
            'client_name' => $testimonial['client_name'] ?? '',
            'client_position' => $testimonial['client_position'] ?? '',
            'client_company' => $testimonial['client_company'] ?? '',
            'rating' => intval($testimonial['rating'] ?? 5)
        ];
        
        // Process client avatar
        if (!empty($testimonial['client_avatar'])) {
            $avatar = $testimonial['client_avatar'];
            if (is_array($avatar)) {
                $processed_testimonial['client_avatar'] = [
                    'id' => $avatar['ID'] ?? $avatar['id'] ?? 0,
                    'url' => $avatar['url'] ?? $avatar['sizes']['medium'] ?? '',
                    'alt' => $avatar['alt'] ?? '',
                    'sizes' => [
                        'thumbnail' => $avatar['sizes']['thumbnail'] ?? $avatar['url'] ?? '',
                        'medium' => $avatar['sizes']['medium'] ?? $avatar['url'] ?? '',
                        'large' => $avatar['sizes']['large'] ?? $avatar['url'] ?? '',
                        'full' => $avatar['sizes']['full'] ?? $avatar['url'] ?? ''
                    ]
                ];
            }
        }

        
        $processed_testimonials[] = $processed_testimonial;
    }
}

// Helper function to get section height
function get_section_height($background_height, $custom_height) {
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

// Helper function to get background styles
function get_background_styles($background_image, $background_color, $background_height, $custom_height, $text_color) {
    $styles = "background-color: {$background_color}; color: {$text_color}; min-height: " . get_section_height($background_height, $custom_height) . ";";
    
    if ($background_image && !empty($background_image['url'])) {
        $styles .= " background-image: url('{$background_image['url']}'); background-size: cover; background-position: center; background-repeat: no-repeat;";
    }
    
    return $styles;
}

// Prepare data for JSON output
$block_data = [
    'heading' => $heading,
    'sub_heading' => $sub_heading,
    'testimonial_items' => $processed_testimonials,
    'autoplay_slider' => $autoplay_slider,
    'slider_speed' => $slider_speed,
    'show_navigation' => $show_navigation,
    'show_dots' => $show_dots,
    'background_image' => $background_image,
    'background_color' => $background_color,
    'background_height' => $background_height,
    'custom_height' => $custom_height,
    'text_color' => $text_color,
    'accent_color' => $accent_color
];

// Add Font Awesome for icons
wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($class_name); ?>" style="<?php echo esc_attr(get_background_styles($background_image, $background_color, $background_height, $custom_height, $text_color)); ?>">
    
    <!-- Background Pattern -->
    <div class="testimonial-background-pattern"></div>
    
    <div class="container">
        <!-- Header -->
        <div class="testimonial-header">
            <h2 class="testimonial-heading"><?php echo esc_html($heading); ?></h2>
            <?php if ($sub_heading): ?>
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
                <div class="acf-block-placeholder-text">Service Testimonial</div>
                <div class="acf-block-placeholder-instructions">Add testimonials to display the service testimonial slider</div>
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