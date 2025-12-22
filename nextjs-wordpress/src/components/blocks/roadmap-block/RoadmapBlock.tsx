/**
 * Roadmap Block Component
 * Displays a timeline of roadmap items with completion status
 */

import React from 'react';

interface RoadmapItem {
  date?: string;
  title: string;
  description?: string;
  link?: string;
  is_completed?: boolean;
  is_current?: boolean;
}

interface RoadmapBlockData {
  heading?: string;
  subheading?: string;
  layout?: 'vertical' | 'horizontal';
  roadmap_items?: RoadmapItem[];
}

interface RoadmapBlockProps {
  data: RoadmapBlockData;
}

export function RoadmapBlock({ data }: RoadmapBlockProps) {
  const {
    heading,
    subheading,
    layout = 'vertical',
    roadmap_items
  } = data || {};

  // Ensure roadmap_items is always an array
  const items = Array.isArray(roadmap_items) ? roadmap_items : [];

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`roadmap-block layout-${layout} py-16 bg-gray-50`}>
      <div className="container mx-auto px-4">
        
        {heading && (
          <h2 className="roadmap-heading text-3xl md:text-4xl font-bold text-center mb-4">
            {heading}
          </h2>
        )}
        
        {subheading && (
          <p className="roadmap-subheading text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            {subheading}
          </p>
        )}
        
        <div className={`roadmap-timeline ${layout === 'horizontal' ? 'flex flex-wrap gap-8 justify-center' : 'space-y-8'}`}>
          {items.map((item, index) => {
            // Ensure item is an object with required properties
            const safeItem = {
              title: item?.title || `Item ${index + 1}`,
              date: item?.date,
              description: item?.description,
              link: item?.link,
              is_completed: Boolean(item?.is_completed),
              is_current: Boolean(item?.is_current)
            };
            
            return (
            <div 
              key={index}
              className={`roadmap-item relative ${safeItem.is_completed ? 'completed' : ''} ${safeItem.is_current ? 'current' : ''} ${
                layout === 'horizontal' ? 'flex-1 min-w-[200px] max-w-[300px]' : ''
              }`}
            >
              
              <div className="roadmap-marker flex items-center">
                <div className={`marker-dot relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  safeItem.is_completed 
                    ? 'bg-green-500' 
                    : safeItem.is_current 
                      ? 'bg-blue-500' 
                      : 'bg-gray-400'
                }`}>
                  {safeItem.is_completed ? (
                    <span className="checkmark text-xl">✓</span>
                  ) : (
                    <span className="step-number">{index + 1}</span>
                  )}
                </div>
                
                {/* Connector line for vertical layout */}
                {layout === 'vertical' && index < items.length - 1 && (
                  <div className="connector-line absolute top-12 left-6 w-0.5 h-16 bg-gray-300 z-0"></div>
                )}
                
                {/* Connector line for horizontal layout */}
                {layout === 'horizontal' && index < items.length - 1 && (
                  <div className="connector-line absolute top-6 left-12 h-0.5 w-16 bg-gray-300 z-0 hidden md:block"></div>
                )}
              </div>
              
              <div className={`roadmap-content ${
                layout === 'horizontal' 
                  ? 'ml-0 mt-4 text-center' 
                  : 'ml-16 -mt-12'
              }`}>
                {safeItem.date && (
                  <div className={`roadmap-date text-sm font-semibold mb-2 ${
                    safeItem.is_completed 
                      ? 'text-green-600' 
                      : safeItem.is_current 
                        ? 'text-blue-600' 
                        : 'text-gray-500'
                  }`}>
                    {safeItem.date}
                  </div>
                )}
                
                <h3 className={`roadmap-title text-xl font-bold mb-2 ${
                  safeItem.is_completed 
                    ? 'text-green-800' 
                    : safeItem.is_current 
                      ? 'text-blue-800' 
                      : 'text-gray-700'
                }`}>
                  {safeItem.title}
                </h3>
                
                {safeItem.description && (
                  <p className="roadmap-description text-gray-600 mb-4 leading-relaxed">
                    {safeItem.description}
                  </p>
                )}
                
                {safeItem.link && (
                  <a 
                    href={safeItem.link} 
                    className={`roadmap-link inline-block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      safeItem.is_completed 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : safeItem.is_current 
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Learn More
                  </a>
                )}
              </div>
              
            </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}

export default RoadmapBlock;