import React from 'react';
import './VerticalStepper.scss';

interface StepperSection {
  id: string;
  title: string;
}

interface VerticalStepperProps {
  sections: StepperSection[];
}

export default function VerticalStepper({ sections }: VerticalStepperProps) {
  return (
    <div className="vertical-stepper">
      <div className="vertical-stepper__container">
        {sections.map((section, index) => (
          <div key={section.id} className="vertical-stepper__item">
            <a 
              href={`#${section.id}`} 
              className="vertical-stepper__link"
              title={section.title}
            >
              <span className="vertical-stepper__dot"></span>
              <span className="vertical-stepper__label">{section.title}</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}