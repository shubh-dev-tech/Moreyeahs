import { useEffect, useRef } from 'react';

export function useHeaderScroll() {
  const lastScrollTop = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const header = document.querySelector('.header') as HTMLElement;
    
    if (!header) return;

    function updateHeader() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollDelta = scrollTop - lastScrollTop.current;
      
      // Only trigger after scrolling more than 5px to avoid jitter
      if (Math.abs(scrollDelta) < 5) {
        ticking.current = false;
        return;
      }

      if (scrollTop > 100) { // Start hiding after 100px scroll
        if (scrollDelta > 0) {
          // Scrolling down - hide entire header
          header.classList.add('header--hidden');
        } else {
          // Scrolling up - show entire header
          header.classList.remove('header--hidden');
        }
      } else {
        // At top - always show header
        header.classList.remove('header--hidden');
      }

      lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
      ticking.current = false;
    }

    function requestTick() {
      if (!ticking.current) {
        requestAnimationFrame(updateHeader);
        ticking.current = true;
      }
    }

    // Throttled scroll event
    window.addEventListener('scroll', requestTick, { passive: true });

    // Handle resize to recalculate positions
    const handleResize = () => {
      lastScrollTop.current = window.pageYOffset || document.documentElement.scrollTop;
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', requestTick);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
}