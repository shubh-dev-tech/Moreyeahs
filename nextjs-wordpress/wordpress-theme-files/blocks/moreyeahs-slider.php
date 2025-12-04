<?php
/**
 * Moreyeahs Slider Block Template
 * 
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Get block attributes
$block_id = 'moreyeahs-slider-' . $block['id'];
$slides = get_post_meta($post_id, 'moreyeahs_slider_slides', true);

if (empty($slides)) {
    echo '<div class="moreyeahs-slider-placeholder" style="padding: 40px; background: #f0f0f0; text-align: center; border: 2px dashed #ccc;">';
    echo '<p style="margin: 0; color: #666;">Add slides to your slider</p>';
    echo '</div>';
    return;
}
?>

<div id="<?php echo esc_attr($block_id); ?>" class="moreyeahs-slider">
    <div class="slider-container">
        <?php foreach ($slides as $index => $slide): ?>
            <div class="slide <?php echo $index === 0 ? 'active' : ''; ?>">
                <?php if (!empty($slide['image'])): ?>
                    <img src="<?php echo esc_url($slide['image']); ?>" alt="<?php echo esc_attr($slide['heading']); ?>" class="slide-image" />
                <?php endif; ?>
                
                <div class="slide-overlay"></div>
                
                <div class="slide-caption">
                    <div class="container">
                        <?php if (!empty($slide['heading'])): ?>
                            <h2 class="slide-heading"><?php echo esc_html($slide['heading']); ?></h2>
                        <?php endif; ?>
                        
                        <?php if (!empty($slide['cta_text']) && !empty($slide['cta_url'])): ?>
                            <a href="<?php echo esc_url($slide['cta_url']); ?>" class="slide-cta">
                                <?php echo esc_html($slide['cta_text']); ?>
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
    
    <div class="slider-dots">
        <?php foreach ($slides as $index => $slide): ?>
            <button class="dot <?php echo $index === 0 ? 'active' : ''; ?>" data-slide="<?php echo $index; ?>">
                <span></span>
            </button>
        <?php endforeach; ?>
    </div>
</div>

<style>
.moreyeahs-slider {
    position: relative;
    width: 100%;
    overflow: hidden;
}

.slider-container {
    position: relative;
    width: 100%;
    height: 600px;
}

.slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
}

.slide.active {
    opacity: 1;
}

.slide-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.slide-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
}

.slide-caption {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    z-index: 10;
}

.slide-caption .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.slide-heading {
    color: white;
    font-size: 48px;
    font-weight: bold;
    margin-bottom: 30px;
    line-height: 1.2;
}

.slide-cta {
       display: inline-block;
    padding: 10px 40px;
    background: transparent;
    color: #fff;
    text-decoration: none;
    text-transform: uppercase;
    font-weight: 600;
    transition: transform 0.3s ease, color 0.4s ease;
    border: 1px solid white;
    position: relative;
    overflow: hidden;
    z-index: 1;
}

.slide-cta::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: #000;
    transition: width 0.4s ease;
    z-index: -1;
}

.slide-cta:hover {
    transform: translateY(-2px);
}

.slide-cta:hover::before {
    width: 100%;
}

.slider-dots {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 20;
}

.dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    border: none;
    cursor: pointer;
    padding: 0;
    transition: all 0.3s ease;
}

.dot.active {
    background: white;
    width: 40px;
    border-radius: 6px;
}

@media (max-width: 768px) {
    .slider-container {
        height: 400px;
    }
    
    .slide-heading {
        font-size: 28px;
        margin-bottom: 20px;
    }
    
    .slide-cta {
        padding: 12px 30px;
        font-size: 14px;
    }
}
</style>

<script>
(function() {
    const slider = document.getElementById('<?php echo $block_id; ?>');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.dot');
    let currentSlide = 0;
    let autoplayInterval;
    
    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoplay();
            startAutoplay();
        });
    });
    
    startAutoplay();
    
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
})();
</script>
