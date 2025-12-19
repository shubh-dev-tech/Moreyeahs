'use client';

import { useState } from 'react';
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

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveSection(sectionId); // Manual activation only
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
