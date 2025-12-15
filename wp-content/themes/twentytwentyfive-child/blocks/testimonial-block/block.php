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

        <!-- Main Content with Background Image and Testimonial -->
        <div class="testimonial-block__main-content">
            <?php if ($background_image): ?>
            <div class="testimonial-block__background">
                <img src="<?php echo esc_url($background_image['url']); ?>" 
                     alt="<?php echo esc_attr($background_image['alt']); ?>">
            </div>
            <?php endif; ?>

            <?php if ($overlay_text): ?>
            <div class="testimonial-block__overlay-text">
                <?php echo esc_html($overlay_text); ?>
            </div>
            <?php endif; ?>

            <?php if ($testimonials): ?>
            <div class="testimonial-block__slider">
                <?php foreach ($testimonials as $index => $testimonial): ?>
                <div class="testimonial-block__slide" data-slide="<?php echo $index; ?>" style="<?php echo $index === 0 ? 'display: block;' : 'display: none;'; ?>">
                    <div class="testimonial-block__quote-label">WHAT OUR PEOPLE SAY</div>
                    
                    <div class="testimonial-block__content-wrapper">
                        <?php if (!empty($testimonial['author_image'])): ?>
                        <div class="testimonial-block__image">
                            <img src="<?php echo esc_url($testimonial['author_image']['url']); ?>" 
                                 alt="<?php echo esc_attr($testimonial['author_image']['alt']); ?>" 
                                 width="60" 
                                 height="60">
                        </div>
                        <?php endif; ?>
                        
                        <div class="testimonial-block__content">
                            <?php if (!empty($testimonial['quote'])): ?>
                                <p class="testimonial-block__quote-heading">"<?php echo esc_html($testimonial['quote']); ?>"</p>
                            <?php endif; ?>
                            
                            <?php if (!empty($testimonial['author_name'])): ?>
                                <p class="testimonial-block__author">
                                    - <?php echo esc_html($testimonial['author_name']); ?>
                                    <?php if (!empty($testimonial['author_title'])): ?>
                                        <span><?php echo esc_html($testimonial['author_title']); ?></span>
                                    <?php endif; ?>
                                </p>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>

                <?php if (count($testimonials) > 1): ?>
                <div class="testimonial-block__dots">
                    <?php foreach ($testimonials as $index => $testimonial): ?>
                    <button class="testimonial-block__dot <?php echo $index === 0 ? 'testimonial-block__dot--active' : ''; ?>" 
                            onclick="testimonialGoToSlide('<?php echo esc_attr($block_id); ?>', <?php echo $index; ?>)"></button>
                    <?php endforeach; ?>
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

    window.testimonialNextSlide = function(id) {
        if (id !== blockId) return;
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlide();
    };

    window.testimonialPrevSlide = function(id) {
        if (id !== blockId) return;
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlide();
    };

    window.testimonialGoToSlide = function(id, index) {
        if (id !== blockId) return;
        currentSlide = index;
        updateSlide();
    };

    function updateSlide() {
        const block = document.getElementById(blockId);
        const slides = block.querySelectorAll('.testimonial-block__slide');
        const dots = block.querySelectorAll('.testimonial-block__dot');

        slides.forEach((slide, index) => {
            slide.style.display = index === currentSlide ? 'flex' : 'none';
        });

        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('testimonial-block__dot--active');
            } else {
                dot.classList.remove('testimonial-block__dot--active');
            }
        });
    }
})();
</script>
