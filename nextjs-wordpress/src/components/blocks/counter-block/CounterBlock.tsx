'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import './styles.scss';

interface CounterItem {
  number?: string;
  prefix?: string;
  suffix?: string;
  label?: string;
}

interface CounterBlockProps {
  data: {
    heading?: string;
    sub_heading?: string;
    counters?: CounterItem[];
    background_color?: string;
  };
}

export default function CounterBlock({ data }: CounterBlockProps) {
  const {
    heading,
    sub_heading,
    counters,
    background_color
  } = data || {};

  // All hooks must be called at the top level
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counterValues, setCounterValues] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const reactId = useId();
  const blockId = `counter-block-${reactId}`;

  // Initialize counter values to 0
  useEffect(() => {
    if (counters) {
      setCounterValues(new Array(counters.length).fill(0));
    }
  }, [counters]);

  // Animate counter when section is visible
  useEffect(() => {
    if (!counters || hasAnimated) return;

    const currentSection = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            // Animate each counter
            counters.forEach((counter, index) => {
              const targetValue = parseFloat(counter.number || '0');
              const duration = 2000; // 2 seconds
              const steps = 60;
              const increment = targetValue / steps;
              const stepDuration = duration / steps;
              
              let currentStep = 0;
              
              const timer = setInterval(() => {
                currentStep++;
                const newValue = Math.min(increment * currentStep, targetValue);
                
                setCounterValues((prev) => {
                  const updated = [...prev];
                  updated[index] = newValue;
                  return updated;
                });
                
                if (currentStep >= steps) {
                  clearInterval(timer);
                }
              }, stepDuration);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, [counters, hasAnimated]);

  // Early return after all hooks
  if (!heading && !sub_heading && (!counters || counters.length === 0)) {
    return null;
  }
  
  // Set default background color if not specified
  const backgroundColor = background_color || '#ffffff';
  
  const blockStyles = {
    backgroundColor: backgroundColor
  };

  // Format counter value
  const formatCounterValue = (value: number, originalNumber: string): string => {
    // Check if original number has decimals
    const hasDecimals = originalNumber.includes('.');
    if (hasDecimals) {
      const decimalPlaces = originalNumber.split('.')[1]?.length || 1;
      return value.toFixed(decimalPlaces);
    }
    return Math.floor(value).toString();
  };

  return (
    <section ref={sectionRef} id={blockId} className="counter-block" style={blockStyles}>
      <div className="counter-block__container">
        {(heading || sub_heading) && (
          <div className="counter-block__header">
            {heading && (
              <h2 className="counter-block__heading">{heading}</h2>
            )}
            
            {sub_heading && (
              <p className="counter-block__sub-heading">{sub_heading}</p>
            )}
          </div>
        )}
        
        {counters && counters.length > 0 && (
          <div className="counter-block__counters">
            {counters.map((counter, index) => (
              <div key={index} className="counter-block__item">
                <div className="counter-block__number">
                  {counter.prefix && (
                    <span className="counter-block__prefix">{counter.prefix}</span>
                  )}
                  <span className="counter-block__value">
                    {formatCounterValue(counterValues[index] || 0, counter.number || '0')}
                  </span>
                  {counter.suffix && (
                    <span className="counter-block__suffix">{counter.suffix}</span>
                  )}
                </div>
                {counter.label && (
                  <p className="counter-block__label">{counter.label}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
