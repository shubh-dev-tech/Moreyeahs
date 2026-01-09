<?php
/**
 * Video Hero Section Block Template
 */

// Get field values
$main_heading = get_field('main_heading') ?: 'Follow Your Heart Rescue!';
$subtitle = get_field('subtitle') ?: 'Pet Supplies & Toy Drive';
$videos = get_field('videos') ?: [];
$slider_settings = get_field('slider_settings') ?: [];
$background_settings = get_field('background_settings') ?: [];
$video_settings = get_field('video_settings') ?: [];
$styling_options = get_field('styling_options') ?: [];
$cta_buttons = get_field('cta_buttons') ?: [];

// Generate unique ID for this block
$block_id = 'video-hero-section-' . $block['id'];

// Build background styles
$background_style = '';
if (!empty($background_settings)) {
    $bg_type = $background_settings['background_type'] ?? 'gradient';
    
    switch ($bg_type) {
        case 'color':
            $bg_color = $background_settings['bg_color'] ?? '#667eea';
            $background_style = "background-color: {$bg_color};";
            break;
        case 'gradient':
            $gradient_start = $background_settings['gradient_start'] ?? '#667eea';
            $gradient_end = $background_settings['gradient_end'] ?? '#764ba2';
            $gradient_direction = $background_settings['gradient_direction'] ?? '135deg';
            $background_style = "background: linear-gradient({$gradient_direction}, {$gradient_start} 0%, {$gradient_end} 100%);";
            break;
        case 'image':
            if (!empty($background_settings['bg_image'])) {
                $bg_image_url = wp_get_attachment_image_url($background_settings['bg_image'], 'full');
                $bg_overlay = $background_settings['bg_image_overlay'] ?? 'rgba(0, 0, 0, 0.4)';
                $background_style = "background-image: linear-gradient({$bg_overlay}, {$bg_overlay}), url('{$bg_image_url}'); background-size: cover; background-position: center; background-repeat: no-repeat;";
            }
            break;
    }
}

// Build section styles
$section_style = $background_style;
if (!empty($styling_options)) {
    $section_height = $styling_options['section_height'] ?? 'viewport';
    
    if ($section_height === 'viewport') {
        $section_style .= 'min-height: 100vh;';
    } elseif ($section_height === 'custom' && !empty($styling_options['custom_height'])) {
        $section_style .= 'min-height: ' . intval($styling_options['custom_height']) . 'px;';
    }
}

// Build video container styles
$video_container_style = '';
if (!empty($styling_options)) {
    $aspect_ratio = $styling_options['video_aspect_ratio'] ?? '16/9';
    if ($aspect_ratio !== 'auto') {
        $video_container_style .= 'aspect-ratio: ' . esc_attr($aspect_ratio) . ';';
    }
    
    $border_radius = $styling_options['border_radius'] ?? 12;
    $video_container_style .= 'border-radius: ' . intval($border_radius) . 'px;';
}

// Build overlay styles - removed since we don't need overlay anymore

// Custom CSS variables
$custom_css = '';
if (!empty($styling_options)) {
    $text_color = $styling_options['text_color'] ?? '#ffffff';
    $heading_color = $styling_options['heading_color'] ?? '#ffffff';
    
    $custom_css = "
    <style>
    #{$block_id} {
        --text-color: {$text_color};
        --heading-color: {$heading_color};
    }
    </style>
    ";
}

// Helper function to get YouTube video ID
function get_youtube_video_id($url) {
    preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $url, $matches);
    return isset($matches[1]) ? $matches[1] : null;
}

// Helper function to get Vimeo video ID
function get_vimeo_video_id($url) {
    preg_match('/(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i', $url, $matches);
    return isset($matches[1]) ? $matches[1] : null;
}

// Ensure we have at least one video
if (empty($videos)) {
    $videos = [[
        'video_source' => 'url',
        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    ]];
}

echo $custom_css;
?>

