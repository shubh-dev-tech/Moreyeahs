"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function NotFound() {
  const pageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) {
      return;
    }

    let rafId = 0;
    let lastTime = performance.now();
    let textTargetX = 0;
    let textTargetY = 0;
    let textX = 0;
    let textY = 0;

    const blobs = [
      { baseX: 18, baseY: 18, ampX: 24, ampY: 16, speedX: 0.00018, speedY: 0.00022, phaseX: 0.2, phaseY: 1.4 },
      { baseX: 78, baseY: 20, ampX: 18, ampY: 20, speedX: 0.00016, speedY: 0.0002, phaseX: 1.1, phaseY: 2.4 },
      { baseX: 22, baseY: 76, ampX: 20, ampY: 18, speedX: 0.0002, speedY: 0.00018, phaseX: 2.2, phaseY: 0.9 },
      { baseX: 72, baseY: 70, ampX: 22, ampY: 22, speedX: 0.00015, speedY: 0.00019, phaseX: 0.6, phaseY: 2.8 },
      { baseX: 50, baseY: 50, ampX: 26, ampY: 24, speedX: 0.00012, speedY: 0.00016, phaseX: 2.6, phaseY: 0.4 },
    ];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const animate = (time: number) => {
      const delta = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      blobs.forEach((blob, index) => {
        const x = blob.baseX + Math.sin(time * blob.speedX + blob.phaseX) * blob.ampX;
        const y = blob.baseY + Math.cos(time * blob.speedY + blob.phaseY) * blob.ampY;
        page.style.setProperty(`--g${index + 1}x`, `${x}%`);
        page.style.setProperty(`--g${index + 1}y`, `${y}%`);
      });

      const shiftX = Math.sin(time * 0.0001) * 26;
      const shiftY = Math.cos(time * 0.00012) * 22;
      page.style.setProperty('--mesh-shift-x', `${shiftX}px`);
      page.style.setProperty('--mesh-shift-y', `${shiftY}px`);

      textX += (textTargetX - textX) * 0.08;
      textY += (textTargetY - textY) * 0.08;

      page.style.setProperty('--text-x', `${-textX * 40}px`);
      page.style.setProperty('--text-y', `${-textY * 30}px`);
      page.style.setProperty('--tilt-x', `${textY * 8}deg`);
      page.style.setProperty('--tilt-y', `${-textX * 10}deg`);

      rafId = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = page.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      textTargetX = Math.max(-0.5, Math.min(0.5, x));
      textTargetY = Math.max(-0.5, Math.min(0.5, y));
    };

    const handlePointerLeave = () => {
      textTargetX = 0;
      textTargetY = 0;
    };

    if (!prefersReducedMotion.matches) {
      rafId = window.requestAnimationFrame(animate);
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerleave', handlePointerLeave);
    }

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <section className="not-found-page" ref={pageRef}>
      <div className="not-found-shell">
        <span className="not-found-hero">404</span>
        <span className="not-found-divider" aria-hidden="true" />
        <h1 className="not-found-title">Oops! You&apos;ve drifted into deep space.</h1>
        <p className="not-found-copy">
          The page you are looking for has vanished into the digital void. Don&apos;t worry, it happens to the best of us.
        </p>
        <div className="not-found-actions">
          <Link href="/" className="not-found-btn primary">
            <i className="fa-solid fa-house" aria-hidden="true" />
            Return Home
          </Link>
        </div>
      </div>
    </section>
  );
}
