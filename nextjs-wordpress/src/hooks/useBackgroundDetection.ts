'use client';

import { useEffect, useState } from 'react';

export const useBackgroundDetection = (elementSelector: string = '.header', dependencies: any[] = []) => {
  const [isDarkBackground, setIsDarkBackground] = useState(false);

  useEffect(() => {
    const checkBackgroundColor = () => {
      const element = document.querySelector(elementSelector) as HTMLElement;
      if (!element) return;

      const elementRect = element.getBoundingClientRect();
      const centerX = elementRect.left + elementRect.width / 2;
      const centerY = elementRect.top + elementRect.height / 2;

      // Temporarily hide element to check what's behind it
      const originalPointerEvents = element.style.pointerEvents;
      element.style.pointerEvents = 'none';
      
      const elementBehind = document.elementFromPoint(centerX, centerY);
      
      // Restore original pointer events
      element.style.pointerEvents = originalPointerEvents;

      if (elementBehind) {
        const computedStyle = window.getComputedStyle(elementBehind);
        let bgColor = computedStyle.backgroundColor;
        
        // If background is transparent, check parent elements
        let currentElement: Element | null = elementBehind;
        while (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
          currentElement = currentElement?.parentElement || null;
          if (!currentElement || currentElement === document.body) {
            // Default to white background if we reach body
            bgColor = 'rgb(255, 255, 255)';
            break;
          }
          bgColor = window.getComputedStyle(currentElement).backgroundColor;
        }
        
        // Parse RGB values
        const rgb = bgColor.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          const r = parseInt(rgb[0]);
          const g = parseInt(rgb[1]);
          const b = parseInt(rgb[2]);
          
          // Calculate relative luminance using standard formula
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          
          // If background is dark (luminance < 0.5), it's a dark background
          const isDark = luminance < 0.5;
          setIsDarkBackground(isDark);
        }
      }
    };

    const handleScroll = () => {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(checkBackgroundColor);
    };

    const handleResize = () => {
      requestAnimationFrame(checkBackgroundColor);
    };

    // Check background immediately when component mounts or dependencies change
    checkBackgroundColor();

    // Also check after a short delay to ensure DOM is fully rendered
    const initialCheck = setTimeout(checkBackgroundColor, 100);
    
    // Check again after images and other content might have loaded
    const delayedCheck = setTimeout(checkBackgroundColor, 500);

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', checkBackgroundColor);

    // Check on route changes (for Next.js navigation)
    const handleRouteChange = () => {
      // Small delay to let the new page content render
      setTimeout(checkBackgroundColor, 100);
    };

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);

    // Listen for Next.js route changes if available
    if (typeof window !== 'undefined' && window.history) {
      const originalPushState = window.history.pushState;
      const originalReplaceState = window.history.replaceState;

      window.history.pushState = function(...args) {
        originalPushState.apply(window.history, args);
        handleRouteChange();
      };

      window.history.replaceState = function(...args) {
        originalReplaceState.apply(window.history, args);
        handleRouteChange();
      };

      return () => {
        clearTimeout(initialCheck);
        clearTimeout(delayedCheck);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('load', checkBackgroundColor);
        window.removeEventListener('popstate', handleRouteChange);
        
        // Restore original methods
        window.history.pushState = originalPushState;
        window.history.replaceState = originalReplaceState;
      };
    }

    return () => {
      clearTimeout(initialCheck);
      clearTimeout(delayedCheck);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', checkBackgroundColor);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [elementSelector, dependencies]);

  return isDarkBackground;
};