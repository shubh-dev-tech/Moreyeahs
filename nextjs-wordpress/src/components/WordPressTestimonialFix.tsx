'use client';

import { useEffect } from 'react';

export default function WordPressTestimonialFix() {
  useEffect(() => {
    // console.log('🔧 WordPressTestimonialFix RUNNING...');

    // Find all buttons in testimonial sections
    const allButtons = document.querySelectorAll('button');
    // console.log('Total buttons found:', allButtons.length);

    // Find testimonial navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn, .prev-btn, .next-btn, [class*="testimonial"] button');
    // console.log('Nav buttons found:', navButtons.length);

    // Find testimonial cards
    const cards = document.querySelectorAll('.testimonial-card');
    // console.log('Testimonial cards found:', cards.length);

    if (cards.length === 0) {
      // console.log('❌ No testimonial cards found!');
      return;
    }

    let currentIndex = 0;


    let startX = 0;

    const wrapper = document.querySelector('.testimonial-cards-wrapper');

    wrapper?.addEventListener('touchstart', (e: any) => {
      startX = e.touches[0].clientX;
    });

    wrapper?.addEventListener('touchend', (e: any) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(currentIndex + 1); // swipe left
        } else {
          goToSlide(currentIndex - 1); // swipe right
        }

        // reset autoplay timer on swipe
        resetAutoplay();
      }
    });


    // Find current active index
    cards.forEach((card, i) => {
      if (card.classList.contains('active')) currentIndex = i;
    });

    const goToSlide = (index: number) => {
      if (index >= cards.length) index = 0;
      if (index < 0) index = cards.length - 1;
      currentIndex = index;

      // console.log('Moving to slide:', currentIndex);

      cards.forEach((card, i) => {
        card.classList.remove('active', 'prev', 'next', 'hidden');
        if (i === currentIndex) card.classList.add('active');
        else if (i === (currentIndex - 1 + cards.length) % cards.length) card.classList.add('prev');
        else if (i === (currentIndex + 1) % cards.length) card.classList.add('next');
        else card.classList.add('hidden');
      });

      // Update dots
      document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    };

    // --- Autoplay (fix: previously only button-click worked) ---
    // Default: change every 5s. If WP/ACF provides a speed, set it on wrapper like: data-slider-speed="4"
    const getAutoplayDelayMs = () => {
      const speedAttr =
        (wrapper as HTMLElement | null)?.getAttribute('data-slider-speed') ||
        (document.querySelector('[data-slider-speed]') as HTMLElement | null)?.getAttribute('data-slider-speed');

      const speedSeconds = speedAttr ? Number(speedAttr) : 3;
      if (!Number.isFinite(speedSeconds) || speedSeconds <= 0) return 5000;
      return Math.max(1000, speedSeconds * 1000);
    };

    let isPaused = false;
    let autoplayInterval: number | null = null;

    const startAutoplay = () => {
      if (autoplayInterval !== null) return;
      if (cards.length <= 1) return;

      autoplayInterval = window.setInterval(() => {
        if (isPaused) return;
        goToSlide(currentIndex + 1);
      }, getAutoplayDelayMs());
    };

    const stopAutoplay = () => {
      if (autoplayInterval === null) return;
      window.clearInterval(autoplayInterval);
      autoplayInterval = null;
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    // pause on tab hidden
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // pause on hover (desktop)
    const handleMouseEnter = () => {
      isPaused = true;
    };
    const handleMouseLeave = () => {
      isPaused = false;
    };
    wrapper?.addEventListener('mouseenter', handleMouseEnter);
    wrapper?.addEventListener('mouseleave', handleMouseLeave);

    // Attach to ALL buttons that might be nav buttons
    navButtons.forEach((btn, i) => {
      const isNext = btn.classList.contains('next-btn') || btn.className.includes('next');
      // console.log(`Button ${i}: isNext=${isNext}, classes=${btn.className}`);

      btn.removeAttribute('onclick');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // console.log(isNext ? '➡️ NEXT clicked!' : '⬅️ PREV clicked!');
        goToSlide(isNext ? currentIndex + 1 : currentIndex - 1);
        resetAutoplay();
      });
    });

    // start autoplay after wiring everything
    startAutoplay();

    return () => {
      stopAutoplay();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      wrapper?.removeEventListener('mouseenter', handleMouseEnter);
      wrapper?.removeEventListener('mouseleave', handleMouseLeave);
    };

    // console.log('✅ WordPressTestimonialFix COMPLETE!');
  }, []);

  return null;
}

