/**
 * Icon Text Grid Block JavaScript
 * Handles additional interactions and accessibility
 */

document.addEventListener('DOMContentLoaded', function() {
  const iconTextGrids = document.querySelectorAll('.icon-text-grid');

  iconTextGrids.forEach(grid => {
    const items = grid.querySelectorAll('.icon-text-grid__item');

    items.forEach(item => {
      // Add keyboard navigation support
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });

      // Prevent animation restart on rapid hover
      const icon = item.querySelector('.icon-text-grid__icon');
      if (icon) {
        icon.addEventListener('animationend', function() {
          this.style.animation = 'none';
          setTimeout(() => {
            this.style.animation = '';
          }, 10);
        });
      }
    });
  });

  // Optional: Add analytics tracking
  function trackIconClick(text, link) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'icon_grid_click', {
        'event_category': 'engagement',
        'event_label': text,
        'value': link
      });
    }
  }

  // Attach click tracking
  document.querySelectorAll('.icon-text-grid__item').forEach(item => {
    item.addEventListener('click', function() {
      const text = this.querySelector('.icon-text-grid__text')?.textContent || '';
      const link = this.getAttribute('href') || '';
      trackIconClick(text, link);
    });
  });
});
