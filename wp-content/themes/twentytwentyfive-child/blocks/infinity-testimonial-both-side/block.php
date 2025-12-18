<?php
/**
 * Infinity Testimonial Both Side Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Get ACF fields
$show_rating = get_field('show_rating');
$rating_text = get_field('rating_text');
$rating_stars = get_field('rating_stars');
$heading = get_field('heading');
$background_color = get_field('background_color');
$background_image = get_field('background_image');
$scroll_direction = get_field('scroll_direction');
$testimonials = get_field('testimonials');

// Block ID
$block_id = 'infinity-testimonial-both-side-' . $block['id'];
if (!empty($block['anchor'])) {
    $block_id = $block['anchor'];
}

// Block classes
$class_name = 'infinity-testimonial-both-side';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $class_name .= ' align' . $block['align'];
}

// Ensure we have testimonials
if (!$testimonials || empty($testimonials)) {
    if ($is_preview) {
        echo '<p>Please add testimonials to display the block.</p>';
    }
    return;
}

// Duplicate testimonials for seamless infinite scroll
$duplicated_testimonials = array_merge($testimonials, $testimonials);

// Build inline styles for background
$section_styles = '';
if ($background_color) {
    $section_styles .= 'background: ' . esc_attr($background_color) . ';';
}
if ($background_image && !empty($background_image['url'])) {
    $section_styles .= 'background-image: url(' . esc_url($background_image['url']) . ');';
    $section_styles .= 'background-size: cover;';
    $section_styles .= 'background-position: center;';
    $section_styles .= 'background-repeat: no-repeat;';
}
?>

<section id="<?php echo esc_attr($block_id); ?>" class="<?php echo esc_attr($class_name); ?>" <?php if ($section_styles): ?>style="<?php echo $section_styles; ?>"<?php endif; ?>>
    <?php if ($background_image && !empty($background_image['url'])): ?>
    <div class="infinity-testimonial-both-side__bg-overlay"></div>
    <?php endif; ?>
    <div class="infinity-testimonial-both-side__container">
        
        <!-- Rating Section -->
        <?php if ($show_rating && ($rating_text || $rating_stars)): ?>
        <div class="infinity-testimonial-both-side__rating">
            <?php if ($rating_stars): ?>
            <div class="infinity-testimonial-both-side__stars">
                <span class="star-icon">★</span>
                <?php for ($i = 1; $i <= 5; $i++): ?>
                    <span class="star <?php echo $i <= $rating_stars ? 'filled' : 'empty'; ?>">★</span>
                <?php endfor; ?>
            </div>
            <?php endif; ?>
            
            <?php if ($rating_text): ?>
                <p class="infinity-testimonial-both-side__rating-text"><?php echo esc_html($rating_text); ?></p>
            <?php endif; ?>
        </div>
        <?php endif; ?>

        <!-- Heading -->
        <?php if ($heading): ?>
        <div class="infinity-testimonial-both-side__header">
            <h2 class="infinity-testimonial-both-side__heading"><?php echo esc_html($heading); ?></h2>
        </div>
        <?php endif; ?>

        <!-- Infinite Scroll Testimonials -->
        <div class="infinity-testimonial-both-side__slider-container">
            <div class="infinity-testimonial-both-side__slider" 
                 data-direction="<?php echo esc_attr($scroll_direction); ?>"
                 data-block-id="<?php echo esc_attr($block_id); ?>">
                
                <div class="infinity-testimonial-both-side__track">
                    <?php foreach ($duplicated_testimonials as $index => $testimonial): ?>
                    <div class="infinity-testimonial-both-side__slide">
                        <div class="infinity-testimonial-both-side__card">
                            
                            <!-- Content based on type -->
                            <?php if ($testimonial['content_type'] === 'video' && !empty($testimonial['video'])): ?>
                                <!-- Video Testimonial -->
                                <div class="infinity-testimonial-both-side__video-container">
                                    <video 
                                        class="infinity-testimonial-both-side__video"
                                        controls
                                        preload="metadata"
                                        <?php if (!empty($testimonial['video_thumbnail'])): ?>
                                        poster="<?php echo esc_url($testimonial['video_thumbnail']['url']); ?>"
                                        <?php endif; ?>
                                    >
                                        <source src="<?php echo esc_url($testimonial['video']['url']); ?>" type="<?php echo esc_attr($testimonial['video']['mime_type']); ?>">
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            <?php else: ?>
                                <!-- Text Testimonial -->
                                <?php if (!empty($testimonial['quote'])): ?>
                                <div class="infinity-testimonial-both-side__quote-container">
                                    <div class="infinity-testimonial-both-side__quote-icon">"</div>
                                    <p class="infinity-testimonial-both-side__quote"><?php echo esc_html($testimonial['quote']); ?></p>
                                </div>
                                <?php endif; ?>
                            <?php endif; ?>

                            <!-- Author Information -->
                            <div class="infinity-testimonial-both-side__author">
                                <?php if (!empty($testimonial['author_image'])): ?>
                                <div class="infinity-testimonial-both-side__author-image">
                                    <img src="<?php echo esc_url($testimonial['author_image']['url']); ?>" 
                                         alt="<?php echo esc_attr($testimonial['author_image']['alt'] ?: $testimonial['author_name']); ?>" 
                                         width="50" 
                                         height="50">
                                </div>
                                <?php endif; ?>
                                
                                <div class="infinity-testimonial-both-side__author-info">
                                    <?php if (!empty($testimonial['author_name'])): ?>
                                        <h4 class="infinity-testimonial-both-side__author-name"><?php echo esc_html($testimonial['author_name']); ?></h4>
                                    <?php endif; ?>
                                    
                                    <?php if (!empty($testimonial['author_title']) || !empty($testimonial['author_company'])): ?>
                                        <p class="infinity-testimonial-both-side__author-details">
                                            <?php if (!empty($testimonial['author_title'])): ?>
                                                <?php echo esc_html($testimonial['author_title']); ?>
                                            <?php endif; ?>
                                            <?php if (!empty($testimonial['author_title']) && !empty($testimonial['author_company'])): ?>
                                                <?php echo ' at '; ?>
                                            <?php endif; ?>
                                            <?php if (!empty($testimonial['author_company'])): ?>
                                                <?php echo esc_html($testimonial['author_company']); ?>
                                            <?php endif; ?>
                                        </p>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>
</section>

<script>
(function() {
    const blockId = '<?php echo esc_js($block_id); ?>';
    const slider = document.querySelector(`#${blockId} .infinity-testimonial-both-side__slider`);
    const track = document.querySelector(`#${blockId} .infinity-testimonial-both-side__track`);
    
    if (!slider || !track) return;
    
    const direction = slider.dataset.direction;
    const slides = track.querySelectorAll('.infinity-testimonial-both-side__slide');
    const slideWidth = slides[0]?.offsetWidth || 300;
    const gap = 20; // Gap between slides
    const totalWidth = (slideWidth + gap) * slides.length;
    
    const moveDistance = 0.5; // Pixels per frame
    const resetPoint = totalWidth / 2; // Half because we duplicated testimonials
    
    // Initialize position based on direction
    let currentPosition = direction === 'left_to_right' ? -resetPoint : 0;
    let animationId;
    
    function animate() {
        if (direction === 'left_to_right') {
            currentPosition += moveDistance; // Move right (positive direction)
            // Reset when we've moved one full set
            if (currentPosition >= 0) {
                currentPosition = -resetPoint;
            }
        } else {
            currentPosition -= moveDistance; // Move left (negative direction)
            // Reset when we've moved one full set
            if (currentPosition <= -resetPoint) {
                currentPosition = 0;
            }
        }
        
        track.style.transform = `translateX(${currentPosition}px)`;
        animationId = requestAnimationFrame(animate);
    }
    
    // Pause animation on hover
    const handleMouseEnter = () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    };
    
    const handleMouseLeave = () => {
        animationId = requestAnimationFrame(animate);
    };
    
    // Use slider container for better hover detection
    const sliderContainer = slider.parentElement;
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', handleMouseEnter);
        sliderContainer.addEventListener('mouseleave', handleMouseLeave);
    }
    
    // Start animation
    animationId = requestAnimationFrame(animate);
})();
</script>