'use client';

import { useEffect } from 'react';
import { setupWordPressErrorHandler } from '@/lib/wordpress-content';

/**
 * WordPress Error Handler Component
 * Sets up global error handling for WordPress-related JavaScript errors
 */
export default function WordPressErrorHandler() {
  useEffect(() => {
    setupWordPressErrorHandler();
  }, []);

  return null; // This component doesn't render anything
}