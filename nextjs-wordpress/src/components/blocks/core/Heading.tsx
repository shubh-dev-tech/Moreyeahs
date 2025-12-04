/**
 * Core Heading Block
 */

import React from 'react';

interface CoreHeadingProps {
  innerHTML: string;
  data?: any;
  level?: number;
}

export function CoreHeading({ innerHTML, level = 2 }: CoreHeadingProps) {
  return (
    <div 
      className="prose max-w-none my-6"
      dangerouslySetInnerHTML={{ __html: innerHTML }}
    />
  );
}
