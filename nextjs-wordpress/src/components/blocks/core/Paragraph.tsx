/**
 * Core Paragraph Block
 */

import React from 'react';

interface CoreParagraphProps {
  innerHTML: string;
  data?: any;
}

export function CoreParagraph({ innerHTML }: CoreParagraphProps) {
  return (
    <div 
      className="prose max-w-none my-4"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: innerHTML }}
    />
  );
}
