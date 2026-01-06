<?php
/**
 * Partnership Gallery Block
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'partnership-gallery-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'partnership-gallery-block';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $className .= ' align' . $block['align'];
}

// Get ACF fields
$heading = get_field('heading');
$sub_heading = get_field('sub_heading');
$gallery_images_raw = get_field('gallery_images');
$layout_type = get_field('layout_type') ?: 'grid';
$columns_count = get_field('columns_count') ?: '4';
$enable_slider = get_field('enable_slider');
$slider_speed = get_field('slider_speed') ?: 3;
$autoplay_slider = get_field('autoplay_slider');
$slider_direction = get_field('slider_direction') ?: 'left';
$background_color = get_field('background_color') ?: '#f8f9fa';
$text_color = get_field('text_color') ?: '#333333';
$image_style = get_field('image_style') ?: 'contain';
$image_hover_effect = get_field('image_hover_effect') ?: 'scale';

// Process gallery images to ensure they have full image data
$gallery_images = [];
if ($gallery_images_raw && is_array($gallery_images_raw)) {
    if (function_exists('process_acf_gallery_field')) {
        $gallery_images = process_acf_gallery_field($gallery_images_raw);
    } else {
        // Fallback processing if function doesn't exist
        foreach ($gallery_images_raw as $image) {
            if (is_numeric($image)) {
                $image_id = intval($image);
                $image_data = wp_get_attachment_image_src($image_id, 'full');
                if ($image_data) {
                    $gallery_images[] = [
                        'id' => $image_id,
                        'url' => $image_data[0],
                        'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true) ?: '',
                        'title' => get_the_title($image_id) ?: '',
                        'sizes' => [
                            'thumbnail' => wp_get_attachment_image_src($image_id, 'thumbnail')[0] ?? $image_data[0],
                            'medium' => wp_get_attachment_image_src($image_id, 'medium')[0] ?? $image_data[0],
                            'large' => wp_get_attachment_image_src($image_id, 'large')[0] ?? $image_data[0],
                            'full' => $image_data[0]
                        ]
                    ];
                }
            } elseif (is_array($image) && isset($image['url'])) {
                $gallery_images[] = $image;
            } elseif (is_array($image) && isset($image['ID'])) {
                $image_id = intval($image['ID']);
                $image_data = wp_get_attachment_image_src($image_id, 'full');
                if ($image_data) {
                    $gallery_images[] = [
                        'id' => $image_id,
                        'url' => $image_data[0],
                        'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true) ?: ($image['alt'] ?? ''),
                        'title' => get_the_title($image_id) ?: ($image['title'] ?? ''),
                        'sizes' => [
                            'thumbnail' => wp_get_attachment_image_src($image_id, 'thumbnail')[0] ?? $image_data[0],
                            'medium' => wp_get_attachment_image_src($image_id, 'medium')[0] ?? $image_data[0],
                            'large' => wp_get_attachment_image_src($image_id, 'large')[0] ?? $image_data[0],
                            'full' => $image_data[0]
                        ]
                    ];
                }
            }
        }
    }
}

// If no images, show placeholder in admin
if (empty($gallery_images)) {
    if ($is_preview) {
        echo '<div class="acf-block-placeholder">
                <div class="acf-block-placeholder-icon">🤝</div>
                <div class="acf-block-placeholder-text">Partnership Gallery</div>
                <div class="acf-block-placeholder-instructions">Add images to display the partnership gallery</div>
              </div>';
    }
    return;
}

// Generate unique ID for slider
$slider_id = 'partnership-slider-' . uniqid();
?>

<section 
    id="<?php echo esc_attr($id); ?>" 
    class="<?php echo esc_attr($className); ?>"
    style="background-color: <?php echo esc_attr($background_color); ?>; color: <?php echo esc_attr($text_color); ?>;"
    data-layout="<?php echo esc_attr($layout_type); ?>"
    data-columns="<?php echo esc_attr($columns_count); ?>"
    data-slider="<?php echo $enable_slider ? 'true' : 'false'; ?>"
    data-speed="<?php echo esc_attr($slider_speed); ?>"
    data-autoplay="<?php echo $autoplay_slider ? 'true' : 'false'; ?>"
    data-direction="<?php echo esc_attr($slider_direction); ?>"
>
    <div class="container">
        <?php if ($heading || $sub_heading): ?>
            <div class="partnership-header">
                <?php if ($heading): ?>
                    <h2 class="partnership-heading"><?php echo esc_html($heading); ?></h2>
                <?php endif; ?>
                
                <?php if ($sub_heading): ?>
                    <div class="partnership-sub-heading"><?php echo wp_kses_post($sub_heading); ?></div>
                <?php endif; ?>
            </div>
        <?php endif; ?>

        <div class="partnership-container">
            <?php if ($layout_type === 'slider' && $enable_slider): ?>
                <!-- Slider Layout -->
                <div class="partnership-slider" id="<?php echo esc_attr($slider_id); ?>">
                    <div class="partnership-slider-track">
                        <?php 
                        // Duplicate images for infinite loop
                        $images_to_show = array_merge($gallery_images, $gallery_images);
                        foreach ($images_to_show as $image): 
                        ?>
                            <div class="partnership-slide">
                                <div class="partnership-image-wrapper" data-style="<?php echo esc_attr($image_style); ?>" data-hover="<?php echo esc_attr($image_hover_effect); ?>">
                                    <img 
                                        src="<?php echo esc_url($image['sizes']['medium'] ?? $image['sizes']['large'] ?? $image['sizes']['full'] ?? $image['url']); ?>" 
                                        alt="<?php echo esc_attr($image['alt'] ?? $image['title'] ?? ''); ?>"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php else: ?>
                <!-- Grid Layout -->
                <div class="partnership-grid partnership-grid-<?php echo esc_attr($columns_count); ?>">
                    <?php foreach ($gallery_images as $image): ?>
                        <div class="partnership-item">
                            <div class="partnership-image-wrapper" data-style="<?php echo esc_attr($image_style); ?>" data-hover="<?php echo esc_attr($image_hover_effect); ?>">
                                <img 
                                    src="<?php echo esc_url($image['sizes']['medium'] ?? $image['sizes']['large'] ?? $image['sizes']['full'] ?? $image['url']); ?>" 
                                    alt="<?php echo esc_attr($image['alt'] ?? $image['title'] ?? ''); ?>"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <?php if ($layout_type === 'slider' && $enable_slider): ?>
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            const slider = document.getElementById('<?php echo esc_js($slider_id); ?>');
            if (!slider) return;
            
            const track = slider.querySelector('.partnership-slider-track');
            const slides = track.querySelectorAll('.partnership-slide');
            const slideCount = slides.length / 2; // Half because we duplicated
            const columnsCount = <?php echo esc_js($columns_count); ?>;
            const slideWidth = 100 / columnsCount; // Based on columns
            const direction = '<?php echo esc_js($slider_direction); ?>';
            const speed = <?php echo esc_js($slider_speed * 1000); ?>;
            const autoplay = <?php echo $autoplay_slider ? 'true' : 'false'; ?>;
            
            let currentIndex = 0;
            let isAnimating = false;
            let animationId;

            // Set initial styles
            track.style.transform = 'translateX(0%)';
            slides.forEach((slide, index) => {
                slide.style.minWidth = slideWidth + '%';
                slide.style.flex = '0 0 ' + slideWidth + '%';
            });

            function moveSlider() {
                if (isAnimating) return;
                
                isAnimating = true;
                
                if (direction === 'right') {
                    currentIndex--;
                    if (currentIndex < 0) {
                        currentIndex = slideCount - 1;
                        track.style.transition = 'none';
                        track.style.transform = `translateX(-${slideCount * slideWidth}%)`;
                        setTimeout(() => {
                            track.style.transition = 'transform 0.8s ease-in-out';
                            currentIndex--;
                            const translateX = -(currentIndex * slideWidth);
                            track.style.transform = `translateX(${translateX}%)`;
                        }, 50);
                    } else {
                        const translateX = -(currentIndex * slideWidth);
                        track.style.transition = 'transform 0.8s ease-in-out';
                        track.style.transform = `translateX(${translateX}%)`;
                    }
                } else {
                    currentIndex++;
                    const translateX = -(currentIndex * slideWidth);
                    track.style.transition = 'transform 0.8s ease-in-out';
                    track.style.transform = `translateX(${translateX}%)`;
                    
                    // Reset to beginning when reaching duplicated images
                    if (currentIndex >= slideCount) {
                        setTimeout(() => {
                            track.style.transition = 'none';
                            currentIndex = 0;
                            track.style.transform = 'translateX(0%)';
                        }, 800);
                    }
                }
                
                setTimeout(() => {
                    isAnimating = false;
                }, 800);
            }

            if (autoplay) {
                function startAutoplay() {
                    animationId = setInterval(moveSlider, speed);
                }
                
                function stopAutoplay() {
                    if (animationId) {
                        clearInterval(animationId);
                    }
                }
                
                // Start autoplay
                startAutoplay();
                
                // Pause on hover
                slider.addEventListener('mouseenter', stopAutoplay);
                slider.addEventListener('mouseleave', startAutoplay);
                
                // Pause when tab is not visible
                document.addEventListener('visibilitychange', function() {
                    if (document.hidden) {
                        stopAutoplay();
                    } else {
                        startAutoplay();
                    }
                });
            }
        });
        </script>
    <?php endif; ?>
</section>