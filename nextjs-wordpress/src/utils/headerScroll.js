/**
 * Header scroll behavior - hide/show menu on scroll
 */

let lastScrollTop = 0;
let isScrolling = false;

export function initHeaderScroll() {
  const header = document.querySelector('.header');
  const headerMenu = document.querySelector('.header__menu');
  
  if (!header || !headerMenu) return;

  let ticking = false;

  function updateHeader() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDelta = scrollTop - lastScrollTop;
    
    // Only trigger after scrolling more than 5px to avoid jitter
    if (Math.abs(scrollDelta) < 5) return;

    if (scrollTop > 100) { // Start hiding after 100px scroll
      if (scrollDelta > 0) {
        // Scrolling down - hide menu
        headerMenu.classList.add('header__menu--hidden');
      } else {
        // Scrolling up - show menu
        headerMenu.classList.remove('header__menu--hidden');
      }
    } else {
      // At top - always show menu
      headerMenu.classList.remove('header__menu--hidden');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  // Throttled scroll event
  window.addEventListener('scroll', requestTick, { passive: true });

  // Handle resize to recalculate positions
  window.addEventListener('resize', () => {
    lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  });
}

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderScroll);
  } else {
    initHeaderScroll();
  }
}