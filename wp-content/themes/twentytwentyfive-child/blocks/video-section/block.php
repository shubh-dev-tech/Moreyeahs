<?php
/**
 * Video Section Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Get ACF fields
$heading = get_field('heading');
$sub_heading = get_field('sub_heading');
$videos = get_field('videos');
$button_text = get_field('button_text');
$button_url = get_field('button_url');
$background_color = get_field('background_color');
$background_image = get_field('background_image');

// Block ID
$block_id = 'video-section-' . $block['id'];
if (!empty($block['anchor'])) {
    $block_id = $block['anchor'];
}

// Block classes
$class_name = 'video-section';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $class_name .= ' align' . $block['align'];
}

// Ensure we have required content
if (!$videos || empty($videos)) {
    if ($is_preview) {
        echo '<p>Please add videos to display the block.</p>';
    }
    return;
}

// Build inline styles for background
$section_styles = '';
if ($background_color) {
    $section_styles .= 'background-color: ' . esc_attr($background_color) . ';';
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
    <div class="video-section__bg-overlay"></div>
    <?php endif; ?>
    
    <div class="video-section__container">
        <div class="video-section__content">
            
            <!-- Text Content -->
            <div class="video-section__text-content">
                <?php if ($heading): ?>
                <h2 class="video-section__heading"><?php echo esc_html($heading); ?></h2>
                <?php endif; ?>
                
                <?php if ($sub_heading): ?>
                <p class="video-section__sub-heading"><?php echo esc_html($sub_heading); ?></p>
                <?php endif; ?>
                
                <?php if ($button_text): ?>
                <div class="video-section__button-wrapper">
                    <?php if ($button_url): ?>
                    <a href="<?php echo esc_url($button_url); ?>" class="video-section__button">
                        <?php echo esc_html($button_text); ?>
                    </a>
                    <?php else: ?>
                    <button class="video-section__button video-section__button--play" data-action="play-current">
                        <?php echo esc_html($button_text); ?>
                    </button>
                    <?php endif; ?>
                </div>
                <?php endif; ?>
            </div>

            <!-- Video Carousel -->
            <div class="video-section__carousel-wrapper">
                <div class="video-section__carousel" data-block-id="<?php echo esc_attr($block_id); ?>">
                    <?php foreach ($videos as $index => $video): ?>
                    <div class="video-section__slide" data-slide="<?php echo $index; ?>" style="display: <?php echo $index === 0 ? 'block' : 'none'; ?>;">
                        <div class="video-section__video-container">
                            <video 
                                class="video-section__video"
                                preload="metadata"
                                muted
                                <?php if ($video['video_thumbnail'] && !empty($video['video_thumbnail']['url'])): ?>
                                poster="<?php echo esc_url($video['video_thumbnail']['url']); ?>"
                                <?php endif; ?>
                                data-video-index="<?php echo $index; ?>"
                            >
                                <source src="<?php echo esc_url($video['video_url']['url']); ?>" type="<?php echo esc_attr($video['video_url']['mime_type']); ?>">
                                Your browser does not support the video tag.
                            </video>
                            
                            <!-- Play Button Overlay -->
                            <div class="video-section__play-overlay">
                                <button class="video-section__play-button" aria-label="Play video">
                                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="30" cy="30" r="30" fill="rgba(255, 255, 255, 0.9)"/>
                                        <path d="M25 20L40 30L25 40V20Z" fill="#333"/>
                                    </svg>
                                </button>
                            </div>

                            <!-- Hover Play/Pause Overlay -->
                            <div class="video-section__play-pause-overlay">
                                <button class="video-section__play-pause-button" aria-label="Play video">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 5v14l11-7L8 5z" fill="currentColor"/>
                                    </svg>
                                </button>
                            </div>

                            <?php if (!empty($video['video_title']) || !empty($video['video_subtitle'])): ?>
                            <div class="video-section__video-title">
                                <?php if (!empty($video['video_title'])): ?>
                                <h3><?php echo esc_html($video['video_title']); ?></h3>
                                <?php endif; ?>
                                <?php if (!empty($video['video_subtitle'])): ?>
                                <p class="video-section__video-subtitle"><?php echo esc_html($video['video_subtitle']); ?></p>
                                <?php endif; ?>
                            </div>
                            <?php endif; ?>

                            <?php if (!empty($video['video_button_text'])): ?>
                            <div class="video-section__video-button-wrapper">
                                <?php if (!empty($video['video_button_url'])): ?>
                                <a href="<?php echo esc_url($video['video_button_url']); ?>" class="video-section__video-button" target="_blank" rel="noopener noreferrer">
                                    <?php echo esc_html($video['video_button_text']); ?>
                                </a>
                                <?php else: ?>
                                <button class="video-section__video-button video-section__video-button--play" data-video-index="<?php echo $index; ?>">
                                    <?php echo esc_html($video['video_button_text']); ?>
                                </button>
                                <?php endif; ?>
                            </div>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>

                <!-- Navigation Arrows -->
                <?php if (count($videos) > 1): ?>
                <button class="video-section__nav video-section__nav--prev" aria-label="Previous video">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="video-section__nav video-section__nav--next" aria-label="Next video">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <?php endif; ?>

                <!-- Dots Indicator -->
                <?php if (count($videos) > 1): ?>
              
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>

<script>
(function() {
    const blockId = '<?php echo esc_js($block_id); ?>';
    const videoSection = document.querySelector(`#${blockId}`);
    const carousel = videoSection?.querySelector('.video-section__carousel');
    const slides = videoSection?.querySelectorAll('.video-section__slide');
    const videos = videoSection?.querySelectorAll('.video-section__video');
    const playButtons = videoSection?.querySelectorAll('.video-section__play-button');
    const playPauseOverlays = videoSection?.querySelectorAll('.video-section__play-pause-overlay');
    const customPlayButton = videoSection?.querySelector('.video-section__button--play');
    const prevButton = videoSection?.querySelector('.video-section__nav--prev');
    const nextButton = videoSection?.querySelector('.video-section__nav--next');
    const dots = videoSection?.querySelectorAll('.video-section__dot');
    
    if (!carousel || slides.length === 0) return;
    
    let currentSlide = 0;
    let playingVideos = new Set();
    let autoplayInterval = null;
    
    // Navigate to specific slide
    function goToSlide(index) {
        if (index < 0 || index >= slides.length) return;
        
        // Pause current video
        const currentVideo = slides[currentSlide]?.querySelector('.video-section__video');
        if (currentVideo) {
            currentVideo.pause();
            currentVideo.currentTime = 0;
        }
        
        // Hide all slides
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
        playingVideos.clear();
    }
    
    // Navigate to next slide
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }
    
    // Navigate to previous slide
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prev);
    }
    
    // Handle play video
    function handlePlayVideo(index) {
        const video = videos[index];
        if (video) {
            video.play();
            playingVideos.add(index);
            
            const overlay = video.parentElement.querySelector('.video-section__play-overlay');
            if (overlay) overlay.classList.add('playing');
        }
    }
    
    // Toggle play/pause
    function togglePlayPause(index) {
        const video = videos[index];
        if (!video) return;
        
        if (video.paused) {
            video.play();
            playingVideos.add(index);
        } else {
            video.pause();
            playingVideos.delete(index);
        }
        
        updatePlayPauseButton(index);
    }
    
    // Update play/pause button icon
    function updatePlayPauseButton(index) {
        const video = videos[index];
        const button = video?.parentElement.querySelector('.video-section__play-pause-button');
        if (!button) return;
        
        const isPlaying = !video.paused;
        button.innerHTML = isPlaying ? 
            '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>' :
            '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7L8 5z" fill="currentColor"/></svg>';
        
        button.setAttribute('aria-label', isPlaying ? 'Pause video' : 'Play video');
    }
    
    // Play button handlers
    playButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const slideIndex = parseInt(button.closest('.video-section__slide').getAttribute('data-slide'));
            handlePlayVideo(slideIndex);
        });
    });
    
    // Play/pause overlay handlers
    playPauseOverlays.forEach((overlay, index) => {
        overlay.addEventListener('click', () => {
            const slideIndex = parseInt(overlay.closest('.video-section__slide').getAttribute('data-slide'));
            togglePlayPause(slideIndex);
        });
    });
    
    // Video-specific button handlers
    const videoButtons = videoSection?.querySelectorAll('.video-section__video-button--play');
    videoButtons?.forEach((button) => {
        button.addEventListener('click', () => {
            const videoIndex = parseInt(button.getAttribute('data-video-index'));
            handlePlayVideo(videoIndex);
        });
    });
    
    // Custom play button (plays current video)
    if (customPlayButton) {
        customPlayButton.addEventListener('click', () => {
            handlePlayVideo(currentSlide);
        });
    }
    
    // Navigation buttons
    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Video event listeners
    videos.forEach((video, index) => {
        video.addEventListener('play', () => {
            const overlay = video.parentElement.querySelector('.video-section__play-overlay');
            if (overlay) overlay.classList.add('playing');
            updatePlayPauseButton(index);
        });
        
        video.addEventListener('pause', () => {
            const overlay = video.parentElement.querySelector('.video-section__play-overlay');
            if (overlay) overlay.classList.remove('playing');
            updatePlayPauseButton(index);
        });
        
        video.addEventListener('ended', () => {
            playingVideos.delete(index);
            const overlay = video.parentElement.querySelector('.video-section__play-overlay');
            if (overlay) overlay.classList.remove('playing');
            updatePlayPauseButton(index);
        });
    });
    
    // Auto-advance slides every 5 seconds
    if (slides.length > 1) {
        autoplayInterval = setInterval(() => {
            nextSlide();
        }, 5000);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    });
    
    // Initialize - show first slide
    goToSlide(0);
})();
</script>