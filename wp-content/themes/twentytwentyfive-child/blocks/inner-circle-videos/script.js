(function() {
    'use strict';

    function initInnerCircleVideos() {
        const blocks = document.querySelectorAll('.inner-circle-videos');
        
        blocks.forEach(block => {
            const slider = block.querySelector('[data-slider]');
            const slides = block.querySelectorAll('.inner-circle-videos__slide');
            const dots = block.querySelectorAll('.inner-circle-videos__dot');
            const playButtons = block.querySelectorAll('.inner-circle-videos__play-btn');
            const modal = block.querySelector('.inner-circle-videos__modal');
            const modalClose = block.querySelector('.inner-circle-videos__modal-close');
            const modalOverlay = block.querySelector('.inner-circle-videos__modal-overlay');
            const modalVideo = block.querySelector('.inner-circle-videos__modal-video');
            
            if (!slider || slides.length === 0) return;

            const originalSlidesCount = slides.length / 3; // We tripled the slides
            let currentIndex = originalSlidesCount; // Start from middle set
            let isAnimating = false;
            let autoplayInterval;
            let isDragging = false;
            let startPos = 0;
            let currentTranslate = 0;
            let prevTranslate = 0;

            // Calculate slide width
            function getSlideWidth() {
                return slides[0].offsetWidth + 30; // slide width + gap
            }

            // Update slider position
            function updateSliderPosition(animate = true) {
                const slideWidth = getSlideWidth();
                const offset = -currentIndex * slideWidth;
                
                if (animate) {
                    slider.style.transition = 'transform 0.5s ease';
                } else {
                    slider.style.transition = 'none';
                }
                
                slider.style.transform = `translateX(${offset}px)`;
                updateDots();
            }

            // Update active dot
            function updateDots() {
                const actualIndex = currentIndex % originalSlidesCount;
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === actualIndex);
                });
            }

            // Go to specific slide
            function goToSlide(index, animate = true) {
                if (isAnimating) return;
                isAnimating = true;
                currentIndex = index;
                updateSliderPosition(animate);
                
                setTimeout(() => {
                    isAnimating = false;
                }, 500);
            }

            // Next slide
            function nextSlide() {
                currentIndex++;
                updateSliderPosition(true);
                
                // Check if we need to loop
                if (currentIndex >= originalSlidesCount * 2) {
                    setTimeout(() => {
                        currentIndex = originalSlidesCount;
                        updateSliderPosition(false);
                    }, 500);
                }
            }

            // Previous slide
            function prevSlide() {
                currentIndex--;
                updateSliderPosition(true);
                
                // Check if we need to loop
                if (currentIndex < originalSlidesCount) {
                    setTimeout(() => {
                        currentIndex = originalSlidesCount * 2 - 1;
                        updateSliderPosition(false);
                    }, 500);
                }
            }

            // Autoplay
            function startAutoplay() {
                stopAutoplay();
                autoplayInterval = setInterval(() => {
                    nextSlide();
                }, 5000);
            }

            function stopAutoplay() {
                if (autoplayInterval) {
                    clearInterval(autoplayInterval);
                }
            }

            // Dot navigation
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    goToSlide(originalSlidesCount + index);
                    stopAutoplay();
                    startAutoplay();
                });
            });

            // Touch/Mouse drag functionality
            function touchStart(e) {
                isDragging = true;
                startPos = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
                prevTranslate = -currentIndex * getSlideWidth();
                stopAutoplay();
                slider.style.transition = 'none';
            }

            function touchMove(e) {
                if (!isDragging) return;
                
                const currentPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
                currentTranslate = prevTranslate + currentPosition - startPos;
                slider.style.transform = `translateX(${currentTranslate}px)`;
            }

            function touchEnd() {
                if (!isDragging) return;
                isDragging = false;
                
                const movedBy = currentTranslate - prevTranslate;
                const slideWidth = getSlideWidth();
                
                if (Math.abs(movedBy) > slideWidth / 4) {
                    if (movedBy > 0) {
                        prevSlide();
                    } else {
                        nextSlide();
                    }
                } else {
                    updateSliderPosition(true);
                }
                
                startAutoplay();
            }

            // Add event listeners for drag
            slider.addEventListener('mousedown', touchStart);
            slider.addEventListener('touchstart', touchStart);
            slider.addEventListener('mousemove', touchMove);
            slider.addEventListener('touchmove', touchMove);
            slider.addEventListener('mouseup', touchEnd);
            slider.addEventListener('touchend', touchEnd);
            slider.addEventListener('mouseleave', () => {
                if (isDragging) touchEnd();
            });

            // Prevent default drag behavior
            slider.addEventListener('dragstart', (e) => e.preventDefault());

            // Video popup functionality
            playButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const videoUrl = button.getAttribute('data-video-url');
                    const videoType = button.getAttribute('data-video-type');
                    
                    openVideoModal(videoUrl, videoType);
                    stopAutoplay();
                });
            });

            function openVideoModal(videoUrl, videoType) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                let videoHTML = '';
                
                if (videoType === 'youtube' || videoType === 'vimeo') {
                    videoHTML = `<iframe 
                        src="${videoUrl}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>`;
                } else {
                    videoHTML = `<video controls autoplay>
                        <source src="${videoUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>`;
                }
                
                modalVideo.innerHTML = videoHTML;
            }

            function closeVideoModal() {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                modalVideo.innerHTML = '';
                startAutoplay();
            }

            modalClose.addEventListener('click', closeVideoModal);
            modalOverlay.addEventListener('click', closeVideoModal);

            // Close modal on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    closeVideoModal();
                }
            });

            // Initialize
            updateSliderPosition(false);
            startAutoplay();

            // Handle window resize
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    updateSliderPosition(false);
                }, 250);
            });

            // Pause autoplay when tab is not visible
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    stopAutoplay();
                } else {
                    startAutoplay();
                }
            });
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initInnerCircleVideos);
    } else {
        initInnerCircleVideos();
    }

    // Re-initialize for Gutenberg editor
    if (window.acf) {
        window.acf.addAction('render_block_preview/type=inner-circle-videos', initInnerCircleVideos);
    }
})();
