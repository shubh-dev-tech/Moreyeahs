'use client';

import { useEffect, useRef } from 'react';

interface WordPressContentProps {
  content: string;
}

export function WordPressContent({ content }: WordPressContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Extract and execute inline scripts
    const container = containerRef.current;
    const scripts = container.querySelectorAll('script');
    
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      
      // Copy attributes
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      // Copy script content
      newScript.textContent = oldScript.textContent;
      
      // Replace old script with new one to execute it
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [content]);

  return (
    <div 
      ref={containerRef}
      className="wordpress-content"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
