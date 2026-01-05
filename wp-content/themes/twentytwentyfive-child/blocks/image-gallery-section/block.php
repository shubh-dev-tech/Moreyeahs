<?php
/**
 * Image Gallery Section Block
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'image-gallery-section-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'image-gallery-section';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $className .= ' align' . $block['align'];
}

// Get ACF fields
$heading = get_field('heading');
$sub_heading = get_field('sub_heading');
$gallery_images = get_field('gallery_images');
$gallery_layout = get_field('gallery_layout') ?: '4';
$enable_slider = get_field('enable_slider');
$slider_speed = get_field('slider_speed') ?: 3;
$autoplay_slider = get_field('autoplay_slider');
$background_color = get_field('background_color') ?: '#ffffff';
$text_color = get_field('text_color') ?: '#333333';

// If no images, show placeholder in admin
if (empty($gallery_images)) {
    if ($is_preview) {
        echo '<div class="acf-block-placeholder">
                <div class="acf-block-placeholder-icon">🖼️</div>
                <div class="acf-block-placeholder-text">Image Gallery Section</div>
                <div class="acf-block-placeholder-instructions">Add images to display the gallery</div>
              </div>';
    }
    return;
}

// Generate unique ID for slider
$slider_id = 'gallery-slider-' . uniqid();
?>

<section 
    id="<?php echo esc_attr($id); ?>" 
    class="<?php echo esc_attr($className); ?>"
    style="background-color: <?php echo esc_attr($background_color); ?>; color: <?php echo esc_attr($text_color); ?>;"
    data-layout="<?php echo esc_attr($gallery_layout); ?>"
    data-slider="<?php echo $enable_slider ? 'true' : 'false'; ?>"
    data-speed="<?php echo esc_attr($slider_speed); ?>"
    data-autoplay="<?php echo $autoplay_slider ? 'true' : 'false'; ?>"
>
    <div class="container">
        <?php if ($heading || $sub_heading): ?>
            <div class="gallery-header">
                <?php if ($heading): ?>
                    <h2 class="gallery-heading"><?php echo esc_html($heading); ?></h2>
                <?php endif; ?>
                
                <?php if ($sub_heading): ?>
                    <div class="gallery-sub-heading"><?php echo wp_kses_post($sub_heading); ?></div>
                <?php endif; ?>
            </div>
        <?php endif; ?>

        <div class="gallery-container">
            <?php if ($enable_slider): ?>
                <!-- Slider Layout -->
                <div class="gallery-slider" id="<?php echo esc_attr($slider_id); ?>">
                    <div class="gallery-slider-track">
                        <?php 
                        // Duplicate images for infinite loop
                        $images_to_show = array_merge($gallery_images, $gallery_images);
                        foreach ($images_to_show as $image): 
                        ?>
                            <div class="gallery-slide">
                                <div class="gallery-image-wrapper">
                                    <img 
                                        src="<?php echo esc_url($image['sizes']['large'] ?: $image['url']); ?>" 
                                        alt="<?php echo esc_attr($image['alt'] ?: $image['title']); ?>"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php else: ?>
                <!-- Grid Layout -->
                <div class="gallery-grid gallery-grid-<?php echo esc_attr($gallery_layout); ?>">
                    <?php foreach ($gallery_images as $image): ?>
                        <div class="gallery-item">
                            <div class="gallery-image-wrapper">
                                <img 
                                    src="<?php echo esc_url($image['sizes']['large'] ?: $image['url']); ?>" 
                                    alt="<?php echo esc_attr($image['alt'] ?: $image['title']); ?>"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <?php if ($enable_slider): ?>
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            const slider = document.getElementById('<?php echo esc_js($slider_id); ?>');
            const track = slider.querySelector('.gallery-slider-track');
            const slides = track.querySelectorAll('.gallery-slide');
            const slideCount = slides.length / 2; // Half because we duplicated
            const slideWidth = 100 / <?php echo esc_js($gallery_layout); ?>; // Based on columns
            let currentIndex = 0;
            let isAnimating = false;

            // Set initial styles
            track.style.transform = 'translateX(0%)';
            slides.forEach((slide, index) => {
                slide.style.minWidth = slideWidth + '%';
            });

            function moveSlider() {
                if (isAnimating) return;
                
                isAnimating = true;
                currentIndex++;
                
                const translateX = -(currentIndex * slideWidth);
                track.style.transition = 'transform 0.5s ease-in-out';
                track.style.transform = `translateX(${translateX}%)`;
                
                // Reset to beginning when reaching duplicated images
                if (currentIndex >= slideCount) {
                    setTimeout(() => {
                        track.style.transition = 'none';
                        currentIndex = 0;
                        track.style.transform = 'translateX(0%)';
                        isAnimating = false;
                    }, 500);
                } else {
                    setTimeout(() => {
                        isAnimating = false;
                    }, 500);
                }
            }

            <?php if ($autoplay_slider): ?>
            // Auto-advance slider
            setInterval(moveSlider, <?php echo esc_js($slider_speed * 1000); ?>);
            <?php endif; ?>
        });
        </script>
    <?php endif; ?>
</section>