<?php
/**
 * Testimonial Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Get ACF fields
$heading = get_field('heading');
$subheading = get_field('subheading');
$background_image = get_field('background_image');
$overlay_text = get_field('overlay_text');
$testimonials = get_field('testimonials');
$bottom_heading = get_field('bottom_heading');
$button_text = get_field('button_text');
$button_link = get_field('button_link');

// Block ID
$block_id = 'testimonial-block-' . $block['id'];
if (!empty($block['anchor'])) {
    $block_id = $block['anchor'];
}

// Block classes
$class_name = 'testimonial-block';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $class_name .= ' align' . $block['align'];
}
?>

<section id="<?php echo esc_attr($block_id); ?>" class="<?php echo esc_attr($class_name); ?>">
    <div class="testimonial-block__container">
        
        <!-- Top Header Section -->
        <?php if ($heading || $subheading): ?>
        <div class="testimonial-block__header">
            <?php if ($heading): ?>
                <h2 class="testimonial-block__heading"><?php echo esc_html($heading); ?></h2>
            <?php endif; ?>
            
            <?php if ($subheading): ?>
                <p class="testimonial-block__subheading"><?php echo esc_html($subheading); ?></p>
            <?php endif; ?>
        </div>
        <?php endif; ?>

        <!-- Main Content with Background Image and Testimonial Slider -->
        <div class="testimonial-block__main-content">
            <?php if ($background_image): ?>
            <div class="testimonial-block__background">
                <img src="<?php echo esc_url($background_image['url']); ?>" 
                     alt="<?php echo esc_attr($background_image['alt']); ?>">
                <div class="testimonial-block__background-overlay"></div>
            </div>
            <?php endif; ?>

            <?php if ($overlay_text): ?>
            <div class="testimonial-block__overlay-text">
                <?php echo esc_html($overlay_text); ?>
            </div>
            <?php endif; ?>

            <?php if ($testimonials): ?>
            <div class="testimonial-block__slider-container">
                <div class="testimonial-block__slider">
                    <?php foreach ($testimonials as $index => $testimonial): ?>
                    <div class="testimonial-block__slide" data-slide="<?php echo $index; ?>" style="<?php echo $index === 0 ? 'display: block;' : 'display: none;'; ?>">
                        <div class="testimonial-block__card">
                            <?php if (!empty($testimonial['quote'])): ?>
                                <div class="testimonial-block__quote">
                                    <?php echo esc_html($testimonial['quote']); ?>
                                </div>
                            <?php endif; ?>
                            
                            <div class="testimonial-block__author-section">
                                <?php if (!empty($testimonial['author_image'])): ?>
                                <div class="testimonial-block__author-image">
                                    <img src="<?php echo esc_url($testimonial['author_image']['url']); ?>" 
                                         alt="<?php echo esc_attr($testimonial['author_image']['alt']); ?>">
                                </div>
                                <?php endif; ?>
                                
                                <div class="testimonial-block__author-info">
                                    <?php if (!empty($testimonial['author_name'])): ?>
                                        <div class="testimonial-block__author-name">
                                            <?php echo esc_html($testimonial['author_name']); ?>
                                        </div>
                                    <?php endif; ?>
                                    
                                    <?php if (!empty($testimonial['author_title'])): ?>
                                        <div class="testimonial-block__author-title">
                                            <?php echo esc_html($testimonial['author_title']); ?>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>

                <?php if (count($testimonials) > 1): ?>
                <div class="testimonial-block__navigation">
                    <button class="testimonial-block__nav-btn testimonial-block__nav-prev" 
                            onclick="testimonialPrevSlide('<?php echo esc_attr($block_id); ?>')">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="testimonial-block__nav-btn testimonial-block__nav-next" 
                            onclick="testimonialNextSlide('<?php echo esc_attr($block_id); ?>')">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>

                <div class="testimonial-block__progress">
                    <div class="testimonial-block__progress-dots">
                        <?php foreach ($testimonials as $index => $testimonial): ?>
                        <button class="testimonial-block__progress-dot <?php echo $index === 0 ? 'testimonial-block__progress-dot--active' : ''; ?>" 
                                onclick="testimonialGoToSlide('<?php echo esc_attr($block_id); ?>', <?php echo $index; ?>)"
                                aria-label="Go to testimonial <?php echo $index + 1; ?>"></button>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?>
            </div>
            <?php endif; ?>
        </div>

        <?php if ($bottom_heading || $button_text): ?>
        <div class="testimonial-block__footer">
            <?php if ($bottom_heading): ?>
                <h3 class="testimonial-block__footer-heading"><?php echo esc_html($bottom_heading); ?></h3>
            <?php endif; ?>
            
            <?php if ($button_text && $button_link): ?>
                <a href="<?php echo esc_url($button_link); ?>" class="testimonial-block__button">
                    <?php echo esc_html($button_text); ?>
                </a>
            <?php endif; ?>
        </div>
        <?php endif; ?>
    </div>
</section>

<script>
(function() {
    const blockId = '<?php echo esc_js($block_id); ?>';
    let currentSlide = 0;
    const totalSlides = <?php echo count($testimonials); ?>;
    let autoplayInterval;
    let isAutoplayPaused = false;

    // Initialize autoplay
    function startAutoplay() {
        if (totalSlides <= 1) return;
        
        autoplayInterval = setInterval(() => {
            if (!isAutoplayPaused) {
                nextSlide();
            }
        }, 5000); // Change slide every 5 seconds
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }

    function pauseAutoplay() {
        isAutoplayPaused = true;
    }

    function resumeAutoplay() {
        isAutoplayPaused = false;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlide();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlide();
    }

    // Global functions for external access
    window.testimonialNextSlide = function(id) {
        if (id !== blockId) return;
        pauseAutoplay();
        nextSlide();
        setTimeout(resumeAutoplay, 10000); // Resume autoplay after 10 seconds
    };

    window.testimonialPrevSlide = function(id) {
        if (id !== blockId) return;
        pauseAutoplay();
        prevSlide();
        setTimeout(resumeAutoplay, 10000); // Resume autoplay after 10 seconds
    };

    window.testimonialGoToSlide = function(id, index) {
        if (id !== blockId) return;
        pauseAutoplay();
        currentSlide = index;
        updateSlide();
        setTimeout(resumeAutoplay, 10000); // Resume autoplay after 10 seconds
    };

    function updateSlide() {
        const block = document.getElementById(blockId);
        if (!block) return;
        
        const slides = block.querySelectorAll('.testimonial-block__slide');
        const progressDots = block.querySelectorAll('.testimonial-block__progress-dot');

        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.style.display = 'block';
                slide.style.opacity = '0';
                slide.style.transform = 'translateX(20px)';
                
                // Animate in
                setTimeout(() => {
                    slide.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    slide.style.opacity = '1';
                    slide.style.transform = 'translateX(0)';
                }, 10);
            } else {
                slide.style.display = 'none';
                slide.style.opacity = '0';
                slide.style.transform = 'translateX(0)';
            }
        });

        // Update progress dots
        progressDots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('testimonial-block__progress-dot--active');
            } else {
                dot.classList.remove('testimonial-block__progress-dot--active');
            }
        });
    }

    // Add hover pause/resume functionality
    function initHoverControls() {
        const block = document.getElementById(blockId);
        if (!block) return;

        const sliderContainer = block.querySelector('.testimonial-block__slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', pauseAutoplay);
            sliderContainer.addEventListener('mouseleave', resumeAutoplay);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                initHoverControls();
                startAutoplay();
            }, 100);
        });
    } else {
        setTimeout(() => {
            initHoverControls();
            startAutoplay();
        }, 100);
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', stopAutoplay);
})();
</script>
