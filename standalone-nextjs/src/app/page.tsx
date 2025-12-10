import React from 'react';
import { siteData } from '@/data/staticData';
import ContentBlock from '@/components/blocks/ContentBlock';
import ServiceBlock from '@/components/blocks/ServiceBlock';
import VerticalStepper from '@/components/VerticalStepper';

export default function Home() {
  // Define sections for the stepper
  const stepperSections = [
    { id: 'hero', title: 'Home' },
    { id: 'services', title: 'Services' },
    { id: 'about', title: 'About' },
  ];

  return (
    <>
      <VerticalStepper sections={stepperSections} />
      <main className="min-h-screen">
        {siteData.contentBlocks.map((block, index) => {
          const sectionId = index === 0 ? 'hero' : 
                           index === 1 ? 'services' : 
                           index === 2 ? 'about' : `section-${index}`;
          
          return (
            <div key={index} id={sectionId}>
              {block.type === 'moreyeahs-content-block' && (
                <ContentBlock data={block.data} />
              )}
              {block.type === 'moreyeahs-service-block' && (
                <ServiceBlock data={block.data} />
              )}
            </div>
          );
        })}
      </main>
    </>
  );
}