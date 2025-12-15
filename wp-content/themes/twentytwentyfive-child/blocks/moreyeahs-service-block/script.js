/**
 * More Years Service Block JavaScript
 * 
 * Optional JavaScript functionality for the service block
 * Currently includes basic interaction enhancements
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        initMoreYeahsServiceBlock();
    });

    /**
     * Initialize More Years Service Block functionality
     */
    function initMoreYeahsServiceBlock() {
        const serviceBlocks = document.querySelectorAll('.moreyeahs-service');
        
        serviceBlocks.forEach(function(block) {
            // Add smooth scroll behavior for anchor links within the block
            const anchorLinks = block.querySelectorAll('a[href^="#"]');
            anchorLinks.forEach(function(link) {
                link.addEventListener('click', handleSmoothScroll);
            });

            // Add keyboard navigation support
            const serviceLinks = block.querySelectorAll('.moreyeahs-service__service-link');
            serviceLinks.forEach(function(link) {
                link.addEventListener('keydown', handleKeyboardNavigation);
            });

            // Add analytics tracking (optional)
            trackServiceInteractions(block);
        });
    }

    /**
     * Handle smooth scrolling for anchor links
     */
    function handleSmoothScroll(event) {
        const href = event.currentTarget.getAttribute('href');
        
        if (href.startsWith('#') && href.length > 1) {
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                event.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeyboardNavigation(event) {
        // Enter or Space key should trigger the link
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.currentTarget.click();
        }
    }

    /**
     * Track service interactions for analytics
     */
    function trackServiceInteractions(block) {
        const serviceLinks = block.querySelectorAll('.moreyeahs-service__service-link');
        const sectionLinks = block.querySelectorAll('.moreyeahs-service__section-link');
        
        // Track service link clicks
        serviceLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                // Example: Google Analytics tracking
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        'event_category': 'More Years Service Block',
                        'event_label': 'Service Link: ' + link.textContent.trim(),
                        'value': 1
                    });
                }
                
                // Example: Custom analytics
                if (typeof window.customAnalytics !== 'undefined') {
                    window.customAnalytics.track('service_link_click', {
                        block_type: 'moreyeahs-service',
                        link_text: link.textContent.trim(),
                        link_url: link.href
                    });
                }
            });
        });
        
        // Track section header clicks
        sectionLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        'event_category': 'More Years Service Block',
                        'event_label': 'Section Header: ' + link.textContent.trim(),
                        'value': 1
                    });
                }
            });
        });
    }

    /**
     * Utility function to add loading states (for future AJAX functionality)
     */
    function addLoadingState(element) {
        element.classList.add('loading');
        element.setAttribute('aria-busy', 'true');
    }

    /**
     * Utility function to remove loading states
     */
    function removeLoadingState(element) {
        element.classList.remove('loading');
        element.setAttribute('aria-busy', 'false');
    }

    // Export functions for external use if needed
    window.MoreYeahsServiceBlock = {
        init: initMoreYeahsServiceBlock,
        addLoadingState: addLoadingState,
        removeLoadingState: removeLoadingState
    };

})();