<div id="<?php echo esc_attr($block_id); ?>" class="video-hero-section" style="<?php echo esc_attr($section_style); ?>">
    <div class="video-hero-container">
        
        <!-- Header Content Above Video -->
        <div class="video-hero-header">
            <h1 class="video-hero-heading"><?php echo esc_html($main_heading); ?></h1>
            <?php if (!empty($subtitle)): ?>
                <p class="video-hero-subtitle"><?php echo esc_html($subtitle); ?></p>
            <?php endif; ?>
        </div>

        <!-- Video Slider -->
        <div class="video-slider-container" style="<?php echo esc_attr($video_container_style); ?>">
            <div class="video-slider">
                <?php foreach ($videos as $index => $video): ?>
                    <?php
                    $video_source = $video['video_source'] ?? 'upload';
                    $is_active = $index === 0 ? 'active' : '';
                    ?>
                    
                    <div class="video-slide <?php echo esc_attr($is_active); ?>">
                        <?php if ($video_source === 'embed' && !empty($video['video_embed'])): ?>
                            <!-- Embed Code -->
                            <div class="video-embed-container">
                                <?php echo wp_kses_post($video['video_embed']); ?>
                            </div>
                            
                        <?php elseif ($video_source === 'url' && !empty($video['video_url'])): ?>
                            <?php 
                            $youtube_id = get_youtube_video_id($video['video_url']);
                            $vimeo_id = get_vimeo_video_id($video['video_url']);
                            ?>
                            
                            <?php if ($youtube_id): ?>
                                <!-- YouTube Video -->
                                <?php
                                $youtube_params = [
                                    'autoplay' => !empty($video_settings['autoplay']) && $index === 0 ? '1' : '0',
                                    'mute' => !empty($video_settings['muted']) ? '1' : '0',
                                    'loop' => !empty($video_settings['loop']) ? '1' : '0',
                                    'controls' => !empty($video_settings['controls']) ? '1' : '0',
                                    'rel' => '0',
                                    'modestbranding' => '1'
                                ];
                                $youtube_url = 'https://www.youtube.com/embed/' . $youtube_id . '?' . http_build_query($youtube_params);
                                ?>
                                <iframe
                                    src="<?php echo esc_url($youtube_url); ?>"
                                    title="<?php echo esc_attr($video['video_title'] ?? $main_heading); ?>"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen
                                    class="video-iframe"
                                ></iframe>
                                
                            <?php elseif ($vimeo_id): ?>
                                <!-- Vimeo Video -->
                                <?php
                                $vimeo_params = [
                                    'autoplay' => !empty($video_settings['autoplay']) && $index === 0 ? '1' : '0',
                                    'muted' => !empty($video_settings['muted']) ? '1' : '0',
                                    'loop' => !empty($video_settings['loop']) ? '1' : '0',
                                    'controls' => !empty($video_settings['controls']) ? '1' : '0'
                                ];
                                $vimeo_url = 'https://player.vimeo.com/video/' . $vimeo_id . '?' . http_build_query($vimeo_params);
                                ?>
                                <iframe
                                    src="<?php echo esc_url($vimeo_url); ?>"
                                    title="<?php echo esc_attr($video['video_title'] ?? $main_heading); ?>"
                                    frameborder="0"
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowfullscreen
                                    class="video-iframe"
                                ></iframe>
                                
                            <?php else: ?>
                                <!-- Direct Video URL -->
                                <video
                                    class="video-element"
                                    <?php if (!empty($video['poster_image'])): ?>
                                        poster="<?php echo esc_url(wp_get_attachment_image_url($video['poster_image'], 'full')); ?>"
                                    <?php endif; ?>
                                    <?php echo !empty($video_settings['autoplay']) && $index === 0 ? 'autoplay' : ''; ?>
                                    <?php echo !empty($video_settings['muted']) ? 'muted' : ''; ?>
                                    <?php echo !empty($video_settings['loop']) ? 'loop' : ''; ?>
                                    <?php echo !empty($video_settings['controls']) ? 'controls' : ''; ?>
                                    preload="<?php echo esc_attr($video_settings['preload'] ?? 'metadata'); ?>"
                                    playsinline
                                >
                                    <source src="<?php echo esc_url($video['video_url']); ?>" />
                                    Your browser does not support the video tag.
                                </video>
                            <?php endif; ?>
                            
                        <?php elseif ($video_source === 'upload' && !empty($video['video_file'])): ?>
                            <!-- Uploaded Video File -->
                            <video
                                class="video-element"
                                <?php if (!empty($video['poster_image'])): ?>
                                    poster="<?php echo esc_url(wp_get_attachment_image_url($video['poster_image'], 'full')); ?>"
                                <?php endif; ?>
                                <?php echo !empty($video_settings['autoplay']) && $index === 0 ? 'autoplay' : ''; ?>
                                <?php echo !empty($video_settings['muted']) ? 'muted' : ''; ?>
                                <?php echo !empty($video_settings['loop']) ? 'loop' : ''; ?>
                                <?php echo !empty($video_settings['controls']) ? 'controls' : ''; ?>
                                preload="<?php echo esc_attr($video_settings['preload'] ?? 'metadata'); ?>"
                                playsinline
                            >
                                <source src="<?php echo esc_url($video['video_file']['url']); ?>" type="<?php echo esc_attr($video['video_file']['mime_type'] ?? 'video/mp4'); ?>" />
                                Your browser does not support the video tag.
                            </video>
                            
                        <?php else: ?>
                            <!-- Video Placeholder -->
                            <div class="video-placeholder">
                                <div class="placeholder-content">
                                    <div class="play-icon">▶</div>
                                    <p>Video not configured</p>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>

            <!-- Navigation Arrows -->
            <?php if (!empty($slider_settings['show_arrows']) && count($videos) > 1): ?>
                <button class="slider-arrow slider-arrow-prev" onclick="prevSlide_<?php echo esc_attr($block['id']); ?>()" aria-label="Previous video">‹</button>
                <button class="slider-arrow slider-arrow-next" onclick="nextSlide_<?php echo esc_attr($block['id']); ?>()" aria-label="Next video">›</button>
            <?php endif; ?>
        </div>

        <!-- Navigation Dots -->
        <?php if (!empty($slider_settings['show_dots']) && count($videos) > 1): ?>
            <div class="slider-dots">
                <?php foreach ($videos as $index => $video): ?>
                    <button 
                        class="slider-dot <?php echo $index === 0 ? 'active' : ''; ?>" 
                        onclick="goToSlide_<?php echo esc_attr($block['id']); ?>(<?php echo $index; ?>)"
                        aria-label="Go to video <?php echo $index + 1; ?>"
                    ></button>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <!-- CTA Buttons -->
        <?php if (!empty($cta_buttons)): ?>
            <div class="cta-buttons">
                <?php foreach ($cta_buttons as $button): ?>
                    <?php
                    $button_style = $button['button_style'] ?? 'primary';
                    $button_color = $button['button_color'] ?? '#6366f1';
                    $button_styles = '';
                    
                    if ($button_style === 'primary') {
                        $button_styles = "background-color: {$button_color}; border-color: {$button_color}; color: #ffffff;";
                    } elseif ($button_style === 'outline') {
                        $button_styles = "background-color: transparent; border-color: {$button_color}; color: {$button_color};";
                    } else {
                        $button_styles = "background-color: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3); color: #ffffff;";
                    }
                    ?>
                    <a
                        href="<?php echo esc_url($button['button_url']); ?>"
                        class="cta-button <?php echo esc_attr($button_style); ?>"
                        style="<?php echo esc_attr($button_styles); ?>"
                    >
                        <?php echo esc_html($button['button_text']); ?>
                    </a>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php if (count($videos) > 1): ?>
