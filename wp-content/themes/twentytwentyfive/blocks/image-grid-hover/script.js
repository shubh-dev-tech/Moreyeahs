/**
 * Image Grid Hover Block JavaScript
 * Handles any interactive functionality for the image grid
 */

(function() {
  'use strict';

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const imageGridBlocks = document.querySelectorAll('.image-grid-hover-block');
    
    imageGridBlocks.forEach(function(block) {
      // Add loaded class for animations
      block.classList.add('loaded');
      
      // Optional: Add click tracking or analytics
      const gridItems = block.querySelectorAll('.image-grid-item');
      gridItems.forEach(function(item, index) {
        item.addEventListener('click', function(e) {
          // You can add custom click handling here
          console.log('Grid item clicked:', index + 1);
        });
      });
    });
  }

  // Optional: Add intersection observer for scroll animations
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, {
      threshold: 0.1
    });

    document.querySelectorAll('.image-grid-item').forEach(function(item) {
      observer.observe(item);
    });
  }
})();
