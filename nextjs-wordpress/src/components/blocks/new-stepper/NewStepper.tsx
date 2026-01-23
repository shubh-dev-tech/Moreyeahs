'use client';

import React, { useEffect, useState } from 'react';
import './styles.scss';

interface Step {
  label?: string;
  section_id?: string;
  point_text?: string;
  [key: string]: any;
}

interface NewStepperProps {
  data?: {
    steps?: (Step | string)[];
    [key: string]: any;
  };
  steps?: (Step | string)[];
  [key: string]: any;
}

const NewStepper: React.FC<NewStepperProps> = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDarkBackground, setIsDarkBackground] = useState(false);

  const { data } = props || {};

  // Extract steps - following the Full One by Two Section pattern
  const rawSteps = props?.steps || data?.steps || [];
  
  // Handle WordPress ACF data - convert false to empty array
  const safeSteps = React.useMemo(() => {
    let steps: { label: string; section_id: string }[] = [];
    
    // If steps is a number, it might be the count - try to get the actual data from a different property
    if (typeof rawSteps === 'number' && rawSteps > 0) {
      // Check if there are individual step properties in the data object
      const stepsFromData: { label: string; section_id: string }[] = [];
      
      for (let i = 0; i < rawSteps; i++) {
        let foundStep: { label: string; section_id: string } | null = null;
        
        // Try various key patterns
        const keysToTry = [
          `steps_${i}_label`,
          `steps_${i}`,
          `step_${i}`,
          `label_${i}`
        ];
        
        for (const key of keysToTry) {
          if (data && data[key]) {
            foundStep = {
              label: data[key],
              section_id: data[`steps_${i}_section_id`] || data[`section_id_${i}`] || ''
            };
            break;
          }
        }
        
        if (foundStep && foundStep.label) {
          stepsFromData.push(foundStep);
        }
      }
      
      if (stepsFromData.length > 0) {
        steps = stepsFromData;
      }
    } else if (rawSteps && Array.isArray(rawSteps)) {
      const mappedSteps = rawSteps
        .map(step => {
          // Handle both string arrays and object arrays
          if (typeof step === 'string') {
            return { label: step.trim(), section_id: '' };
          }
          if (typeof step === 'object' && step) {
            const label = step.label || step.point_text || '';
            const section_id = step.section_id || step.section_html_anchor || step.sectionId || '';
            if (label && section_id) {
              return { label, section_id };
            }
          }
          return null;
        })
        .filter((step): step is { label: string; section_id: string } => 
          step !== null && step.label !== '' && step.section_id !== ''
        );
      
      steps = mappedSteps;
    }
    
    return steps;
  }, [rawSteps, data]);

  // Function to detect if background is dark - using the same method as header
  const checkBackgroundColor = () => {
    if (safeSteps.length === 0) return;

    // Get the stepper element
    const stepperElement = document.querySelector('.new-stepper') as HTMLElement;
    if (!stepperElement) return;

    const stepperRect = stepperElement.getBoundingClientRect();
    const centerX = stepperRect.left + stepperRect.width / 2;
    const centerY = stepperRect.top + stepperRect.height / 2;

    // Temporarily hide stepper to check what's behind it
    stepperElement.style.pointerEvents = 'none';
    const elementBehind = document.elementFromPoint(centerX, centerY);
    stepperElement.style.pointerEvents = '';

    if (elementBehind) {
      const bgColor = window.getComputedStyle(elementBehind).backgroundColor;
      
      // Parse RGB values
      const rgb = bgColor.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);
        
        // Calculate relative luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // If background is dark (luminance < 0.5), use light text
        const isDark = luminance < 0.5;
        setIsDarkBackground(isDark);
      }
    }
  };

  // Debug logging - following Full One by Two Section pattern
  useEffect(() => {
    // Debug info removed for production
  }, [props, data, rawSteps, safeSteps]);

  // Scroll tracking with background detection - using header's method
  useEffect(() => {
    if (safeSteps.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      // Find which section is currently in view
      for (let i = safeSteps.length - 1; i >= 0; i--) {
        const section = document.getElementById(safeSteps[i].section_id);
        if (section) {
          if (section.offsetTop <= scrollPosition) {
            setActiveIndex(i);
            break;
          }
        } else {
          // Section not found in DOM
        }
      }
      
      // Check background color after scroll
      checkBackgroundColor();
    };

    console.log('[NewStepper] Adding scroll event listener');
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkBackgroundColor);
    
    // Check initial position and background
    handleScroll();

    return () => {
      console.log('[NewStepper] Removing scroll event listener');
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkBackgroundColor);
    };
  }, [safeSteps]);

  // Don't render if no valid steps - following Full One by Two Section pattern
  if (!props || safeSteps.length === 0) {
    if (!props) {
      // No props provided
    } else {
      // Not rendering - no valid steps found
    }
    return null;
  }

  const handleClick = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`new-stepper ${isDarkBackground ? 'new-stepper--dark' : ''}`}>
      <div className="new-stepper__title">Welcome to<br /><b>More</b>Yeahs</div>
      <ul className="new-stepper__list">
        {safeSteps.map((step, index) => (
          <li 
            key={index}
            className={`new-stepper__item ${activeIndex === index ? 'new-stepper__item--active' : ''}`}
            data-section={step.section_id}
          >
            <a 
              href={`#${step.section_id}`}
              className="new-stepper__link"
              onClick={(e) => {
                e.preventDefault();
                handleClick(step.section_id);
              }}
            >
              <div className="new-stepper__line"></div>
              <div className="new-stepper__label">
                {step.label}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NewStepper;
