/**
 * Service Across Multi Block JavaScript
 * 
 * Handles interactive features and animations for the service across multi block
 */

(function() {
    'use strict';

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initServiceAcrossMultiBlock();
    });

    /**
     * Initialize the Service Across Multi Block functionality
     */
    function initServiceAcrossMultiBlock() {
        const blocks = document.querySelectorAll('.service-across-multi-block');
        
        blocks.forEach(function(block) {
            // Initialize intersection observer for animations
            initScrollAnimations(block);
            
            // Initialize hover effects
            initHoverEffects(block);
            
            // Initialize accessibility features
            initAccessibility(block);
        });
    }

    /**
     * Initialize scroll-based animations using Intersection Observer
     * @param {Element} block - The block element
     */
    function initScrollAnimations(block) {
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const animatedElements = block.querySelectorAll(
            '.samb-platform-badge, .samb-service-category, .samb-tech-badge'
        );

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(function(element, index) {
            // Set initial state
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.transitionDelay = (index * 0.1) + 's';
            
            observer.observe(element);
        });
    }

    /**
     * Initialize hover effects and interactions
     * @param {Element} block - The block element
     */
    function initHoverEffects(block) {
        // Platform badges hover effect
        const platformBadges = block.querySelectorAll('.samb-platform-badge');
        platformBadges.forEach(function(badge) {
            badge.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px) scale(1.02)';
            });
            
            badge.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Service categories hover effect
        const serviceCategories = block.querySelectorAll('.samb-service-category');
        serviceCategories.forEach(function(category) {
            category.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-6px)';
                this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
            });
            
            category.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });

        // Technology badges ripple effect
        const techBadges = block.querySelectorAll('.samb-tech-badge');
        techBadges.forEach(function(badge) {
            badge.addEventListener('click', function(e) {
                createRippleEffect(e, this);
            });
        });
    }

    /**
     * Create ripple effect on click
     * @param {Event} e - Click event
     * @param {Element} element - Target element
     */
    function createRippleEffect(e, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(function() {
            ripple.remove();
        }, 600);
    }

    /**
     * Initialize accessibility features
     * @param {Element} block - The block element
     */
    function initAccessibility(block) {
        // Add ARIA labels to interactive elements
        const platformBadges = block.querySelectorAll('.samb-platform-badge');
        platformBadges.forEach(function(badge) {
            const platformName = badge.querySelector('.samb-platform-name');
            if (platformName) {
                badge.setAttribute('aria-label', 'Cloud platform: ' + platformName.textContent);
            }
        });

        // Add ARIA labels to technology badges
        const techBadges = block.querySelectorAll('.samb-tech-badge');
        techBadges.forEach(function(badge) {
            badge.setAttribute('aria-label', 'Technology: ' + badge.textContent);
            badge.setAttribute('role', 'button');
            badge.setAttribute('tabindex', '0');
            
            // Add keyboard support
            badge.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    createRippleEffect(e, this);
                }
            });
        });

        // Improve quote accessibility
        const quote = block.querySelector('.samb-quote');
        if (quote) {
            quote.setAttribute('role', 'blockquote');
            quote.setAttribute('aria-label', 'Testimonial quote');
        }
    }

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Handle window resize for responsive adjustments
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Reinitialize if needed on significant resize
            const blocks = document.querySelectorAll('.service-across-multi-block');
            blocks.forEach(function(block) {
                // Reset any inline styles that might need adjustment
                const animatedElements = block.querySelectorAll('[style*="transform"]');
                animatedElements.forEach(function(element) {
                    if (window.innerWidth <= 768) {
                        // Mobile adjustments
                        element.style.transform = element.style.transform.replace(/scale\([^)]*\)/g, 'scale(1)');
                    }
                });
            });
        }, 250);
    });

})();