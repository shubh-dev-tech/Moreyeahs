'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import './styles.scss';

interface RoadmapStep {
  icon?: {
    url: string;
    alt: string;
  };
  heading: string;
  subheading?: string;
}

interface RoadmapBlockProps {
  heading?: string;
  subheading?: string;
  left_image?: {
    url: string;
    alt: string;
  };
  background_color?: string;
  roadmap_steps?: RoadmapStep[];
}

const RoadmapBlock: React.FC<RoadmapBlockProps> = ({
  heading = 'ROADMAP',
  subheading,
  left_image,
  background_color = '#1a0b2e',
  roadmap_steps = []
}) => {
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rightContainer = stepsRef.current?.parentElement;
    if (!rightContainer || !stepsRef.current) return;

    const steps = stepsRef.current.querySelectorAll('.roadmap-step');
    let currentActiveIndex = 0;
    let isScrolling = false;

    // Initialize first step as active
    const updateStepStates = (activeIndex: number) => {
      steps.forEach((step, index) => {
        step.classList.remove('active', 'prev', 'next');
        
        if (index === activeIndex) {
          step.classList.add('active');
        } else if (index < activeIndex) {
          step.classList.add('prev');
        } else {
          step.classList.add('next');
        }
      });
    };

    updateStepStates(0);

    // Intersection Observer for detecting which step is in center
    const observerOptions = {
      root: rightContainer,
      threshold: 0.6,
      rootMargin: '-30% 0px -30% 0px'
    };

    const stepObserver = new IntersectionObserver((entries) => {
      if (isScrolling) return;
      
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stepIndex = Array.from(steps).indexOf(entry.target as Element);
          if (stepIndex !== currentActiveIndex && stepIndex !== -1) {
            currentActiveIndex = stepIndex;
            updateStepStates(stepIndex);
          }
        }
      });
    }, observerOptions);

    // Observe all steps
    steps.forEach((step) => stepObserver.observe(step));

    // Handle counter clicks
    const counters = rightContainer.querySelectorAll('.step-counter');
    const scrollToStep = (index: number) => {
      if (index < 0 || index >= steps.length || isScrolling) return;
      
      isScrolling = true;
      currentActiveIndex = index;
      updateStepStates(index);
      
      (steps[index] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      
      setTimeout(() => {
        isScrolling = false;
      }, 800);
    };

    counters.forEach((counter, index) => {
      counter.addEventListener('click', () => scrollToStep(index));
    });

    // Handle wheel events for step navigation
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrolling) return;
      
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(steps.length - 1, currentActiveIndex + direction));
      
      if (nextIndex !== currentActiveIndex) {
        scrollToStep(nextIndex);
      }
    };

    rightContainer.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      stepObserver.disconnect();
      rightContainer.removeEventListener('wheel', handleWheel);
    };
  }, []);

  if (!heading || roadmap_steps.length === 0) {
    return null;
  }

  return (
    <div 
      className="roadmap-block" 
      style={{ backgroundColor: background_color }}
    >
      <div className="roadmap-container">
        {/* Left side - Sticky content */}
        <div className="roadmap-left">
          <div className="roadmap-left-sticky">
            <h2 className="roadmap-heading">{heading}</h2>
            {subheading && (
              <p className="roadmap-subheading">{subheading}</p>
            )}
            
            {left_image && (
              <div className="roadmap-image">
                <Image
                  src={left_image.url}
                  alt={left_image.alt || ''}
                  width={400}
                  height={300}
                  style={{ 
                    width: '100%',
                    height: 'auto',
                    borderRadius: '20px'
                  }}
                  priority
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Right side - Scrollable steps */}
        <div className="roadmap-right">
          <div className="roadmap-steps" ref={stepsRef}>
            {roadmap_steps.map((step, index) => (
              <div 
                key={index} 
                className="roadmap-step" 
                data-step={index + 1}
                style={{ 
                  animationDelay: `${(index + 1) * 0.2}s` 
                }}
              >
                {/* Step counter with line */}
                <div className="step-counter-wrapper">
                  <div className="step-counter">
                    <span className="step-number">{index + 1}</span>
                  </div>
                  {index < roadmap_steps.length - 1 && (
                    <div className="step-line"></div>
                  )}
                </div>
                
                {/* Step content box */}
                <div className="step-content">
                  {step.icon && (
                    <div className="step-icon">
                      <Image
                        src={step.icon.url}
                        alt={step.icon.alt || ''}
                        width={30}
                        height={30}
                        style={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  )}
                  
                  <h3 className="step-heading">{step.heading}</h3>
                  
                  {step.subheading && (
                    <p className="step-subheading">{step.subheading}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapBlock;