import { useEffect, useRef, useCallback } from 'react';

interface HeaderScrollOptions {
  /** Scroll threshold before hiding starts (default: 100) */
  hideThreshold?: number;
  /** Minimum scroll delta to trigger hide/show (default: 5) */
  scrollDelta?: number;
  /** Animation duration in ms (default: 300) */
  animationDuration?: number;
  /** Custom header selector (default: '.header') */
  headerSelector?: string;
  /** Custom menu selector (default: '.header__menu') */
  menuSelector?: string;
  /** Callback when header state changes */
  onStateChange?: (isHidden: boolean, isScrolled: boolean) => void;
}

export function useAdvancedHeaderScroll(options: HeaderScrollOptions = {}) {
  const {
    hideThreshold = 100,
    scrollDelta = 5,
    animationDuration = 300,
    headerSelector = '.header',
    menuSelector = '.header__menu',
    onStateChange
  } = options;

  const lastScrollTop = useRef(0);
  const ticking = useRef(false);
  const isHidden = useRef(false);

  const updateHeader = useCallback(() => {
    const header = document.querySelector(headerSelector);
    const headerMenu = document.querySelector(menuSelector);
    
    if (!header || !headerMenu) {
      ticking.current = false;
      return;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDirection = scrollTop - lastScrollTop.current;
    
    // Only trigger after scrolling more than specified delta to avoid jitter
    if (Math.abs(scrollDirection) < scrollDelta) {
      ticking.current = false;
      return;
    }

    const shouldHide = scrollTop > hideThreshold && scrollDirection > 0;
    const shouldShow = scrollDirection < 0 || scrollTop <= hideThreshold;

    // Update hidden state
    if (shouldHide && !isHidden.current) {
      headerMenu.classList.add('header__menu--hidden');
      isHidden.current = true;
    } else if (shouldShow && isHidden.current) {
      headerMenu.classList.remove('header__menu--hidden');
      isHidden.current = false;
    }

    // Call callback if provided
    if (onStateChange) {
      onStateChange(isHidden.current, false);
    }

    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
    ticking.current = false;
  }, [hideThreshold, scrollDelta, headerSelector, menuSelector, onStateChange]);

  const requestTick = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(updateHeader);
      ticking.current = true;
    }
  }, [updateHeader]);

  const handleResize = useCallback(() => {
    lastScrollTop.current = window.pageYOffset || document.documentElement.scrollTop;
  }, []);

  useEffect(() => {
    // Set CSS custom property for animation duration
    document.documentElement.style.setProperty('--header-animation-duration', `${animationDuration}ms`);

    // Add event listeners
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', handleResize);

    // Initial state check
    requestTick();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', requestTick);
      window.removeEventListener('resize', handleResize);
    };
  }, [requestTick, handleResize, animationDuration]);

  // Return current state and control functions
  return {
    isHidden: isHidden.current,
    forceShow: () => {
      const headerMenu = document.querySelector(menuSelector);
      if (headerMenu) {
        headerMenu.classList.remove('header__menu--hidden');
        isHidden.current = false;
      }
    },
    forceHide: () => {
      const headerMenu = document.querySelector(menuSelector);
      if (headerMenu) {
        headerMenu.classList.add('header__menu--hidden');
        isHidden.current = true;
      }
    }
  };
}