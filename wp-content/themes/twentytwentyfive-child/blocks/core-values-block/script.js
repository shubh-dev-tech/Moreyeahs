// Core Values Block JavaScript
// Add any interactive functionality here if needed

(function() {
    'use strict';
    
    // Initialize block when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        const coreValuesBlocks = document.querySelectorAll('.core-values-block');
        
        coreValuesBlocks.forEach(function(block) {
            // Add any interactive features here
            // For example: intersection observer for animations
            
            const cards = block.querySelectorAll('.core-values-block__card');
            
            // Optional: Add staggered animation on scroll
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry, index) {
                        if (entry.isIntersecting) {
                            setTimeout(function() {
                                entry.target.style.opacity = '1';
                                entry.target.style.transform = 'translateY(0)';
                            }, index * 100);
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    threshold: 0.1
                });
                
                cards.forEach(function(card) {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    observer.observe(card);
                });
            }
        });
    });
})();
