'use client';

import React, { useEffect, useState } from 'react';
import './styles.scss';

interface Step {
  label: string;
  section_id: string;
}

interface StepperBlockProps {
  stepper_mode?: 'auto' | 'manual';
  steps?: Step[];
}

const StepperBlock: React.FC<StepperBlockProps> = ({ 
  stepper_mode = 'auto',
  steps = []
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [detectedSteps, setDetectedSteps] = useState<Step[]>([]);

  // Auto-detect sections on mount if in auto mode
  useEffect(() => {
    if (stepper_mode === 'auto') {
      const sections = document.querySelectorAll('section[id]');
      const foundSteps: Step[] = [];
      
      sections.forEach((section) => {
        const id = section.getAttribute('id');
        // Skip WordPress internal IDs
        if (id && !id.startsWith('wp-') && !id.startsWith('block-') && id !== 'page') {
          // Try to find a heading in the section
          const heading = section.querySelector('h1, h2, h3, h4, .slide-heading, [class*="heading"]');
          let label = heading?.textContent?.trim() || '';
          
          // If no heading found, create label from ID
          if (!label) {
            label = id.split(/[-_]/).map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
          }
          
          if (label) {
            foundSteps.push({
              section_id: id,
              label: label
            });
          }
        }
      });
      
      setDetectedSteps(foundSteps);
    }
  }, [stepper_mode]);

  const activeSteps = stepper_mode === 'auto' ? detectedSteps : steps;

  useEffect(() => {
    if (activeSteps.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      // Find which section is currently in view
      for (let i = activeSteps.length - 1; i >= 0; i--) {
        const section = document.getElementById(activeSteps[i].section_id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveIndex(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSteps]);

  if (!activeSteps || activeSteps.length === 0) {
    return null;
  }

  const handleClick = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className="stepper-block sticky-left-nav"
      data-mode={stepper_mode}
    >
      <ul className="stepper-block__list">
        {activeSteps.map((step, index) => (
          <li 
            key={index}
            className={`stepper-block__item ${activeIndex === index ? 'stepper-block__item--active nav-active' : ''}`}
          >
            <a 
              href={`#${step.section_id}`}
              onClick={(e) => {
                e.preventDefault();
                handleClick(step.section_id);
              }}
            >
              <div className="stepper-block__line"></div>
              {step.label && (
                <div className="stepper-block__label">
                  {step.label}
                </div>
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default StepperBlock;
