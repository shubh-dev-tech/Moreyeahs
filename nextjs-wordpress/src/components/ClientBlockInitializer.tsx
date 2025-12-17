'use client';

import { useEffect } from 'react';

// Import block initializers
import { initializeStoriesBlogBlocks } from './blocks/stories-blog-block/client-renderer';

export default function ClientBlockInitializer() {
  useEffect(() => {
    // Initialize all client-side blocks
    initializeStoriesBlogBlocks();
    
    // Re-initialize on navigation (for SPA behavior)
    const handleNavigation = () => {
      setTimeout(() => {
        initializeStoriesBlogBlocks();
      }, 100);
    };

    // Listen for navigation events
    window.addEventListener('popstate', handleNavigation);
    
    // Listen for dynamic content changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes);
          const hasBlockData = addedNodes.some(node => 
            node instanceof Element && 
            (node.querySelector('.stories-blog-block-data') || node.classList?.contains('stories-blog-block-data'))
          );
          
          if (hasBlockData) {
            setTimeout(initializeStoriesBlogBlocks, 100);
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
}