<script>
(function() {
    const blockId = '<?php echo esc_js($block['id']); ?>';
    const slides = document.querySelectorAll('#video-hero-section-' + blockId + ' .video-slide');
    const dots = document.querySelectorAll('#video-hero-section-' + blockId + ' .slider-dot');
    let currentSlide = 0;
    let autoplayInterval;
    let isPaused = false;

    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    function goToSlide(index) {
        showSlide(index);
    }

    // Global functions for button clicks
    window['nextSlide_' + blockId] = nextSlide;
    window['prevSlide_' + blockId] = prevSlide;
    window['goToSlide_' + blockId] = goToSlide;

    // Auto-advance slider
    <?php if (!empty($slider_settings['autoplay_slider'])): ?>
    function startAutoplay() {
        const speed = <?php echo intval($slider_settings['slider_speed'] ?? 5000); ?>;
        autoplayInterval = setInterval(nextSlide, speed);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }

    // Start autoplay
    startAutoplay();

    // Pause on hover
    <?php if (!empty($slider_settings['pause_on_hover'])): ?>
    const container = document.getElementById('video-hero-section-' + blockId);
    if (container) {
        container.addEventListener('mouseenter', () => {
            isPaused = true;
            stopAutoplay();
        });
        
        container.addEventListener('mouseleave', () => {
            isPaused = false;
            startAutoplay();
        });
    }
    <?php endif; ?>
    <?php endif; ?>
})();
</script>
<?php endif; ?>