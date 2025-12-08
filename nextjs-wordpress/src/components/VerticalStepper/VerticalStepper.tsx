'use client';

import { useEffect, useState } from 'react';
import './styles.scss';

interface StepperSection {
  id: string;
  title: string;
}

interface VerticalStepperProps {
  sections: StepperSection[];
}

export default function VerticalStepper({ sections }: VerticalStepperProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="vertical-stepper">
      <div className="stepper-line"></div>
      {sections.map((section, index) => (
        <div
          key={section.id}
          className={`stepper-item ${activeSection === section.id ? 'active' : ''}`}
          onClick={() => scrollToSection(section.id)}
        >
          <div className="stepper-dot"></div>
          {activeSection === section.id && (
            <div className="stepper-label">{section.title}</div>
          )}
        </div>
      ))}
    </div>
  );
}
