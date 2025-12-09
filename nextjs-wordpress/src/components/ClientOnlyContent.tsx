'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyContentProps {
  html: string;
  className?: string;
}

export default function ClientOnlyContent({ html, className = '' }: ClientOnlyContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className} />;
  }

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
